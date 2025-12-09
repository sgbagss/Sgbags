import React from 'react';
import { Sparkles, Image as ImageIcon } from 'lucide-react';

export const Header: React.FC = () => {
  return (
    <header className="w-full border-b border-indigo-900/50 bg-slate-900/50 backdrop-blur-md sticky top-0 z-50">
      <div className="max-w-5xl mx-auto px-4 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="bg-gradient-to-br from-indigo-500 to-purple-600 p-2 rounded-lg">
            <Sparkles className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-indigo-200">
              AI Mai Hoto
            </h1>
            <p className="text-xs text-slate-400">Gemini 2.5 Flash</p>
          </div>
        </div>
        
        <div className="flex items-center gap-2 text-sm text-slate-400 bg-slate-800/50 px-3 py-1 rounded-full border border-slate-700">
          <ImageIcon className="w-4 h-4" />
          <span className="hidden sm:inline">Samar da Hotuna</span>
        </div>
      </div>
    </header>
  );
};