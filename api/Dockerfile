FROM python:3.11-slim

WORKDIR /app

# Install system dependencies for OpenCV and Git
RUN apt-get update && apt-get install -y \
    libgl1 \
    libglib2.0-0 \
    libsm6 \
    libxext6 \
    libxrender1 \
    git \
    && rm -rf /var/lib/apt/lists/*

# Copy requirements and install Python dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Pre-download Real-ESRGAN model weights during build
RUN mkdir -p /app/weights && \
    python -c "from RealESRGAN import RealESRGAN; import torch; \
    device = torch.device('cpu'); \
    model = RealESRGAN(device, scale=2); model.load_weights('weights/RealESRGAN_x2.pth', download=True); \
    model = RealESRGAN(device, scale=4); model.load_weights('weights/RealESRGAN_x4.pth', download=True)"

# Copy application code
COPY . .

# Create directories for uploads and results
RUN mkdir -p /app/uploads /app/results

# Expose port
EXPOSE 7860

# Run the application
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "7860"]
