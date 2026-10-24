import { Member, Donation, YouTubeVideo, SentSMS, ChurchSettings, ChurchNotice } from '../types/church';

export const ADMIN_MASTER_PASSWORD = 'KanisaAdmin2026';

export const INITIAL_SETTINGS: ChurchSettings = {
  churchName: 'Kanisa la Ukombozi',
  motto: 'Kumpenda Mungu, Kuinua Familia na Kuhudumia Jamii',
  logoUrl: '',
  leaderName: 'Mch. Paulo Zakaria',
  leaderTitle: 'Mchungaji Kiongozi',
  leaderPhoto: '/src/assets/images/pastor_leader_portrait_1792854334515.jpg',
  leaderEmail: 'paulozakaria1996@gmail.com',
  churchPhone: '+255 754 000 000',
  location: 'Tanzania',
  mpesaTill: '589021',
  tigoPaybill: '109283',
  crdbAccount: '0150293847200',
  nmbAccount: '2011004829100',
  currency: 'TZS',
};

// No fake data - Starts completely fresh for real church operations
export const INITIAL_MEMBERS: Member[] = [];

export const INITIAL_DONATIONS: Donation[] = [];

export const INITIAL_SMS_LOGS: SentSMS[] = [];

export const INITIAL_NOTICES: ChurchNotice[] = [];

export const INITIAL_VIDEOS: YouTubeVideo[] = [
  {
    id: 'vid-1',
    title: 'Ibada ya Neno na Maombi: Nguvu ya Imani',
    speaker: 'Mch. Paulo Zakaria',
    youtubeUrl: 'https://www.youtube.com/watch?v=ScMzIvxBSi4',
    embedId: 'ScMzIvxBSi4',
    date: '2026-10-24',
    duration: '45:00',
    category: 'Ibada ya Jumapili',
    description: 'Mahubiri ya kiroho na maombi ya ushindi katika Kristo Yesu.',
  }
];

