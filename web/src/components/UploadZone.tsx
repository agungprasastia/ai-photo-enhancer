import { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, Image as ImageIcon, X, Loader2 } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface UploadZoneProps {
  onUpload: (file: File) => void;
  isUploading: boolean;
}

export default function UploadZone({ onUpload, isUploading }: UploadZoneProps) {
  const [preview, setPreview] = useState<string | null>(null);
  const [file, setFile] = useState<File | null>(null);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const selectedFile = acceptedFiles[0];
    if (selectedFile) {
      setFile(selectedFile);
      const reader = new FileReader();
      reader.onload = () => setPreview(reader.result as string);
      reader.readAsDataURL(selectedFile);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/jpeg': ['.jpg', '.jpeg'],
      'image/png': ['.png'],
      'image/webp': ['.webp']
    },
    maxFiles: 1,
    disabled: isUploading
  });

  const handleUpload = () => {
    if (file) onUpload(file);
  };

  const clearFile = () => {
    setFile(null);
    setPreview(null);
  };

  if (preview && file) {
    return (
      <Card className="w-full border-white/10 bg-white/5 backdrop-blur-xl">
        <CardContent className="p-6">
          <div className="relative">
            <Button
              onClick={clearFile}
              size="icon"
              variant="destructive"
              className="absolute right-2 top-2 z-10 h-9 w-9 rounded-full"
            >
              <X size={18} />
            </Button>
            <img
              src={preview}
              alt="Preview"
              className="w-full max-h-[300px] object-contain rounded-xl"
            />
          </div>
          <div className="mt-5 flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <ImageIcon size={18} className="text-violet-400" />
              <span className="text-sm text-slate-400">
                {file.name.length > 25 ? file.name.substring(0, 25) + '...' : file.name}
              </span>
              <span className="text-xs text-slate-500">
                ({(file.size / 1024 / 1024).toFixed(2)} MB)
              </span>
            </div>
            <Button onClick={handleUpload} disabled={isUploading}>
              {isUploading ? (
                <>
                  <Loader2 size={18} className="animate-spin" />
                  Uploading...
                </>
              ) : (
                'Upload Image'
              )}
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div
      {...getRootProps()}
      className={`w-full cursor-pointer rounded-2xl border-2 border-dashed p-12 text-center transition-all duration-300 ${
        isDragActive
          ? 'border-violet-500 bg-violet-500/10'
          : 'border-violet-500/25 bg-violet-500/5 hover:border-violet-500/50 hover:bg-violet-500/10'
      }`}
    >
      <input {...getInputProps()} />
      <div className="mx-auto mb-6 flex h-16 w-16 animate-bounce items-center justify-center rounded-full bg-gradient-to-br from-violet-500/20 to-cyan-500/20">
        <Upload size={28} className="text-violet-400" />
      </div>
      {isDragActive ? (
        <p className="text-lg font-medium text-violet-400">Drop image here...</p>
      ) : (
        <>
          <p className="mb-2 text-lg font-medium text-slate-200">
            Drag & drop your image here
          </p>
          <p className="mb-4 text-slate-500">or click to browse</p>
          <p className="text-sm text-slate-600">Supports: JPG, PNG, WebP</p>
        </>
      )}
    </div>
  );
}
