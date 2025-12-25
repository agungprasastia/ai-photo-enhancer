"""Image Upscaling Service using Real-ESRGAN"""

import cv2
import numpy as np
import torch
from PIL import Image
from RealESRGAN import RealESRGAN

_models = {}


def get_model():
    global _models
    
    if 4 in _models:
        return _models[4]
    
    device = torch.device('cuda' if torch.cuda.is_available() else 'cpu')
    
    model = RealESRGAN(device, scale=4)
    model.load_weights('weights/RealESRGAN_x4.pth', download=True)
    
    _models[4] = model
    return model


def upscale_image(input_path: str, output_path: str) -> None:
    img_cv = cv2.imread(input_path, cv2.IMREAD_UNCHANGED)
    
    if img_cv is None:
        raise ValueError("Could not load image")
    
    has_alpha = len(img_cv.shape) == 3 and img_cv.shape[2] == 4
    
    if has_alpha:
        bgr = img_cv[:, :, :3]
        alpha = img_cv[:, :, 3]
        
        rgb = cv2.cvtColor(bgr, cv2.COLOR_BGR2RGB)
        pil_image = Image.fromarray(rgb)
        
        model = get_model()
        sr_image = model.predict(pil_image)
        
        sr_array = np.array(sr_image)
        sr_bgr = cv2.cvtColor(sr_array, cv2.COLOR_RGB2BGR)
        
        h, w = sr_bgr.shape[:2]
        alpha_up = cv2.resize(alpha, (w, h), interpolation=cv2.INTER_LANCZOS4)
        
        result = cv2.merge([sr_bgr[:,:,0], sr_bgr[:,:,1], sr_bgr[:,:,2], alpha_up])
    else:
        if len(img_cv.shape) == 3:
            rgb = cv2.cvtColor(img_cv, cv2.COLOR_BGR2RGB)
        else:
            rgb = cv2.cvtColor(img_cv, cv2.COLOR_GRAY2RGB)
        
        pil_image = Image.fromarray(rgb)
        
        model = get_model()
        sr_image = model.predict(pil_image)
        
        sr_array = np.array(sr_image)
        result = cv2.cvtColor(sr_array, cv2.COLOR_RGB2BGR)
    
    cv2.imwrite(output_path, result, [cv2.IMWRITE_PNG_COMPRESSION, 3])
