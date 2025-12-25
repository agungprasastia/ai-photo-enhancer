# Photo Enhancer

AI-powered photo enhancement tool with background removal and image upscaling.

## Tech Stack

- **Frontend**: React + Vite + TypeScript + shadcn/ui + Tailwind CSS
- **Backend**: FastAPI + Python + rembg + OpenCV

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
- 🔍 **Image Upscaling** - 2x/4x upscale with enhancement
- 📱 **Responsive UI** - Modern dark theme with shadcn/ui
- 🔄 **Before/After Slider** - Compare original and enhanced images

## License

MIT
