import React from 'react';
import { ChurchSettings, Member, Donation, YouTubeVideo, ChurchNotice } from '../types/church';
import { 
  UserPlus, 
  HeartHandshake, 
  Video, 
  LogIn, 
  Clock, 
  MapPin, 
  Phone, 
  ArrowRight,
  Church,
  ShieldCheck,
  Bell,
  Image as ImageIcon
} from 'lucide-react';

interface HomeSectionProps {
  settings: ChurchSettings;
  members: Member[];
  donations: Donation[];
  videos: YouTubeVideo[];
  notices: ChurchNotice[];
  onNavigate: (tab: 'register' | 'giving' | 'videos' | 'notices' | 'admin') => void;
  onOpenLogin: () => void;
  isAdminLoggedIn: boolean;
}

export const HomeSection: React.FC<HomeSectionProps> = ({
  settings,
  members,
  donations,
  videos,
  notices,
  onNavigate,
  onOpenLogin,
  isAdminLoggedIn,
}) => {
  const totalMembers = members.length;
  const youthCount = members.filter(m => {
    const birthYear = new Date(m.dob).getFullYear();
    const age = 2026 - birthYear;
    return age >= 13 && age <= 35;
  }).length;
  const childrenCount = members.filter(m => {
    const birthYear = new Date(m.dob).getFullYear();
    const age = 2026 - birthYear;
    return age < 13;
  }).length;
  const adultsCount = members.filter(m => {
    const birthYear = new Date(m.dob).getFullYear();
    const age = 2026 - birthYear;
    return age > 35;
  }).length;

  return (
    <div className="space-y-16 pb-16">
      
      {/* Hero Section */}
      <section className="relative bg-slate-950 text-white overflow-hidden">
        {/* Background Image with Scrim */}
        <div className="absolute inset-0">
          <img
            src="/src/assets/images/church_hero_altar_1792854333601.jpg"
            alt="Madhabahu ya Kanisa"
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover opacity-35"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/70 to-slate-950/40" />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-28 lg:py-32">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-amber-400/20 border border-amber-400/30 text-amber-300 text-xs font-semibold mb-6">
              <Church className="w-4 h-4 text-amber-400" />
              <span>Karibu Nyumbani mwa Bwana</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-tight">
              {settings.churchName}
            </h1>

            <p className="mt-4 text-lg sm:text-xl text-slate-300 font-light leading-relaxed">
              {settings.motto}
            </p>

            <p className="mt-2 text-xs sm:text-sm text-amber-200/90 font-medium flex items-center gap-2">
              <MapPin className="w-4 h-4 text-amber-400 shrink-0" />
              {settings.location}
            </p>

            {/* Clean Hero CTAs: Jisajili & Ingia */}
            <div className="mt-8 flex flex-wrap items-center gap-4">
              <button
                onClick={() => onNavigate('register')}
                className="px-6 py-3.5 text-xs sm:text-sm font-bold text-white bg-blue-800 hover:bg-blue-700 rounded-xl transition-all shadow-lg hover:shadow-xl flex items-center gap-2 cursor-pointer"
              >
                <UserPlus className="w-4 h-4 text-amber-400" />
                Jisajili
              </button>

              <button
                onClick={() => {
                  if (isAdminLoggedIn) {
                    onNavigate('admin');
                  } else {
                    onOpenLogin();
                  }
                }}
                className="px-6 py-3.5 text-xs sm:text-sm font-bold text-slate-900 bg-amber-400 hover:bg-amber-300 rounded-xl transition-all shadow-lg hover:shadow-xl flex items-center gap-2 cursor-pointer"
              >
                <LogIn className="w-4 h-4 text-slate-900" />
                Ingia
              </button>

              <button
                onClick={() => onNavigate('giving')}
                className="px-6 py-3.5 text-xs sm:text-sm font-semibold text-white bg-white/10 hover:bg-white/20 rounded-xl transition-all backdrop-blur-sm flex items-center gap-2 cursor-pointer border border-white/20"
              >
                <HeartHandshake className="w-4 h-4 text-amber-400" />
                Toa Sadaka
              </button>
            </div>
          </div>
        </div>

        {/* Real Dynamic KPI Strip */}
        <div className="relative border-t border-slate-800/80 bg-slate-900/80 backdrop-blur-md">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
              <div>
                <span className="text-2xl font-extrabold text-white font-mono">{totalMembers}</span>
                <span className="text-xs text-slate-400 block">Washirika Waliosajiliwa</span>
              </div>
              <div>
                <span className="text-2xl font-extrabold text-amber-400 font-mono">{youthCount}</span>
                <span className="text-xs text-slate-400 block">Vijana Kanisani</span>
              </div>
              <div>
                <span className="text-2xl font-extrabold text-blue-400 font-mono">{adultsCount}</span>
                <span className="text-xs text-slate-400 block">Watu Wazima na Wazee</span>
              </div>
              <div>
                <span className="text-2xl font-extrabold text-emerald-400 font-mono">{childrenCount}</span>
                <span className="text-xs text-slate-400 block">Sunday School</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Leadership Profile & Fellowship */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch">
          
          {/* Pastor Card */}
          <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-sm flex flex-col justify-between">
            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
              <img
                src={settings.leaderPhoto}
                alt={settings.leaderName}
                referrerPolicy="no-referrer"
                className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl object-cover border-2 border-amber-400 shadow-md shrink-0 bg-slate-100"
              />
              <div>
                <span className="text-xs font-semibold text-blue-900 bg-blue-50 px-2.5 py-0.5 rounded">
                  Ofisi ya Kiongozi Mkuu
                </span>
                <h3 className="text-xl font-bold text-slate-900 mt-2">
                  {settings.leaderName}
                </h3>
                <p className="text-xs text-slate-500 font-medium">
                  {settings.leaderTitle}
                </p>
                <p className="mt-3 text-xs sm:text-sm text-slate-600 leading-relaxed italic">
                  "Tunakukaribisha kwa furaha katika kanisa letu. Tumejitolea kujenga kizazi kinachomcha Mungu, kuimarisha familia, na kusaidia kila mshirika kufikia kusudi lake ndani ya Kristo. Uko mahali salama pa kiroho."
                </p>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3 text-xs text-slate-500">
              <span className="flex items-center gap-1.5 font-mono">
                <Phone className="w-3.5 h-3.5 text-blue-900" />
                {settings.churchPhone}
              </span>
              <button
                onClick={() => onNavigate('register')}
                className="font-semibold text-blue-900 hover:underline flex items-center gap-1 cursor-pointer"
              >
                Jisajili Leo <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Fellowship Choir & Congregation Card */}
          <div className="bg-white rounded-2xl overflow-hidden border border-slate-200 shadow-sm flex flex-col justify-between">
            <div className="relative aspect-video">
              <img
                src="/src/assets/images/church_worship_fellowship_1792854335120.jpg"
                alt="Ibada na Sifa za Kwaya"
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/30 to-transparent flex items-end p-5">
                <div className="text-white">
                  <span className="text-[11px] font-semibold text-amber-400 uppercase tracking-wider block">
                    Ushirika & Sifa
                  </span>
                  <h4 className="text-base font-bold text-white">
                    Ibada na Huduma za Kiroho
                  </h4>
                </div>
              </div>
            </div>

            <div className="p-6">
              <p className="text-xs text-slate-600 leading-relaxed">
                Tunayo makundi ya huduma ikiwa ni pamoja na Umoja wa Vijana, Kwaya Kuu, Umoja wa Wanawake, Wazee wa Kanisa, na Sunday School ya watoto wetu.
              </p>
              <div className="mt-4 flex items-center justify-between">
                <button
                  onClick={() => onNavigate('videos')}
                  className="text-xs font-semibold text-blue-900 hover:underline flex items-center gap-1 cursor-pointer"
                >
                  Tazama Video za YouTube <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* Church Service Timetable */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-2xl p-6 sm:p-10 border border-slate-200 shadow-sm">
          <div className="text-center max-w-xl mx-auto mb-8">
            <span className="text-xs font-bold uppercase tracking-wider text-blue-900 bg-blue-50 px-3 py-1 rounded">
              Ratiba za Ibada
            </span>
            <h3 className="text-2xl font-bold text-slate-900 mt-2">
              Ratiba ya Ibada na Mikutano ya Wiki
            </h3>
            <p className="text-xs text-slate-500 mt-1">
              Ungana nasi katika nyakati hizi za baraka uweponi mwa Mungu.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs space-y-1.5">
              <div className="flex items-center justify-between text-blue-900 font-bold">
                <span>Jumapili: Ibada ya Kwanza</span>
                <Clock className="w-4 h-4 text-blue-800" />
              </div>
              <div className="text-base font-extrabold text-slate-900 font-mono">
                Saa 1:00 - 3:30 Asubuhi
              </div>
              <p className="text-slate-500 text-[11px]">Ibada ya asubuhi na meza ya Bwana.</p>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs space-y-1.5">
              <div className="flex items-center justify-between text-amber-700 font-bold">
                <span>Jumapili: Ibada Kuu & Watoto</span>
                <Clock className="w-4 h-4 text-amber-600" />
              </div>
              <div className="text-base font-extrabold text-slate-900 font-mono">
                Saa 3:45 - 7:00 Mchana
              </div>
              <p className="text-slate-500 text-[11px]">Mahubiri, kwaya zote & Sunday School.</p>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs space-y-1.5">
              <div className="flex items-center justify-between text-indigo-900 font-bold">
                <span>Jumanne: Maombi & Ushauri</span>
                <Clock className="w-4 h-4 text-indigo-700" />
              </div>
              <div className="text-base font-extrabold text-slate-900 font-mono">
                Saa 10:00 Jioni
              </div>
              <p className="text-slate-500 text-[11px]">Kukutana na mchungaji na maombezi.</p>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs space-y-1.5">
              <div className="flex items-center justify-between text-emerald-800 font-bold">
                <span>Ijumaa: Mafundisho & Vijana</span>
                <Clock className="w-4 h-4 text-emerald-600" />
              </div>
              <div className="text-base font-extrabold text-slate-900 font-mono">
                Saa 10:30 Jioni
              </div>
              <p className="text-slate-500 text-[11px]">Kujifunza Biblia kwa kina na semina.</p>
            </div>

          </div>
        </div>
      </section>

      {/* Notice Board Spotlight Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-br from-blue-950 via-slate-900 to-blue-900 text-white rounded-2xl p-6 sm:p-10 border border-blue-800 shadow-md">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 pb-6 border-b border-blue-800/80">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold uppercase tracking-wider text-amber-400 bg-amber-400/10 px-2.5 py-0.5 rounded border border-amber-400/20">
                  Ubao wa Matangazo
                </span>
                <span className="text-xs text-blue-200">
                  Taarifa & Ratiba za Kanisa
                </span>
              </div>
              <h3 className="text-2xl font-bold text-white mt-1.5">
                Matangazo ya Kanisa na Picha za Matukio
              </h3>
            </div>

            <button
              onClick={() => onNavigate('notices')}
              className="flex items-center gap-2 px-5 py-2.5 text-xs font-bold text-slate-900 bg-amber-400 hover:bg-amber-300 rounded-xl transition-all shadow-md cursor-pointer shrink-0"
            >
              <Bell className="w-4 h-4 text-slate-900" />
              Tazama Ubao wa Matangazo ({notices.length})
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {notices.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
              {notices.slice(0, 2).map((notice) => (
                <div 
                  key={notice.id} 
                  onClick={() => onNavigate('notices')}
                  className="bg-slate-800/80 hover:bg-slate-800 rounded-xl p-5 border border-slate-700/80 transition-all cursor-pointer space-y-3"
                >
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-amber-300 font-semibold bg-amber-500/20 px-2 py-0.5 rounded text-[11px]">
                      {notice.category}
                    </span>
                    <span className="text-slate-400">{notice.date}</span>
                  </div>

                  <h4 className="text-base font-bold text-white line-clamp-1">{notice.title}</h4>
                  
                  <p className="text-xs text-slate-300 line-clamp-3 leading-relaxed">
                    {notice.content}
                  </p>

                  {notice.images && notice.images.length > 0 && (
                    <div className="flex items-center gap-2 pt-1 text-[11px] text-amber-400">
                      <ImageIcon className="w-3.5 h-3.5" />
                      <span>Ina picha {notice.images.length} za matukio</span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-xs text-slate-400">
              Hakuna matangazo kwa sasa. Matangazo mapya yatawekwa hapa na uongozi.
            </div>
          )}
        </div>
      </section>

    </div>
  );
};
