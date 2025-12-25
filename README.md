# AI Photo Enhancer

AI-powered photo enhancement application with background removal and image upscaling.

## Project Structure

```
photo-enhancer/
├── api/              # Python FastAPI Backend
│   ├── main.py
│   ├── services/
│   │   ├── background.py
│   │   └── upscale.py
│   └── requirements.txt
│
├── web/              # React + Vite Frontend
│   ├── src/
│   └── package.json
│
├── uploads/          # Uploaded images
├── results/          # Processed images
└── README.md
```

## Features

- 🖼️ **Background Removal** - AI-powered background removal using rembg
- 🔍 **Image Upscaling** - Enhance image resolution 2x/4x
- 🎨 **Modern UI** - Beautiful dark theme with glassmorphism effects
- 📱 **Responsive** - Works on desktop and mobile

## Quick Start

### 1. Setup Backend

```bash
cd api
python -m venv venv
.\venv\Scripts\activate  # Windows
source venv/bin/activate # Linux/Mac
pip install -r requirements.txt
uvicorn main:app --reload
```

Backend runs at: http://localhost:8000

### 2. Setup Frontend

```bash
cd web
npm install
npm run dev
```

Frontend runs at: http://localhost:5173

## Tech Stack

- **Frontend**: React 19, Vite, TailwindCSS
- **Backend**: Python FastAPI
- **AI**: rembg (background removal), Real-ESRGAN (upscaling)

## License

MIT
