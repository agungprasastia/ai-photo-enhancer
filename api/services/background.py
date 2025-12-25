"""
Background Removal Service
Uses rembg library for AI-powered background removal
"""

from rembg import remove
from PIL import Image


def remove_background(input_path: str, output_path: str) -> None:
    """
    Remove background from an image
    
    Args:
        input_path: Path to input image
        output_path: Path to save output image (PNG with transparency)
    """
    # Open input image
    input_image = Image.open(input_path)
    
    # Remove background
    output_image = remove(input_image)
    
    # Save as PNG to preserve transparency
    output_image.save(output_path, "PNG")
