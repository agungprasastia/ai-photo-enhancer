"""
Image Upscaling Service
Uses PIL for basic upscaling (can be upgraded to Real-ESRGAN for better quality)
"""

from PIL import Image


def upscale_image(input_path: str, output_path: str, scale: int = 2) -> None:
    """
    Upscale an image by a given factor
    
    Args:
        input_path: Path to input image
        output_path: Path to save output image
        scale: Upscale factor (2 or 4)
    """
    # Open input image
    image = Image.open(input_path)
    
    # Calculate new dimensions
    new_width = image.width * scale
    new_height = image.height * scale
    
    # Upscale using LANCZOS resampling (high quality)
    upscaled = image.resize(
        (new_width, new_height),
        Image.Resampling.LANCZOS
    )
    
    # Save output
    upscaled.save(output_path)
