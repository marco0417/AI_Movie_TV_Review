
import React, { useState } from 'react';
import { Review, Language } from '../types';
import { TRANSLATIONS, FORTUNES } from '../constants';
import { getImageUrl } from '../services/tmdbService';
import { X, RefreshCw, Share2, Twitter, Heart, Copy } from 'lucide-react';

interface LotteryModalProps {
  isOpen: boolean;
  onClose: () => void;
  reviews: Review[];
  lang: Language;
  onSelect: (review: Review) => void;
}

export const LotteryModal: React.FC<LotteryModalProps> = ({ isOpen, onClose, reviews, lang, onSelect }) => {
  const [spinning, setSpinning] = useState(false);
  const [result, setResult] = useState<Review | null>(null);
  const [fortune, setFortune] = useState<string>('');
  const [fortuneType, setFortuneType] = useState<string>('');
  const t = TRANSLATIONS[lang];

  const fortuneTypes = [t.fortuneExcellent, t.fortuneGood, t.fortuneGreat, t.fortuneSmall];

  if (!isOpen) return null;

  const handleSpin = () => {
    if (reviews.length === 0) return;
    setSpinning(true);
    setResult(null);
    
    setTimeout(() => {
      const randomIndex = Math.floor(Math.random() * reviews.length);
      const res = reviews[randomIndex];
      const fortList = FORTUNES[lang] || FORTUNES['en'];
      const fort = fortList[Math.floor(Math.random() * fortList.length)];
      const type = fortuneTypes[Math.floor(Math.random() * fortuneTypes.length)];
      
      setResult(res);
      setFortune(fort);
      setFortuneType(type);
      setSpinning(false);
    }, 2500);
  };

  const shareText = result ? `I picked "${result.title[lang]}"! Fortune: ${fortuneType}. ${fortune}` : '';

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-2 sm:p-4 bg-black/70 backdrop-blur-md overflow-hidden">
      <div className="bg-[#FEFEFE] rounded-3xl w-full max-w-[400px] max-h-[90vh] flex flex-col relative shadow-2xl animate-in zoom-in duration-300">
        {/* Close Button */}
        <button 
          onClick={onClose} 
          className="absolute top-4 right-4 z-[110] text-gray-400 hover:text-red-500 transition-colors p-2 bg-white/90 rounded-full shadow-md border border-gray-100"
        >
          <X size={20} />
        </button>
        
        {/* Content Area - Scrollable */}
        <div className="flex-grow overflow-y-auto scrollbar-hide">
          {spinning ? (
            <div className="p-12 text-center h-[500px] flex flex-col items-center justify-center">
              <div className="w-56 h-80 overflow-hidden relative rounded-2xl shadow-2xl border border-gray-100 bg-gray-50">
                 <div className="flex flex-col animate-scroll-vertical">
                    {[...reviews, ...reviews, ...reviews].map((r, i) => (
                       <img key={i} src={getImageUrl(r.posterPath, 'w500')} className="w-56 h-80 object-cover" alt="movie" />
                    ))}
                 </div>
              </div>
              <p className="mt-8 text-red-500 font-black text-xl tracking-[0.3em] animate-pulse uppercase font-serif">{t.spin}...</p>
            </div>
          ) : result ? (
            <div className="flex flex-col animate-in fade-in slide-in-from-bottom-4 duration-500">
               {/* Hero Image Section */}
               <div className="w-full relative aspect-[3/4.5] overflow-hidden">
                  <img src={getImageUrl(result.posterPath, 'w780')} className="w-full h-full object-cover" alt="result" />
                  <div className="absolute top-6 left-6 bg-red-500 text-white font-black px-5 py-2.5 rounded-xl rotate-[-4deg] shadow-xl text-xl border-2 border-white z-20">
                    {fortuneType}
                  </div>
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent p-8 pt-20">
                    <h3 className="text-3xl font-black text-white leading-tight drop-shadow-2xl font-serif">{result.title[lang]}</h3>
                    <div className="mt-4 flex flex-wrap gap-2">
                       <span className="bg-white/20 backdrop-blur-md text-white text-[10px] px-3 py-1 rounded-full font-bold"># {result.genres[0]}</span>
                       {result.seasonNumber && <span className="bg-white/20 backdrop-blur-md text-white text-[10px] px-3 py-1 rounded-full font-bold"># S{result.seasonNumber}</span>}
                    </div>
                  </div>
               </div>

               {/* Fortune Text */}
               <div className="p-8 space-y-6">
                  <div className="bg-red-50/50 border-l-4 border-red-500 p-6 rounded-r-2xl">
                     <p className="text-gray-900 text-lg font-serif italic leading-relaxed">"{fortune}"</p>
                  </div>

                  {/* Actions Area */}
                  <div className="flex flex-col gap-4">
                    <button 
                      onClick={() => onSelect(result)}
                      className="w-full bg-red-500 text-white py-4 rounded-full font-black text-lg shadow-xl hover:bg-red-600 transition-all flex items-center justify-center transform active:scale-95"
                    >
                      <Heart size={20} className="mr-2" fill="currentColor" />
                      {t.readMore}
                    </button>

                    <div className="grid grid-cols-2 gap-3">
                        <button 
                          onClick={handleSpin}
                          className="py-3 bg-gray-100 text-gray-600 rounded-full font-bold text-sm hover:bg-gray-200 transition-colors flex items-center justify-center"
                        >
                          <RefreshCw size={16} className="mr-2" />
                          {t.retry}
                        </button>
                        <div className="flex gap-2">
                            <button 
                              onClick={() => window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}`, '_blank')}
                              className="flex-grow bg-[#1DA1F2]/10 text-[#1DA1F2] rounded-full flex items-center justify-center hover:bg-[#1DA1F2]/20"
                            >
                              <Twitter size={20} />
                            </button>
                            <button 
                              onClick={() => {
                                  navigator.clipboard.writeText(shareText);
                                  alert(t.copied);
                              }}
                              className="flex-grow bg-gray-100 text-gray-500 rounded-full flex items-center justify-center hover:bg-gray-200"
                            >
                              <Copy size={20} />
                            </button>
                        </div>
                    </div>
                  </div>
               </div>
            </div>
          ) : (
            <div className="h-[550px] flex flex-col items-center justify-center p-8 text-center space-y-8">
              <div className="bg-red-50 p-10 rounded-full text-red-500 shadow-inner">
                <RefreshCw size={64} className="animate-spin-slow opacity-60" />
              </div>
              <div className="space-y-2">
                <h4 className="text-2xl font-black text-gray-900 font-serif">{t.lotteryTitle}</h4>
                <p className="text-sm text-gray-400 max-w-[200px] mx-auto">AI Cinematic destiny is just one click away.</p>
              </div>
              <button 
                onClick={handleSpin}
                className="w-full py-5 bg-red-500 text-white rounded-full font-black uppercase tracking-[0.2em] hover:bg-red-600 transition-all shadow-2xl transform active:scale-95"
              >
                {t.spin}
              </button>
            </div>
          )}
        </div>
      </div>
      <style>{`
        @keyframes scroll-vertical {
          0% { transform: translateY(0); }
          100% { transform: translateY(-66.6%); }
        }
        .animate-scroll-vertical {
          animation: scroll-vertical 2s cubic-bezier(.45, .05, .55, .95) infinite;
        }
        .animate-spin-slow {
          animation: spin 4s linear infinite;
        }
        .scrollbar-hide::-webkit-scrollbar { display: none; }
        .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </div>
  );
};
