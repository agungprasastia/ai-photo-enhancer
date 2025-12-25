# AI Photo Enhancer

AI-powered photo enhancement tool with background removal and image upscaling using Real-ESRGAN.

## Tech Stack

- **Frontend**: React + Vite + TypeScript + shadcn/ui + Tailwind CSS v4
- **Backend**: FastAPI + Python + rembg + Real-ESRGAN

## Project Structure

```
photo-enhancer/
├── api/
│   ├── services/
│   │   ├── background.py
│   │   └── upscale.py
│   ├── main.py
│   ├── requirements.txt
│   └── Dockerfile
├── web/
│   ├── src/
│   │   ├── components/
│   │   │   ├── ui/
│   │   │   ├── Header.tsx
│   │   │   ├── UploadZone.tsx
│   │   │   ├── EnhanceOptions.tsx
│   │   │   ├── ProcessingStatus.tsx
│   │   │   └── BeforeAfter.tsx
│   │   ├── lib/
│   │   ├── App.tsx
│   │   ├── main.tsx
│   │   └── index.css
│   ├── package.json
│   └── vite.config.ts
├── uploads/
├── results/
└── README.md
```

## Deployment

### Backend (Hugging Face Spaces)
- Push `api/` folder to Hugging Face Space with Docker SDK
- README.md in api/ contains HF Space metadata

### Frontend (Vercel)
- Push `web/` folder to Vercel
- Set `VITE_API_URL` environment variable to your HF Space URL

## Local Development

### Backend (API)
```bash
cd api
python -m venv venv
.\venv\Scripts\activate  # Windows
pip install -r requirements.txt
uvicorn main:app --reload
```

### Frontend (Web)
```bash
cd web
npm install
npm run dev
```

## Features

- 🎨 **Background Removal** - AI-powered using rembg with BiRefNet model
- 🔍 **Image Upscaling** - 2x/4x/8x upscale using Real-ESRGAN (py-real-esrgan v2.0.0)
- 📱 **Responsive UI** - Modern dark theme with shadcn/ui
- 🔄 **Before/After Slider** - Compare original and enhanced images

## License

MIT
