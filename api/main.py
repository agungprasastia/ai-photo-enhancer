from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse, StreamingResponse
from PIL import Image
import uuid
import os
import shutil
import asyncio
import json
from concurrent.futures import ThreadPoolExecutor

# Import services
from services.background import remove_background
from services.upscale import upscale_image

app = FastAPI(
    title="AI Photo Enhancer API",
    description="API untuk enhance foto dengan AI - Background Removal & Upscaling",
    version="1.0.0"
)

# CORS configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Directories (use absolute paths for Docker)
UPLOAD_DIR = os.path.join(os.path.dirname(__file__), "uploads")
RESULT_DIR = os.path.join(os.path.dirname(__file__), "results")
os.makedirs(UPLOAD_DIR, exist_ok=True)
os.makedirs(RESULT_DIR, exist_ok=True)

# Thread pool for CPU-bound tasks
executor = ThreadPoolExecutor(max_workers=2)

# Task progress storage
tasks: dict[str, dict] = {}


async def run_in_thread(func, *args):
    """Run CPU-bound function in thread pool to avoid blocking"""
    loop = asyncio.get_event_loop()
    return await loop.run_in_executor(executor, func, *args)


def update_progress(task_id: str, progress: int, message: str, done: bool = False, result: str = None):
    """Update task progress"""
    tasks[task_id] = {
        "progress": progress,
        "message": message,
        "done": done,
        "result": result
    }


@app.get("/")
def root():
    """Health check endpoint"""
    return {
        "status": "running",
        "message": "AI Photo Enhancer API",
        "endpoints": {
            "upload": "POST /upload",
            "remove_bg": "POST /enhance/background/{filename}",
            "upscale": "POST /enhance/upscale/{filename}",
            "download": "GET /download/{filename}",
            "progress": "GET /progress/{task_id}"
        }
    }


@app.post("/upload")
async def upload_image(file: UploadFile = File(...)):
    """Upload an image for processing - optimized with direct file write"""
    
    # Validate file type
    allowed_types = ["image/jpeg", "image/png", "image/webp"]
    if file.content_type not in allowed_types:
        raise HTTPException(
            status_code=400,
            detail=f"File type not allowed. Allowed: {allowed_types}"
        )
    
    # Generate unique filename
    ext = file.filename.split(".")[-1]
    filename = f"{uuid.uuid4()}.{ext}"
    file_path = os.path.join(UPLOAD_DIR, filename)
    
    try:
        # Validate image first
        file.file.seek(0)
        image = Image.open(file.file)
        width, height = image.size
        image.close()
        
        # Direct write to disk (faster than re-encoding)
        file.file.seek(0)
        with open(file_path, 'wb') as f:
            shutil.copyfileobj(file.file, f)
            
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Invalid image file: {str(e)}")
    
    return {
        "success": True,
        "message": "Upload successful",
        "filename": filename,
        "size": {
            "width": width,
            "height": height
        }
    }


@app.post("/enhance/background/{filename}")
async def enhance_remove_background(filename: str):
    """Remove background from uploaded image - async processing"""
    
    input_path = os.path.join(UPLOAD_DIR, filename)
    
    if not os.path.exists(input_path):
        raise HTTPException(status_code=404, detail="File not found")
    
    # Generate output filename and task ID
    output_filename = f"nobg_{filename.rsplit('.', 1)[0]}.png"
    output_path = os.path.join(RESULT_DIR, output_filename)
    task_id = str(uuid.uuid4())
    
    # Initialize progress
    update_progress(task_id, 0, "Starting background removal...")
    
    try:
        # Run in thread pool to avoid blocking
        update_progress(task_id, 20, "Analyzing image...")
        await run_in_thread(remove_background, input_path, output_path)
        update_progress(task_id, 100, "Complete!", done=True, result=output_filename)
    except Exception as e:
        update_progress(task_id, 0, f"Error: {str(e)}", done=True)
        raise HTTPException(status_code=500, detail=f"Processing failed: {str(e)}")
    
    return {
        "success": True,
        "message": "Background removed successfully",
        "original": filename,
        "result": output_filename,
        "task_id": task_id
    }


@app.post("/enhance/upscale/{filename}")
async def enhance_upscale(filename: str, scale: int = 4):
    """Upscale image resolution using Real-ESRGAN (2x or 4x) - async processing"""
    
    # Validate scale
    if scale not in [2, 4]:
        scale = 4
    
    input_path = os.path.join(UPLOAD_DIR, filename)
    
    if not os.path.exists(input_path):
        raise HTTPException(status_code=404, detail="File not found")
    
    output_filename = f"upscale{scale}x_{filename}"
    output_path = os.path.join(RESULT_DIR, output_filename)
    task_id = str(uuid.uuid4())
    
    # Initialize progress
    update_progress(task_id, 0, "Starting upscale...")
    
    try:
        # Run in thread pool to avoid blocking
        update_progress(task_id, 10, "Loading AI model...")
        await run_in_thread(upscale_image, input_path, output_path, scale)
        update_progress(task_id, 100, "Complete!", done=True, result=output_filename)
    except Exception as e:
        update_progress(task_id, 0, f"Error: {str(e)}", done=True)
        raise HTTPException(status_code=500, detail=f"Processing failed: {str(e)}")
    
    return {
        "success": True,
        "message": f"Image upscaled {scale}x successfully",
        "original": filename,
        "result": output_filename,
        "scale": scale,
        "task_id": task_id
    }


@app.get("/progress/{task_id}")
async def progress_stream(task_id: str):
    """SSE endpoint for real-time progress updates"""
    
    async def event_generator():
        retry_count = 0
        max_retries = 100  # ~30 seconds max
        
        while retry_count < max_retries:
            if task_id in tasks:
                status = tasks[task_id]
                yield f"data: {json.dumps(status)}\n\n"
                
                if status.get('done'):
                    # Clean up after sending final status
                    del tasks[task_id]
                    break
            else:
                # Task not started yet
                yield f"data: {json.dumps({'progress': 0, 'message': 'Waiting...', 'done': False})}\n\n"
            
            await asyncio.sleep(0.3)
            retry_count += 1
    
    return StreamingResponse(
        event_generator(),
        media_type="text/event-stream",
        headers={
            "Cache-Control": "no-cache",
            "Connection": "keep-alive",
            "X-Accel-Buffering": "no"
        }
    )


@app.get("/download/{filename}")
async def download_file(filename: str):
    """Download processed image"""
    
    file_path = os.path.join(RESULT_DIR, filename)
    
    if not os.path.exists(file_path):
        raise HTTPException(status_code=404, detail="File not found")
    
    return FileResponse(
        file_path,
        media_type="image/png",
        filename=filename
    )
