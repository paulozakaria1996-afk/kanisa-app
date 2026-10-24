import React, { useState } from 'react';
import { YouTubeVideo, extractYouTubeId } from '../types/church';
import { 
  Video, 
  Play, 
  Search, 
  Plus, 
  Calendar, 
  User, 
  Clock, 
  X, 
  ExternalLink,
  Sparkles
} from 'lucide-react';

interface YouTubeVideosSectionProps {
  videos: YouTubeVideo[];
  onAddVideo: (video: YouTubeVideo) => void;
  isAdminLoggedIn: boolean;
  onOpenAdminLogin: () => void;
}

export const YouTubeVideosSection: React.FC<YouTubeVideosSectionProps> = ({
  videos,
  onAddVideo,
  isAdminLoggedIn,
  onOpenAdminLogin,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('Zote');
  const [activeVideo, setActiveVideo] = useState<YouTubeVideo | null>(videos[0] || null);
  const [showAddModal, setShowAddModal] = useState(false);

  // New video form fields
  const [newTitle, setNewTitle] = useState('');
  const [newSpeaker, setNewSpeaker] = useState('');
  const [newUrl, setNewUrl] = useState('');
  const [newCategory, setNewCategory] = useState<YouTubeVideo['category']>('Mahubiri');
  const [newDuration, setNewDuration] = useState('45:00');
  const [newDescription, setNewDescription] = useState('');

  const categories = ['Zote', 'Mahubiri', 'Ibada ya Jumapili', 'Nyimbo za Kwaya', 'Semina ya Vijana', 'Mafundisho ya Neno'];

  const filteredVideos = videos.filter((v) => {
    const matchesSearch = 
      v.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      v.speaker.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (v.description && v.description.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchesCategory = selectedCategory === 'Zote' || v.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleCreateVideo = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newUrl.trim()) return;

    const embedId = extractYouTubeId(newUrl);

    const videoObj: YouTubeVideo = {
      id: 'vid-' + Date.now(),
      title: newTitle.trim(),
      speaker: newSpeaker.trim() || 'Mchungaji Kiongozi',
      youtubeUrl: newUrl.trim(),
      embedId: embedId || 'ScMzIvxBSi4',
      date: new Date().toISOString().split('T')[0],
      duration: newDuration.trim() || '45:00',
      category: newCategory,
      description: newDescription.trim(),
    };

    onAddVideo(videoObj);
    setActiveVideo(videoObj);
    setShowAddModal(false);

    // Reset
    setNewTitle('');
    setNewSpeaker('');
    setNewUrl('');
    setNewDescription('');
  };

  return (
    <section className="py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      
      {/* Kicker & Title */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
        <div>
          <span className="text-xs font-semibold tracking-wider uppercase text-red-600 bg-red-50 px-3 py-1 rounded-md">
            Mahubiri & Ibada Moja kwa Moja
          </span>
          <h2 className="mt-3 text-3xl font-extrabold text-slate-900 tracking-tight">
            Video za YouTube na Mafundisho ya Neno
          </h2>
          <p className="mt-1 text-sm text-slate-600">
            Tazama ibada zilizopita, mafundisho ya neno la Mungu, na sifa za kwaya kupitia kituo chetu cha YouTube.
          </p>
        </div>

        <div className="shrink-0">
          <button
            onClick={() => {
              if (isAdminLoggedIn) {
                setShowAddModal(true);
              } else {
                onOpenAdminLogin();
              }
            }}
            className="flex items-center gap-2 px-4 py-2.5 text-xs font-semibold text-white bg-blue-900 hover:bg-blue-800 rounded-lg transition-colors cursor-pointer shadow-sm"
          >
            <Plus className="w-4 h-4 text-amber-400" />
            Weka Video Mpya ya YouTube
          </button>
        </div>
      </div>

      {/* Featured Video Player */}
      {activeVideo && (
        <div className="bg-slate-950 rounded-2xl overflow-hidden shadow-xl border border-slate-800 mb-10">
          <div className="relative aspect-video w-full max-h-[520px]">
            <iframe
              src={`https://www.youtube-nocookie.com/embed/${activeVideo.embedId}?autoplay=0&rel=0`}
              title={activeVideo.title}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="w-full h-full border-0"
            />
          </div>

          <div className="p-6 bg-slate-900 text-white">
            <div className="flex flex-wrap items-center justify-between gap-3 mb-2">
              <span className="text-xs font-semibold text-amber-400 bg-amber-400/10 px-2.5 py-1 rounded border border-amber-400/20">
                {activeVideo.category}
              </span>
              <div className="flex items-center gap-4 text-xs text-slate-400">
                <span className="flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5 text-blue-400" />
                  {activeVideo.speaker}
                </span>
                <span className="flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5" />
                  {activeVideo.date}
                </span>
                <span className="flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5" />
                  {activeVideo.duration}
                </span>
              </div>
            </div>

            <h3 className="text-xl font-bold text-white mb-2">{activeVideo.title}</h3>
            {activeVideo.description && (
              <p className="text-sm text-slate-300 leading-relaxed max-w-4xl">
                {activeVideo.description}
              </p>
            )}
            
            <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-between">
              <span className="text-xs text-slate-400">
                Inacheza kutoka YouTube
              </span>
              <a
                href={activeVideo.youtubeUrl}
                target="_blank"
                rel="noreferrer"
                className="text-xs text-amber-400 hover:text-amber-300 flex items-center gap-1 font-medium"
              >
                Fungua kwenye YouTube
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>
        </div>
      )}

      {/* Filter and Search Bar */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-6">
        
        {/* Category Pills/Buttons */}
        <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto pb-2 md:pb-0 scrollbar-none">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors whitespace-nowrap cursor-pointer ${
                selectedCategory === cat
                  ? 'bg-blue-900 text-white shadow-sm'
                  : 'bg-white text-slate-600 hover:text-slate-900 border border-slate-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="relative w-full md:w-72">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
            <Search className="w-4 h-4" />
          </div>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Tafuta mahubiri au mnenaji..."
            className="w-full pl-9 pr-3.5 py-2 text-xs rounded-lg border border-slate-300 bg-white focus:outline-none focus:ring-2 focus:ring-blue-900"
          />
        </div>

      </div>

      {/* Videos Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {filteredVideos.map((video) => {
          const isSelected = activeVideo?.id === video.id;
          return (
            <div
              key={video.id}
              onClick={() => {
                setActiveVideo(video);
                window.scrollTo({ top: 180, behavior: 'smooth' });
              }}
              className={`group bg-white rounded-xl overflow-hidden border transition-all cursor-pointer flex flex-col ${
                isSelected 
                  ? 'border-blue-900 ring-2 ring-blue-900/20 shadow-md' 
                  : 'border-slate-200 hover:border-slate-300 hover:shadow-sm'
              }`}
            >
              {/* Thumbnail Container */}
              <div className="relative aspect-video bg-slate-900 overflow-hidden">
                <img
                  src={`https://img.youtube.com/vi/${video.embedId}/mqdefault.jpg`}
                  alt={video.title}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  onError={(e) => {
                    // Fallback thumbnail if image fails
                    (e.target as HTMLElement).style.display = 'none';
                  }}
                />
                
                {/* Fallback pattern behind */}
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-900/40 to-transparent flex items-center justify-center">
                  <div className="w-10 h-10 rounded-full bg-red-600 text-white flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                    <Play className="w-5 h-5 ml-0.5 fill-current" />
                  </div>
                </div>

                <div className="absolute bottom-2 right-2 bg-black/80 text-white text-[10px] font-mono px-1.5 py-0.5 rounded">
                  {video.duration}
                </div>
              </div>

              {/* Video metadata */}
              <div className="p-4 flex-1 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between text-[11px] text-slate-500 mb-1">
                    <span className="font-medium text-amber-700">{video.category}</span>
                    <span>{video.date}</span>
                  </div>
                  <h4 className="text-sm font-semibold text-slate-900 line-clamp-2 group-hover:text-blue-900 transition-colors">
                    {video.title}
                  </h4>
                </div>

                <div className="mt-3 pt-2 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                  <span className="truncate">{video.speaker}</span>
                  <span className="text-blue-900 font-medium text-[11px] shrink-0">Tazama</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {filteredVideos.length === 0 && (
        <div className="text-center py-12 bg-white rounded-xl border border-slate-200">
          <Video className="w-10 h-10 mx-auto text-slate-400 mb-2" />
          <h4 className="text-sm font-semibold text-slate-700">Hakuna video zilizopatikana</h4>
          <p className="text-xs text-slate-500 mt-1">Jaribu neno lingine la utafutaji au badili kundi.</p>
        </div>
      )}

      {/* Add New Video Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-fade-in">
          <div className="w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden">
            
            <div className="bg-blue-900 text-white p-5 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Video className="w-5 h-5 text-amber-400" />
                <h3 className="text-sm font-bold text-white">Weka Link ya Video ya YouTube</h3>
              </div>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-blue-200 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateVideo} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Kichwa cha Video / Somo Kuu <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="mfano: Ibada ya Jumapili: Nguvu ya Maombi"
                  className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-900"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Link Kamili ya YouTube (URL) <span className="text-red-500">*</span>
                </label>
                <input
                  type="url"
                  required
                  value={newUrl}
                  onChange={(e) => setNewUrl(e.target.value)}
                  placeholder="https://www.youtube.com/watch?v=... au https://youtu.be/..."
                  className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-900"
                />
                <p className="text-[11px] text-slate-500 mt-1">
                  Unaweza kuweka link ya video au kitambulisho (Video ID) cha herufi 11.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Mnenaji / Muhubiri / Mwimbaji
                  </label>
                  <input
                    type="text"
                    value={newSpeaker}
                    onChange={(e) => setNewSpeaker(e.target.value)}
                    placeholder="Mch. Paulo Zakaria"
                    className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-900"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Kategoria ya Video
                  </label>
                  <select
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value as any)}
                    className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-900 bg-white"
                  >
                    <option value="Mahubiri">Mahubiri</option>
                    <option value="Ibada ya Jumapili">Ibada ya Jumapili</option>
                    <option value="Nyimbo za Kwaya">Nyimbo za Kwaya</option>
                    <option value="Semina ya Vijana">Semina ya Vijana</option>
                    <option value="Mafundisho ya Neno">Mafundisho ya Neno</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Muda wa Video (Mfano 45:20)
                </label>
                <input
                  type="text"
                  value={newDuration}
                  onChange={(e) => setNewDuration(e.target.value)}
                  placeholder="45:00"
                  className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-900"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Maelezo Mafupi ya Somo (Hiari)
                </label>
                <textarea
                  rows={2}
                  value={newDescription}
                  onChange={(e) => setNewDescription(e.target.value)}
                  placeholder="Dondoo kuu za mahubiri au maandiko yaliyotumika..."
                  className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-900"
                />
              </div>

              <div className="pt-2 flex gap-3">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="flex-1 py-2.5 px-4 text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg cursor-pointer"
                >
                  Ghairi
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 px-4 text-xs font-semibold text-white bg-blue-900 hover:bg-blue-800 rounded-lg transition-colors cursor-pointer shadow-sm"
                >
                  Hifadhi Video
                </button>
              </div>
            </form>

          </div>
        </div>
      )}

    </section>
  );
};
