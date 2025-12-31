import { Wand2 } from 'lucide-react';

export default function Header() {
  return (
    <header className="border-b border-white/5 px-6 py-4">
      <div className="mx-auto flex max-w-6xl items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-violet-500 to-cyan-500 shadow-lg shadow-violet-500/25">
            <Wand2 size={20} className="text-white" />
          </div>
          <span className="bg-gradient-to-r from-violet-400 to-cyan-400 bg-clip-text text-xl font-bold text-transparent">
            Photo Enhancer
          </span>
        </div>
      </div>
    </header>
  );
}
