"""
Background Removal Service
Uses rembg library with BiRefNet model for high-quality background removal
"""

from rembg import remove, new_session
from PIL import Image
import io


def remove_background(input_path: str, output_path: str) -> None:
    """
    Remove background from an image using BiRefNet model
    
    Args:
        input_path: Path to input image
        output_path: Path to save output image (PNG with transparency)
    """
    # Open input image as bytes
    with open(input_path, 'rb') as f:
        input_data = f.read()
    
    # Use BiRefNet-general model - best quality for various images
    # Model will be downloaded on first use (~200MB)
    try:
        session = new_session("birefnet-general")
        output_data = remove(input_data, session=session)
    except Exception:
        # Fallback to default model if BiRefNet fails
        output_data = remove(input_data)
    
    # Convert to PIL Image
    output_image = Image.open(io.BytesIO(output_data))
    
    # Ensure RGBA mode
    if output_image.mode != 'RGBA':
        output_image = output_image.convert('RGBA')
    
    # Save as PNG to preserve transparency
    output_image.save(output_path, "PNG")
