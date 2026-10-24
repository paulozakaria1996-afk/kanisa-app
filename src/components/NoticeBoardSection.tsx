import React, { useState } from 'react';
import { ChurchNotice, ChurchSettings } from '../types/church';
import { 
  Bell, 
  Calendar, 
  Clock, 
  Image as ImageIcon, 
  X, 
  Plus, 
  Pin, 
  Share2, 
  Check, 
  ExternalLink,
  ChevronRight,
  Sparkles
} from 'lucide-react';

interface NoticeBoardSectionProps {
  notices: ChurchNotice[];
  settings: ChurchSettings;
  isAdminLoggedIn: boolean;
  onOpenCreateNotice?: () => void;
  onDeleteNotice?: (id: string) => void;
}

export const NoticeBoardSection: React.FC<NoticeBoardSectionProps> = ({
  notices,
  settings,
  isAdminLoggedIn,
  onOpenCreateNotice,
  onDeleteNotice,
}) => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [filterCategory, setFilterCategory] = useState<string>('Zote');

  const categories = ['Zote', 'Ratiba ya Ibada', 'Tangazo Kuu', 'Harambee & Ujenzi', 'Semina & Mikutano', 'Taarifa Maalum'];

  const filteredNotices = notices.filter(n => 
    filterCategory === 'Zote' || n.category === filterCategory
  );

  const handleShare = (notice: ChurchNotice) => {
    const text = `*${notice.title}* (${notice.category})\nKanisa: ${settings.churchName}\n\n${notice.content}\n\nTarehe: ${notice.date}`;
    if (navigator.share) {
      navigator.share({
        title: notice.title,
        text: text,
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(text);
      setCopiedId(notice.id);
      setTimeout(() => setCopiedId(null), 3000);
    }
  };

  return (
    <section className="py-12 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto space-y-8 animate-fade-in">
      
      {/* Header kicker & title */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <span className="text-xs font-semibold tracking-wider uppercase text-blue-900 bg-blue-50 px-3 py-1 rounded-md">
            Mawasiliano na Matukio ya Kanisa
          </span>
          <h2 className="mt-3 text-3xl font-extrabold text-slate-900 tracking-tight">
            Ubao wa Matangazo na Ratiba za Ibada
          </h2>
          <p className="mt-2 text-sm text-slate-600 max-w-2xl">
            Pata taarifa rasmi za kanisa, ratiba za ibada, matukio ya kwaya, mikutano ya vijana, na matangazo maalum kutoka kwa uongozi.
          </p>
        </div>

        {isAdminLoggedIn && onOpenCreateNotice && (
          <button
            onClick={onOpenCreateNotice}
            className="flex items-center gap-2 px-4 py-2.5 text-xs font-semibold text-white bg-blue-900 hover:bg-blue-800 rounded-xl transition-all shadow-sm cursor-pointer shrink-0"
          >
            <Plus className="w-4 h-4 text-amber-400" />
            Weka Tangazo / Ratiba Mpya
          </button>
        )}
      </div>

      {/* Category filters */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-2 scrollbar-none">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setFilterCategory(cat)}
            className={`px-3.5 py-1.5 text-xs font-medium rounded-lg transition-colors whitespace-nowrap cursor-pointer ${
              filterCategory === cat
                ? 'bg-blue-900 text-white shadow-sm'
                : 'bg-white text-slate-600 hover:text-slate-900 border border-slate-200'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Notices Feed */}
      <div className="space-y-6">
        {filteredNotices.map((notice) => (
          <article
            key={notice.id}
            className={`bg-white rounded-2xl border transition-all p-6 sm:p-8 shadow-sm ${
              notice.isPinned
                ? 'border-blue-900/40 ring-1 ring-blue-900/10'
                : 'border-slate-200 hover:border-slate-300'
            }`}
          >
            {/* Meta row */}
            <div className="flex flex-wrap items-center justify-between gap-3 mb-3 pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2.5">
                <span className="text-xs font-bold text-blue-900 bg-blue-50 px-2.5 py-0.5 rounded border border-blue-200">
                  {notice.category}
                </span>
                {notice.isPinned && (
                  <span className="text-xs font-semibold text-amber-700 bg-amber-50 px-2 py-0.5 rounded flex items-center gap-1">
                    <Pin className="w-3 h-3 text-amber-600" />
                    Tangazo Muhimu
                  </span>
                )}
              </div>

              <div className="flex items-center gap-3 text-xs text-slate-400">
                <span className="flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5" />
                  {notice.date}
                </span>
                {notice.author && (
                  <span className="hidden sm:inline">
                    · {notice.author}
                  </span>
                )}
              </div>
            </div>

            {/* Title */}
            <h3 className="text-xl font-bold text-slate-900 tracking-tight mb-3">
              {notice.title}
            </h3>

            {/* Text content */}
            <div className="text-sm text-slate-700 leading-relaxed whitespace-pre-line mb-5">
              {notice.content}
            </div>

            {/* Photo Gallery (Optional & Unlimited Photos) */}
            {notice.images && notice.images.length > 0 && (
              <div className="pt-2 pb-4">
                <div className="flex items-center gap-1.5 text-xs text-slate-500 mb-2.5 font-medium">
                  <ImageIcon className="w-4 h-4 text-blue-900" />
                  <span>Picha zilizoambatanishwa ({notice.images.length}):</span>
                  <span className="text-[11px] text-slate-400">(Bofya picha kuikuza)</span>
                </div>

                <div className={`grid gap-3 ${
                  notice.images.length === 1 
                    ? 'grid-cols-1 sm:grid-cols-2 max-w-lg' 
                    : notice.images.length === 2 
                    ? 'grid-cols-2 max-w-2xl' 
                    : 'grid-cols-2 sm:grid-cols-3 md:grid-cols-4'
                }`}>
                  {notice.images.map((imgUrl, idx) => (
                    <div
                      key={idx}
                      onClick={() => setSelectedImage(imgUrl)}
                      className="group relative aspect-video sm:aspect-square rounded-xl overflow-hidden bg-slate-900 cursor-pointer border border-slate-200 hover:border-blue-900 transition-all shadow-sm"
                    >
                      <img
                        src={imgUrl}
                        alt={`${notice.title} - picha ${idx + 1}`}
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        onError={(e) => {
                          (e.target as HTMLElement).style.display = 'none';
                        }}
                      />
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center">
                        <span className="opacity-0 group-hover:opacity-100 transition-opacity bg-black/75 text-white text-[11px] px-2 py-1 rounded">
                          Kuza Picha
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Action footer */}
            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
              <button
                onClick={() => handleShare(notice)}
                className="flex items-center gap-1.5 font-medium text-slate-600 hover:text-blue-900 transition-colors cursor-pointer"
              >
                {copiedId === notice.id ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-600" />
                    <span className="text-emerald-700 font-semibold">Ujumbe Umenakiliwa!</span>
                  </>
                ) : (
                  <>
                    <Share2 className="w-3.5 h-3.5" />
                    <span>Shiriki Tangazo Hili</span>
                  </>
                )}
              </button>

              {isAdminLoggedIn && onDeleteNotice && (
                <button
                  onClick={() => {
                    if (confirm(`Una uhakika unataka kufuta tangazo la: "${notice.title}"?`)) {
                      onDeleteNotice(notice.id);
                    }
                  }}
                  className="text-red-600 hover:text-red-800 font-medium cursor-pointer"
                >
                  Futa Tangazo
                </button>
              )}
            </div>

          </article>
        ))}

        {filteredNotices.length === 0 && (
          <div className="text-center py-16 bg-white rounded-2xl border border-slate-200">
            <Bell className="w-12 h-12 mx-auto text-slate-300 mb-2" />
            <h4 className="text-sm font-semibold text-slate-700">Hakuna matangazo kwa kundi hili</h4>
            <p className="text-xs text-slate-500 mt-1">
              Matangazo mapya na ratiba zitawekwa hapa na uongozi wa kanisa.
            </p>
          </div>
        )}
      </div>

      {/* Lightbox / Full-screen Image Viewer */}
      {selectedImage && (
        <div 
          onClick={() => setSelectedImage(null)}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in"
        >
          <div 
            onClick={(e) => e.stopPropagation()}
            className="relative max-w-4xl max-h-[90vh] bg-slate-900 rounded-2xl overflow-hidden shadow-2xl border border-slate-700"
          >
            <button
              onClick={() => setSelectedImage(null)}
              className="absolute top-3 right-3 z-10 w-8 h-8 rounded-full bg-black/60 hover:bg-black text-white flex items-center justify-center transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
            <img
              src={selectedImage}
              alt="Picha ya tangazo"
              referrerPolicy="no-referrer"
              className="w-full h-auto max-h-[85vh] object-contain"
            />
          </div>
        </div>
      )}

    </section>
  );
};
