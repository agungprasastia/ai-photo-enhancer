import { ReactCompareSlider, ReactCompareSliderImage } from 'react-compare-slider';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface BeforeAfterProps {
  originalUrl: string;
  enhancedUrl: string;
}

export default function BeforeAfter({ originalUrl, enhancedUrl }: BeforeAfterProps) {
  if (!originalUrl || !enhancedUrl) return null;

  // Classic gray checkerboard pattern (like Photoshop)
  const checkerboardBg = `
    linear-gradient(45deg, #808080 25%, transparent 25%),
    linear-gradient(-45deg, #808080 25%, transparent 25%),
    linear-gradient(45deg, transparent 75%, #808080 75%),
    linear-gradient(-45deg, transparent 75%, #808080 75%)
  `;

  return (
    <Card className="w-full border-white/10 bg-white/5 backdrop-blur-xl">
      <CardContent className="p-4">
        <ReactCompareSlider
          itemOne={
            <div 
              style={{ 
                width: '100%', 
                height: '100%', 
                backgroundColor: '#1a1a2e',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <ReactCompareSliderImage
                src={originalUrl}
                alt="Original"
                style={{ objectFit: 'contain', maxHeight: '320px' }}
              />
            </div>
          }
          itemTwo={
            <div 
              style={{ 
                width: '100%', 
                height: '100%', 
                backgroundImage: checkerboardBg,
                backgroundSize: '16px 16px',
                backgroundPosition: '0 0, 0 8px, 8px -8px, -8px 0px',
                backgroundColor: '#c0c0c0',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <ReactCompareSliderImage
                src={enhancedUrl}
                alt="Enhanced"
                style={{ objectFit: 'contain', maxHeight: '320px' }}
              />
            </div>
          }
          position={50}
          className="h-80 rounded-xl overflow-hidden"
        />
        <div className="mt-3 flex justify-between">
          <Badge variant="secondary" className="bg-slate-800 text-slate-400">
            ← Original
          </Badge>
          <Badge variant="secondary" className="bg-violet-500/20 text-violet-400">
            Enhanced (transparent) →
          </Badge>
        </div>
      </CardContent>
    </Card>
  );
}
