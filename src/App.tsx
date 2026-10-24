/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { 
  Member, 
  Donation, 
  YouTubeVideo, 
  SentSMS, 
  ChurchSettings,
  ChurchNotice
} from './types/church';
import { storage } from './utils/storage';
import { Header } from './components/Header';
import { HomeSection } from './components/HomeSection';
import { MemberRegistrationSection } from './components/MemberRegistrationSection';
import { OnlineGivingSection } from './components/OnlineGivingSection';
import { YouTubeVideosSection } from './components/YouTubeVideosSection';
import { NoticeBoardSection } from './components/NoticeBoardSection';
import { AdminDashboard } from './components/AdminDashboard';
import { MemberProfileSection } from './components/MemberProfileSection';
import { AuthModal } from './components/AuthModal';
import { Footer } from './components/Footer';
import { CheckCircle2, RotateCw } from 'lucide-react';

type TabType = 'home' | 'register' | 'giving' | 'videos' | 'notices' | 'admin' | 'profile';

export default function App() {
  const [activeTab, setActiveTab] = useState<TabType>('home');
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState<boolean>(() => storage.isAdminAuthenticated());
  const [loggedMember, setLoggedMember] = useState<Member | null>(() => storage.getLoggedMember());
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  // Core Persistent State
  const [settings, setSettings] = useState<ChurchSettings>(() => storage.getSettings());
  const [members, setMembers] = useState<Member[]>(() => storage.getMembers());
  const [donations, setDonations] = useState<Donation[]>(() => storage.getDonations());
  const [videos, setVideos] = useState<YouTubeVideo[]>(() => storage.getVideos());
  const [notices, setNotices] = useState<ChurchNotice[]>(() => storage.getNotices());
  const [smsLogs, setSmsLogs] = useState<SentSMS[]>(() => storage.getSMSLogs());

  // Refresh State
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [refreshToast, setRefreshToast] = useState<string | null>(null);

  // Synchronize document title with church name
  useEffect(() => {
    document.title = `${settings.churchName} - Mfumo wa Usimamizi wa Washirika`;
  }, [settings.churchName]);

  // Tab navigation integrated with native device/browser history
  const navigateToTab = (tab: TabType, pushToHistory: boolean = true) => {
    if (tab === activeTab) return;
    if (pushToHistory) {
      window.history.pushState({ tab }, '', `#${tab}`);
    }
    setActiveTab(tab);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Device/Hardware Back Button & Browser Navigation Support
  useEffect(() => {
    const validTabs: TabType[] = ['home', 'register', 'giving', 'videos', 'notices', 'admin', 'profile'];
    const currentHash = window.location.hash.replace('#', '') as TabType;
    const initialTab: TabType = validTabs.includes(currentHash) ? currentHash : 'home';
    
    if (initialTab !== 'home') {
      setActiveTab(initialTab);
    }
    window.history.replaceState({ tab: initialTab }, '', `#${initialTab}`);

    const handlePopState = (event: PopStateEvent) => {
      if (event.state && event.state.tab && validTabs.includes(event.state.tab)) {
        setActiveTab(event.state.tab);
      } else {
        const hash = window.location.hash.replace('#', '') as TabType;
        if (validTabs.includes(hash)) {
          setActiveTab(hash);
        } else {
          setActiveTab('home');
        }
      }
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  // Back button handler (Uses native device history if available, else falls back to home)
  const handleBack = () => {
    if (window.history.state && window.history.length > 1) {
      window.history.back();
    } else {
      navigateToTab('home');
    }
  };

  // Refresh button handler: reloads latest state from storage & signals success
  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setSettings(storage.getSettings());
      setMembers(storage.getMembers());
      setDonations(storage.getDonations());
      setVideos(storage.getVideos());
      setNotices(storage.getNotices());
      setSmsLogs(storage.getSMSLogs());
      setIsAdminLoggedIn(storage.isAdminAuthenticated());
      setLoggedMember(storage.getLoggedMember());
      setIsRefreshing(false);
      setRefreshToast('Mfumo umesasishwa kikamilifu! Data na taarifa zote ziko tayari.');
      setTimeout(() => {
        setRefreshToast(null);
      }, 3500);
    }, 450);
  };

  // Handlers for App state updates
  const handleRegisterMember = (newMember: Member) => {
    const updated = [newMember, ...members];
    setMembers(updated);
    storage.saveMembers(updated);
    setLoggedMember(newMember);
    storage.setLoggedMember(newMember);
  };

  const handleDeleteMember = (id: string) => {
    const updated = members.filter(m => m.id !== id);
    setMembers(updated);
    storage.saveMembers(updated);
    if (loggedMember?.id === id) {
      setLoggedMember(null);
      storage.setLoggedMember(null);
    }
  };

  const handleAddDonation = (newDonation: Donation) => {
    const updated = [newDonation, ...donations];
    setDonations(updated);
    storage.saveDonations(updated);
  };

  const handleAddVideo = (newVideo: YouTubeVideo) => {
    const updated = [newVideo, ...videos];
    setVideos(updated);
    storage.saveVideos(updated);
  };

  const handleDeleteVideo = (id: string) => {
    const updated = videos.filter(v => v.id !== id);
    setVideos(updated);
    storage.saveVideos(updated);
  };

  const handleAddNotice = (newNotice: ChurchNotice) => {
    const updated = [newNotice, ...notices];
    setNotices(updated);
    storage.saveNotices(updated);
  };

  const handleDeleteNotice = (id: string) => {
    const updated = notices.filter(n => n.id !== id);
    setNotices(updated);
    storage.saveNotices(updated);
  };

  const handleSendSMS = (newSMS: SentSMS) => {
    const updated = [newSMS, ...smsLogs];
    setSmsLogs(updated);
    storage.saveSMSLogs(updated);
  };

  const handleUpdateSettings = (newSettings: ChurchSettings) => {
    setSettings(newSettings);
    storage.saveSettings(newSettings);
  };

  const handleAdminLoginSuccess = () => {
    setIsAdminLoggedIn(true);
    storage.setAdminAuthenticated(true, true);
    navigateToTab('admin');
  };

  const handleMemberLoginSuccess = (member: Member) => {
    setLoggedMember(member);
    storage.setLoggedMember(member);
    navigateToTab('profile');
  };

  const handleLogout = () => {
    setIsAdminLoggedIn(false);
    setLoggedMember(null);
    storage.setAdminAuthenticated(false);
    storage.setLoggedMember(null);
    navigateToTab('home');
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 font-sans selection:bg-amber-200 selection:text-blue-950">
      
      {/* Top Header with Back & Refresh Buttons */}
      <Header
        settings={settings}
        activeTab={activeTab}
        setActiveTab={(tab) => navigateToTab(tab)}
        isAdminLoggedIn={isAdminLoggedIn}
        loggedMember={loggedMember}
        onOpenLogin={() => setIsAuthModalOpen(true)}
        onLogout={handleLogout}
        onBack={handleBack}
        onRefresh={handleRefresh}
        isRefreshing={isRefreshing}
      />

      {/* Floating Refresh Toast */}
      {refreshToast && (
        <div className="fixed top-24 right-4 z-50 flex items-center gap-2 bg-emerald-900 text-white px-4 py-3 rounded-xl shadow-xl border border-emerald-700 animate-bounce">
          <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
          <span className="text-xs font-semibold">{refreshToast}</span>
        </div>
      )}

      {/* Main Content Area */}
      <main className="flex-1">
        {activeTab === 'home' && (
          <HomeSection
            settings={settings}
            members={members}
            donations={donations}
            videos={videos}
            notices={notices}
            onNavigate={(tab) => navigateToTab(tab)}
            onOpenLogin={() => setIsAuthModalOpen(true)}
            isAdminLoggedIn={isAdminLoggedIn}
          />
        )}

        {activeTab === 'register' && (
          <MemberRegistrationSection
            settings={settings}
            onRegisterMember={handleRegisterMember}
            onGoToGiving={() => navigateToTab('giving')}
          />
        )}

        {activeTab === 'giving' && (
          <OnlineGivingSection
            settings={settings}
            onAddDonation={handleAddDonation}
            recentDonations={donations}
          />
        )}

        {activeTab === 'notices' && (
          <NoticeBoardSection
            notices={notices}
            settings={settings}
            isAdminLoggedIn={isAdminLoggedIn}
            onOpenCreateNotice={() => {
              if (isAdminLoggedIn) {
                navigateToTab('admin');
              } else {
                setIsAuthModalOpen(true);
              }
            }}
            onDeleteNotice={handleDeleteNotice}
          />
        )}

        {activeTab === 'videos' && (
          <YouTubeVideosSection
            videos={videos}
            onAddVideo={handleAddVideo}
            isAdminLoggedIn={isAdminLoggedIn}
            onOpenAdminLogin={() => setIsAuthModalOpen(true)}
          />
        )}

        {activeTab === 'profile' && loggedMember && (
          <MemberProfileSection
            member={loggedMember}
            donations={donations}
            settings={settings}
            onGoToGiving={() => navigateToTab('giving')}
            onLogout={handleLogout}
          />
        )}

        {activeTab === 'admin' && (
          isAdminLoggedIn ? (
            <AdminDashboard
              settings={settings}
              onUpdateSettings={handleUpdateSettings}
              members={members}
              onAddMember={handleRegisterMember}
              onDeleteMember={handleDeleteMember}
              donations={donations}
              videos={videos}
              onAddVideo={handleAddVideo}
              onDeleteVideo={handleDeleteVideo}
              notices={notices}
              onAddNotice={handleAddNotice}
              onDeleteNotice={handleDeleteNotice}
              smsLogs={smsLogs}
              onSendSMS={handleSendSMS}
              onLogout={handleLogout}
            />
          ) : (
            <div className="py-24 text-center max-w-md mx-auto px-4">
              <h2 className="text-xl font-bold text-slate-900">Uthibitisho wa Kuingia Unahitajika</h2>
              <p className="text-xs text-slate-600 mt-2 mb-6">
                Ili kuingia kama msimamizi, tafadhali bonyeza kitufe cha 'Ingia' na uweke neno la siri.
              </p>
              <button
                onClick={() => setIsAuthModalOpen(true)}
                className="px-6 py-2.5 text-xs font-semibold text-white bg-blue-900 hover:bg-blue-800 rounded-lg shadow-sm cursor-pointer"
              >
                Ingia
              </button>
            </div>
          )
        )}
      </main>

      {/* Footer */}
      <Footer
        settings={settings}
        onNavigate={(tab) => navigateToTab(tab)}
        onOpenAdminLogin={() => setIsAuthModalOpen(true)}
        isAdminLoggedIn={isAdminLoggedIn}
      />

      {/* Unified Auth Modal (Jisajili & Ingia) */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onAdminLoginSuccess={handleAdminLoginSuccess}
        onMemberLoginSuccess={handleMemberLoginSuccess}
        onGoToRegister={() => navigateToTab('register')}
        members={members}
      />

    </div>
  );
}
