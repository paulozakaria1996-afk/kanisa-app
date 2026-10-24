/**
 * Church Management System Types
 */

export type Gender = 'Mwanaume' | 'Mwanamke';

export type AgeCategory = 'Mtoto' | 'Kijana' | 'Mtu Mzima';

export interface Member {
  id: string;
  fullName: string;
  phone: string;
  email?: string;
  gender: Gender;
  dob: string; // YYYY-MM-DD
  residence: string;
  department: string; // e.g. 'Kwaya Kuu', 'Umoja wa Vijana', 'Umoja wa Wanawake', 'Wanaume', 'Sunday School', 'Wazee wa Kanisa'
  maritalStatus?: 'Hajaoa / Hajaolewa' | 'Ameoa / Ameolewa' | 'Mjane';
  baptismStatus?: 'Amebatizwa' | 'Bado Hajabatizwa';
  registeredAt: string;
  notes?: string;
}

export type GivingCategory = 
  | 'Fungu la Kumi'
  | 'Sadaka ya Kawaida'
  | 'Sadaka ya Shukrani'
  | 'Harambee ya Ujenzi'
  | 'Michango ya Huduma';

export type PaymentMethod = 
  | 'M-Pesa'
  | 'Tigo Pesa'
  | 'Airtel Money'
  | 'Halopesa'
  | 'CRDB Bank'
  | 'NMB Bank';

export interface Donation {
  id: string;
  receiptNo: string;
  memberName: string;
  memberPhone: string;
  category: GivingCategory;
  amount: number;
  paymentMethod: PaymentMethod;
  referenceCode: string;
  date: string;
  status: 'Imekamilika' | 'Inasubiri';
  note?: string;
}

export interface YouTubeVideo {
  id: string;
  title: string;
  speaker: string;
  youtubeUrl: string;
  embedId: string;
  date: string;
  duration: string;
  category: 'Mahubiri' | 'Ibada ya Jumapili' | 'Nyimbo za Kwaya' | 'Semina ya Vijana' | 'Mafundisho ya Neno';
  description?: string;
}

export interface SentSMS {
  id: string;
  recipientType: 'Mshirika Mmoja' | 'Washirika Wote' | 'Kundi Maalum';
  recipientCount: number;
  recipientNames: string[];
  messageText: string;
  sentAt: string;
  status: 'Imetumwa' | 'Imefanikiwa';
}

export type NoticeCategory = 
  | 'Ratiba ya Ibada'
  | 'Tangazo Kuu'
  | 'Harambee & Ujenzi'
  | 'Semina & Mikutano'
  | 'Taarifa Maalum';

export interface ChurchNotice {
  id: string;
  title: string;
  category: NoticeCategory;
  content: string;
  images: string[]; // Unlimited photo attachments from phone gallery or URLs
  date: string; // YYYY-MM-DD
  isPinned?: boolean;
  author?: string;
}

export interface ChurchSettings {
  churchName: string;
  motto: string;
  logoUrl: string;
  leaderName: string;
  leaderTitle: string;
  leaderPhoto: string;
  leaderEmail: string;
  churchPhone: string;
  location: string;
  mpesaTill: string;
  tigoPaybill: string;
  crdbAccount: string;
  nmbAccount: string;
  currency: string;
}

/**
 * Utility functions for Demographics
 */
export function calculateAge(dob: string): number {
  if (!dob) return 0;
  const birthDate = new Date(dob);
  const today = new Date();
  let age = today.getFullYear() - birthDate.getFullYear();
  const m = today.getMonth() - birthDate.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  return isNaN(age) || age < 0 ? 0 : age;
}

export function getAgeCategory(age: number): AgeCategory {
  if (age < 13) {
    return 'Mtoto';
  } else if (age <= 35) {
    return 'Kijana';
  } else {
    return 'Mtu Mzima';
  }
}

export function extractYouTubeId(url: string): string {
  if (!url) return '';
  const trimmed = url.trim();
  if (/^[a-zA-Z0-9_-]{11}$/.test(trimmed)) {
    return trimmed;
  }
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
  const match = trimmed.match(regExp);
  return match && match[2].length === 11 ? match[2] : 'j3qP6K_2vQc';
}
