import React, { useState } from 'react';
import { 
  Member, 
  Donation, 
  YouTubeVideo, 
  SentSMS, 
  ChurchSettings,
  ChurchNotice,
  NoticeCategory,
  calculateAge,
  getAgeCategory,
  extractYouTubeId
} from '../types/church';
import { 
  Users, 
  UserCheck, 
  HeartHandshake, 
  MessageSquare, 
  Send, 
  FileText, 
  Settings, 
  Search, 
  Filter, 
  Plus, 
  Trash2, 
  Mail, 
  Phone, 
  Calendar, 
  CheckCircle2, 
  Printer, 
  ExternalLink, 
  Download, 
  Image as ImageIcon, 
  ShieldCheck, 
  Video, 
  Eye, 
  Sparkles,
  Layers,
  Baby,
  Smile,
  LogOut,
  X,
  Upload,
  Bell,
  Pin
} from 'lucide-react';

interface AdminDashboardProps {
  settings: ChurchSettings;
  onUpdateSettings: (newSettings: ChurchSettings) => void;
  members: Member[];
  onAddMember: (member: Member) => void;
  onDeleteMember: (id: string) => void;
  donations: Donation[];
  videos: YouTubeVideo[];
  onAddVideo: (video: YouTubeVideo) => void;
  onDeleteVideo: (id: string) => void;
  smsLogs: SentSMS[];
  onSendSMS: (sms: SentSMS) => void;
  notices: ChurchNotice[];
  onAddNotice: (notice: ChurchNotice) => void;
  onDeleteNotice: (id: string) => void;
  onLogout: () => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  settings,
  onUpdateSettings,
  members,
  onAddMember,
  onDeleteMember,
  donations,
  videos,
  onAddVideo,
  onDeleteVideo,
  smsLogs,
  onSendSMS,
  notices,
  onAddNotice,
  onDeleteNotice,
  onLogout,
}) => {
  const [activeSubTab, setActiveSubTab] = useState<'demographics' | 'members' | 'notices' | 'sms' | 'videos' | 'monthly_report' | 'settings'>('demographics');

  // Search & Filter for Members Directory
  const [memberSearch, setMemberSearch] = useState('');
  const [filterGender, setFilterGender] = useState<string>('Wote');
  const [filterAgeGroup, setFilterAgeGroup] = useState<string>('Wote');
  const [selectedMemberForSMS, setSelectedMemberForSMS] = useState<Member | null>(null);
  const [selectedMemberDetails, setSelectedMemberDetails] = useState<Member | null>(null);

  // Notice Board Form State
  const [noticeModalOpen, setNoticeModalOpen] = useState(false);
  const [newNoticeTitle, setNewNoticeTitle] = useState('');
  const [newNoticeCategory, setNewNoticeCategory] = useState<NoticeCategory>('Ratiba ya Ibada');
  const [newNoticeContent, setNewNoticeContent] = useState('');
  const [newNoticeDate, setNewNoticeDate] = useState(new Date().toISOString().split('T')[0]);
  const [newNoticeImages, setNewNoticeImages] = useState<string[]>([]);
  const [newNoticePinned, setNewNoticePinned] = useState(false);

  // File Upload Handlers (Direct from device/phone gallery)
  const handleLeaderPhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        setSettingsForm(prev => ({ ...prev, leaderPhoto: reader.result as string }));
      }
    };
    reader.readAsDataURL(file);
  };

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        setSettingsForm(prev => ({ ...prev, logoUrl: reader.result as string }));
      }
    };
    reader.readAsDataURL(file);
  };

  // Upload multiple images for notices without limits from phone gallery
  const handleNoticeImagesUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    Array.from(files).forEach((file) => {
      const reader = new FileReader();
      reader.onload = () => {
        if (typeof reader.result === 'string') {
          setNewNoticeImages((prev) => [...prev, reader.result as string]);
        }
      };
      reader.readAsDataURL(file);
    });
  };

  const handleRemoveNoticeImage = (indexToRemove: number) => {
    setNewNoticeImages((prev) => prev.filter((_, idx) => idx !== indexToRemove));
  };

  const handleCreateNoticeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNoticeTitle.trim() || !newNoticeContent.trim()) return;

    const noticeObj: ChurchNotice = {
      id: 'notice-' + Date.now(),
      title: newNoticeTitle.trim(),
      category: newNoticeCategory,
      content: newNoticeContent.trim(),
      images: newNoticeImages,
      date: newNoticeDate,
      isPinned: newNoticePinned,
      author: settings.leaderName,
    };

    onAddNotice(noticeObj);
    setNoticeModalOpen(false);

    // Reset notice form
    setNewNoticeTitle('');
    setNewNoticeCategory('Ratiba ya Ibada');
    setNewNoticeContent('');
    setNewNoticeImages([]);
    setNewNoticePinned(false);
  };

  // Bulk SMS State
  const [bulkSMSText, setBulkSMSText] = useState('Habari {jina}, tunakukaribisha katika ibada ya Jumapili kuanzia saa 3:00 asubuhi. Karibu tubarikiwe pamoja!');
  const [bulkAudience, setBulkAudience] = useState<'Wote' | 'Wanaume' | 'Wanawake' | 'Vijana' | 'Watoto'>('Wote');
  const [bulkPreviewIndex, setBulkPreviewIndex] = useState(0);
  const [isSendingBulk, setIsSendingBulk] = useState(false);
  const [bulkSendSuccess, setBulkSendSuccess] = useState<string | null>(null);

  // Single Member SMS State
  const [singleSMSMemberId, setSingleSMSMemberId] = useState<string>(members[0]?.id || '');
  const [singleSMSText, setSingleSMSText] = useState('');
  const [singleSendSuccess, setSingleSendSuccess] = useState<string | null>(null);

  // Monthly Report State
  const [reportMonth, setReportMonth] = useState('2026-10'); // YYYY-MM
  const [emailStatus, setEmailStatus] = useState<string | null>(null);
  const [isSendingReportEmail, setIsSendingReportEmail] = useState(false);

  // Settings State Form
  const [settingsForm, setSettingsForm] = useState<ChurchSettings>({ ...settings });
  const [settingsSavedToast, setSettingsSavedToast] = useState(false);

  // New Video Form State
  const [videoModalOpen, setVideoModalOpen] = useState(false);
  const [newVideoTitle, setNewVideoTitle] = useState('');
  const [newVideoUrl, setNewVideoUrl] = useState('');
  const [newVideoSpeaker, setNewVideoSpeaker] = useState(settings.leaderName);
  const [newVideoCategory, setNewVideoCategory] = useState<YouTubeVideo['category']>('Mahubiri');

  // DEMOGRAPHIC COMPUTATIONS (Required by user prompt!)
  const totalMembers = members.length;
  const menCount = members.filter(m => m.gender === 'Mwanaume').length;
  const womenCount = members.filter(m => m.gender === 'Mwanamke').length;
  
  const childrenCount = members.filter(m => calculateAge(m.dob) < 13).length; // Watoto (<13)
  const youthCount = members.filter(m => {
    const age = calculateAge(m.dob);
    return age >= 13 && age <= 35;
  }).length; // Vijana (13 - 35)
  const adultsCount = members.filter(m => calculateAge(m.dob) > 35).length; // Watu Wazima (>35)

  const menPct = totalMembers > 0 ? Math.round((menCount / totalMembers) * 100) : 0;
  const womenPct = totalMembers > 0 ? Math.round((womenCount / totalMembers) * 100) : 0;
  const childrenPct = totalMembers > 0 ? Math.round((childrenCount / totalMembers) * 100) : 0;
  const youthPct = totalMembers > 0 ? Math.round((youthCount / totalMembers) * 100) : 0;
  const adultsPct = totalMembers > 0 ? Math.round((adultsCount / totalMembers) * 100) : 0;

  // Financial Stats
  const totalDonationsAmount = donations.reduce((sum, d) => sum + d.amount, 0);

  // Filtered members list
  const filteredMembers = members.filter(m => {
    const matchesSearch = 
      m.fullName.toLowerCase().includes(memberSearch.toLowerCase()) ||
      m.phone.includes(memberSearch) ||
      m.residence.toLowerCase().includes(memberSearch.toLowerCase()) ||
      m.department.toLowerCase().includes(memberSearch.toLowerCase());
    
    const matchesGender = filterGender === 'Wote' || m.gender === filterGender;
    
    const age = calculateAge(m.dob);
    const category = getAgeCategory(age);
    const matchesAge = 
      filterAgeGroup === 'Wote' ||
      (filterAgeGroup === 'Watoto' && category === 'Mtoto') ||
      (filterAgeGroup === 'Vijana' && category === 'Kijana') ||
      (filterAgeGroup === 'Watu Wazima' && category === 'Mtu Mzima');

    return matchesSearch && matchesGender && matchesAge;
  });

  // Audience list for Bulk SMS
  const bulkRecipients = members.filter(m => {
    if (bulkAudience === 'Wote') return true;
    if (bulkAudience === 'Wanaume') return m.gender === 'Mwanaume';
    if (bulkAudience === 'Wanawake') return m.gender === 'Mwanamke';
    if (bulkAudience === 'Vijana') return calculateAge(m.dob) >= 13 && calculateAge(m.dob) <= 35;
    if (bulkAudience === 'Watoto') return calculateAge(m.dob) < 13;
    return true;
  });

  const currentPreviewRecipient = bulkRecipients[bulkPreviewIndex % (bulkRecipients.length || 1)] || members[0];
  const renderedBulkPreview = currentPreviewRecipient 
    ? bulkSMSText.replace(/\{jina\}/gi, currentPreviewRecipient.fullName).replace(/\[jina\]/gi, currentPreviewRecipient.fullName)
    : bulkSMSText;

  // Handle Bulk SMS Send
  const handleSendBulkSMS = (e: React.FormEvent) => {
    e.preventDefault();
    if (!bulkSMSText.trim() || bulkRecipients.length === 0) return;

    setIsSendingBulk(true);
    setTimeout(() => {
      const newSMS: SentSMS = {
        id: 'sms-' + Date.now(),
        recipientType: bulkAudience === 'Wote' ? 'Washirika Wote' : 'Kundi Maalum',
        recipientCount: bulkRecipients.length,
        recipientNames: bulkRecipients.map(r => r.fullName),
        messageText: bulkSMSText,
        sentAt: new Date().toISOString(),
        status: 'Imefanikiwa',
      };

      onSendSMS(newSMS);
      setIsSendingBulk(false);
      setBulkSendSuccess(`SMS ${bulkRecipients.length} zimetumwa kikamilifu kwa washirika! Kila mmoja ametajwa jina lake.`);
      setTimeout(() => setBulkSendSuccess(null), 5000);
    }, 1200);
  };

  // Handle Single SMS Send
  const handleSendSingleSMS = (e: React.FormEvent) => {
    e.preventDefault();
    const recipient = members.find(m => m.id === singleSMSMemberId);
    if (!recipient || !singleSMSText.trim()) return;

    const personalized = singleSMSText.replace(/\{jina\}/gi, recipient.fullName).replace(/\[jina\]/gi, recipient.fullName);

    const newSMS: SentSMS = {
      id: 'sms-' + Date.now(),
      recipientType: 'Mshirika Mmoja',
      recipientCount: 1,
      recipientNames: [recipient.fullName],
      messageText: personalized,
      sentAt: new Date().toISOString(),
      status: 'Imefanikiwa',
    };

    onSendSMS(newSMS);
    setSingleSendSuccess(`SMS imetumwa salama kwa ${recipient.fullName} (${recipient.phone})`);
    setTimeout(() => setSingleSendSuccess(null), 4000);
  };

  // Preset single templates
  const applySingleTemplate = (type: 'birthday' | 'sunday' | 'tithes' | 'prayer') => {
    const recipient = members.find(m => m.id === singleSMSMemberId);
    const name = recipient ? recipient.fullName : '{jina}';
    if (type === 'birthday') {
      setSingleSMSText(`Heri ya Siku ya Kuzaliwa Ndugu ${name}! Uongozi na kanisa zima tunakutakia baraka tele, afya njema na maisha marefu yenye kumpendeza Mungu.`);
    } else if (type === 'sunday') {
      setSingleSMSText(`Habari Ndugu ${name}, tunakukumbusha ibada yetu ya Jumapili kuanzia saa tatu asubuhi. Uwepo wako ni baraka kubwa kanisani.`);
    } else if (type === 'tithes') {
      setSingleSMSText(`Mpendwa ${name}, tunakushukuru sana kwa uaminifu wako katika kutoa fungu la kumi na sadaka. Mungu azidi kufungua madirisha ya mbinguni kwako.`);
    } else if (type === 'prayer') {
      setSingleSMSText(`Shalom ${name}, timu ya maombezi inakukumbuka kwenye maombi wiki hii. Ikiwa una hitaji maalum, jisikie huru kuwasiliana na ofisi ya mchungaji.`);
    }
  };

  // Monthly Report Calculations
  const reportMembers = members.filter(m => m.registeredAt.startsWith(reportMonth));
  const reportDonations = donations.filter(d => d.date.startsWith(reportMonth));
  const reportDonationsTotal = reportDonations.reduce((sum, d) => sum + d.amount, 0);

  // Send Monthly Report to Pastor Email
  const handleSendMonthlyReportEmail = () => {
    setIsSendingReportEmail(true);

    const monthFormatted = new Date(reportMonth + '-01').toLocaleDateString('sw-TZ', { month: 'long', year: 'numeric' });
    const emailSubject = encodeURIComponent(`Ripoti Rasmi ya Mwezi (${monthFormatted}) - ${settings.churchName}`);
    
    const emailBody = encodeURIComponent(
`SHALOM MCHUNGAJI KIONGOZI (${settings.leaderName}),

Hii ni Ripoti Rasmi ya Kila Mwezi ya Kanisa kwa Mwezi wa: ${monthFormatted.toUpperCase()}
Kanisa: ${settings.churchName}
Barua Pepe ya Kiongozi: ${settings.leaderEmail}

1. TAKWIMU ZA WASHIRIKA:
- Jumla ya Washirika Waliosajiliwa: ${totalMembers}
- Idadi ya Wanaume: ${menCount} (${menPct}%)
- Idadi ya Wanawake: ${womenCount} (${womenPct}%)
- Idadi ya Vijana (Miaka 13 - 35): ${youthCount} (${youthPct}%)
- Idadi ya Watoto (Chini ya Miaka 13): ${childrenCount} (${childrenPct}%)
- Idadi ya Watu Wazima/Wazee (>35): ${adultsCount} (${adultsPct}%)
- Washirika Wapya Waliojiunga Mwezi Huu: ${reportMembers.length}

2. MAKUSANYO YA FEDHA NA SADAKA (${settings.currency}):
- Jumla ya Sadaka na Michango Mwezi Huu: ${reportDonationsTotal.toLocaleString()} ${settings.currency}
- Idadi ya Miamala: ${reportDonations.length}

3. HUDUMA YA MAWASILIANO (SMS):
- Jumla ya SMS Zilizotumwa: ${smsLogs.length}

Ripoti hii imetolewa kiotomatiki na Mfumo wa Usimamizi wa Washirika wa Kanisa.
Mungu Akubariki Sana Katika Utumishi Wako!`
    );

    // Open mailto link
    const mailtoUrl = `mailto:${settings.leaderEmail}?subject=${emailSubject}&body=${emailBody}`;
    window.location.href = mailtoUrl;

    setTimeout(() => {
      setIsSendingReportEmail(false);
      setEmailStatus(`Ripoti ya mwezi ${monthFormatted} imetayarishwa na kutumwa kwa barua pepe ya kiongozi: ${settings.leaderEmail}!`);
      setTimeout(() => setEmailStatus(null), 6000);
    }, 1000);
  };

  // Save Settings
  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateSettings(settingsForm);
    setSettingsSavedToast(true);
    setTimeout(() => setSettingsSavedToast(false), 4000);
  };

  // Export CSV
  const handleExportCSV = () => {
    const headers = ['ID', 'Jina Kamili', 'Jinsia', 'Tarehe ya Kuzaliwa', 'Umri', 'Kundi', 'Simu', 'Barua Pepe', 'Makazi', 'Idara', 'Tarehe ya Usajili'];
    const rows = members.map(m => {
      const age = calculateAge(m.dob);
      return [
        m.id,
        `"${m.fullName}"`,
        m.gender,
        m.dob,
        age,
        getAgeCategory(age),
        `"${m.phone}"`,
        `"${m.email || ''}"`,
        `"${m.residence}"`,
        `"${m.department}"`,
        m.registeredAt.split('T')[0]
      ];
    });

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Orodha_ya_Washirika_${settings.churchName.replace(/\s+/g, '_')}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Add video
  const handleAddVideoSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newVideoTitle.trim() || !newVideoUrl.trim()) return;

    const embedId = extractYouTubeId(newVideoUrl);
    const videoObj: YouTubeVideo = {
      id: 'vid-' + Date.now(),
      title: newVideoTitle.trim(),
      speaker: newVideoSpeaker.trim() || settings.leaderName,
      youtubeUrl: newVideoUrl.trim(),
      embedId: embedId || 'ScMzIvxBSi4',
      date: new Date().toISOString().split('T')[0],
      duration: '45:00',
      category: newVideoCategory,
    };

    onAddVideo(videoObj);
    setVideoModalOpen(false);
    setNewVideoTitle('');
    setNewVideoUrl('');
  };

  return (
    <div className="py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-8 animate-fade-in">
      
      {/* Top Banner / Leader Welcome */}
      <div className="bg-gradient-to-r from-blue-950 via-blue-900 to-indigo-950 text-white rounded-2xl p-6 sm:p-8 shadow-xl border border-blue-900/50 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-4 sm:gap-6">
          <img
            src={settings.leaderPhoto}
            alt={settings.leaderName}
            referrerPolicy="no-referrer"
            className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl object-cover border-2 border-amber-400/80 shadow-md bg-slate-800 shrink-0"
            onError={(e) => {
              (e.target as HTMLElement).style.display = 'none';
            }}
          />
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs uppercase tracking-wider text-amber-300 font-semibold bg-amber-400/10 px-2.5 py-0.5 rounded border border-amber-400/20">
                Dashibodi ya Msimamizi
              </span>
              <span className="text-xs text-blue-200">
                Ulinzi: Imethibitishwa
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white mt-1">
              {settings.leaderName}
            </h1>
            <p className="text-xs sm:text-sm text-blue-200">
              {settings.leaderTitle} · {settings.churchName}
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2.5 shrink-0">
          <button
            onClick={() => setActiveSubTab('monthly_report')}
            className="flex items-center gap-2 px-3.5 py-2 text-xs font-semibold text-slate-900 bg-amber-400 hover:bg-amber-300 rounded-lg transition-colors cursor-pointer shadow-sm"
          >
            <Mail className="w-4 h-4" />
            Tuma Ripoti ya Mwezi
          </button>
          <button
            onClick={onLogout}
            className="flex items-center gap-2 px-3.5 py-2 text-xs font-medium text-white bg-white/10 hover:bg-white/20 rounded-lg transition-colors cursor-pointer"
          >
            <LogOut className="w-4 h-4 text-red-300" />
            Toka Mfumo
          </button>
        </div>
      </div>

      {/* Admin Navigation Tabs */}
      <div className="flex items-center gap-1.5 p-1.5 bg-white rounded-xl border border-slate-200 shadow-sm overflow-x-auto scrollbar-none">
        <button
          onClick={() => setActiveSubTab('demographics')}
          className={`flex items-center gap-2 px-4 py-2.5 text-xs font-semibold rounded-lg transition-all whitespace-nowrap cursor-pointer ${
            activeSubTab === 'demographics'
              ? 'bg-blue-900 text-white shadow-sm'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
          }`}
        >
          <Users className="w-4 h-4" />
          Takwimu & Idadi ya Waumini
        </button>

        <button
          onClick={() => setActiveSubTab('members')}
          className={`flex items-center gap-2 px-4 py-2.5 text-xs font-semibold rounded-lg transition-all whitespace-nowrap cursor-pointer ${
            activeSubTab === 'members'
              ? 'bg-blue-900 text-white shadow-sm'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
          }`}
        >
          <UserCheck className="w-4 h-4" />
          Orodha ya Washirika ({members.length})
        </button>

        <button
          onClick={() => setActiveSubTab('notices')}
          className={`flex items-center gap-2 px-4 py-2.5 text-xs font-semibold rounded-lg transition-all whitespace-nowrap cursor-pointer ${
            activeSubTab === 'notices'
              ? 'bg-blue-900 text-white shadow-sm'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
          }`}
        >
          <Bell className="w-4 h-4 text-amber-500" />
          Ubao wa Matangazo & Ratiba ({notices.length})
        </button>

        <button
          onClick={() => setActiveSubTab('sms')}
          className={`flex items-center gap-2 px-4 py-2.5 text-xs font-semibold rounded-lg transition-all whitespace-nowrap cursor-pointer ${
            activeSubTab === 'sms'
              ? 'bg-blue-900 text-white shadow-sm'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
          }`}
        >
          <MessageSquare className="w-4 h-4 text-amber-500" />
          Kutuma SMS (Mmoja & Wote)
        </button>

        <button
          onClick={() => setActiveSubTab('videos')}
          className={`flex items-center gap-2 px-4 py-2.5 text-xs font-semibold rounded-lg transition-all whitespace-nowrap cursor-pointer ${
            activeSubTab === 'videos'
              ? 'bg-blue-900 text-white shadow-sm'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
          }`}
        >
          <Video className="w-4 h-4 text-red-500" />
          Usimamizi wa YouTube ({videos.length})
        </button>

        <button
          onClick={() => setActiveSubTab('monthly_report')}
          className={`flex items-center gap-2 px-4 py-2.5 text-xs font-semibold rounded-lg transition-all whitespace-nowrap cursor-pointer ${
            activeSubTab === 'monthly_report'
              ? 'bg-blue-900 text-white shadow-sm'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
          }`}
        >
          <FileText className="w-4 h-4" />
          Ripoti ya Kila Mwezi kwa Email
        </button>

        <button
          onClick={() => setActiveSubTab('settings')}
          className={`flex items-center gap-2 px-4 py-2.5 text-xs font-semibold rounded-lg transition-all whitespace-nowrap cursor-pointer ${
            activeSubTab === 'settings'
              ? 'bg-blue-900 text-white shadow-sm'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
          }`}
        >
          <Settings className="w-4 h-4" />
          Mipangilio ya Mfumo
        </button>
      </div>

      {/* ======================================================== */}
      {/* SUB-TAB 1: DEMOGRAPHICS (Takwimu za Jinsia na Umri)       */}
      {/* ======================================================== */}
      {activeSubTab === 'demographics' && (
        <div className="space-y-6 animate-fade-in">
          
          {/* Main Key Counters */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            
            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
              <span className="text-[11px] font-semibold text-slate-500 uppercase block">Jumla ya Washirika</span>
              <span className="text-3xl font-extrabold text-blue-950 font-mono mt-1 block">
                {totalMembers}
              </span>
              <span className="text-[11px] text-slate-400 mt-1 block">Waliosajiliwa kanisani</span>
            </div>

            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
              <span className="text-[11px] font-semibold text-blue-700 uppercase block">Wanaume</span>
              <span className="text-3xl font-extrabold text-blue-900 font-mono mt-1 block">
                {menCount}
              </span>
              <span className="text-[11px] text-slate-500 mt-1 block font-medium">{menPct}% ya waumini wote</span>
            </div>

            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
              <span className="text-[11px] font-semibold text-pink-700 uppercase block">Wanawake</span>
              <span className="text-3xl font-extrabold text-pink-900 font-mono mt-1 block">
                {womenCount}
              </span>
              <span className="text-[11px] text-slate-500 mt-1 block font-medium">{womenPct}% ya waumini wote</span>
            </div>

            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
              <span className="text-[11px] font-semibold text-amber-700 uppercase block">Vijana (13 - 35)</span>
              <span className="text-3xl font-extrabold text-amber-600 font-mono mt-1 block">
                {youthCount}
              </span>
              <span className="text-[11px] text-slate-500 mt-1 block font-medium">{youthPct}% ya waumini wote</span>
            </div>

            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
              <span className="text-[11px] font-semibold text-emerald-700 uppercase block">Watoto (&lt;13)</span>
              <span className="text-3xl font-extrabold text-emerald-700 font-mono mt-1 block">
                {childrenCount}
              </span>
              <span className="text-[11px] text-slate-500 mt-1 block font-medium">{childrenPct}% ya Sunday School</span>
            </div>

            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
              <span className="text-[11px] font-semibold text-indigo-700 uppercase block">Watu Wazima (&gt;35)</span>
              <span className="text-3xl font-extrabold text-indigo-900 font-mono mt-1 block">
                {adultsCount}
              </span>
              <span className="text-[11px] text-slate-500 mt-1 block font-medium">{adultsPct}% wazee na wazazi</span>
            </div>

          </div>

          {/* Demographic Visual Breakdown Bars */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            
            {/* Gender Balance Card */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
              <h3 className="text-sm font-bold text-slate-900 mb-4 flex items-center justify-between">
                <span>Mlingano wa Jinsia (Wanaume na Wanawake)</span>
                <span className="text-xs text-slate-500 font-normal">Kutoka tarehe za kuzaliwa na usajili</span>
              </h3>

              {/* Progress bar */}
              <div className="h-4 bg-slate-100 rounded-full overflow-hidden flex mb-4">
                <div 
                  style={{ width: `${menPct}%` }} 
                  className="bg-blue-800 transition-all duration-500" 
                  title={`Wanaume: ${menPct}%`}
                />
                <div 
                  style={{ width: `${womenPct}%` }} 
                  className="bg-pink-600 transition-all duration-500" 
                  title={`Wanawake: ${womenPct}%`}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="p-3 bg-blue-50/50 rounded-lg border border-blue-100">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-blue-950">Wanaume</span>
                    <span className="text-xs font-mono font-bold text-blue-800">{menCount}</span>
                  </div>
                  <span className="text-xs text-blue-700 font-mono">{menPct}%</span>
                </div>

                <div className="p-3 bg-pink-50/50 rounded-lg border border-pink-100">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-pink-950">Wanawake</span>
                    <span className="text-xs font-mono font-bold text-pink-800">{womenCount}</span>
                  </div>
                  <span className="text-xs text-pink-700 font-mono">{womenPct}%</span>
                </div>
              </div>
            </div>

            {/* Age Group Distribution Card */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
              <h3 className="text-sm font-bold text-slate-900 mb-4 flex items-center justify-between">
                <span>Mchanganuo wa Makundi ya Umri</span>
                <span className="text-xs text-slate-500 font-normal">Kulingana na Tarehe ya Kuzaliwa</span>
              </h3>

              <div className="space-y-3">
                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="font-semibold text-slate-700">Watoto (Chini ya miaka 13 - Sunday School)</span>
                    <span className="font-mono text-slate-900">{childrenCount} ({childrenPct}%)</span>
                  </div>
                  <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                    <div style={{ width: `${childrenPct}%` }} className="h-full bg-emerald-600" />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="font-semibold text-slate-700">Vijana (Miaka 13 hadi 35 - Umoja wa Vijana)</span>
                    <span className="font-mono text-slate-900">{youthCount} ({youthPct}%)</span>
                  </div>
                  <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                    <div style={{ width: `${youthPct}%` }} className="h-full bg-amber-600" />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="font-semibold text-slate-700">Watu Wazima na Wazee (Zaidi ya miaka 35)</span>
                    <span className="font-mono text-slate-900">{adultsCount} ({adultsPct}%)</span>
                  </div>
                  <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                    <div style={{ width: `${adultsPct}%` }} className="h-full bg-indigo-700" />
                  </div>
                </div>
              </div>
            </div>

          </div>

          {/* Quick Stats Grid: Finance & Communications */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <div className="bg-slate-900 text-white p-6 rounded-2xl border border-slate-800 shadow-sm">
              <span className="text-xs text-amber-400 font-semibold uppercase block">Jumla ya Sadaka na Fungu la Kumi</span>
              <span className="text-2xl sm:text-3xl font-extrabold text-white font-mono mt-2 block">
                {totalDonationsAmount.toLocaleString()} {settings.currency}
              </span>
              <span className="text-xs text-slate-400 mt-1 block">
                Kutoka kwa miamala {donations.length} ya mtandao
              </span>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
              <span className="text-xs text-slate-500 font-semibold uppercase block">Kumbukumbu za SMS Zilizotumwa</span>
              <span className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-mono mt-2 block">
                {smsLogs.length}
              </span>
              <span className="text-xs text-slate-400 mt-1 block">
                Mjumbe uliotangazwa kwa waumini
              </span>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
              <span className="text-xs text-slate-500 font-semibold uppercase block">Video za YouTube Zilizochapishwa</span>
              <span className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-mono mt-2 block">
                {videos.length}
              </span>
              <span className="text-xs text-slate-400 mt-1 block">
                Mahubiri na sifa za kwaya mtandaoni
              </span>
            </div>
          </div>

        </div>
      )}

      {/* ======================================================== */}
      {/* SUB-TAB 2: MEMBERS DIRECTORY (Orodha ya Washirika)       */}
      {/* ======================================================== */}
      {activeSubTab === 'members' && (
        <div className="space-y-6 animate-fade-in">
          
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
            
            {/* Filter controls bar */}
            <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-6">
              
              <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
                {/* Search input */}
                <div className="relative w-full sm:w-64">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                    <Search className="w-4 h-4" />
                  </div>
                  <input
                    type="text"
                    value={memberSearch}
                    onChange={(e) => setMemberSearch(e.target.value)}
                    placeholder="Tafuta jina, simu, mtaa..."
                    className="w-full pl-9 pr-3.5 py-2 text-xs rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-900"
                  />
                </div>

                {/* Filter Gender */}
                <select
                  value={filterGender}
                  onChange={(e) => setFilterGender(e.target.value)}
                  className="px-3 py-2 text-xs rounded-lg border border-slate-300 bg-white focus:outline-none focus:ring-2 focus:ring-blue-900"
                >
                  <option value="Wote">Jinsia: Zote</option>
                  <option value="Mwanaume">Wanaume Tu</option>
                  <option value="Mwanamke">Wanawake Tu</option>
                </select>

                {/* Filter Age Group */}
                <select
                  value={filterAgeGroup}
                  onChange={(e) => setFilterAgeGroup(e.target.value)}
                  className="px-3 py-2 text-xs rounded-lg border border-slate-300 bg-white focus:outline-none focus:ring-2 focus:ring-blue-900"
                >
                  <option value="Wote">Umri: Wote</option>
                  <option value="Watoto">Watoto (&lt;13)</option>
                  <option value="Vijana">Vijana (13 - 35)</option>
                  <option value="Watu Wazima">Watu Wazima (&gt;35)</option>
                </select>
              </div>

              {/* Action buttons */}
              <div className="flex items-center gap-2.5 w-full md:w-auto justify-end">
                <button
                  onClick={handleExportCSV}
                  className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors cursor-pointer"
                >
                  <Download className="w-4 h-4" />
                  Pakua CSV
                </button>
              </div>

            </div>

            {/* Table */}
            <div className="overflow-x-auto border border-slate-200 rounded-xl">
              <table className="w-full text-left text-xs text-slate-700">
                <thead className="bg-slate-50 text-[11px] text-slate-500 uppercase tracking-wider border-b border-slate-200">
                  <tr>
                    <th className="py-3 px-4">Jina Kamili</th>
                    <th className="py-3 px-4">Jinsia</th>
                    <th className="py-3 px-4">Umri / Kundi</th>
                    <th className="py-3 px-4">Namba ya Simu</th>
                    <th className="py-3 px-4">Mtaa / Makazi</th>
                    <th className="py-3 px-4">Idara / Huduma</th>
                    <th className="py-3 px-4 text-right">Vitendo</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {filteredMembers.map((member) => {
                    const age = calculateAge(member.dob);
                    const category = getAgeCategory(age);
                    return (
                      <tr key={member.id} className="hover:bg-slate-50/80 transition-colors">
                        <td className="py-3 px-4 font-semibold text-slate-900 whitespace-nowrap">
                          {member.fullName}
                        </td>
                        <td className="py-3 px-4 whitespace-nowrap">
                          <span className={member.gender === 'Mwanaume' ? 'text-blue-900 font-medium' : 'text-pink-900 font-medium'}>
                            {member.gender}
                          </span>
                        </td>
                        <td className="py-3 px-4 whitespace-nowrap">
                          <span className="font-mono">{age} miaka</span>
                          <span className="text-slate-400 mx-1">·</span>
                          <span className="font-medium text-slate-600">{category}</span>
                        </td>
                        <td className="py-3 px-4 font-mono whitespace-nowrap">
                          {member.phone}
                        </td>
                        <td className="py-3 px-4 whitespace-nowrap text-slate-600">
                          {member.residence}
                        </td>
                        <td className="py-3 px-4 whitespace-nowrap">
                          <span className="bg-slate-100 text-slate-800 px-2 py-0.5 rounded text-[11px]">
                            {member.department}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-right whitespace-nowrap space-x-2">
                          <button
                            onClick={() => {
                              setSelectedMemberForSMS(member);
                              setSingleSMSMemberId(member.id);
                              applySingleTemplate('sunday');
                              setActiveSubTab('sms');
                            }}
                            className="text-blue-900 hover:text-blue-700 font-semibold p-1"
                            title="Tuma SMS kwa mshirika huyu"
                          >
                            <MessageSquare className="w-4 h-4 inline" />
                          </button>
                          <button
                            onClick={() => setSelectedMemberDetails(member)}
                            className="text-slate-600 hover:text-slate-900 font-semibold p-1"
                            title="Tazama maelezo kamili"
                          >
                            <Eye className="w-4 h-4 inline" />
                          </button>
                          <button
                            onClick={() => {
                              if (confirm(`Una uhakika unataka kumfuta mshirika ${member.fullName}?`)) {
                                onDeleteMember(member.id);
                              }
                            }}
                            className="text-red-600 hover:text-red-800 p-1"
                            title="Futa mshirika"
                          >
                            <Trash2 className="w-4 h-4 inline" />
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>

              {filteredMembers.length === 0 && (
                <div className="text-center py-8 text-xs text-slate-500">
                  Hakuna washirika waliopatikana kwa kigezo hiki.
                </div>
              )}
            </div>

          </div>

        </div>
      )}

      {/* ======================================================== */}
      {/* SUB-TAB: UBAO WA MATANGAZO NA RATIBA ZA IBADA             */}
      {/* ======================================================== */}
      {activeSubTab === 'notices' && (
        <div className="space-y-6 animate-fade-in">
          
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
            <div>
              <h3 className="text-base font-bold text-slate-900">Ubao wa Matangazo na Ratiba za Ibada</h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Andika taarifa yoyote, ratiba za ibada au matangazo ya kanisa ukiwa na uwezo wa kuweka picha kutoka galari ya simu bila kikomo (hiari).
              </p>
            </div>
            <button
              onClick={() => setNoticeModalOpen(true)}
              className="flex items-center gap-2 px-4 py-2.5 text-xs font-semibold text-white bg-blue-900 hover:bg-blue-800 rounded-xl transition-all shadow-sm cursor-pointer shrink-0"
            >
              <Plus className="w-4 h-4 text-amber-400" />
              Andika Tangazo / Ratiba Mpya
            </button>
          </div>

          <div className="space-y-4">
            {notices.map((notice) => (
              <div 
                key={notice.id} 
                className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:border-slate-300 transition-all space-y-4"
              >
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-3">
                  <div className="flex items-center gap-2">
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
                  <div className="flex items-center gap-4 text-xs text-slate-500">
                    <span>{notice.date}</span>
                    <button
                      onClick={() => {
                        if (confirm(`Una uhakika unataka kufuta tangazo: "${notice.title}"?`)) {
                          onDeleteNotice(notice.id);
                        }
                      }}
                      className="text-red-600 hover:text-red-800 font-medium cursor-pointer"
                    >
                      Futa
                    </button>
                  </div>
                </div>

                <div>
                  <h4 className="text-lg font-bold text-slate-900">{notice.title}</h4>
                  <p className="text-xs text-slate-700 leading-relaxed mt-2 whitespace-pre-line">
                    {notice.content}
                  </p>
                </div>

                {notice.images && notice.images.length > 0 && (
                  <div className="pt-2">
                    <span className="text-[11px] font-semibold text-slate-500 block mb-2">
                      Picha zilizoambatanishwa ({notice.images.length}):
                    </span>
                    <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-2">
                      {notice.images.map((img, i) => (
                        <div key={i} className="aspect-square rounded-lg overflow-hidden bg-slate-100 border border-slate-200">
                          <img 
                            src={img} 
                            alt="Attached" 
                            className="w-full h-full object-cover" 
                            referrerPolicy="no-referrer"
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}

            {notices.length === 0 && (
              <div className="text-center py-12 bg-white rounded-2xl border border-slate-200 text-xs text-slate-500">
                <Bell className="w-10 h-10 mx-auto text-slate-300 mb-2" />
                <p>Hakuna matangazo kwa sasa. Bonyeza kitufe cha 'Andika Tangazo / Ratiba Mpya' kuanza.</p>
              </div>
            )}
          </div>

        </div>
      )}

      {/* ======================================================== */}
      {/* SUB-TAB 3: SMS MESSAGING ENGINE (Kutuma SMS)             */}
      {/* ======================================================== */}
      {activeSubTab === 'sms' && (
        <div className="space-y-8 animate-fade-in">
          
          {bulkSendSuccess && (
            <div className="flex items-center gap-3 p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-xs font-medium">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
              <span>{bulkSendSuccess}</span>
            </div>
          )}

          {singleSendSuccess && (
            <div className="flex items-center gap-3 p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-xs font-medium">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
              <span>{singleSendSuccess}</span>
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            
            {/* 1. BULK SMS SECTION (SMS Moja kwenda kwa Washirika Wote kwa mara moja) */}
            <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <span className="text-[11px] font-bold uppercase text-amber-700 bg-amber-50 px-2.5 py-0.5 rounded">
                      SMS ya Pamoja (Bulk SMS)
                    </span>
                    <h3 className="text-base font-bold text-slate-900 mt-1">
                      SMS Moja kwa Washirika Wote
                    </h3>
                  </div>
                  <Users className="w-5 h-5 text-blue-900" />
                </div>

                <p className="text-xs text-slate-600 mb-4 leading-relaxed">
                  Mfumo utamtaja kila mshirika jina lake kiotomatiki ukitumia neno <code className="bg-slate-100 text-blue-900 px-1.5 py-0.5 rounded font-mono font-bold">{"{jina}"}</code>. Kila mshirika atapokea ujumbe unaomtaja yeye binafsi!
                </p>

                <form onSubmit={handleSendBulkSMS} className="space-y-4">
                  
                  {/* Audience target */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                      Chagua Walengwa wa SMS:
                    </label>
                    <div className="grid grid-cols-3 sm:grid-cols-5 gap-1.5">
                      {(['Wote', 'Wanaume', 'Wanawake', 'Vijana', 'Watoto'] as const).map(aud => (
                        <button
                          key={aud}
                          type="button"
                          onClick={() => {
                            setBulkAudience(aud);
                            setBulkPreviewIndex(0);
                          }}
                          className={`py-1.5 px-2 text-xs font-medium rounded-lg border text-center transition-colors cursor-pointer ${
                            bulkAudience === aud
                              ? 'bg-blue-900 text-white border-blue-900'
                              : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                          }`}
                        >
                          {aud}
                        </button>
                      ))}
                    </div>
                    <span className="text-[11px] text-slate-500 mt-1 block">
                      Idadi ya wapokeaji: <strong className="text-blue-900">{bulkRecipients.length} washirika</strong>
                    </span>
                  </div>

                  {/* Message textarea */}
                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <label className="text-xs font-semibold text-slate-700">
                        Ujumbe wa SMS (Tumia {"{jina}"} kwa jina la mshirika):
                      </label>
                      <span className="text-[11px] text-slate-400 font-mono">
                        {bulkSMSText.length} herufi
                      </span>
                    </div>
                    <textarea
                      rows={4}
                      required
                      value={bulkSMSText}
                      onChange={(e) => setBulkSMSText(e.target.value)}
                      className="w-full p-3 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-900"
                    />
                  </div>

                  {/* Ready template buttons */}
                  <div>
                    <span className="text-[11px] text-slate-500 block mb-1.5">Sampuli za Ujumbe wa Haraka:</span>
                    <div className="flex flex-wrap gap-2">
                      <button
                        type="button"
                        onClick={() => setBulkSMSText('Habari {jina}, tunakukumbusha ibada yetu ya Jumapili kuanzia saa 3:00 asubuhi. Karibu na uje na mgeni wako. Mungu akubariki sana!')}
                        className="text-[11px] bg-slate-100 hover:bg-slate-200 text-slate-700 px-2.5 py-1 rounded transition-colors"
                      >
                        Ibada ya Jumapili
                      </button>
                      <button
                        type="button"
                        onClick={() => setBulkSMSText('Shalom {jina}, uongozi wa kanisa unakualika kwenye mkutano mkuu wa robo mwaka Jumamosi hii saa 8:00 mchana. Ushiriki wako ni muhimu.')}
                        className="text-[11px] bg-slate-100 hover:bg-slate-200 text-slate-700 px-2.5 py-1 rounded transition-colors"
                      >
                        Mkutano Mkuu
                      </button>
                      <button
                        type="button"
                        onClick={() => setBulkSMSText('Mpendwa {jina}, tunakushukuru kwa uaminifu wako katika ujenzi wa kanisa letu. Tumeanza hatua mpya, baraka za Bwana ziwe nawe.')}
                        className="text-[11px] bg-slate-100 hover:bg-slate-200 text-slate-700 px-2.5 py-1 rounded transition-colors"
                      >
                        Ujenzi na Harambee
                      </button>
                    </div>
                  </div>

                  {/* Live recipient preview */}
                  {bulkRecipients.length === 0 ? (
                    <div className="p-3.5 bg-slate-900 text-white rounded-xl text-xs space-y-1">
                      <span className="text-amber-400 font-semibold block">Hakuna washirika kwa sasa</span>
                      <p className="text-slate-300 text-[11px]">
                        Waumini wakishajisajili kupitia fomu ya 'Jisajili', watatokea hapa na kila mmoja atatajwa jina lake kiotomatiki kwa kutumia {"{jina}"}.
                      </p>
                    </div>
                  ) : (
                    <div className="p-3.5 bg-slate-900 text-white rounded-xl text-xs space-y-1.5">
                      <div className="flex items-center justify-between text-[11px] text-slate-400">
                        <span>Muonekano wa Ujumbe kwa Kila Mtu:</span>
                        <div className="space-x-1.5">
                          <button
                            type="button"
                            onClick={() => setBulkPreviewIndex(Math.max(0, bulkPreviewIndex - 1))}
                            className="hover:text-white"
                          >
                            &larr; Nyuma
                          </button>
                          <span>{bulkPreviewIndex + 1} / {bulkRecipients.length || 1}</span>
                          <button
                            type="button"
                            onClick={() => setBulkPreviewIndex(bulkPreviewIndex + 1)}
                            className="hover:text-white"
                          >
                            Mbele &rarr;
                          </button>
                        </div>
                      </div>
                      <div className="font-semibold text-amber-300">
                        Kwake: {currentPreviewRecipient?.fullName} ({currentPreviewRecipient?.phone})
                      </div>
                      <p className="text-slate-200 font-mono text-[11px] bg-slate-800/80 p-2.5 rounded border border-slate-700">
                        "{renderedBulkPreview}"
                      </p>
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={isSendingBulk || bulkRecipients.length === 0}
                    className="w-full py-3 px-4 text-xs font-bold text-white bg-blue-900 hover:bg-blue-800 disabled:bg-slate-300 rounded-xl transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <Send className="w-4 h-4 text-amber-400" />
                    {isSendingBulk ? 'Inatuma SMS...' : `Tuma SMS kwa Washirika Wote (${bulkRecipients.length})`}
                  </button>

                </form>
              </div>
            </div>

            {/* 2. SINGLE MEMBER SMS (SMS kwa Mshirika Mmoja) */}
            <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <span className="text-[11px] font-bold uppercase text-blue-700 bg-blue-50 px-2.5 py-0.5 rounded">
                      SMS Binafsi
                    </span>
                    <h3 className="text-base font-bold text-slate-900 mt-1">
                      Tuma SMS kwa Mshirika Mmoja
                    </h3>
                  </div>
                  <MessageSquare className="w-5 h-5 text-amber-600" />
                </div>

                <p className="text-xs text-slate-600 mb-4 leading-relaxed">
                  Chagua mshirika na umtumie ujumbe maalum wa salamu, siku ya kuzaliwa, ukumbusho au maombi.
                </p>

                <form onSubmit={handleSendSingleSMS} className="space-y-4">
                  
                  {/* Select member */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                      Chagua Mshirika:
                    </label>
                    {members.length === 0 ? (
                      <p className="text-xs text-slate-500 bg-slate-50 p-3 rounded-lg border border-slate-200">
                        Bado hakuna washirika waliosajiliwa. Waumini wakijaza fomu ya 'Jisajili', majina yao yataonekana hapa moja kwa moja.
                      </p>
                    ) : (
                      <select
                        value={singleSMSMemberId || members[0]?.id || ''}
                        onChange={(e) => {
                          setSingleSMSMemberId(e.target.value);
                        }}
                        className="w-full p-2.5 text-xs rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-900 bg-white"
                      >
                        {members.map(m => (
                          <option key={m.id} value={m.id}>
                            {m.fullName} ({m.phone}) - {m.department}
                          </option>
                        ))}
                      </select>
                    )}
                  </div>

                  {/* Template buttons */}
                  <div>
                    <span className="text-[11px] text-slate-500 block mb-1.5">Violezo vya Haraka:</span>
                    <div className="flex flex-wrap gap-2">
                      <button
                        type="button"
                        onClick={() => applySingleTemplate('birthday')}
                        className="text-[11px] bg-slate-100 hover:bg-slate-200 text-slate-700 px-2.5 py-1 rounded"
                      >
                        Siku ya Kuzaliwa
                      </button>
                      <button
                        type="button"
                        onClick={() => applySingleTemplate('sunday')}
                        className="text-[11px] bg-slate-100 hover:bg-slate-200 text-slate-700 px-2.5 py-1 rounded"
                      >
                        Ibada ya Jumapili
                      </button>
                      <button
                        type="button"
                        onClick={() => applySingleTemplate('tithes')}
                        className="text-[11px] bg-slate-100 hover:bg-slate-200 text-slate-700 px-2.5 py-1 rounded"
                      >
                        Shukrani ya Sadaka
                      </button>
                      <button
                        type="button"
                        onClick={() => applySingleTemplate('prayer')}
                        className="text-[11px] bg-slate-100 hover:bg-slate-200 text-slate-700 px-2.5 py-1 rounded"
                      >
                        Maombi & Baraka
                      </button>
                    </div>
                  </div>

                  {/* Textarea */}
                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <label className="text-xs font-semibold text-slate-700">
                        Ujumbe kwa Mshirika:
                      </label>
                      <span className="text-[11px] text-slate-400 font-mono">
                        {singleSMSText.length} herufi
                      </span>
                    </div>
                    <textarea
                      rows={4}
                      required
                      value={singleSMSText}
                      onChange={(e) => setSingleSMSText(e.target.value)}
                      placeholder="Andika ujumbe wako hapa..."
                      className="w-full p-3 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-900"
                    />
                  </div>

                  {/* Actions: Send via System or Open WhatsApp/Native Phone SMS */}
                  {(() => {
                    const recipient = members.find(m => m.id === singleSMSMemberId);
                    const cleanPhone = recipient?.phone.replace(/[^0-9]/g, '') || '';
                    const encodedMsg = encodeURIComponent(singleSMSText);
                    return (
                      <div className="space-y-2 pt-2">
                        <button
                          type="submit"
                          className="w-full py-3 px-4 text-xs font-bold text-white bg-blue-900 hover:bg-blue-800 rounded-xl transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer"
                        >
                          <Send className="w-4 h-4 text-amber-400" />
                          Tuma SMS Kupitia Mfumo
                        </button>

                        <div className="grid grid-cols-2 gap-2 pt-1">
                          <a
                            href={`sms:${recipient?.phone || ''}?body=${encodedMsg}`}
                            className="py-2 px-3 text-center text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors flex items-center justify-center gap-1.5"
                          >
                            <Phone className="w-3.5 h-3.5 text-blue-800" />
                            Fungua SMS ya Simu
                          </a>
                          <a
                            href={`https://wa.me/${cleanPhone}?text=${encodedMsg}`}
                            target="_blank"
                            rel="noreferrer"
                            className="py-2 px-3 text-center text-xs font-medium text-emerald-800 bg-emerald-50 hover:bg-emerald-100 rounded-lg transition-colors flex items-center justify-center gap-1.5"
                          >
                            <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
                            Tuma kwa WhatsApp
                          </a>
                        </div>
                      </div>
                    );
                  })()}

                </form>
              </div>
            </div>

          </div>

          {/* SMS Logs / History */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
            <h3 className="text-sm font-bold text-slate-900 mb-4 flex items-center gap-2">
              <FileText className="w-4 h-4 text-blue-900" />
              Kumbukumbu za SMS Zilizotumwa
            </h3>

            <div className="space-y-3">
              {smsLogs.map((log) => (
                <div key={log.id} className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs space-y-2">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-blue-900 bg-blue-50 px-2.5 py-0.5 rounded border border-blue-200">
                        {log.recipientType}
                      </span>
                      <span className="text-slate-600">
                        Wapokeaji: {log.recipientCount} ({log.recipientNames.slice(0, 3).join(', ')}{log.recipientNames.length > 3 ? '...' : ''})
                      </span>
                    </div>
                    <span className="text-slate-400 font-mono text-[11px]">
                      {new Date(log.sentAt).toLocaleString('sw-TZ')}
                    </span>
                  </div>
                  <p className="text-slate-800 bg-white p-2.5 rounded-lg border border-slate-200 font-mono text-[11px]">
                    "{log.messageText}"
                  </p>
                </div>
              ))}
            </div>
          </div>

        </div>
      )}

      {/* ======================================================== */}
      {/* SUB-TAB 4: YOUTUBE MANAGER (Usimamizi wa Video)          */}
      {/* ======================================================== */}
      {activeSubTab === 'videos' && (
        <div className="space-y-6 animate-fade-in">
          
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-slate-900">Usimamizi wa Video za YouTube</h3>
              <p className="text-xs text-slate-500">Weka link za mahubiri, ibada, na nyimbo za kwaya</p>
            </div>
            <button
              onClick={() => setVideoModalOpen(true)}
              className="flex items-center gap-2 px-4 py-2 text-xs font-semibold text-white bg-blue-900 hover:bg-blue-800 rounded-lg transition-colors cursor-pointer"
            >
              <Plus className="w-4 h-4 text-amber-400" />
              Weka Video Mpya
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {videos.map((vid) => (
              <div key={vid.id} className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm flex flex-col justify-between">
                <div>
                  <div className="relative aspect-video bg-black">
                    <iframe
                      src={`https://www.youtube-nocookie.com/embed/${vid.embedId}`}
                      title={vid.title}
                      className="w-full h-full border-0"
                    />
                  </div>
                  <div className="p-4">
                    <span className="text-[11px] font-semibold text-amber-700 bg-amber-50 px-2 py-0.5 rounded">
                      {vid.category}
                    </span>
                    <h4 className="text-sm font-bold text-slate-900 mt-2 line-clamp-2">{vid.title}</h4>
                    <p className="text-xs text-slate-500 mt-1">{vid.speaker} · {vid.date}</p>
                  </div>
                </div>

                <div className="p-4 pt-0 border-t border-slate-100 flex items-center justify-between">
                  <a
                    href={vid.youtubeUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="text-xs text-blue-900 hover:underline flex items-center gap-1 font-medium"
                  >
                    Fungua YouTube
                    <ExternalLink className="w-3 h-3" />
                  </a>
                  <button
                    onClick={() => {
                      if (confirm(`Una uhakika unataka kuondoa video ya: ${vid.title}?`)) {
                        onDeleteVideo(vid.id);
                      }
                    }}
                    className="text-red-600 hover:text-red-800 text-xs font-medium cursor-pointer"
                  >
                    Futa Video
                  </button>
                </div>
              </div>
            ))}
          </div>

        </div>
      )}

      {/* ======================================================== */}
      {/* SUB-TAB 5: MONTHLY REPORT (Ripoti za Kila Mwezi kwa Email) */}
      {/* ======================================================== */}
      {activeSubTab === 'monthly_report' && (
        <div className="space-y-6 animate-fade-in">
          
          {emailStatus && (
            <div className="flex items-center gap-3 p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-xs font-medium">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
              <span>{emailStatus}</span>
            </div>
          )}

          <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-sm">
            
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-6 mb-6">
              <div>
                <span className="text-xs font-bold uppercase text-blue-900 bg-blue-50 px-2.5 py-1 rounded">
                  Ripoti Rasmi ya Uongozi
                </span>
                <h3 className="text-xl font-bold text-slate-900 mt-2">
                  Taarifa ya Kila Mwezi kwa Barua Pepe ya Kiongozi
                </h3>
                <p className="text-xs text-slate-600 mt-1">
                  Inatuma muhtasari mzima wa washirika, sadaka, na huduma moja kwa moja kwa barua pepe ya kiongozi: <strong className="text-blue-900 font-mono">{settings.leaderEmail}</strong>
                </p>
              </div>

              <div className="flex items-center gap-3">
                <input
                  type="month"
                  value={reportMonth}
                  onChange={(e) => setReportMonth(e.target.value)}
                  className="px-3 py-2 text-xs font-semibold rounded-lg border border-slate-300 bg-slate-50 focus:outline-none focus:ring-2 focus:ring-blue-900"
                />
                <button
                  onClick={handleSendMonthlyReportEmail}
                  disabled={isSendingReportEmail}
                  className="flex items-center gap-2 px-4 py-2.5 text-xs font-bold text-white bg-blue-900 hover:bg-blue-800 disabled:bg-slate-300 rounded-lg transition-colors cursor-pointer shadow-sm"
                >
                  <Mail className="w-4 h-4 text-amber-400" />
                  {isSendingReportEmail ? 'Inatuma...' : 'Tuma Ripoti kwa Barua Pepe Sasa'}
                </button>
              </div>
            </div>

            {/* Printable Formal Church Document Report */}
            <div className="p-8 border border-slate-300 rounded-2xl bg-slate-50/50 space-y-6">
              
              {/* Document Header */}
              <div className="text-center border-b border-slate-300 pb-6">
                <span className="text-base font-bold text-blue-950 uppercase tracking-widest">{settings.churchName}</span>
                <p className="text-xs text-slate-500 italic mt-0.5">{settings.motto}</p>
                <p className="text-xs text-slate-600 mt-1">{settings.location} · Simu: {settings.churchPhone}</p>
                <div className="mt-4 pt-3 border-t border-slate-200">
                  <h2 className="text-lg font-extrabold text-slate-900 uppercase tracking-wide">
                    RIPOTI YA UTENDAJI NA USIMAMIZI WA WASHIRIKA - {new Date(reportMonth + '-01').toLocaleDateString('sw-TZ', { month: 'long', year: 'numeric' }).toUpperCase()}
                  </h2>
                  <p className="text-xs text-slate-500 font-mono mt-1">Tarehe ya Ripoti: 24 Oktoba 2026</p>
                </div>
              </div>

              {/* Section 1: Demographics */}
              <div>
                <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-3 pb-1 border-b border-slate-200">
                  1. Takwimu Kamili za Washirika (Wanaume, Wanawake, Vijana na Watoto)
                </h4>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
                  <div className="p-3 bg-white rounded-lg border border-slate-200">
                    <span className="text-slate-500 block">Jumla ya Washirika</span>
                    <span className="text-xl font-bold text-slate-900 font-mono">{totalMembers}</span>
                  </div>
                  <div className="p-3 bg-white rounded-lg border border-slate-200">
                    <span className="text-slate-500 block">Wanaume</span>
                    <span className="text-xl font-bold text-blue-900 font-mono">{menCount} ({menPct}%)</span>
                  </div>
                  <div className="p-3 bg-white rounded-lg border border-slate-200">
                    <span className="text-slate-500 block">Wanawake</span>
                    <span className="text-xl font-bold text-pink-900 font-mono">{womenCount} ({womenPct}%)</span>
                  </div>
                  <div className="p-3 bg-white rounded-lg border border-slate-200">
                    <span className="text-slate-500 block">Vijana (Miaka 13 - 35)</span>
                    <span className="text-xl font-bold text-amber-700 font-mono">{youthCount} ({youthPct}%)</span>
                  </div>
                  <div className="p-3 bg-white rounded-lg border border-slate-200">
                    <span className="text-slate-500 block">Watoto (Chini ya 13)</span>
                    <span className="text-xl font-bold text-emerald-700 font-mono">{childrenCount} ({childrenPct}%)</span>
                  </div>
                  <div className="p-3 bg-white rounded-lg border border-slate-200">
                    <span className="text-slate-500 block">Watu Wazima na Wazee</span>
                    <span className="text-xl font-bold text-indigo-900 font-mono">{adultsCount} ({adultsPct}%)</span>
                  </div>
                  <div className="p-3 bg-white rounded-lg border border-slate-200 col-span-2">
                    <span className="text-slate-500 block">Washirika Wapya Waliojiunga Mwezi Huu</span>
                    <span className="text-xl font-bold text-blue-900 font-mono">{reportMembers.length} washirika</span>
                  </div>
                </div>
              </div>

              {/* Section 2: Finances */}
              <div>
                <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-3 pb-1 border-b border-slate-200">
                  2. Muhtasari wa Fedha na Sadaka Mtandaoni ({settings.currency})
                </h4>
                <div className="p-4 bg-white rounded-xl border border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div>
                    <span className="text-xs text-slate-500">Jumla ya Makusanyo Mwezi Huu:</span>
                    <div className="text-2xl font-extrabold text-blue-950 font-mono">
                      {reportDonationsTotal.toLocaleString()} {settings.currency}
                    </div>
                  </div>
                  <div className="text-xs text-slate-600 text-right">
                    <span>Miamala {reportDonations.length} ya mtandao (M-Pesa, Tigo Pesa, Benki)</span>
                  </div>
                </div>
              </div>

              {/* Signature lines */}
              <div className="pt-8 border-t border-slate-300 grid grid-cols-2 gap-8 text-xs text-slate-700">
                <div>
                  <span className="block border-b border-slate-400 pb-1 font-semibold">{settings.leaderName}</span>
                  <span className="text-[11px] text-slate-500">{settings.leaderTitle}</span>
                </div>
                <div>
                  <span className="block border-b border-slate-400 pb-1 font-semibold">Katibu Mkuu wa Kanisa</span>
                  <span className="text-[11px] text-slate-500">Kamati ya Utawala na Fedha</span>
                </div>
              </div>

            </div>

            <div className="mt-6 flex justify-end gap-3">
              <button
                onClick={() => window.print()}
                className="flex items-center gap-2 px-5 py-2.5 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors cursor-pointer"
              >
                <Printer className="w-4 h-4" />
                Chapisha / Pakua PDF ya Ripoti
              </button>
            </div>

          </div>

        </div>
      )}

      {/* ======================================================== */}
      {/* SUB-TAB 6: SETTINGS (Mipangilio ya Mfumo)                 */}
      {/* ======================================================== */}
      {activeSubTab === 'settings' && (
        <div className="space-y-6 animate-fade-in max-w-4xl mx-auto">
          
          {settingsSavedToast && (
            <div className="flex items-center gap-3 p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-xs font-medium">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
              <span>Mipangilio ya kanisa imesasishwa kikamilifu! Jina, logo na picha zimehifadhiwa.</span>
            </div>
          )}

          <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-sm">
            <div className="mb-6 pb-4 border-b border-slate-200">
              <h3 className="text-lg font-bold text-slate-900">Mipangilio ya Kanisa na Mfumo</h3>
              <p className="text-xs text-slate-500 mt-1">
                Badilisha jina la app, nembo (logo), picha za kiongozi, na barua pepe ya kupokea ripoti za kila mwezi.
              </p>
            </div>

            <form onSubmit={handleSaveSettings} className="space-y-6">
              
              {/* Church name & motto */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    Jina la Kanisa / App Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={settingsForm.churchName}
                    onChange={(e) => setSettingsForm({ ...settingsForm, churchName: e.target.value })}
                    className="w-full px-3.5 py-2.5 text-sm rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-900 font-semibold text-slate-900"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    Kaulimbiu ya Kanisa (Motto / Vision)
                  </label>
                  <input
                    type="text"
                    value={settingsForm.motto}
                    onChange={(e) => setSettingsForm({ ...settingsForm, motto: e.target.value })}
                    className="w-full px-3.5 py-2.5 text-sm rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-900"
                  />
                </div>
              </div>

              {/* Logo Settings */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Nembo ya Kanisa (Pakia kutoka kwenye simu au weka URL)
                </label>
                <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                  <div className="flex items-center gap-3">
                    {settingsForm.logoUrl ? (
                      <img
                        src={settingsForm.logoUrl}
                        alt="Logo preview"
                        className="w-12 h-12 object-contain rounded-lg border border-slate-200 p-1 bg-white"
                      />
                    ) : (
                      <div className="w-12 h-12 rounded-lg bg-blue-900 text-amber-400 flex items-center justify-center font-bold text-xs">
                        NEMBO
                      </div>
                    )}

                    <label className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg cursor-pointer transition-colors border border-slate-200">
                      <Upload className="w-3.5 h-3.5 text-blue-900" />
                      <span>Pakia Nembo Kutoka Galari</span>
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={handleLogoUpload}
                      />
                    </label>
                  </div>

                  <input
                    type="text"
                    value={settingsForm.logoUrl}
                    onChange={(e) => setSettingsForm({ ...settingsForm, logoUrl: e.target.value })}
                    placeholder="au weka URL ya nembo hapa..."
                    className="flex-1 px-3.5 py-2 text-xs rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-900 font-mono"
                  />
                </div>
              </div>

              {/* Leader Photo & Profile */}
              <div className="pt-4 border-t border-slate-200">
                <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-4">
                  Taarifa za Kiongozi Mkuu / Mchungaji
                </h4>

                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 mb-4">
                  <img
                    src={settingsForm.leaderPhoto}
                    alt={settingsForm.leaderName}
                    referrerPolicy="no-referrer"
                    className="w-20 h-20 rounded-2xl object-cover border-2 border-amber-400/80 shadow-md bg-slate-800 shrink-0"
                  />
                  <div className="flex-1 w-full space-y-2">
                    <label className="block text-xs font-semibold text-slate-700">
                      Picha ya Kiongozi (Pakia picha ya kiongozi moja kwa moja kutoka kwenye simu yako au galari)
                    </label>
                    
                    <div className="flex flex-wrap items-center gap-2.5">
                      <label className="flex items-center gap-2 px-4 py-2.5 text-xs font-bold text-white bg-blue-900 hover:bg-blue-800 rounded-xl cursor-pointer transition-all shadow-sm">
                        <Upload className="w-4 h-4 text-amber-400" />
                        <span>Pakia Picha ya Kiongozi Kutoka Galari ya Simu</span>
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={handleLeaderPhotoUpload}
                        />
                      </label>

                      <button
                        type="button"
                        onClick={() => setSettingsForm({ ...settingsForm, leaderPhoto: '/src/assets/images/pastor_leader_portrait_1792854334515.jpg' })}
                        className="px-3 py-2 text-xs font-medium text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors cursor-pointer"
                      >
                        Picha Asili ya Kiongozi
                      </button>
                    </div>

                    <input
                      type="text"
                      value={settingsForm.leaderPhoto}
                      onChange={(e) => setSettingsForm({ ...settingsForm, leaderPhoto: e.target.value })}
                      placeholder="au weka URL ya picha..."
                      className="w-full px-3.5 py-1.5 text-xs rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-900 font-mono text-slate-600"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                      Jina la Kiongozi / Mchungaji
                    </label>
                    <input
                      type="text"
                      value={settingsForm.leaderName}
                      onChange={(e) => setSettingsForm({ ...settingsForm, leaderName: e.target.value })}
                      className="w-full px-3.5 py-2.5 text-sm rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-900"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                      Cheo cha Kiongozi
                    </label>
                    <input
                      type="text"
                      value={settingsForm.leaderTitle}
                      onChange={(e) => setSettingsForm({ ...settingsForm, leaderTitle: e.target.value })}
                      className="w-full px-3.5 py-2.5 text-sm rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-900"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                      Barua Pepe ya Kiongozi ya Kupokea Ripoti <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="email"
                      required
                      value={settingsForm.leaderEmail}
                      onChange={(e) => setSettingsForm({ ...settingsForm, leaderEmail: e.target.value })}
                      className="w-full px-3.5 py-2.5 text-sm rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-900 font-mono text-blue-900 font-semibold"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                      Simu ya Kanisa
                    </label>
                    <input
                      type="tel"
                      value={settingsForm.churchPhone}
                      onChange={(e) => setSettingsForm({ ...settingsForm, churchPhone: e.target.value })}
                      className="w-full px-3.5 py-2.5 text-sm rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-900"
                    />
                  </div>
                </div>
              </div>

              {/* Payment Account Numbers */}
              <div className="pt-4 border-t border-slate-200">
                <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-4">
                  Nambari Rasmi za Malipo ya Sadaka Mtandaoni
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Vodacom M-Pesa Till (Lipa Namba)
                    </label>
                    <input
                      type="text"
                      value={settingsForm.mpesaTill}
                      onChange={(e) => setSettingsForm({ ...settingsForm, mpesaTill: e.target.value })}
                      className="w-full px-3.5 py-2 text-xs rounded-lg border border-slate-300 font-mono"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Tigo Pesa Paybill
                    </label>
                    <input
                      type="text"
                      value={settingsForm.tigoPaybill}
                      onChange={(e) => setSettingsForm({ ...settingsForm, tigoPaybill: e.target.value })}
                      className="w-full px-3.5 py-2 text-xs rounded-lg border border-slate-300 font-mono"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Akaunti ya CRDB Bank
                    </label>
                    <input
                      type="text"
                      value={settingsForm.crdbAccount}
                      onChange={(e) => setSettingsForm({ ...settingsForm, crdbAccount: e.target.value })}
                      className="w-full px-3.5 py-2 text-xs rounded-lg border border-slate-300 font-mono"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Akaunti ya NMB Bank
                    </label>
                    <input
                      type="text"
                      value={settingsForm.nmbAccount}
                      onChange={(e) => setSettingsForm({ ...settingsForm, nmbAccount: e.target.value })}
                      className="w-full px-3.5 py-2 text-xs rounded-lg border border-slate-300 font-mono"
                    />
                  </div>
                </div>
              </div>

              {/* Save CTA */}
              <div className="pt-4 border-t border-slate-200 flex justify-end">
                <button
                  type="submit"
                  className="px-8 py-3 text-xs font-bold text-white bg-blue-900 hover:bg-blue-800 rounded-xl transition-all shadow-md cursor-pointer flex items-center gap-2"
                >
                  <CheckCircle2 className="w-4 h-4 text-amber-400" />
                  Hifadhi Mabadiliko ya Mipangilio
                </button>
              </div>

            </form>
          </div>

        </div>
      )}

      {/* Member Details Modal */}
      {selectedMemberDetails && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-fade-in">
          <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden">
            <div className="bg-blue-900 text-white p-5 flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-white">{selectedMemberDetails.fullName}</h3>
                <p className="text-xs text-blue-200">{selectedMemberDetails.department}</p>
              </div>
              <button
                onClick={() => setSelectedMemberDetails(null)}
                className="text-blue-200 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-3 text-xs">
              <div className="flex justify-between py-1.5 border-b border-slate-100">
                <span className="text-slate-500">Jinsia:</span>
                <span className="font-semibold text-slate-900">{selectedMemberDetails.gender}</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-slate-100">
                <span className="text-slate-500">Tarehe ya Kuzaliwa:</span>
                <span className="font-mono text-slate-900">{selectedMemberDetails.dob}</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-slate-100">
                <span className="text-slate-500">Umri & Kundi:</span>
                <span className="font-bold text-amber-700">
                  {calculateAge(selectedMemberDetails.dob)} miaka ({getAgeCategory(calculateAge(selectedMemberDetails.dob))})
                </span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-slate-100">
                <span className="text-slate-500">Simu:</span>
                <span className="font-mono text-slate-900">{selectedMemberDetails.phone}</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-slate-100">
                <span className="text-slate-500">Barua Pepe:</span>
                <span className="text-slate-900">{selectedMemberDetails.email || 'Hajaweka'}</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-slate-100">
                <span className="text-slate-500">Makazi:</span>
                <span className="text-slate-900">{selectedMemberDetails.residence}</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-slate-100">
                <span className="text-slate-500">Hali ya Ndoa:</span>
                <span className="text-slate-900">{selectedMemberDetails.maritalStatus || 'Hajaoa/Hajaolewa'}</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-slate-100">
                <span className="text-slate-500">Hali ya Ubatizo:</span>
                <span className="text-slate-900">{selectedMemberDetails.baptismStatus || 'Amebatizwa'}</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-slate-100">
                <span className="text-slate-500">Tarehe ya Kujiunga:</span>
                <span className="font-mono text-slate-900">{selectedMemberDetails.registeredAt.split('T')[0]}</span>
              </div>
            </div>

            <div className="p-4 bg-slate-50 border-t border-slate-200 flex justify-end">
              <button
                onClick={() => setSelectedMemberDetails(null)}
                className="px-4 py-2 text-xs font-semibold text-slate-700 bg-white border border-slate-300 hover:bg-slate-100 rounded-lg"
              >
                Funga
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Video Modal */}
      {videoModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-fade-in">
          <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden">
            <div className="bg-blue-900 text-white p-5 flex items-center justify-between">
              <h3 className="text-sm font-bold text-white">Ongeza Video Mpya ya YouTube</h3>
              <button
                onClick={() => setVideoModalOpen(false)}
                className="text-blue-200 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddVideoSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Kichwa cha Video
                </label>
                <input
                  type="text"
                  required
                  value={newVideoTitle}
                  onChange={(e) => setNewVideoTitle(e.target.value)}
                  placeholder="Ibada ya Jumapili..."
                  className="w-full p-2.5 text-xs rounded-lg border border-slate-300"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  YouTube URL
                </label>
                <input
                  type="url"
                  required
                  value={newVideoUrl}
                  onChange={(e) => setNewVideoUrl(e.target.value)}
                  placeholder="https://youtube.com/watch?v=..."
                  className="w-full p-2.5 text-xs rounded-lg border border-slate-300"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Mnenaji
                </label>
                <input
                  type="text"
                  value={newVideoSpeaker}
                  onChange={(e) => setNewVideoSpeaker(e.target.value)}
                  className="w-full p-2.5 text-xs rounded-lg border border-slate-300"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Kundi
                </label>
                <select
                  value={newVideoCategory}
                  onChange={(e) => setNewVideoCategory(e.target.value as any)}
                  className="w-full p-2.5 text-xs rounded-lg border border-slate-300 bg-white"
                >
                  <option value="Mahubiri">Mahubiri</option>
                  <option value="Ibada ya Jumapili">Ibada ya Jumapili</option>
                  <option value="Nyimbo za Kwaya">Nyimbo za Kwaya</option>
                  <option value="Semina ya Vijana">Semina ya Vijana</option>
                  <option value="Mafundisho ya Neno">Mafundisho ya Neno</option>
                </select>
              </div>

              <div className="pt-2 flex gap-3">
                <button
                  type="button"
                  onClick={() => setVideoModalOpen(false)}
                  className="flex-1 py-2 text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg"
                >
                  Ghairi
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2 text-xs font-semibold text-white bg-blue-900 hover:bg-blue-800 rounded-lg"
                >
                  Hifadhi Video
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Create Notice Modal (With multi-image upload from gallery, optional and unlimited) */}
      {noticeModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-fade-in">
          <div className="w-full max-w-xl max-h-[92vh] overflow-y-auto bg-white rounded-2xl shadow-2xl border border-slate-200">
            <div className="bg-blue-900 text-white p-5 flex items-center justify-between sticky top-0 z-10">
              <div className="flex items-center gap-2">
                <Bell className="w-5 h-5 text-amber-400" />
                <h3 className="text-sm font-bold text-white">Andika Tangazo / Ratiba ya Ibada</h3>
              </div>
              <button
                onClick={() => setNoticeModalOpen(false)}
                className="text-blue-200 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateNoticeSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Kichwa cha Tangazo au Ratiba <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={newNoticeTitle}
                  onChange={(e) => setNewNoticeTitle(e.target.value)}
                  placeholder="mfano: Ratiba Mpya ya Ibada za Jumapili na Mazoezi ya Kwaya"
                  className="w-full p-2.5 text-xs rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-900 font-semibold"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Aina / Kundi la Tangazo
                  </label>
                  <select
                    value={newNoticeCategory}
                    onChange={(e) => setNewNoticeCategory(e.target.value as any)}
                    className="w-full p-2 text-xs rounded-lg border border-slate-300 bg-white"
                  >
                    <option value="Ratiba ya Ibada">Ratiba ya Ibada</option>
                    <option value="Tangazo Kuu">Tangazo Kuu la Kanisa</option>
                    <option value="Harambee & Ujenzi">Harambee & Ujenzi</option>
                    <option value="Semina & Mikutano">Semina & Mikutano</option>
                    <option value="Taarifa Maalum">Taarifa Maalum ya Kichungaji</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Tarehe ya Tangazo
                  </label>
                  <input
                    type="date"
                    value={newNoticeDate}
                    onChange={(e) => setNewNoticeDate(e.target.value)}
                    className="w-full p-2 text-xs rounded-lg border border-slate-300"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Maelezo Kamili ya Tangazo / Ratiba <span className="text-red-500">*</span>
                </label>
                <textarea
                  rows={4}
                  required
                  value={newNoticeContent}
                  onChange={(e) => setNewNoticeContent(e.target.value)}
                  placeholder="Andika maelezo ya tangazo, nyakati za ibada, tarehe za matukio, n.k..."
                  className="w-full p-3 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-900"
                />
              </div>

              {/* Multi-Image Upload (Optional, No Limit, Directly from Phone Gallery) */}
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div>
                    <span className="text-xs font-bold text-slate-800 block flex items-center gap-1.5">
                      <ImageIcon className="w-4 h-4 text-blue-900" />
                      Picha Kutoka Kwenye Galari ya Simu (Hiari)
                    </span>
                    <span className="text-[11px] text-slate-500">
                      Unaweza kuweka picha za vipeperushi (posters), ratiba au matukio bila kikomo cha idadi ya picha.
                    </span>
                  </div>

                  <label className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-white bg-blue-900 hover:bg-blue-800 rounded-lg cursor-pointer transition-colors shadow-sm shrink-0">
                    <Upload className="w-3.5 h-3.5 text-amber-400" />
                    <span>Chagua Picha Kutoka Galari</span>
                    <input
                      type="file"
                      accept="image/*"
                      multiple
                      className="hidden"
                      onChange={handleNoticeImagesUpload}
                    />
                  </label>
                </div>

                {/* Previews of uploaded images */}
                {newNoticeImages.length > 0 ? (
                  <div>
                    <div className="text-[11px] font-medium text-blue-900 mb-2">
                      Picha {newNoticeImages.length} zimechaguliwa (Unaweza kuongeza zaidi au kubonyeza X kuondoa):
                    </div>
                    <div className="grid grid-cols-3 sm:grid-cols-4 gap-2.5 max-h-48 overflow-y-auto p-1">
                      {newNoticeImages.map((img, idx) => (
                        <div key={idx} className="relative aspect-square rounded-lg overflow-hidden border border-slate-300 bg-slate-900 group">
                          <img 
                            src={img} 
                            alt={`Upload ${idx + 1}`} 
                            className="w-full h-full object-cover" 
                            referrerPolicy="no-referrer"
                          />
                          <button
                            type="button"
                            onClick={() => handleRemoveNoticeImage(idx)}
                            className="absolute top-1 right-1 w-5 h-5 bg-red-600 hover:bg-red-700 text-white rounded-full flex items-center justify-center text-xs shadow-md"
                            title="Ondoa picha hii"
                          >
                            &times;
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <p className="text-[11px] text-slate-400 italic">
                    Hakuna picha zilizochaguliwa bado. Kuweka picha ni hiari.
                  </p>
                )}
              </div>

              {/* Pinned checkbox */}
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="pin-notice-cb"
                  checked={newNoticePinned}
                  onChange={(e) => setNewNoticePinned(e.target.checked)}
                  className="rounded border-slate-300 text-blue-900 focus:ring-blue-900"
                />
                <label htmlFor="pin-notice-cb" className="text-xs text-slate-700 font-medium cursor-pointer flex items-center gap-1">
                  <Pin className="w-3.5 h-3.5 text-amber-600" />
                  Weka Alama ya Tangazo Muhimu (Litaonekana juu kabisa)
                </label>
              </div>

              <div className="pt-3 border-t border-slate-100 flex gap-3">
                <button
                  type="button"
                  onClick={() => setNoticeModalOpen(false)}
                  className="flex-1 py-2.5 text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg cursor-pointer"
                >
                  Ghairi
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 text-xs font-bold text-white bg-blue-900 hover:bg-blue-800 rounded-lg transition-colors cursor-pointer shadow-sm"
                >
                  Chapisha Tangazo / Ratiba
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};

