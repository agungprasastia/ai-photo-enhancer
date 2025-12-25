import { Sparkles, Maximize2, Eraser, LucideIcon } from 'lucide-react';

interface EnhanceOptionsProps {
  onSelect: (option: string) => void;
  selectedOption: string;
  isProcessing: boolean;
}

interface Option {
  id: string;
  title: string;
  description: string;
  icon: LucideIcon;
  gradient: string;
}

export default function EnhanceOptions({ onSelect, selectedOption, isProcessing }: EnhanceOptionsProps) {
  const options: Option[] = [
    {
      id: 'background',
      title: 'Remove Background',
      description: 'AI-powered background removal',
      icon: Eraser,
      gradient: 'linear-gradient(135deg, #ec4899 0%, #8b5cf6 100%)'
    },
    {
      id: 'upscale',
      title: 'Upscale 2x',
      description: 'Enhance image resolution',
      icon: Maximize2,
      gradient: 'linear-gradient(135deg, #06b6d4 0%, #3b82f6 100%)'
    }
  ];

  return (
    <div style={{ width: '100%' }}>
      <div className="options-title">
        <Sparkles size={18} style={{ color: '#a78bfa' }} />
        <span>Choose Enhancement</span>
      </div>
      <div className="options-grid">
        {options.map((option) => {
          const Icon = option.icon;
          return (
            <button
              key={option.id}
              onClick={() => onSelect(option.id)}
              disabled={isProcessing}
              className={`card ${selectedOption === option.id ? 'selected' : ''}`}
              style={{
                opacity: isProcessing ? 0.5 : 1,
                cursor: isProcessing ? 'not-allowed' : 'pointer'
              }}
            >
              <div style={{
                width: '44px',
                height: '44px',
                borderRadius: '10px',
                background: option.gradient,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '0.875rem'
              }}>
                <Icon size={22} color="white" />
              </div>
              <h4 style={{ fontWeight: 600, marginBottom: '0.25rem', fontSize: '0.95rem' }}>
                {option.title}
              </h4>
              <p style={{ fontSize: '0.8rem', color: '#64748b' }}>
                {option.description}
              </p>
            </button>
          );
        })}
      </div>
    </div>
  );
}
