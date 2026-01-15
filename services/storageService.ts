
import { Review, AppConfig, WatchlistItem } from '../types';

const REVIEWS_KEY = 'my_ai_movie_reviews';
const CONFIG_KEY = 'my_ai_movie_config';
const WATCHLIST_KEY = 'my_ai_movie_watchlist';
const ADMIN_PASSWORD_KEY = 'my_ai_movie_admin_pass';

export const storage = {
  getReviews: (): Review[] => JSON.parse(localStorage.getItem(REVIEWS_KEY) || '[]'),
  setReviews: (reviews: Review[]) => localStorage.setItem(REVIEWS_KEY, JSON.stringify(reviews)),
  
  getConfig: (): AppConfig => {
    const defaultBot: AppConfig = {
      tmdbApiKey: '',
      geminiApiKey: '',
      updateTime: '01:00',
      lastUpdateDate: new Date(0).toISOString(),
      siteName: 'My AI Movie Review',
      authors: [
        { 
          name: { 'en': 'Humor Bot', 'zh-TW': '幽默大師', 'zh-CN': '幽默大师' }, 
          style: 'humorous' 
        },
        { 
          name: { 'en': 'Salty Critic', 'zh-TW': '毒舌影評人', 'zh-CN': '毒舌影评人' }, 
          style: 'toxic' 
        },
        { 
          name: { 'en': 'Dreamy Soul', 'zh-TW': '感性靈魂', 'zh-CN': '感性灵魂' }, 
          style: 'sentimental' 
        }
      ],
      activeAuthorIndex: 0
    };
    const saved = localStorage.getItem(CONFIG_KEY);
    return saved ? { ...defaultBot, ...JSON.parse(saved) } : defaultBot;
  },
  setConfig: (config: AppConfig) => localStorage.setItem(CONFIG_KEY, JSON.stringify(config)),
  
  getWatchlist: (): WatchlistItem[] => JSON.parse(localStorage.getItem(WATCHLIST_KEY) || '[]'),
  setWatchlist: (list: WatchlistItem[]) => localStorage.setItem(WATCHLIST_KEY, JSON.stringify(list)),

  getAdminPassword: () => localStorage.getItem(ADMIN_PASSWORD_KEY) || 'admin',
  setAdminPassword: (pass: string) => localStorage.setItem(ADMIN_PASSWORD_KEY, pass),
};
