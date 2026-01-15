
import React, { useState, useEffect, useMemo } from 'react';
import ReactMarkdown from 'react-markdown';
import { Language, Review, MediaType, AppConfig, WatchlistItem, AuthorProfile, AuthorStyle } from './types';
import { TRANSLATIONS, GENRE_MAP, LOCALIZED_GENRES } from './constants';
import { storage } from './services/storageService';
import { Navigation } from './components/Navigation';
import { ReviewCard } from './components/ReviewCard';
import { LotteryModal } from './components/LotteryModal';
import { fetchTrending, fetchDetails, getImageUrl } from './services/tmdbService';
import { generateHumorousReview } from './services/geminiService';
import { 
  Mail, Clock, User, Film, Tv, MapPin, 
  Plus, Check, LogOut, Settings as SettingsIcon, 
  Play, RefreshCw, Loader2, Heart, X, Trash2, Edit2, ChevronLeft,
  Share2, Facebook, Twitter, Link as LinkIcon, Save,
  UserCircle, Calendar, ChevronRight, Lock, Eye, EyeOff, Key, AlertCircle
} from 'lucide-react';

const ADMIN_PAGE_SIZE = 10;

// Sub-component for Admin Settings
const AdminSettings = ({ buffer, setBuffer, t, onSave, adminPass, setAdminPass, onConnectAI }: any) => {
  const [showPass, setShowPass] = useState(false);
  const [hasAIKey, setHasAIKey] = useState(false);

  useEffect(() => {
    // Check if AI key is selected on mount
    const checkKey = async () => {
      if (window.aistudio?.hasSelectedApiKey) {
        const has = await window.aistudio.hasSelectedApiKey();
        setHasAIKey(has);
      }
    };
    checkKey();
  }, []);
  
  return (
    <section className="bg-white p-6 sm:p-8 border wp-shadow rounded-sm space-y-6 md:col-span-2">
      <div className="flex justify-between items-center">
        <h3 className="text-xl font-bold flex items-center font-serif text-blue-600">
          <SettingsIcon className="mr-2" /> {t.siteSettings}
        </h3>
        <button 
          onClick={onSave} 
          className="bg-blue-600 text-white px-6 py-2 rounded-full font-bold text-xs uppercase tracking-widest flex items-center hover:bg-blue-700 shadow-md transition-transform active:scale-95"
        >
          <Save size={14} className="mr-2" /> {t.save}
        </button>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div className="space-y-1">
          <label className="text-[10px] font-black uppercase text-gray-400">{t.siteNameLabel}</label>
          <input 
            value={buffer.siteName} 
            onChange={e => setBuffer({...buffer, siteName: e.target.value})} 
            className="w-full p-2.5 border rounded outline-none bg-white text-gray-900 border-gray-200 focus:border-blue-600" 
          />
        </div>
        <div className="space-y-1">
          <label className="text-[10px] font-black uppercase text-gray-400">TMDB API KEY</label>
          <input 
            value={buffer.tmdbApiKey} 
            type="password" 
            onChange={e => setBuffer({...buffer, tmdbApiKey: e.target.value})} 
            className="w-full p-2.5 border rounded font-mono outline-none bg-white text-gray-900 border-gray-200 focus:border-blue-600" 
            placeholder="Paste TMDB Key"
          />
        </div>
        <div className="space-y-1">
          <label className="text-[10px] font-black uppercase text-gray-400">Admin Password</label>
          <div className="relative">
            <input 
              value={adminPass} 
              type={showPass ? "text" : "password"} 
              onChange={e => setAdminPass(e.target.value)} 
              className="w-full p-2.5 pl-9 border rounded font-mono outline-none bg-white text-gray-900 border-gray-200 focus:border-blue-600" 
            />
            <Lock className="absolute left-3 top-3 text-gray-300" size={16} />
            <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-3 top-3 text-gray-400 hover:text-blue-600">
              {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>
        </div>
        <div className="space-y-1">
          <label className="text-[10px] font-black uppercase text-gray-400">Gemini AI Status</label>
          <div className="flex flex-col gap-2">
            <button 
              onClick={onConnectAI}
              className={`flex items-center justify-center p-2.5 border rounded font-bold text-xs uppercase transition-all ${hasAIKey ? 'bg-green-50 text-green-700 border-green-200' : 'bg-red-50 text-red-700 border-red-200 animate-pulse'}`}
            >
              <Key size={14} className="mr-2" />
              {hasAIKey ? 'AI Connected' : 'Connect Gemini AI Key'}
            </button>
            <a href="https://ai.google.dev/gemini-api/docs/billing" target="_blank" rel="noopener noreferrer" className="text-[8px] text-gray-400 hover:underline">
              Important: Use a paid GCP project key. Click for billing docs.
            </a>
          </div>
        </div>
      </div>

      <div className="border-t pt-6 space-y-6">
        <h4 className="text-sm font-bold uppercase tracking-widest text-gray-500 flex items-center">
          <UserCircle size={18} className="mr-2"/> AI Personas
        </h4>
        <div className="grid grid-cols-1 gap-4">
          {buffer.authors.map((author: any, idx: number) => (
            <div key={idx} className={`p-5 rounded-xl border transition-all ${buffer.activeAuthorIndex === idx ? 'border-blue-600 bg-blue-50/50 ring-1 ring-blue-600' : 'bg-gray-50 border-gray-100'}`}>
              <div className="flex items-center space-x-3 mb-4">
                <input type="radio" checked={buffer.activeAuthorIndex === idx} onChange={() => setBuffer({...buffer, activeAuthorIndex: idx})} className="w-4 h-4 text-blue-600" />
                <span className="text-xs font-black uppercase text-gray-700 tracking-wider">Style: {t[author.style]}</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {(['en', 'zh-TW', 'zh-CN'] as Language[]).map((l) => (
                  <div key={l} className="space-y-1">
                    <label className="text-[8px] font-black text-gray-400 uppercase">{l}</label>
                    <input 
                      value={author.name[l]} 
                      onChange={e => {
                        const authors = [...buffer.authors];
                        authors[idx] = { ...authors[idx], name: { ...authors[idx].name, [l]: e.target.value } };
                        setBuffer({ ...buffer, authors });
                      }}
                      className="w-full p-2 border rounded text-xs outline-none bg-white text-gray-900 border-gray-200 focus:border-blue-600"
                    />
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

const App: React.FC = () => {
  const [lang, setLang] = useState<Language>('en');
  const [currentPage, setCurrentPage] = useState<string>('home');
  const [selectedReviewId, setSelectedReviewId] = useState<string | null>(null);
  const [reviews, setReviews] = useState<Review[]>(storage.getReviews());
  const [config, setConfig] = useState<AppConfig>(storage.getConfig());
  const [filterType, setFilterType] = useState<MediaType | 'all'>('all');
  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [watchlist, setWatchlist] = useState<WatchlistItem[]>(storage.getWatchlist());
  const [showLottery, setShowLottery] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [adminLoggedIn, setAdminLoggedIn] = useState(false);
  const [adminPage, setAdminPage] = useState(1);
  const [editingReview, setEditingReview] = useState<Review | null>(null);
  const [adminPassBuffer, setAdminPassBuffer] = useState<string>(storage.getAdminPassword());
  
  const [filterRegion, setFilterRegion] = useState<string | null>(null);
  const [filterYear, setFilterYear] = useState<number | null>(null);

  const [adminBuffer, setAdminBuffer] = useState<AppConfig | null>(null);

  const t = TRANSLATIONS[lang];

  const handleConnectAI = async () => {
    if (window.aistudio?.openSelectKey) {
      await window.aistudio.openSelectKey();
      // Assume success as per instructions
    } else {
      alert("AI Key selection is not available in this environment.");
    }
  };

  const autoGenerateReview = async (type: MediaType) => {
    if (!config.tmdbApiKey) {
        alert("Please set your TMDB API Key in Site Settings first.");
        return;
    }

    // Check if user has selected a key in browser environment
    if (window.aistudio && !(await window.aistudio.hasSelectedApiKey())) {
      alert("Please connect your Gemini AI Key first via Site Settings.");
      return;
    }
    
    setIsGenerating(true);
    try {
      const activeAuthor = config.authors[config.activeAuthorIndex];
      
      const trending = await fetchTrending(config.tmdbApiKey, type);
      if (!trending || trending.length === 0) throw new Error("TMDB Trending fetch failed.");

      const existingIds = reviews.map(r => r.tmdbId);
      const target = trending.find((item: any) => !existingIds.includes(item.id)) || trending[0];
      
      const [detailEN, detailTW, detailCN] = await Promise.all([
        fetchDetails(config.tmdbApiKey, type, target.id, 'en-US'),
        fetchDetails(config.tmdbApiKey, type, target.id, 'zh-TW'),
        fetchDetails(config.tmdbApiKey, type, target.id, 'zh-CN')
      ]);

      if (!detailEN || detailEN.success === false) throw new Error("TMDB Detail fetch failed.");

      let seasonNum: number | undefined;
      let finalTitleEN = detailEN.title || detailEN.name;
      let finalTitleTW = detailTW.title || detailTW.name;
      let finalTitleCN = detailCN.title || detailCN.name;
      let finalPoster = target.poster_path;
      let finalOverview = detailEN.overview;

      if (type === MediaType.TV && detailEN.seasons?.length > 0) {
        const reviewedSeasons = reviews.filter(r => r.tmdbId === target.id).map(r => r.seasonNumber);
        const nextSeason = detailEN.seasons.find((s: any) => s.season_number > 0 && !reviewedSeasons.includes(s.season_number));
        if (nextSeason) {
          seasonNum = nextSeason.season_number;
          finalTitleEN = `${detailEN.name} Season ${seasonNum}`;
          finalTitleTW = `${detailTW.name} 第 ${seasonNum} 季`;
          finalTitleCN = `${detailCN.name} 第 ${seasonNum} 季`;
          finalPoster = nextSeason.poster_path || target.poster_path;
          finalOverview = nextSeason.overview || detailEN.overview;
        }
      }

      const [reviewEN, reviewTW, reviewCN] = await Promise.all([
        generateHumorousReview(finalTitleEN, type, 'en', finalOverview, activeAuthor.style),
        generateHumorousReview(finalTitleTW, type, 'zh-TW', finalOverview, activeAuthor.style),
        generateHumorousReview(finalTitleCN, type, 'zh-CN', finalOverview, activeAuthor.style)
      ]);

      const newReview: Review = {
        id: Date.now().toString(),
        tmdbId: target.id,
        mediaType: type,
        seasonNumber: seasonNum,
        title: { 'en': finalTitleEN, 'zh-TW': finalTitleTW, 'zh-CN': finalTitleCN },
        posterPath: finalPoster,
        backdropPaths: detailEN.images?.backdrops?.map((b: any) => b.file_path).slice(0, 5) || [target.backdrop_path],
        content: { 'en': reviewEN, 'zh-TW': reviewTW, 'zh-CN': reviewCN },
        createdAt: new Date().toISOString(),
        genres: detailEN.genres.map((g: any) => g.name),
        releaseYear: new Date(detailEN.release_date || detailEN.first_air_date || Date.now()).getFullYear(),
        region: detailEN.production_countries?.[0]?.iso_3166_1 || 'US',
        visible: true,
        ratings: { 
          tmdb: Math.round(detailEN.vote_average * 10) / 10 || 0, 
          imdb: 7.5 + (Math.random() * 1.5), 
          douban: 7.0 + (Math.random() * 2.0) 
        },
        externalIds: {
          imdb: detailEN.external_ids?.imdb_id,
          tmdb: String(target.id),
          douban: `https://movie.douban.com/subject_search?search_text=${encodeURIComponent(finalTitleCN)}`
        },
        metadata: {
          duration: type === MediaType.MOVIE ? `${detailEN.runtime || 0} min` : `${detailEN.number_of_episodes || 0} Ep`,
          director: detailEN.credits?.crew?.find((c: any) => c.job === 'Director')?.name || 'Various',
          actors: detailEN.credits?.cast?.slice(0, 5).map((a: any) => a.name) || [],
          authorId: config.activeAuthorIndex,
          authorStyle: activeAuthor.style
        }
      };

      const updated = [newReview, ...reviews];
      setReviews(updated);
      storage.setReviews(updated);
    } catch (err: any) { 
      console.error(err);
      if (err.message.includes("Requested entity was not found")) {
        alert("AI Key error. Resetting key state. Please re-connect your AI Key.");
        handleConnectAI();
      } else {
        alert(`Generation Failed: ${err.message}`); 
      }
    } finally { 
      setIsGenerating(false); 
    }
  };

  const filteredReviews = useMemo(() => {
    return reviews.filter(r => {
      if (!r.visible && !adminLoggedIn) return false;
      const matchType = filterType === 'all' || r.mediaType === filterType;
      const matchCat = activeCategory === 'All' || r.genres.includes(activeCategory);
      const matchRegion = !filterRegion || r.region === filterRegion;
      const matchYear = !filterYear || r.releaseYear === filterYear;
      return matchType && matchCat && matchRegion && matchYear;
    });
  }, [reviews, filterType, activeCategory, filterRegion, filterYear, adminLoggedIn]);

  const allGenresInSet = useMemo(() => {
     const set = new Set<string>();
     reviews.forEach(r => r.genres.forEach(g => set.add(g)));
     return Array.from(set);
  }, [reviews]);

  const allYearsInSet = useMemo(() => {
    const set = new Set<number>();
    reviews.forEach(r => set.add(r.releaseYear));
    return Array.from(set).sort((a, b) => b - a);
  }, [reviews]);

  const PageHome = () => (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="mb-12 text-center py-6">
        <div className="flex flex-wrap items-center justify-center gap-2 mb-6">
           { (filterRegion || filterYear) && (
              <button onClick={() => { setFilterRegion(null); setFilterYear(null); }} className="flex items-center text-red-500 hover:text-red-700 font-bold uppercase text-xs">
                <X size={14} className="mr-1"/> Clear filters
              </button>
           )}
        </div>

        <div className="flex justify-center mb-8 border-b scrollbar-hide overflow-x-auto whitespace-nowrap">
          {['all', MediaType.MOVIE, MediaType.TV].map(type => (
            <button key={type} onClick={() => setFilterType(type as any)} className={`px-4 sm:px-8 py-4 font-bold uppercase tracking-widest text-xs sm:text-sm transition-all ${filterType === type ? 'border-b-4 border-blue-600 text-blue-600' : 'text-gray-400 hover:text-gray-600'}`}>
              {type === 'all' ? 'All' : type === MediaType.MOVIE ? t.movie : t.tvShow}
            </button>
          ))}
        </div>

        <div className="space-y-6">
          <div className="flex flex-wrap gap-2 justify-center">
            <button onClick={() => setActiveCategory('All')} className={`px-3 py-1 rounded-full text-[10px] sm:text-xs font-bold uppercase border transition-all ${activeCategory === 'All' ? 'bg-black text-white' : 'bg-white text-gray-400 border-gray-200 hover:border-black'}`}>All Categories</button>
            {Object.entries(GENRE_MAP).map(([id, name]) => {
              const hasContent = allGenresInSet.includes(name);
              return (
                <button key={id} disabled={!hasContent} onClick={() => setActiveCategory(name)} className={`px-3 py-1 rounded-full text-[10px] sm:text-xs font-bold uppercase border transition-all ${activeCategory === name ? 'bg-black text-white' : hasContent ? 'bg-white text-gray-600 border-gray-200 hover:border-black' : 'bg-gray-100 text-gray-300 border-gray-100 cursor-not-allowed'}`}>
                  {LOCALIZED_GENRES[lang][name] || name}
                </button>
              )
            })}
          </div>

          <div className="flex flex-wrap gap-2 justify-center">
             <span className="text-[10px] font-black uppercase text-gray-300 self-center mr-2">{t.year}:</span>
             {allYearsInSet.slice(0, 15).map(year => (
               <button key={year} onClick={() => setFilterYear(year === filterYear ? null : year)} className={`px-3 py-1 rounded-full text-[10px] font-bold border transition-all ${filterYear === year ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-gray-400 border-gray-200 hover:border-blue-600'}`}>
                 {year}
               </button>
             ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
        {filteredReviews.map(r => <ReviewCard key={r.id} review={r} lang={lang} onClick={() => { setSelectedReviewId(r.id); setCurrentPage('detail'); window.scrollTo(0,0); }} />)}
      </div>

      {filteredReviews.length === 0 && (
         <div className="text-center py-20 text-gray-400 italic font-serif">No reviews match your filters.</div>
      )}
    </div>
  );

  const PageAdmin = () => {
    const [user, setUser] = useState('');
    const [pass, setPass] = useState('');
    const [editLang, setEditLang] = useState<Language>('en');

    useEffect(() => {
      if (adminLoggedIn && !adminBuffer) {
        setAdminBuffer(storage.getConfig());
      }
    }, [adminLoggedIn]);

    const handleLogin = (e: React.FormEvent) => {
      e.preventDefault();
      if (user === 'admin' && pass === storage.getAdminPassword()) {
        setAdminLoggedIn(true);
      } else alert('Invalid credentials');
    };

    const handleSaveSettings = () => {
      if (!adminBuffer) return;
      setConfig(adminBuffer);
      storage.setConfig(adminBuffer);
      storage.setAdminPassword(adminPassBuffer);
      alert(t.saveSettings + ' Success!');
    };

    if (!adminLoggedIn) return (
      <div className="max-w-md mx-auto py-20 px-4">
         <form onSubmit={handleLogin} className="bg-white p-8 rounded-lg wp-shadow border border-gray-200">
            <h2 className="text-2xl font-bold mb-6 text-center font-serif">{t.adminLogin}</h2>
            <div className="space-y-4">
               <input placeholder={t.username} value={user} onChange={e => setUser(e.target.value)} className="w-full p-3 border rounded outline-none" />
               <input type="password" placeholder={t.password} value={pass} onChange={e => setPass(e.target.value)} className="w-full p-3 border rounded outline-none" />
               <button type="submit" className="w-full py-4 bg-blue-600 text-white font-bold rounded uppercase tracking-widest hover:bg-blue-700 shadow-md">Login</button>
            </div>
         </form>
      </div>
    );

    if (!adminBuffer) return <div className="p-20 text-center text-gray-400">Loading Configuration...</div>;
    const paginatedReviews = reviews.slice((adminPage - 1) * ADMIN_PAGE_SIZE, adminPage * ADMIN_PAGE_SIZE);
    const totalPages = Math.ceil(reviews.length / ADMIN_PAGE_SIZE);

    return (
      <div className="max-w-6xl mx-auto py-12 px-4 space-y-12 animate-in fade-in duration-300">
         <div className="flex justify-between items-center"><h1 className="text-3xl font-bold font-serif">{t.adminDashboard}</h1><button onClick={() => setAdminLoggedIn(false)} className="text-red-600 font-bold flex items-center uppercase text-xs tracking-widest"><LogOut size={16} className="mr-1"/> Logout</button></div>
         
         <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <section className="bg-white p-8 border wp-shadow rounded-sm space-y-4">
               <h3 className="text-xl font-bold flex items-center font-serif text-blue-600"><Play size={20} className="mr-2" /> {t.generateNow}</h3>
               <button disabled={isGenerating} onClick={() => autoGenerateReview(MediaType.MOVIE)} className="w-full py-4 bg-black text-white rounded font-bold uppercase text-xs tracking-widest flex items-center justify-center hover:bg-gray-800 disabled:opacity-50">
                  {isGenerating ? <Loader2 className="animate-spin mr-2"/> : <Film className="mr-2"/>} {t.generateMovie}
               </button>
               <button disabled={isGenerating} onClick={() => autoGenerateReview(MediaType.TV)} className="w-full py-4 bg-black text-white rounded font-bold uppercase text-xs tracking-widest flex items-center justify-center hover:bg-gray-800 disabled:opacity-50">
                  {isGenerating ? <Loader2 className="animate-spin mr-2"/> : <Tv className="mr-2"/>} {t.generateTV}
               </button>
            </section>

            <AdminSettings buffer={adminBuffer} setBuffer={setAdminBuffer} t={t} onSave={handleSaveSettings} adminPass={adminPassBuffer} setAdminPass={setAdminPassBuffer} onConnectAI={handleConnectAI} />
         </div>

         <section className="bg-white p-8 border wp-shadow rounded-sm">
            <h3 className="text-xl font-bold font-serif mb-6">{t.manageReviews} ({reviews.length})</h3>
            <div className="overflow-x-auto">
               <table className="w-full text-left text-sm whitespace-nowrap">
                  <thead><tr className="border-b text-gray-400 uppercase text-[10px] tracking-widest"><th className="py-4 px-2">Title</th><th className="py-4">Type</th><th className="py-4">Date</th><th className="py-4">Author</th><th className="py-4">Status</th><th className="py-4 text-right">Actions</th></tr></thead>
                  <tbody>{paginatedReviews.map(r => (
                    <tr key={r.id} className="border-b hover:bg-gray-50 transition-colors">
                       <td className="py-4 px-2 font-bold max-w-[200px] truncate">{r.title[lang]}</td>
                       <td className="py-4 uppercase text-[10px] font-bold text-gray-500">{r.mediaType}</td>
                       <td className="py-4 text-gray-500 text-xs">{new Date(r.createdAt).toLocaleDateString()}</td>
                       <td className="py-4 text-xs font-medium text-blue-600">{config.authors[r.metadata.authorId]?.name[lang]}</td>
                       <td className="py-4 text-xs">
                          <button onClick={() => { 
                            const u = reviews.map(rv => rv.id === r.id ? {...rv, visible: !rv.visible} : rv);
                            setReviews(u); storage.setReviews(u); 
                          }} className={`font-bold uppercase tracking-widest ${r.visible ? 'text-green-600' : 'text-gray-400'}`}>
                             {r.visible ? 'Show' : 'Hide'}
                          </button>
                       </td>
                       <td className="py-4 text-right space-x-2">
                          <button onClick={() => setEditingReview({ ...r })} className="p-2 text-blue-600 hover:bg-blue-100 rounded-lg"><Edit2 size={16}/></button>
                          <button onClick={() => { if(confirm('Are you sure?')) { 
                            const u = reviews.filter(rv => rv.id !== r.id);
                            setReviews(u); storage.setReviews(u); 
                          } }} className="p-2 text-red-600 hover:bg-red-100 rounded-lg"><Trash2 size={16}/></button>
                       </td>
                    </tr>
                  ))}</tbody>
               </table>
            </div>
            <div className="mt-8 flex justify-center items-center space-x-4">
               <button onClick={() => setAdminPage(p => Math.max(1, p-1))} className="p-2 border rounded hover:bg-gray-50"><ChevronLeft size={20}/></button>
               <span className="font-bold text-sm text-gray-600 font-serif">{adminPage} / {totalPages || 1}</span>
               <button onClick={() => setAdminPage(p => Math.min(totalPages, p+1))} className="p-2 border rounded hover:bg-gray-50"><ChevronRight size={20}/></button>
            </div>
         </section>

         {editingReview && (
           <div className="fixed inset-0 z-[100] bg-black/50 flex items-center justify-center p-4 backdrop-blur-sm">
              <div className="bg-white rounded-2xl p-6 max-w-2xl w-full max-h-[85vh] overflow-y-auto space-y-4 shadow-2xl animate-in zoom-in duration-300">
                 <div className="flex justify-between items-center border-b pb-4">
                    <h2 className="text-2xl font-bold font-serif">Edit Content</h2>
                    <div className="flex bg-gray-100 p-1 rounded-lg">
                       {(['en', 'zh-TW', 'zh-CN'] as Language[]).map((l) => (
                         <button key={l} onClick={() => setEditLang(l)} className={`px-4 py-1.5 text-[10px] font-bold uppercase rounded-md transition-all ${editLang === l ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-400 hover:text-gray-600'}`}>{l}</button>
                       ))}
                    </div>
                 </div>
                 <div className="space-y-4">
                    <div className="space-y-1">
                      <label className="text-[10px] font-black uppercase text-gray-400">Title ({editLang})</label>
                      <input className="w-full p-3 border rounded-lg bg-white" value={editingReview.title[editLang]} onChange={e => setEditingReview({...editingReview, title: {...editingReview.title, [editLang]: e.target.value}})} />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-black uppercase text-gray-400">Content ({editLang})</label>
                      <textarea className="w-full p-3 border rounded-lg h-80 font-serif leading-relaxed" value={editingReview.content[editLang]} onChange={e => setEditingReview({...editingReview, content: {...editingReview.content, [editLang]: e.target.value}})} />
                    </div>
                 </div>
                 <div className="flex justify-end space-x-3 pt-6 border-t">
                    <button onClick={() => setEditingReview(null)} className="text-gray-400 font-bold uppercase text-xs">Cancel</button>
                    <button onClick={() => { 
                      const u = reviews.map(r => r.id === editingReview.id ? editingReview : r);
                      setReviews(u); storage.setReviews(u); 
                      setEditingReview(null); 
                    }} className="bg-blue-600 text-white px-8 py-3 rounded-full font-bold uppercase text-xs shadow-lg">Save Changes</button>
                 </div>
              </div>
           </div>
         )}
      </div>
    );
  };

  return (
    <div className="min-h-screen flex flex-col selection:bg-blue-100">
      <Navigation lang={lang} setLang={setLang} watchlistCount={watchlist.length} onNavigate={setCurrentPage} onOpenLottery={() => setShowLottery(true)} config={config} />
      <main className="flex-grow">
        {currentPage === 'home' && <PageHome />}
        {currentPage === 'detail' && (
          <div className="max-w-6xl mx-auto px-4 py-12 animate-in fade-in duration-500">
            <button onClick={() => setCurrentPage('home')} className="flex items-center text-gray-500 hover:text-black mb-8 font-bold uppercase text-xs tracking-widest transition-colors"><ChevronLeft size={16} className="mr-2" />Back</button>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
               {/* Reuse previous PageDetail logic but ensure it's properly handled here */}
               <div className="lg:col-span-2 space-y-8">
                  {reviews.find(r => r.id === selectedReviewId) && (
                    <>
                      <h1 className="text-3xl sm:text-5xl font-black font-serif leading-tight">{reviews.find(r => r.id === selectedReviewId)!.title[lang]}</h1>
                      <img src={getImageUrl(reviews.find(r => r.id === selectedReviewId)!.posterPath, 'original')} className="w-full rounded-sm shadow-xl" alt="poster" />
                      <div className="prose prose-lg max-w-none font-serif leading-relaxed">
                        <ReactMarkdown>{reviews.find(r => r.id === selectedReviewId)!.content[lang]}</ReactMarkdown>
                      </div>
                    </>
                  )}
               </div>
            </div>
          </div>
        )}
        {currentPage === 'watchlist' && (
          <div className="max-w-4xl mx-auto px-4 py-12 animate-in fade-in duration-500">
            <h1 className="text-3xl font-bold font-serif mb-8 flex items-center text-pink-500"><Heart className="mr-3" fill="currentColor" />{t.watchlist}</h1>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
              {watchlist.map(item => (
                <div key={item.id} className="bg-white rounded-xl border wp-shadow overflow-hidden group hover:shadow-xl transition-all duration-300">
                  <div className="relative aspect-[2/3] overflow-hidden cursor-pointer" onClick={() => { setSelectedReviewId(reviews.find(r => r.tmdbId === item.tmdbId)?.id || null); setCurrentPage('detail'); }}>
                    <img src={getImageUrl(item.posterPath, 'w342')} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" alt="movie" />
                    <button onClick={(e) => { e.stopPropagation(); const u = watchlist.filter(w => w.id !== item.id); setWatchlist(u); storage.setWatchlist(u); }} className="absolute top-2 right-2 p-1.5 bg-black/50 text-white rounded-full hover:bg-red-600 transition-all"><X size={16} /></button>
                  </div>
                  <div className="p-4"><h3 className="font-bold text-sm line-clamp-1 group-hover:text-blue-600 transition-colors">{item.title}</h3></div>
                </div>
              ))}
              {watchlist.length === 0 && <div className="col-span-full py-20 text-center text-gray-300 italic font-serif">Your watchlist is empty.</div>}
            </div>
          </div>
        )}
        {currentPage === 'admin-login' && <PageAdmin />}
      </main>
      
      <footer className="bg-white border-t pt-16 pb-12 text-center px-6 mt-auto">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-12">
            <div className="text-left space-y-2">
              <div className="text-3xl font-black text-blue-600 font-serif leading-none">{config.siteName}</div>
              <p className="text-[11px] text-gray-400 font-bold tracking-[0.2em] uppercase">AI-Powered Cinematic Guide</p>
            </div>
            <div className="w-full md:w-auto bg-gray-50 p-6 rounded-2xl border border-gray-100 flex flex-col sm:flex-row gap-3 shadow-inner">
               <input type="email" placeholder={t.emailPlaceholder} className="px-5 py-3 text-sm rounded-full border border-gray-200 outline-none w-full sm:w-64 focus:border-blue-600 bg-white" />
               <button className="bg-blue-600 text-white px-8 py-3 rounded-full font-black uppercase tracking-widest text-xs hover:bg-blue-700 transition-all flex items-center justify-center shadow-lg transform active:scale-95">
                 <Mail size={16} className="mr-2" /> {t.subscribe}
               </button>
            </div>
        </div>
      </footer>

      <LotteryModal isOpen={showLottery} onClose={() => setShowLottery(false)} reviews={reviews.filter(r => r.visible)} lang={lang} onSelect={r => { setSelectedReviewId(r.id); setCurrentPage('detail'); setShowLottery(false); window.scrollTo(0,0); }} />
      {isGenerating && (
        <div className="fixed bottom-8 right-8 z-[100] bg-black text-white px-8 py-5 rounded-full shadow-2xl flex items-center animate-bounce border-2 border-blue-600">
          <Loader2 className="animate-spin mr-3 text-blue-400" />
          <span className="font-black text-xs uppercase tracking-[0.1em]">AI is analyzing cinema...</span>
        </div>
      )}
    </div>
  );
};
export default App;
