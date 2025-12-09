import React, { useState, useRef } from 'react';
import { 
  Download, 
  Wand2, 
  AlertCircle, 
  Upload, 
  X, 
  Square, 
  RectangleHorizontal, 
  RectangleVertical, 
  Monitor, 
  Smartphone 
} from 'lucide-react';
import { generateImageFromText } from '../services/geminiService';
import { AspectRatio } from '../types';
import { LoadingSpinner } from './LoadingSpinner';

const ASPECT_RATIOS: { value: AspectRatio; label: string; Icon: React.ElementType }[] = [
  { value: '1:1', label: 'Murabba\'i', Icon: Square },
  { value: '16:9', label: 'Faɗi (16:9)', Icon: Monitor },
  { value: '9:16', label: 'Tsaye (9:16)', Icon: Smartphone },
  { value: '4:3', label: 'Babba (4:3)', Icon: RectangleHorizontal },
  { value: '3:4', label: 'Hoto (3:4)', Icon: RectangleVertical },
];

export const ImageGenerator: React.FC = () => {
  const [prompt, setPrompt] = useState('');
  const [aspectRatio, setAspectRatio] = useState<AspectRatio>('1:1');
  const [loading, setLoading] = useState(false);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  
  // New state for uploaded image
  const [uploadedImage, setUploadedImage] = useState<{ url: string; data: string; mimeType: string } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        setError('Hoton ya yi girma da yawa. Da fatan za a yi amfani da hoto mai ƙasa da 5MB.');
        return;
      }
      
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        // Split data URL to get base64 data and mimeType
        const matches = result.match(/^data:(.+);base64,(.+)$/);
        
        if (matches && matches.length === 3) {
          setUploadedImage({
            url: result,
            mimeType: matches[1],
            data: matches[2]
          });
          setError(null);
        } else {
          setError('Ba a gane hoton ba.');
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const clearUploadedImage = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    setUploadedImage(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim()) return;

    setLoading(true);
    setError(null);
    setGeneratedImage(null);

    try {
      const imageForApi = uploadedImage 
        ? { data: uploadedImage.data, mimeType: uploadedImage.mimeType } 
        : undefined;

      const imageUrl = await generateImageFromText(prompt, aspectRatio, imageForApi);
      if (imageUrl) {
        setGeneratedImage(imageUrl);
      } else {
        setError('Ba a samu damar samar da hoto ba. Da fatan za a sake gwadawa.');
      }
    } catch (err) {
      setError('An sami matsala wajen haɗawa da sabar. Da fatan za a sake gwadawa.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = () => {
    if (generatedImage) {
      const link = document.createElement('a');
      link.href = generatedImage;
      link.download = `ai-hoto-${Date.now()}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-4 md:p-6 pb-24">
      
      {/* Input Section */}
      <div className="bg-slate-800/60 border border-slate-700 rounded-2xl p-6 shadow-xl backdrop-blur-sm mb-8">
        <form onSubmit={handleGenerate} className="space-y-6">
          
          <div className="space-y-2">
            <label htmlFor="prompt" className="block text-sm font-medium text-indigo-200">
              Bayyana hoton da kake so (Prompt)
            </label>
            <div className="relative">
              <textarea
                id="prompt"
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder={uploadedImage 
                  ? "Bayyana yadda kake so a canza hoton... (Misali: Ka sa ya zama kamar zanen cartoon, ko ka sanya hula akai)"
                  : "Misali: Kyakykyawan kyanwa tana sanye da gilashi tana karatun littafi a ɗakin karatu..."
                }
                className="w-full bg-slate-900 border border-slate-600 rounded-xl p-4 text-white placeholder-slate-500 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all min-h-[120px] resize-none text-lg"
              />
              <div className="absolute bottom-3 right-3 text-xs text-slate-500">
                {prompt.length} haruffa
              </div>
            </div>
          </div>

          {/* Image Upload Section */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-indigo-200">
              Dora Hotonka (Na zaɓi)
            </label>
            
            {!uploadedImage ? (
              <div 
                onClick={() => {
                  if (fileInputRef.current) {
                    fileInputRef.current.value = ''; // Reset value to allow re-selecting same file
                    fileInputRef.current.click();
                  }
                }}
                className="border-2 border-dashed border-slate-600 hover:border-indigo-500 hover:bg-slate-800/50 rounded-xl p-6 transition-all cursor-pointer flex flex-col items-center justify-center text-slate-400 gap-2 h-32 group"
              >
                <div className="p-3 bg-slate-800 rounded-full group-hover:bg-indigo-900/50 transition-colors">
                  <Upload className="w-6 h-6 text-slate-300 group-hover:text-indigo-300" />
                </div>
                <div className="text-center">
                  <span className="text-sm font-medium block">Taɓa nan don ɗauko hoto</span>
                  <span className="text-xs text-slate-500">PNG ko JPG (Kasa da 5MB)</span>
                </div>
              </div>
            ) : (
              <div className="relative flex items-center gap-4 bg-slate-900/50 border border-indigo-500/30 rounded-xl p-3">
                <div className="relative h-20 w-20 flex-shrink-0 rounded-lg overflow-hidden bg-black/50 border border-slate-700">
                  <img 
                    src={uploadedImage.url} 
                    alt="Uploaded preview" 
                    className="h-full w-full object-cover"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-white truncate">Hoton da aka dora</p>
                  <p className="text-xs text-slate-400">Za a yi amfani da wannan hoton wajen kirkirar sabo.</p>
                </div>
                <button
                  type="button"
                  onClick={clearUploadedImage}
                  className="p-2 hover:bg-red-500/10 text-slate-400 hover:text-red-400 rounded-lg transition-colors"
                  title="Cire Hoto"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            )}
            <input 
              type="file" 
              ref={fileInputRef}
              onChange={handleFileChange}
              accept="image/png, image/jpeg, image/webp"
              className="hidden"
            />
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-indigo-200">
              Girman Hoto (Aspect Ratio)
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
              {ASPECT_RATIOS.map((ratio) => (
                <button
                  key={ratio.value}
                  type="button"
                  onClick={() => setAspectRatio(ratio.value)}
                  className={`flex flex-col items-center justify-center p-3 rounded-lg border transition-all ${
                    aspectRatio === ratio.value
                      ? 'bg-indigo-600 border-indigo-500 text-white shadow-lg shadow-indigo-900/50'
                      : 'bg-slate-900 border-slate-700 text-slate-400 hover:border-slate-500 hover:bg-slate-800'
                  }`}
                >
                  <ratio.Icon className="w-5 h-5 mb-2 opacity-80" />
                  <span className="text-xs font-medium">{ratio.label}</span>
                </button>
              ))}
            </div>
          </div>

          <button
            type="submit"
            disabled={loading || !prompt.trim()}
            className={`w-full py-4 rounded-xl flex items-center justify-center gap-2 font-bold text-lg transition-all transform ${
              loading || !prompt.trim()
                ? 'bg-slate-700 text-slate-400 cursor-not-allowed'
                : 'bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white shadow-xl shadow-indigo-900/40 hover:scale-[1.02] active:scale-[0.98]'
            }`}
          >
            {loading ? (
              'Yana Aiki...'
            ) : (
              <>
                <Wand2 className="w-5 h-5" />
                Samar da Hoto
              </>
            )}
          </button>
        </form>
      </div>

      {/* Result Section */}
      {error && (
        <div className="bg-red-500/10 border border-red-500/50 text-red-200 p-4 rounded-xl flex items-center gap-3 mb-8 animate-fade-in">
          <AlertCircle className="w-5 h-5 flex-shrink-0" />
          <p>{error}</p>
        </div>
      )}

      {loading && <LoadingSpinner />}

      {generatedImage && !loading && (
        <div className="space-y-6 animate-fade-in scroll-mt-20" id="result">
          <div className="bg-slate-800/40 border border-slate-700 rounded-2xl overflow-hidden shadow-2xl relative group">
            <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-t from-slate-900/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-6 z-10">
              <div className="flex gap-3">
                 <button
                  onClick={handleDownload}
                  className="bg-white/10 hover:bg-white/20 backdrop-blur-md text-white p-3 rounded-lg border border-white/20 transition-all flex-1 flex items-center justify-center gap-2"
                >
                  <Download className="w-5 h-5" />
                  <span className="font-medium">Sauke (Download)</span>
                </button>
              </div>
            </div>
            
            <img 
              src={generatedImage} 
              alt="Generated AI Art" 
              className="w-full h-auto object-contain max-h-[70vh] bg-slate-950"
            />
          </div>
          
          <div className="flex justify-center">
            <p className="text-slate-500 text-sm">
              An kirkira ta hanyar Gemini 2.5 Flash
            </p>
          </div>
        </div>
      )}
    </div>
  );
};