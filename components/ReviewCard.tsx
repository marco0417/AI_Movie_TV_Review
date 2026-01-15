
import React from 'react';
import { Review, Language } from '../types';
import { TRANSLATIONS, LOCALIZED_GENRES } from '../constants';
import { getImageUrl } from '../services/tmdbService';

interface ReviewCardProps {
  review: Review;
  lang: Language;
  onClick: () => void;
}

export const ReviewCard: React.FC<ReviewCardProps> = ({ review, lang, onClick }) => {
  const t = TRANSLATIONS[lang];
  const title = review.title[lang];
  const contentPreview = review.content[lang].split(' ').slice(0, 40).join(' ') + '...';

  return (
    <article className="bg-white rounded-sm overflow-hidden border border-gray-200 transition-all hover:shadow-xl group flex flex-col h-full">
      <div className="relative overflow-hidden aspect-[16/9] cursor-pointer" onClick={onClick}>
        <img 
          src={getImageUrl(review.posterPath, 'w500')} 
          alt={title} 
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute top-4 left-4 flex flex-wrap gap-2">
           {review.genres.map(g => (
              <span key={g} className="bg-blue-600 text-white text-[10px] px-2 py-1 rounded uppercase font-bold tracking-tighter">
                {LOCALIZED_GENRES[lang][g] || g}
              </span>
           ))}
        </div>
      </div>
      
      <div className="p-6 flex flex-col flex-grow">
        <h2 className="text-xl font-bold font-serif mb-3 leading-tight group-hover:text-blue-600 transition-colors cursor-pointer" onClick={onClick}>
          {title} ({review.releaseYear})
        </h2>
        
        <div className="text-gray-600 text-sm mb-4 line-clamp-3 leading-relaxed">
          {contentPreview}
        </div>
        
        <div className="mt-auto flex flex-col space-y-4 border-t pt-4">
           <div className="flex justify-between items-center">
             <button 
               onClick={onClick}
               className="text-blue-600 text-xs font-bold uppercase tracking-widest border-b-2 border-transparent hover:border-blue-600 transition-all"
             >
               {t.readMore}
             </button>
             
             <div className="flex space-x-3">
                <div className="text-center">
                  <span className="block text-[8px] font-bold text-gray-400 uppercase">TMDB</span>
                  <span className="text-xs font-bold">{review.ratings.tmdb}</span>
                </div>
                <div className="text-center">
                  <span className="block text-[8px] font-bold text-gray-400 uppercase">IMDB</span>
                  <span className="text-xs font-bold">{review.ratings.imdb}</span>
                </div>
                <div className="text-center">
                  <span className="block text-[8px] font-bold text-gray-400 uppercase">豆瓣</span>
                  <span className="text-xs font-bold">{review.ratings.douban}</span>
                </div>
             </div>
           </div>
        </div>
      </div>
    </article>
  );
};
