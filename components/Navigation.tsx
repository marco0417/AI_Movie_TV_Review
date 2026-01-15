
import React from 'react';
import { Language, AppConfig } from '../types';
import { TRANSLATIONS } from '../constants';
import { User, Globe, Heart, Gift } from 'lucide-react';

interface NavigationProps {
  lang: Language;
  setLang: (lang: Language) => void;
  watchlistCount: number;
  onNavigate: (page: string) => void;
  onOpenLottery: () => void;
  config: AppConfig;
}

export const Navigation: React.FC<NavigationProps> = ({ 
  lang, 
  setLang, 
  watchlistCount, 
  onNavigate,
  onOpenLottery,
  config
}) => {
  const t = TRANSLATIONS[lang];

  return (
    <nav className="sticky top-0 z-50 bg-white border-b border-gray-200 wp-shadow">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <button 
              onClick={() => onNavigate('home')}
              className="text-xl sm:text-2xl font-bold text-blue-600 hover:opacity-80 transition-opacity font-serif truncate max-w-[150px] sm:max-w-none"
            >
              {config.siteName}
            </button>
          </div>

          <div className="flex items-center space-x-2 sm:space-x-8 text-[10px] sm:text-sm font-semibold uppercase tracking-wider text-gray-600">
            <button onClick={() => onNavigate('home')} className="hidden sm:inline hover:text-blue-600">{t.home}</button>
            
            <button 
              onClick={onOpenLottery} 
              className="text-blue-600 hover:text-blue-700 font-bold border-2 border-blue-600 px-2 sm:px-3 py-1 rounded-full hover:bg-blue-50 transition-all flex items-center"
            >
              <Gift size={16} className="sm:mr-1" />
              <span className="hidden sm:inline">{t.lottery}</span>
            </button>

            <button onClick={() => onNavigate('watchlist')} className="relative hover:text-blue-600 flex items-center">
              <Heart size={18} className="sm:mr-1" />
              <span className="hidden sm:inline">{t.watchlist}</span>
              {watchlistCount > 0 && (
                <span className="absolute -top-1 -right-2 bg-red-500 text-white text-[8px] sm:text-[10px] rounded-full h-3.5 w-3.5 sm:h-4 sm:w-4 flex items-center justify-center font-bold">
                  {watchlistCount}
                </span>
              )}
            </button>
          </div>

          <div className="flex items-center space-x-2 sm:space-x-4">
            <div className="relative group">
              <button className="flex items-center space-x-1 text-gray-600 hover:text-blue-600 py-4">
                <Globe size={18} />
                <span className="hidden sm:inline text-sm uppercase font-bold">{lang === 'en' ? 'EN' : lang === 'zh-TW' ? '繁' : '简'}</span>
              </button>
              <div className="absolute right-0 top-full pt-1 hidden group-hover:block z-50">
                <div className="w-24 sm:w-32 bg-white rounded-md shadow-lg py-1 border border-gray-100">
                  <button onClick={() => setLang('en')} className="block w-full text-left px-4 py-2 text-xs text-gray-700 hover:bg-blue-50">English</button>
                  <button onClick={() => setLang('zh-TW')} className="block w-full text-left px-4 py-2 text-xs text-gray-700 hover:bg-blue-50">繁體中文</button>
                  <button onClick={() => setLang('zh-CN')} className="block w-full text-left px-4 py-2 text-xs text-gray-700 hover:bg-blue-50">简体中文</button>
                </div>
              </div>
            </div>
            <button onClick={() => onNavigate('admin-login')} className="text-gray-600 hover:text-blue-600">
              <User size={20} />
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};
