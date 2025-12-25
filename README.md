# ✨ AI Photo Enhancer

<p>
  <strong>AI-powered photo enhancement tool with Background Removal and Image Upscaling</strong>
</p>

---

## 🚀 Features

| Feature | Description |
|---------|-------------|
| 🎨 **Background Removal** | AI-powered background removal using BiRefNet-General model |
| 🔍 **Image Upscaling** | 4x resolution upscaling using Real-ESRGAN |
| 📱 **Responsive UI** | Modern dark theme with shadcn/ui components |
| 🔄 **Before/After Slider** | Interactive comparison slider to view results |
| ⚡ **Fast Processing** | Optimized for fast performance |

---

## 🤖 AI Models

| Model | Purpose | Library |
|-------|---------|---------|
| **BiRefNet-General** | Background Removal | `rembg` |
| **Real-ESRGAN x4** | Image Upscaling (4x) | `realesrgan` (sberbank-ai) |

---

## 🛠️ Tech Stack

### Frontend
- **Framework**: React 19 + Vite 7
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4 + shadcn/ui
- **Libraries**: 
  - `react-dropzone` - Drag & drop upload
  - `react-compare-slider` - Before/after comparison
  - `lucide-react` - Icons
  - `axios` - HTTP client

### Backend
- **Framework**: FastAPI
- **Language**: Python 3.11+
- **Core Dependencies**:
  - `rembg` - Background removal with BiRefNet
  - `realesrgan` - Image super-resolution
  - `torch` - PyTorch for model inference
  - `opencv-python-headless` - Image processing
  - `pillow` - Image manipulation

---

## 📁 Project Structure

```
photo-enhancer/
├── api/                          # Backend API
│   ├── services/
│   │   ├── background.py         # Background removal (BiRefNet)
│   │   └── upscale.py            # Image upscaling (Real-ESRGAN)
│   ├── main.py                   # FastAPI entry point
│   ├── requirements.txt          # Python dependencies
│   └── Dockerfile                # Docker configuration
│
├── web/                          # Frontend Application
│   ├── src/
│   │   ├── components/
│   │   │   ├── ui/               # shadcn/ui components
│   │   │   ├── Header.tsx        # Navigation header
│   │   │   ├── UploadZone.tsx    # Image upload component
│   │   │   ├── EnhanceOptions.tsx # Enhancement options
│   │   │   ├── ProcessingStatus.tsx # Processing indicator
│   │   │   └── BeforeAfter.tsx   # Comparison slider
│   │   ├── lib/                  # Utilities
│   │   ├── App.tsx               # Main app component
│   │   ├── main.tsx              # Entry point
│   │   └── index.css             # Global styles
│   ├── package.json
│   └── vite.config.ts
│
├── uploads/                      # Uploaded images (temp)
├── results/                      # Processed images (temp)
└── README.md
```

---

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- Python 3.11+
- pip

### Backend (API)

```bash
# Navigate to api folder
cd api

# Create virtual environment
python -m venv venv

# Activate virtual environment
# Windows:
.\venv\Scripts\activate
# Linux/Mac:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Run server
uvicorn main:app --reload --port 8000
```

API will be running at `http://localhost:8000`

### Frontend (Web)

```bash
# Navigate to web folder
cd web

# Install dependencies
npm install

# Run development server
npm run dev
```

Frontend will be running at `http://localhost:5173`

---

## 📡 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/` | Health check & API info |
| `POST` | `/upload` | Upload image for processing |
| `POST` | `/enhance/background/{filename}` | Remove background using BiRefNet |
| `POST` | `/enhance/upscale/{filename}` | Upscale image 4x with Real-ESRGAN |
| `GET` | `/download/{filename}` | Download processed result |

---

## 🌐 Deployment

### Backend → Hugging Face Spaces

1. Create a new Space on [Hugging Face](https://huggingface.co/spaces)
2. Select **Docker** as the SDK
3. Push the `api/` folder to the Space repository
4. Space will auto-build using the Dockerfile

### Frontend → Vercel

1. Deploy the `web/` folder to [Vercel](https://vercel.com)
2. Add environment variable:
   ```
   VITE_API_URL=https://your-space.hf.space
   ```

---

## 🔧 Environment Variables

### Frontend (web/.env)
```env
VITE_API_URL=http://localhost:8000
```

### Backend
No environment variables required for local development.

---

## 📸 Supported Formats

| Format | Upload | Download |
|--------|--------|----------|
| JPEG/JPG | ✅ | ✅ |
| PNG | ✅ | ✅ |
| WebP | ✅ | ✅ |

---

## 📝 License

MIT License - see [LICENSE](LICENSE) file for details.
