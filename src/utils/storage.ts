import { 
  Member, 
  Donation, 
  YouTubeVideo, 
  SentSMS, 
  ChurchSettings,
  ChurchNotice
} from '../types/church';
import { 
  INITIAL_MEMBERS, 
  INITIAL_DONATIONS, 
  INITIAL_VIDEOS, 
  INITIAL_SMS_LOGS, 
  INITIAL_SETTINGS,
  INITIAL_NOTICES
} from '../data/initialData';

// Version 3 ensures zero fake data
const KEYS = {
  MEMBERS: 'kanisa_real_members_v3',
  DONATIONS: 'kanisa_real_donations_v3',
  VIDEOS: 'kanisa_real_videos_v3',
  SMS_LOGS: 'kanisa_real_sms_logs_v3',
  SETTINGS: 'kanisa_real_settings_v3',
  NOTICES: 'kanisa_real_notices_v3',
  ADMIN_SESSION: 'kanisa_real_admin_session_v3',
  LOGGED_MEMBER: 'kanisa_real_member_session_v3',
};

export const storage = {
  getMembers(): Member[] {
    try {
      const data = localStorage.getItem(KEYS.MEMBERS);
      return data ? JSON.parse(data) : INITIAL_MEMBERS;
    } catch {
      return INITIAL_MEMBERS;
    }
  },

  saveMembers(members: Member[]): void {
    try {
      localStorage.setItem(KEYS.MEMBERS, JSON.stringify(members));
    } catch (e) {
      console.error('Error saving members', e);
    }
  },

  getDonations(): Donation[] {
    try {
      const data = localStorage.getItem(KEYS.DONATIONS);
      return data ? JSON.parse(data) : INITIAL_DONATIONS;
    } catch {
      return INITIAL_DONATIONS;
    }
  },

  saveDonations(donations: Donation[]): void {
    try {
      localStorage.setItem(KEYS.DONATIONS, JSON.stringify(donations));
    } catch (e) {
      console.error('Error saving donations', e);
    }
  },

  getVideos(): YouTubeVideo[] {
    try {
      const data = localStorage.getItem(KEYS.VIDEOS);
      return data ? JSON.parse(data) : INITIAL_VIDEOS;
    } catch {
      return INITIAL_VIDEOS;
    }
  },

  saveVideos(videos: YouTubeVideo[]): void {
    try {
      localStorage.setItem(KEYS.VIDEOS, JSON.stringify(videos));
    } catch (e) {
      console.error('Error saving videos', e);
    }
  },

  getSMSLogs(): SentSMS[] {
    try {
      const data = localStorage.getItem(KEYS.SMS_LOGS);
      return data ? JSON.parse(data) : INITIAL_SMS_LOGS;
    } catch {
      return INITIAL_SMS_LOGS;
    }
  },

  saveSMSLogs(logs: SentSMS[]): void {
    try {
      localStorage.setItem(KEYS.SMS_LOGS, JSON.stringify(logs));
    } catch (e) {
      console.error('Error saving SMS logs', e);
    }
  },

  getSettings(): ChurchSettings {
    try {
      const data = localStorage.getItem(KEYS.SETTINGS);
      return data ? JSON.parse(data) : INITIAL_SETTINGS;
    } catch {
      return INITIAL_SETTINGS;
    }
  },

  saveSettings(settings: ChurchSettings): void {
    try {
      localStorage.setItem(KEYS.SETTINGS, JSON.stringify(settings));
    } catch (e) {
      console.error('Error saving settings', e);
    }
  },

  getNotices(): ChurchNotice[] {
    try {
      const data = localStorage.getItem(KEYS.NOTICES);
      return data ? JSON.parse(data) : INITIAL_NOTICES;
    } catch {
      return INITIAL_NOTICES;
    }
  },

  saveNotices(notices: ChurchNotice[]): void {
    try {
      localStorage.setItem(KEYS.NOTICES, JSON.stringify(notices));
    } catch (e) {
      console.error('Error saving notices', e);
    }
  },

  isAdminAuthenticated(): boolean {
    try {
      return sessionStorage.getItem(KEYS.ADMIN_SESSION) === 'true' ||
             localStorage.getItem(KEYS.ADMIN_SESSION) === 'true';
    } catch {
      return false;
    }
  },

  setAdminAuthenticated(auth: boolean, remember: boolean = false): void {
    try {
      if (auth) {
        sessionStorage.setItem(KEYS.ADMIN_SESSION, 'true');
        if (remember) {
          localStorage.setItem(KEYS.ADMIN_SESSION, 'true');
        }
      } else {
        sessionStorage.removeItem(KEYS.ADMIN_SESSION);
        localStorage.removeItem(KEYS.ADMIN_SESSION);
      }
    } catch (e) {
      console.error('Error setting auth state', e);
    }
  },

  getLoggedMember(): Member | null {
    try {
      const data = sessionStorage.getItem(KEYS.LOGGED_MEMBER);
      return data ? JSON.parse(data) : null;
    } catch {
      return null;
    }
  },

  setLoggedMember(member: Member | null): void {
    try {
      if (member) {
        sessionStorage.setItem(KEYS.LOGGED_MEMBER, JSON.stringify(member));
      } else {
        sessionStorage.removeItem(KEYS.LOGGED_MEMBER);
      }
    } catch (e) {
      console.error('Error setting member session', e);
    }
  }
};
