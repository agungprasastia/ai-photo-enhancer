import { ReactCompareSlider, ReactCompareSliderImage } from 'react-compare-slider';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface BeforeAfterProps {
  originalUrl: string;
  enhancedUrl: string;
}

export default function BeforeAfter({ originalUrl, enhancedUrl }: BeforeAfterProps) {
  if (!originalUrl || !enhancedUrl) return null;

  return (
    <Card className="w-full border-white/10 bg-white/5 backdrop-blur-xl">
      <CardContent className="p-4">
        <ReactCompareSlider
          itemOne={
            <ReactCompareSliderImage
              src={originalUrl}
              alt="Original"
              style={{ objectFit: 'contain' }}
            />
          }
          itemTwo={
            <ReactCompareSliderImage
              src={enhancedUrl}
              alt="Enhanced"
              style={{ objectFit: 'contain' }}
            />
          }
          position={50}
          className="h-80 overflow-hidden rounded-xl"
        />
        <div className="mt-3 flex justify-between">
          <Badge variant="secondary" className="bg-slate-800 text-slate-400">
            ← Original
          </Badge>
          <Badge variant="secondary" className="bg-violet-500/20 text-violet-400">
            Enhanced →
          </Badge>
        </div>
      </CardContent>
    </Card>
  );
}
