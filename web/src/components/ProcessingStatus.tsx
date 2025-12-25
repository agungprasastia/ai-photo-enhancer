import { Loader2 } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';

interface ProcessingStatusProps {
  status: 'uploading' | 'processing' | 'complete' | 'error';
}

export default function ProcessingStatus({ status }: ProcessingStatusProps) {
  const statusMessages: Record<string, string> = {
    uploading: 'Uploading image...',
    processing: 'AI is working its magic...',
    complete: 'Enhancement complete!',
    error: 'Something went wrong'
  };

  return (
    <Card className="w-full border-white/10 bg-white/5 backdrop-blur-xl">
      <CardContent className="flex flex-col items-center py-12">
        <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-violet-500/20 to-cyan-500/20">
          <Loader2 size={28} className="animate-spin text-violet-400" />
        </div>
        <p className="mb-4 text-lg font-medium text-slate-200">
          {statusMessages[status] || 'Processing...'}
        </p>
        <Progress value={66} className="w-48" />
      </CardContent>
    </Card>
  );
}
