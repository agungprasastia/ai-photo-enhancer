"""Image Upscaling Service with Enhanced Quality"""

import cv2
import numpy as np


def upscale_image(input_path: str, output_path: str, scale: int = 2) -> None:
    img = cv2.imread(input_path, cv2.IMREAD_UNCHANGED)
    
    if img is None:
        raise ValueError("Could not load image")
    
    h, w = img.shape[:2]
    new_size = (w * scale, h * scale)
    
    # Check if image has alpha channel
    has_alpha = img.shape[2] == 4 if len(img.shape) == 3 else False
    
    if has_alpha:
        # Split channels
        bgr = img[:, :, :3]
        alpha = img[:, :, 3]
        
        # Upscale RGB
        bgr_up = upscale_with_enhancement(bgr, new_size)
        
        # Upscale alpha separately
        alpha_up = cv2.resize(alpha, new_size, interpolation=cv2.INTER_LANCZOS4)
        
        # Merge back
        result = cv2.merge([bgr_up[:,:,0], bgr_up[:,:,1], bgr_up[:,:,2], alpha_up])
    else:
        result = upscale_with_enhancement(img, new_size)
    
    cv2.imwrite(output_path, result, [cv2.IMWRITE_PNG_COMPRESSION, 3])


def upscale_with_enhancement(img: np.ndarray, new_size: tuple) -> np.ndarray:
    """Multi-step upscaling with enhancement for best quality"""
    
    # Step 1: Upscale with INTER_CUBIC (good for enlarging)
    upscaled = cv2.resize(img, new_size, interpolation=cv2.INTER_CUBIC)
    
    # Step 2: Apply bilateral filter to reduce noise while keeping edges
    denoised = cv2.bilateralFilter(upscaled, 5, 50, 50)
    
    # Step 3: Unsharp masking for detail enhancement
    gaussian = cv2.GaussianBlur(denoised, (0, 0), 2.0)
    sharpened = cv2.addWeighted(denoised, 1.8, gaussian, -0.8, 0)
    
    # Step 4: Slight contrast enhancement
    lab = cv2.cvtColor(sharpened, cv2.COLOR_BGR2LAB)
    l, a, b = cv2.split(lab)
    clahe = cv2.createCLAHE(clipLimit=1.5, tileGridSize=(8, 8))
    l = clahe.apply(l)
    enhanced = cv2.merge([l, a, b])
    result = cv2.cvtColor(enhanced, cv2.COLOR_LAB2BGR)
    
    return result
