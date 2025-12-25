import { useState } from 'react';
import axios from 'axios';
import Header from './components/Header';
import UploadZone from './components/UploadZone';
import EnhanceOptions from './components/EnhanceOptions';
import BeforeAfter from './components/BeforeAfter';
import ProcessingStatus from './components/ProcessingStatus';
import { Download, RotateCcw, CheckCircle2 } from 'lucide-react';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

type Step = 'upload' | 'enhance' | 'processing' | 'result';

function App() {
  const [step, setStep] = useState<Step>('upload');
  const [uploadedFilename, setUploadedFilename] = useState('');
  const [selectedOption, setSelectedOption] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [originalUrl, setOriginalUrl] = useState('');
  const [enhancedUrl, setEnhancedUrl] = useState('');
  const [resultFilename, setResultFilename] = useState('');
  const [error, setError] = useState('');

  const handleUpload = async (file: File) => {
    setIsUploading(true);
    setError('');

    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await axios.post(`${API_URL}/upload`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      setUploadedFilename(response.data.filename);
      setOriginalUrl(URL.createObjectURL(file));
      setStep('enhance');
    } catch (err) {
      if (axios.isAxiosError(err)) {
        setError(err.response?.data?.detail || 'Upload failed');
      } else {
        setError('Upload failed');
      }
    } finally {
      setIsUploading(false);
    }
  };

  const handleEnhance = async (option: string) => {
    setSelectedOption(option);
    setIsProcessing(true);
    setStep('processing');
    setError('');

    try {
      const endpoint = option === 'background'
        ? `/enhance/background/${uploadedFilename}`
        : `/enhance/upscale/${uploadedFilename}?scale=2`;

      const response = await axios.post(`${API_URL}${endpoint}`);

      setResultFilename(response.data.result);
      setEnhancedUrl(`${API_URL}/download/${response.data.result}`);
      setStep('result');
    } catch (err) {
      if (axios.isAxiosError(err)) {
        setError(err.response?.data?.detail || 'Enhancement failed');
      } else {
        setError('Enhancement failed');
      }
      setStep('enhance');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDownload = () => {
    window.open(`${API_URL}/download/${resultFilename}`, '_blank');
  };

  const handleReset = () => {
    setStep('upload');
    setUploadedFilename('');
    setSelectedOption('');
    setOriginalUrl('');
    setEnhancedUrl('');
    setResultFilename('');
    setError('');
  };

  const getStepNumber = (): number => {
    if (step === 'upload') return 1;
    if (step === 'enhance') return 2;
    return 3;
  };

  return (
    <div className="app-container">
      <Header />

      <main className="main-content">
        <div className="content-wrapper">
          {/* Hero */}
          <div className="hero-section">
            <h2 className="hero-title">AI Photo Enhancer</h2>
            <p className="hero-subtitle">
              Remove backgrounds, upscale images, and enhance your photos with the power of AI
            </p>
          </div>

          {/* Steps */}
          <div className="steps-container">
            {['Upload', 'Enhance', 'Result'].map((label, i) => {
              const stepNum = i + 1;
              const currentStep = getStepNumber();
              const isActive = stepNum <= currentStep;
              const isComplete = stepNum < currentStep;

              return (
                <div key={label} className="step-item">
                  <div className={`step-circle ${isActive ? 'active' : ''} ${isComplete ? 'complete' : ''}`}>
                    {stepNum}
                  </div>
                  <span className={`step-label ${isActive ? 'active' : ''}`}>{label}</span>
                  {i < 2 && <div className={`step-line ${isComplete ? 'complete' : ''}`} />}
                </div>
              );
            })}
          </div>

          {/* Error */}
          {error && (
            <div className="error-message">
              {error}
            </div>
          )}

          {/* Content */}
          <div className="step-content">
            {step === 'upload' && (
              <UploadZone onUpload={handleUpload} isUploading={isUploading} />
            )}

            {step === 'enhance' && (
              <div className="enhance-container">
                <div className="preview-card">
                  <img src={originalUrl} alt="Uploaded" className="preview-image" />
                </div>
                <EnhanceOptions
                  onSelect={handleEnhance}
                  selectedOption={selectedOption}
                  isProcessing={isProcessing}
                />
              </div>
            )}

            {step === 'processing' && (
              <ProcessingStatus status="processing" />
            )}

            {step === 'result' && (
              <div className="result-container">
                <div className="success-message">
                  <CheckCircle2 size={20} />
                  <span>Enhancement complete!</span>
                </div>

                <BeforeAfter originalUrl={originalUrl} enhancedUrl={enhancedUrl} />

                <div className="action-buttons">
                  <button onClick={handleReset} className="btn-secondary">
                    <RotateCcw size={18} />
                    Start Over
                  </button>
                  <button onClick={handleDownload} className="btn-primary">
                    <Download size={18} />
                    Download Result
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>

      <footer className="app-footer">
        <p>Built with ❤️ using React & FastAPI</p>
      </footer>
    </div>
  );
}

export default App;
