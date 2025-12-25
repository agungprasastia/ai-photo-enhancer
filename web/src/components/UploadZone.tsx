import { useCallback, useState, CSSProperties } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, Image as ImageIcon, X } from 'lucide-react';

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

  const closeButtonStyle: CSSProperties = {
    position: 'absolute',
    top: '0.5rem',
    right: '0.5rem',
    width: '36px',
    height: '36px',
    borderRadius: '50%',
    background: 'rgba(239, 68, 68, 0.9)',
    border: 'none',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 10
  };

  const previewImageStyle: CSSProperties = {
    width: '100%',
    maxHeight: '300px',
    objectFit: 'contain',
    borderRadius: '12px'
  };

  const fileInfoStyle: CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: '1.25rem',
    flexWrap: 'wrap',
    gap: '1rem'
  };

  const iconContainerStyle: CSSProperties = {
    width: '64px',
    height: '64px',
    borderRadius: '50%',
    background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.15) 0%, rgba(6, 182, 212, 0.15) 100%)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    margin: '0 auto 1.5rem'
  };

  if (preview && file) {
    return (
      <div className="glass" style={{ width: '100%', padding: '1.5rem' }}>
        <div style={{ position: 'relative' }}>
          <button onClick={clearFile} style={closeButtonStyle}>
            <X size={18} color="white" />
          </button>
          <img src={preview} alt="Preview" style={previewImageStyle} />
        </div>
        <div style={fileInfoStyle}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <ImageIcon size={18} style={{ color: '#a78bfa' }} />
            <span style={{ fontSize: '0.875rem', color: '#94a3b8' }}>
              {file.name.length > 25 ? file.name.substring(0, 25) + '...' : file.name}
            </span>
            <span style={{ fontSize: '0.75rem', color: '#64748b' }}>
              ({(file.size / 1024 / 1024).toFixed(2)} MB)
            </span>
          </div>
          <button onClick={handleUpload} disabled={isUploading} className="btn-primary">
            {isUploading ? 'Uploading...' : 'Upload Image'}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div
      {...getRootProps()}
      className={`dropzone ${isDragActive ? 'active' : ''}`}
      style={{ width: '100%' }}
    >
      <input {...getInputProps()} />
      <div className="animate-float" style={iconContainerStyle}>
        <Upload size={28} style={{ color: '#a78bfa' }} />
      </div>
      {isDragActive ? (
        <p style={{ fontSize: '1.125rem', fontWeight: 500, color: '#a78bfa' }}>
          Drop image here...
        </p>
      ) : (
        <>
          <p style={{ fontSize: '1.125rem', fontWeight: 500, marginBottom: '0.5rem' }}>
            Drag & drop your image here
          </p>
          <p style={{ color: '#64748b', marginBottom: '1rem' }}>or click to browse</p>
          <p style={{ fontSize: '0.8rem', color: '#475569' }}>
            Supports: JPG, PNG, WebP
          </p>
        </>
      )}
    </div>
  );
}
