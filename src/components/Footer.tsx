import React from 'react';
import { ChurchSettings } from '../types/church';
import { Church, Phone, Mail, MapPin, Heart } from 'lucide-react';

interface FooterProps {
  settings: ChurchSettings;
  onNavigate: (tab: 'home' | 'register' | 'giving' | 'videos' | 'notices' | 'admin' | 'profile') => void;
  onOpenAdminLogin: () => void;
  isAdminLoggedIn: boolean;
}

export const Footer: React.FC<FooterProps> = ({
  settings,
  onNavigate,
  onOpenAdminLogin,
  isAdminLoggedIn,
}) => {
  return (
    <footer className="bg-slate-950 text-slate-400 text-xs border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          
          {/* Col 1: Identity */}
          <div className="md:col-span-2 space-y-3">
            <div className="flex items-center gap-2.5 text-white">
              <div className="w-8 h-8 rounded-lg bg-blue-900 text-amber-400 flex items-center justify-center font-bold">
                <Church className="w-5 h-5" />
              </div>
              <span className="text-base font-bold tracking-tight text-white">{settings.churchName}</span>
            </div>
            <p className="text-slate-400 text-xs leading-relaxed max-w-sm">
              {settings.motto}
            </p>
            <div className="text-[11px] text-slate-500 pt-1">
              {settings.leaderName} · {settings.leaderTitle}
            </div>
          </div>

          {/* Col 2: Navigation Links */}
          <div className="space-y-2.5">
            <h4 className="text-xs font-semibold text-white uppercase tracking-wider">Viungo vya Haraka</h4>
            <ul className="space-y-2">
              <li>
                <button onClick={() => onNavigate('home')} className="hover:text-white transition-colors cursor-pointer">
                  Nyumbani
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('register')} className="hover:text-white transition-colors cursor-pointer">
                  Fomu ya Usajili wa Mshirika
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('giving')} className="hover:text-white transition-colors cursor-pointer">
                  Toa Sadaka & Fungu la Kumi
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('notices')} className="hover:text-white transition-colors cursor-pointer">
                  Ubao wa Matangazo & Ratiba
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('videos')} className="hover:text-white transition-colors cursor-pointer">
                  Video za Mahubiri (YouTube)
                </button>
              </li>
              <li>
                <button 
                  onClick={() => isAdminLoggedIn ? onNavigate('admin') : onOpenAdminLogin()} 
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  {isAdminLoggedIn ? 'Dashibodi ya Uongozi' : 'Ingia'}
                </button>
              </li>
            </ul>
          </div>

          {/* Col 3: Church Contacts */}
          <div className="space-y-2.5">
            <h4 className="text-xs font-semibold text-white uppercase tracking-wider">Mawasiliano ya Kanisa</h4>
            <div className="space-y-2 text-slate-400">
              <div className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <span>{settings.location}</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-blue-400 shrink-0" />
                <span className="font-mono">{settings.churchPhone}</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-emerald-400 shrink-0" />
                <span className="font-mono truncate">{settings.leaderEmail}</span>
              </div>
            </div>
          </div>

        </div>

        <div className="mt-12 pt-6 border-t border-slate-900 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-slate-500">
          <span>&copy; 2026 {settings.churchName}. Haki Zote Zimehifadhiwa.</span>
          <div className="flex items-center gap-1">
            <span>Mfumo Rasmi wa Usimamizi wa Washirika na Sadaka Mtandaoni</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
