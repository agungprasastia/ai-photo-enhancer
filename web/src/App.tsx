import { useState } from 'react';
import axios from 'axios';
import Header from './components/Header';
import UploadZone from './components/UploadZone';
import EnhanceOptions from './components/EnhanceOptions';
import BeforeAfter from './components/BeforeAfter';
import ProcessingStatus from './components/ProcessingStatus';
import { Download, RotateCcw, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Card, CardContent } from '@/components/ui/card';

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
    <div className="flex min-h-screen flex-col bg-[#09090f]">
      {/* Background gradient */}
      <div className="pointer-events-none fixed inset-0 bg-[radial-gradient(ellipse_at_top_center,rgba(139,92,246,0.08)_0%,transparent_50%),radial-gradient(ellipse_at_bottom_right,rgba(6,182,212,0.05)_0%,transparent_50%)]" />
      
      <Header />

      <main className="relative z-10 flex flex-1 items-center justify-center px-4 py-8">
        <div className="flex w-full max-w-xl flex-col gap-8">
          {/* Hero */}
          <div className="text-center">
            <h2 className="mb-3 bg-gradient-to-r from-violet-400 via-pink-400 to-cyan-400 bg-clip-text text-4xl font-bold text-transparent">
              AI Photo Enhancer
            </h2>
            <p className="mx-auto max-w-md text-slate-500">
              Remove backgrounds, upscale images, and enhance your photos with the power of AI
            </p>
          </div>

          {/* Steps */}
          <div className="flex items-center justify-center gap-2">
            {['Upload', 'Enhance', 'Result'].map((label, i) => {
              const stepNum = i + 1;
              const currentStep = getStepNumber();
              const isActive = stepNum <= currentStep;
              const isComplete = stepNum < currentStep;

              return (
                <div key={label} className="flex items-center gap-2">
                  <div
                    className={`flex h-8 w-8 items-center justify-center rounded-full text-sm font-semibold transition-all ${
                      isComplete
                        ? 'bg-violet-500 text-white'
                        : isActive
                        ? 'border border-violet-500 bg-violet-500/15 text-violet-400'
                        : 'border border-white/10 bg-white/5 text-slate-600'
                    }`}
                  >
                    {stepNum}
                  </div>
                  <span className={`hidden text-sm sm:block ${isActive ? 'text-slate-200' : 'text-slate-600'}`}>
                    {label}
                  </span>
                  {i < 2 && (
                    <div
                      className={`mx-1 h-0.5 w-10 transition-all sm:w-16 ${
                        isComplete ? 'bg-violet-500' : 'bg-white/10'
                      }`}
                    />
                  )}
                </div>
              );
            })}
          </div>

          {/* Error */}
          {error && (
            <Alert variant="destructive" className="border-red-500/30 bg-red-500/10">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {/* Content */}
          <div className="flex justify-center">
            {step === 'upload' && (
              <UploadZone onUpload={handleUpload} isUploading={isUploading} />
            )}

            {step === 'enhance' && (
              <div className="flex w-full flex-col gap-6">
                <Card className="border-white/10 bg-white/5 backdrop-blur-xl">
                  <CardContent className="p-4">
                    <img src={originalUrl} alt="Uploaded" className="w-full max-h-72 object-contain rounded-xl" />
                  </CardContent>
                </Card>
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
              <div className="flex w-full flex-col gap-6">
                <Alert className="border-emerald-500/30 bg-emerald-500/10">
                  <CheckCircle2 className="h-5 w-5 text-emerald-400" />
                  <AlertDescription className="text-emerald-300">
                    Enhancement complete!
                  </AlertDescription>
                </Alert>

                <BeforeAfter originalUrl={originalUrl} enhancedUrl={enhancedUrl} />

                <div className="flex flex-wrap justify-center gap-4">
                  <Button variant="outline" onClick={handleReset}>
                    <RotateCcw size={18} />
                    Start Over
                  </Button>
                  <Button onClick={handleDownload}>
                    <Download size={18} />
                    Download Result
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;
