import { useState } from 'react';
import { Sparkles, Maximize2, Eraser, LucideIcon } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface EnhanceOptionsProps {
  onSelect: (option: string, scale?: number) => void;
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
  const [selectedScale, setSelectedScale] = useState<number>(2);

  const options: Option[] = [
    {
      id: 'background',
      title: 'Remove Background',
      description: 'AI-powered background removal',
      icon: Eraser,
      gradient: 'from-pink-500 to-violet-500'
    },
    {
      id: 'upscale',
      title: 'Upscale Image',
      description: 'Enhance resolution with AI',
      icon: Maximize2,
      gradient: 'from-cyan-500 to-blue-500'
    }
  ];

  const handleOptionClick = (optionId: string) => {
    if (isProcessing) return;
    
    if (optionId === 'upscale') {
      onSelect(optionId, selectedScale);
    } else {
      onSelect(optionId);
    }
  };

  return (
    <div className="w-full">
      <div className="mb-4 flex items-center justify-center gap-2 text-base font-semibold">
        <Sparkles size={18} className="text-violet-400" />
        <span>Choose Enhancement</span>
      </div>
      
      {/* Scale Selector */}
      <div className="mb-4 flex items-center justify-center gap-3">
        <span className="text-sm text-slate-400">Upscale Factor:</span>
        <div className="flex gap-2">
          {[2, 4].map((scale) => (
            <Button
              key={scale}
              variant={selectedScale === scale ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSelectedScale(scale)}
              disabled={isProcessing}
              className={`min-w-[50px] ${
                selectedScale === scale 
                  ? 'bg-gradient-to-r from-cyan-500 to-blue-500' 
                  : 'border-white/20 bg-white/5 hover:bg-white/10'
              }`}
            >
              {scale}x
            </Button>
          ))}
        </div>
        <span className="text-xs text-slate-500">
          ({selectedScale === 2 ? 'Faster' : 'Higher quality'})
        </span>
      </div>

      <div className="grid grid-cols-2 gap-4">
        {options.map((option) => {
          const Icon = option.icon;
          const isSelected = selectedOption === option.id;
          const displayTitle = option.id === 'upscale' ? `Upscale ${selectedScale}x` : option.title;
          
          return (
            <Card
              key={option.id}
              onClick={() => handleOptionClick(option.id)}
              className={`cursor-pointer border-white/10 bg-white/5 backdrop-blur-xl transition-all duration-200 hover:-translate-y-1 hover:border-violet-500/50 ${
                isSelected ? 'border-violet-500 shadow-lg shadow-violet-500/20' : ''
              } ${isProcessing ? 'cursor-not-allowed opacity-50' : ''}`}
            >
              <CardContent className="p-5">
                <div className={`mb-3 flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br ${option.gradient}`}>
                  <Icon size={22} className="text-white" />
                </div>
                <h4 className="mb-1 font-semibold text-slate-200">{displayTitle}</h4>
                <p className="text-sm text-slate-500">{option.description}</p>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
