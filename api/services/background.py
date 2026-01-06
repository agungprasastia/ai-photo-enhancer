"""Background Removal Service"""

from rembg import remove, new_session
from PIL import Image
import io

# Global cached session for faster processing
_session = None


def get_session():
    """Get cached rembg session (faster than creating new one each request)"""
    global _session
    if _session is None:
        # Use isnet-general-use for faster processing (vs birefnet-general)
        _session = new_session("isnet-general-use")
    return _session


def remove_background(input_path: str, output_path: str) -> None:
    with open(input_path, 'rb') as f:
        input_data = f.read()
    
    session = get_session()
    output_data = remove(input_data, session=session)
    
    output_image = Image.open(io.BytesIO(output_data))
    
    if output_image.mode != 'RGBA':
        output_image = output_image.convert('RGBA')
    
    output_image.save(output_path, "PNG")
