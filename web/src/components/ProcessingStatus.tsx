import { Loader2 } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';

interface ProcessingStatusProps {
  progress?: number;
  message?: string;
}

export default function ProcessingStatus({ progress = 0, message = 'Processing...' }: ProcessingStatusProps) {
  return (
    <Card className="w-full border-white/10 bg-white/5 backdrop-blur-xl">
      <CardContent className="flex flex-col items-center py-12">
        <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-violet-500/20 to-cyan-500/20">
          <Loader2 size={28} className="animate-spin text-violet-400" />
        </div>
        <p className="mb-4 text-lg font-medium text-slate-200">
          {message}
        </p>
        <Progress value={progress} className="w-48" />
        <p className="mt-2 text-sm text-slate-500">{progress}%</p>
      </CardContent>
    </Card>
  );
}
