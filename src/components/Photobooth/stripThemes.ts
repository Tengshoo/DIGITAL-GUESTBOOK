export interface PhotoboothStripTheme {
  id: 'coquette-cherry' | 'lavender-stars' | 'matcha-butter' | 'baby-blue-pop' | 'cyber-heart';
  name: string;
  subtitle: string;
  badge: string;
  icon: string;
  bgClass: string;
  cardBgClass: string;
  textClass: string;
  accentClass: string;
  borderClass: string;
  tagline: string;
  primaryColor: string;
  secondaryColor: string;
  bgColor: string;
  frameColor: string;
  textColor: string;
  accentColor: string;
}

export const PHOTOBOOTH_STRIP_THEMES: PhotoboothStripTheme[] = [
  {
    id: 'coquette-cherry',
    name: 'Strawberry & Bows',
    subtitle: 'Coquette Milk & Cherries',
    badge: 'Coquette Cut',
    icon: '🎀',
    bgClass: 'bg-gradient-to-b from-[#FFF0F5] via-[#FFE4EC] to-[#FFF5F8]',
    cardBgClass: 'bg-white',
    textClass: 'text-[#9F1239]',
    accentClass: 'text-[#E11D48]',
    borderClass: 'border-[#FDA4AF]',
    tagline: 'sweet moments with you ୨ৎ 100% cute',
    primaryColor: '#E11D48',
    secondaryColor: '#FECDD3',
    bgColor: '#FFF0F5',
    frameColor: '#FFFFFF',
    textColor: '#9F1239',
    accentColor: '#BE123C',
  },
  {
    id: 'lavender-stars',
    name: 'Lilac & Y2K Stars',
    subtitle: 'Korean Haru Dream',
    badge: 'Y2K Sparkle',
    icon: '💜',
    bgClass: 'bg-gradient-to-b from-[#F3E8FF] via-[#EDE9FE] to-[#FCE7F3]',
    cardBgClass: 'bg-white',
    textClass: 'text-[#6B21A8]',
    accentClass: 'text-[#9333EA]',
    borderClass: 'border-[#D8B4FE]',
    tagline: 'main character energy ★ starry love vibes',
    primaryColor: '#9333EA',
    secondaryColor: '#E9D5FF',
    bgColor: '#F5EEFD',
    frameColor: '#FFFFFF',
    textColor: '#581C87',
    accentColor: '#A855F7',
  },
  {
    id: 'matcha-butter',
    name: 'Matcha & Daisy',
    subtitle: 'Butter Cream & Florals',
    badge: 'Soft Floral',
    icon: '🌼',
    bgClass: 'bg-gradient-to-b from-[#FEF9C3] via-[#FFFBEB] to-[#ECFDF5]',
    cardBgClass: 'bg-white',
    textClass: 'text-[#365314]',
    accentClass: 'text-[#65A30D]',
    borderClass: 'border-[#BEF264]',
    tagline: 'happy moments only ✿ sunny day with you',
    primaryColor: '#65A30D',
    secondaryColor: '#FEF08A',
    bgColor: '#FEFCE8',
    frameColor: '#FFFFFF',
    textColor: '#365314',
    accentColor: '#4D7C0F',
  },
  {
    id: 'baby-blue-pop',
    name: 'Cloud 9 & Sky Blue',
    subtitle: 'Life4Cuts Pastel Pop',
    badge: 'Bubblegum Pop',
    icon: '🩵',
    bgClass: 'bg-gradient-to-b from-[#E0F2FE] via-[#F0F9FF] to-[#FFE4E6]',
    cardBgClass: 'bg-white',
    textClass: 'text-[#0369A1]',
    accentClass: 'text-[#0284C7]',
    borderClass: 'border-[#7DD3FC]',
    tagline: 'on cloud nine with you ♡ best day ever',
    primaryColor: '#0284C7',
    secondaryColor: '#BAE6FD',
    bgColor: '#E0F2FE',
    frameColor: '#FFFFFF',
    textColor: '#075985',
    accentColor: '#38BDF8',
  },
  {
    id: 'cyber-heart',
    name: 'Cyber Pop & Pink',
    subtitle: 'Cool Girl Y2K Chrome',
    badge: 'Cool Girl',
    icon: '🖤',
    bgClass: 'bg-gradient-to-b from-[#111215] via-[#181920] to-[#121318]',
    cardBgClass: 'bg-[#1E2028]',
    textClass: 'text-white',
    accentClass: 'text-[#FF2E93]',
    borderClass: 'border-[#FF2E93]/60',
    tagline: 'COOL KIDS WEDDING CLUB // 08.07.26 // ✦',
    primaryColor: '#FF2E93',
    secondaryColor: '#E2E8F0',
    bgColor: '#111215',
    frameColor: '#1E2028',
    textColor: '#FFFFFF',
    accentColor: '#FF2E93',
  },
];
