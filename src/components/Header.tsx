import React, { useState } from 'react';
import { ChurchSettings, Member } from '../types/church';
import { 
  Church, 
  UserPlus, 
  HeartHandshake, 
  Video, 
  ShieldCheck, 
  LogIn, 
  LogOut,
  Menu, 
  X,
  User,
  Bell,
  ArrowLeft,
  RotateCw
} from 'lucide-react';

interface HeaderProps {
  settings: ChurchSettings;
  activeTab: 'home' | 'register' | 'giving' | 'videos' | 'notices' | 'admin' | 'profile';
  setActiveTab: (tab: 'home' | 'register' | 'giving' | 'videos' | 'notices' | 'admin' | 'profile') => void;
  isAdminLoggedIn: boolean;
  loggedMember: Member | null;
  onOpenLogin: () => void;
  onLogout: () => void;
  onBack: () => void;
  onRefresh: () => void;
  isRefreshing: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  settings,
  activeTab,
  setActiveTab,
  isAdminLoggedIn,
  loggedMember,
  onOpenLogin,
  onLogout,
  onBack,
  onRefresh,
  isRefreshing,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleNavClick = (tab: 'home' | 'register' | 'giving' | 'videos' | 'notices' | 'admin' | 'profile') => {
    setActiveTab(tab);
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20 gap-4 sm:gap-8">
          
          {/* Zone 1: Back Button & Church Identity */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            {activeTab !== 'home' && (
              <button
                onClick={onBack}
                title="Rudi Nyuma"
                aria-label="Rudi Nyuma"
                className="p-2 -ml-2 rounded-xl text-slate-700 hover:text-blue-900 hover:bg-slate-100 transition-colors flex items-center gap-1 cursor-pointer"
              >
                <ArrowLeft className="w-5 h-5 text-blue-900" />
                <span className="hidden sm:inline text-xs font-semibold">Rudi</span>
              </button>
            )}

            <div 
              onClick={() => handleNavClick('home')}
              className="flex items-center gap-3 cursor-pointer group"
            >
              {settings.logoUrl ? (
                <img 
                  src={settings.logoUrl} 
                  alt={settings.churchName}
                  referrerPolicy="no-referrer"
                  className="w-10 h-10 sm:w-11 sm:h-11 object-contain rounded-lg border border-slate-200 p-1 bg-white shadow-sm"
                />
              ) : (
                <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-lg bg-blue-900 text-amber-400 flex items-center justify-center font-bold shadow-sm group-hover:bg-blue-950 transition-colors">
                  <Church className="w-5 h-5 sm:w-6 sm:h-6" />
                </div>
              )}
              
              <div className="flex flex-col">
                <span className="text-base sm:text-xl font-bold tracking-tight text-slate-900 leading-tight">
                  {settings.churchName}
                </span>
                <span className="text-xs text-slate-500 font-medium hidden md:inline-block">
                  {settings.motto}
                </span>
              </div>
            </div>
          </div>

          {/* Zone 2: Navigation Links */}
          <nav className="hidden lg:flex items-center gap-6 text-sm font-medium text-slate-600">
            <button
              onClick={() => handleNavClick('home')}
              className={`hover:text-blue-900 transition-colors whitespace-nowrap cursor-pointer py-1 border-b-2 ${
                activeTab === 'home' ? 'text-blue-900 border-blue-900 font-semibold' : 'border-transparent'
              }`}
            >
              Nyumbani
            </button>
            <button
              onClick={() => handleNavClick('register')}
              className={`hover:text-blue-900 transition-colors whitespace-nowrap cursor-pointer py-1 border-b-2 flex items-center gap-1.5 ${
                activeTab === 'register' ? 'text-blue-900 border-blue-900 font-semibold' : 'border-transparent'
              }`}
            >
              <UserPlus className="w-4 h-4 text-blue-700" />
              Jisajili
            </button>
            <button
              onClick={() => handleNavClick('giving')}
              className={`hover:text-blue-900 transition-colors whitespace-nowrap cursor-pointer py-1 border-b-2 flex items-center gap-1.5 ${
                activeTab === 'giving' ? 'text-blue-900 border-blue-900 font-semibold' : 'border-transparent'
              }`}
            >
              <HeartHandshake className="w-4 h-4 text-amber-600" />
              Toa Sadaka
            </button>
            <button
              onClick={() => handleNavClick('notices')}
              className={`hover:text-blue-900 transition-colors whitespace-nowrap cursor-pointer py-1 border-b-2 flex items-center gap-1.5 ${
                activeTab === 'notices' ? 'text-blue-900 border-blue-900 font-semibold' : 'border-transparent'
              }`}
            >
              <Bell className="w-4 h-4 text-amber-500" />
              Matangazo & Ratiba
            </button>
            <button
              onClick={() => handleNavClick('videos')}
              className={`hover:text-blue-900 transition-colors whitespace-nowrap cursor-pointer py-1 border-b-2 flex items-center gap-1.5 ${
                activeTab === 'videos' ? 'text-blue-900 border-blue-900 font-semibold' : 'border-transparent'
              }`}
            >
              <Video className="w-4 h-4 text-red-600" />
              Video za YouTube
            </button>

            {/* Only show Admin Dashboard tab if authenticated */}
            {isAdminLoggedIn && (
              <button
                onClick={() => handleNavClick('admin')}
                className={`hover:text-blue-900 transition-colors whitespace-nowrap cursor-pointer py-1 border-b-2 flex items-center gap-1.5 ${
                  activeTab === 'admin' ? 'text-blue-900 border-blue-900 font-semibold' : 'border-transparent'
                }`}
              >
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                Dashibodi ya Uongozi
              </button>
            )}

            {loggedMember && (
              <button
                onClick={() => handleNavClick('profile')}
                className={`hover:text-blue-900 transition-colors whitespace-nowrap cursor-pointer py-1 border-b-2 flex items-center gap-1.5 ${
                  activeTab === 'profile' ? 'text-blue-900 border-blue-900 font-semibold' : 'border-transparent'
                }`}
              >
                <User className="w-4 h-4 text-blue-700" />
                Akaunti Yangu
              </button>
            )}
          </nav>

          {/* Zone 3: Actions (Refresh Button + Jisajili & Ingia) */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            
            {/* Refresh Button */}
            <button
              onClick={onRefresh}
              title="Sasisha Mfumo (Refresh)"
              aria-label="Sasisha Mfumo"
              className="p-2 text-slate-600 hover:text-blue-900 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer flex items-center gap-1"
            >
              <RotateCw className={`w-4 h-4 text-blue-900 ${isRefreshing ? 'animate-spin' : ''}`} />
              <span className="hidden xl:inline text-xs font-medium text-slate-600">Sasisha</span>
            </button>

            {/* Account controls */}
            <div className="hidden sm:flex items-center gap-2.5">
              {isAdminLoggedIn ? (
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleNavClick('admin')}
                    className="text-xs text-blue-900 bg-blue-50 border border-blue-200 px-3 py-1.5 rounded-lg font-semibold flex items-center gap-1.5 hover:bg-blue-100 transition-colors cursor-pointer"
                  >
                    <ShieldCheck className="w-4 h-4 text-emerald-600" />
                    Dashibodi ya Msimamizi
                  </button>
                  <button
                    onClick={onLogout}
                    className="px-3 py-1.5 text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors cursor-pointer flex items-center gap-1"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    Toka
                  </button>
                </div>
              ) : loggedMember ? (
                <div className="flex items-center gap-2">
                  <span className="text-xs text-slate-700 bg-slate-100 px-3 py-1.5 rounded-lg font-medium">
                    {loggedMember.fullName}
                  </span>
                  <button
                    onClick={onLogout}
                    className="px-3 py-1.5 text-xs font-medium text-slate-600 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
                  >
                    Toka
                  </button>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleNavClick('register')}
                    className="px-3 py-1.5 text-xs font-semibold text-slate-700 hover:text-blue-900 transition-colors cursor-pointer"
                  >
                    Jisajili
                  </button>
                  <button
                    onClick={onOpenLogin}
                    className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold text-white bg-blue-900 rounded-lg hover:bg-blue-800 transition-colors shadow-sm cursor-pointer whitespace-nowrap"
                  >
                    <LogIn className="w-3.5 h-3.5 text-amber-400" />
                    Ingia
                  </button>
                </div>
              )}
            </div>

            {/* Mobile menu toggle */}
            <div className="flex lg:hidden items-center">
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-2 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 focus:outline-none cursor-pointer"
                aria-label="Toggle menu"
              >
                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>

          </div>

        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-slate-200 bg-white px-4 pt-3 pb-6 space-y-2 shadow-lg animate-fade-in">
          {activeTab !== 'home' && (
            <button
              onClick={() => {
                onBack();
                setMobileMenuOpen(false);
              }}
              className="w-full text-left px-3 py-2.5 rounded-lg text-sm font-semibold text-blue-900 bg-blue-50/80 flex items-center gap-2"
            >
              <ArrowLeft className="w-4 h-4 text-blue-900" />
              Rudi Nyuma
            </button>
          )}

          <button
            onClick={() => handleNavClick('home')}
            className={`w-full text-left px-3 py-2.5 rounded-lg text-sm font-medium ${
              activeTab === 'home' ? 'bg-blue-50 text-blue-900 font-semibold' : 'text-slate-700 hover:bg-slate-100'
            }`}
          >
            Nyumbani
          </button>
          <button
            onClick={() => handleNavClick('register')}
            className={`w-full text-left px-3 py-2.5 rounded-lg text-sm font-medium flex items-center gap-2 ${
              activeTab === 'register' ? 'bg-blue-50 text-blue-900 font-semibold' : 'text-slate-700 hover:bg-slate-100'
            }`}
          >
            <UserPlus className="w-4 h-4 text-blue-700" />
            Jisajili
          </button>
          <button
            onClick={() => handleNavClick('giving')}
            className={`w-full text-left px-3 py-2.5 rounded-lg text-sm font-medium flex items-center gap-2 ${
              activeTab === 'giving' ? 'bg-blue-50 text-blue-900 font-semibold' : 'text-slate-700 hover:bg-slate-100'
            }`}
          >
            <HeartHandshake className="w-4 h-4 text-amber-600" />
            Toa Sadaka
          </button>
          <button
            onClick={() => handleNavClick('notices')}
            className={`w-full text-left px-3 py-2.5 rounded-lg text-sm font-medium flex items-center gap-2 ${
              activeTab === 'notices' ? 'bg-blue-50 text-blue-900 font-semibold' : 'text-slate-700 hover:bg-slate-100'
            }`}
          >
            <Bell className="w-4 h-4 text-amber-500" />
            Matangazo & Ratiba
          </button>
          <button
            onClick={() => handleNavClick('videos')}
            className={`w-full text-left px-3 py-2.5 rounded-lg text-sm font-medium flex items-center gap-2 ${
              activeTab === 'videos' ? 'bg-blue-50 text-blue-900 font-semibold' : 'text-slate-700 hover:bg-slate-100'
            }`}
          >
            <Video className="w-4 h-4 text-red-600" />
            Video za YouTube
          </button>

          {isAdminLoggedIn && (
            <button
              onClick={() => handleNavClick('admin')}
              className={`w-full text-left px-3 py-2.5 rounded-lg text-sm font-medium flex items-center gap-2 ${
                activeTab === 'admin' ? 'bg-blue-50 text-blue-900 font-semibold' : 'text-slate-700 hover:bg-slate-100'
              }`}
            >
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              Dashibodi ya Uongozi
            </button>
          )}

          <div className="pt-3 border-t border-slate-100 flex gap-2">
            {isAdminLoggedIn || loggedMember ? (
              <button
                onClick={() => {
                  onLogout();
                  setMobileMenuOpen(false);
                }}
                className="w-full text-center px-4 py-2.5 text-xs font-semibold text-red-700 bg-red-50 hover:bg-red-100 rounded-lg transition-colors"
              >
                Toka
              </button>
            ) : (
              <>
                <button
                  onClick={() => {
                    handleNavClick('register');
                    setMobileMenuOpen(false);
                  }}
                  className="flex-1 py-2.5 text-center text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg"
                >
                  Jisajili
                </button>
                <button
                  onClick={() => {
                    onOpenLogin();
                    setMobileMenuOpen(false);
                  }}
                  className="flex-1 py-2.5 flex items-center justify-center gap-1.5 text-xs font-semibold text-white bg-blue-900 rounded-lg hover:bg-blue-800"
                >
                  <LogIn className="w-3.5 h-3.5 text-amber-400" />
                  Ingia
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
};
