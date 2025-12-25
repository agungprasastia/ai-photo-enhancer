"""Background Removal Service"""

from rembg import remove, new_session
from PIL import Image
import io


def remove_background(input_path: str, output_path: str) -> None:
    with open(input_path, 'rb') as f:
        input_data = f.read()
    
    try:
        session = new_session("birefnet-general")
        output_data = remove(input_data, session=session)
    except Exception:
        output_data = remove(input_data)
    
    output_image = Image.open(io.BytesIO(output_data))
    
    if output_image.mode != 'RGBA':
        output_image = output_image.convert('RGBA')
    
    output_image.save(output_path, "PNG")
