
export type Language = 'en' | 'zh-TW' | 'zh-CN';
export type AuthorStyle = 'humorous' | 'toxic' | 'sentimental';

export enum MediaType {
  MOVIE = 'movie',
  TV = 'tv'
}

export interface AuthorProfile {
  name: Record<Language, string>;
  style: AuthorStyle;
}

export interface Review {
  id: string;
  tmdbId: number;
  mediaType: MediaType;
  seasonNumber?: number; // Added for TV Seasons
  title: Record<Language, string>;
  posterPath: string;
  backdropPaths: string[];
  content: Record<Language, string>;
  createdAt: string;
  genres: string[];
  releaseYear: number;
  region: string;
  visible: boolean;
  ratings: {
    tmdb: number;
    imdb: number;
    douban: number;
  };
  externalIds: {
    imdb?: string;
    tmdb?: string;
    douban?: string;
  };
  metadata: {
    duration: string;
    director: string;
    actors: string[];
    authorId: number;
    authorStyle: AuthorStyle;
  };
}

export interface AppConfig {
  tmdbApiKey: string;
  updateTime: string;
  lastUpdateDate: string;
  siteName: string;
  authors: AuthorProfile[];
  activeAuthorIndex: number;
}

export interface WatchlistItem {
  id: string;
  tmdbId: number;
  mediaType: MediaType;
  title: string;
  posterPath: string;
  watched: boolean;
}

export interface TranslationStrings {
  home: string;
  movie: string;
  tvShow: string;
  readMore: string;
  watchlist: string;
  lottery: string;
  subscribe: string;
  emailPlaceholder: string;
  adminLogin: string;
  settings: string;
  generateNow: string;
  generateMovie: string;
  generateTV: string;
  back: string;
  lotteryTitle: string;
  spin: string;
  close: string;
  retry: string;
  info: string;
  director: string;
  actors: string;
  runtime: string;
  links: string;
  relatedWorks: string;
  adminDashboard: string;
  manageReviews: string;
  siteSettings: string;
  siteNameLabel: string;
  authorNameLabel: string;
  visibility: string;
  edit: string;
  delete: string;
  save: string;
  cancel: string;
  share: string;
  fortuneTitle: string;
  fortuneGood: string;
  fortuneGreat: string;
  fortuneExcellent: string;
  fortuneSmall: string;
  logout: string;
  show: string;
  hide: string;
  username: string;
  password: string;
  login: string;
  authorStyle: string;
  humorous: string;
  toxic: string;
  sentimental: string;
  saveSettings: string;
  region: string;
  year: string;
  relatedByGenre: string;
  copied: string;
  season: string;
}
