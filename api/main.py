from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse
from PIL import Image
import uuid
import os

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

# Directories
UPLOAD_DIR = "../uploads"
RESULT_DIR = "../results"
os.makedirs(UPLOAD_DIR, exist_ok=True)
os.makedirs(RESULT_DIR, exist_ok=True)


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
            "download": "GET /download/{filename}"
        }
    }


@app.post("/upload")
async def upload_image(file: UploadFile = File(...)):
    """Upload an image for processing"""
    
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
    
    # Save file
    try:
        image = Image.open(file.file)
        image.save(file_path)
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Invalid image file: {str(e)}")
    
    return {
        "success": True,
        "message": "Upload successful",
        "filename": filename,
        "size": {
            "width": image.width,
            "height": image.height
        }
    }


@app.post("/enhance/background/{filename}")
async def enhance_remove_background(filename: str):
    """Remove background from uploaded image"""
    
    input_path = os.path.join(UPLOAD_DIR, filename)
    
    if not os.path.exists(input_path):
        raise HTTPException(status_code=404, detail="File not found")
    
    # Generate output filename
    output_filename = f"nobg_{filename.rsplit('.', 1)[0]}.png"
    output_path = os.path.join(RESULT_DIR, output_filename)
    
    try:
        remove_background(input_path, output_path)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Processing failed: {str(e)}")
    
    return {
        "success": True,
        "message": "Background removed successfully",
        "original": filename,
        "result": output_filename
    }


@app.post("/enhance/upscale/{filename}")
async def enhance_upscale(filename: str, scale: int = 2):
    """Upscale image resolution"""
    
    if scale not in [2, 4]:
        raise HTTPException(status_code=400, detail="Scale must be 2 or 4")
    
    input_path = os.path.join(UPLOAD_DIR, filename)
    
    if not os.path.exists(input_path):
        raise HTTPException(status_code=404, detail="File not found")
    
    # Generate output filename
    output_filename = f"upscale{scale}x_{filename}"
    output_path = os.path.join(RESULT_DIR, output_filename)
    
    try:
        upscale_image(input_path, output_path, scale)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Processing failed: {str(e)}")
    
    return {
        "success": True,
        "message": f"Image upscaled {scale}x successfully",
        "original": filename,
        "result": output_filename
    }


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
