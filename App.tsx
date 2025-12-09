import React from 'react';
import { Header } from './components/Header';
import { ImageGenerator } from './components/ImageGenerator';

function App() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-slate-900 via-slate-950 to-black">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto text-center mb-10 space-y-3">
          <h2 className="text-3xl md:text-4xl font-bold text-white">
            Bada umarni, mu samar da <span className="text-indigo-400">Hoto</span>
          </h2>
          <p className="text-slate-400 text-lg">
            Rubuta duk abun da kake hasasowa, AI zai zana maka shi cikin sakan guda.
          </p>
        </div>
        <ImageGenerator />
      </main>
      
      <footer className="w-full py-6 text-center text-slate-600 text-sm border-t border-slate-900 mt-auto">
        <p>© {new Date().getFullYear()} Mai Samar Da Hotuna na AI.</p>
      </footer>
    </div>
  );
}

export default App;