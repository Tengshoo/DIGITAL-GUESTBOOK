export interface PhotoboothStripTheme {
  id: 'vintage-film' | 'champagne-gold' | 'blush-romance' | 'midnight-noir' | 'botanical-garden';
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
    id: 'vintage-film',
    name: 'Vintage Film',
    subtitle: 'Classic 35mm Analog',
    badge: 'Retro Analog',
    icon: '🎞️',
    bgClass: 'bg-[#F5F1E8]',
    cardBgClass: 'bg-[#FAF7F0]',
    textClass: 'text-[#2D241E]',
    accentClass: 'text-[#B45309]',
    borderClass: 'border-[#2D241E]/20',
    tagline: 'MEMOIRA FILM 400 • ANALOG GRAIN',
    primaryColor: '#2D241E',
    secondaryColor: '#B45309',
    bgColor: '#F5F1E8',
    frameColor: '#26201A',
    textColor: '#2D241E',
    accentColor: '#D97706',
  },
  {
    id: 'champagne-gold',
    name: 'Champagne Gold',
    subtitle: 'Gilded Gala Elegance',
    badge: 'Luxury Gala',
    icon: '✨',
    bgClass: 'bg-[#181411]',
    cardBgClass: 'bg-[#211B16]',
    textClass: 'text-[#F9F5EB]',
    accentClass: 'text-[#D4AF37]',
    borderClass: 'border-[#D4AF37]/50',
    tagline: '✦ FOREVER & ALWAYS • LUXURY CELEBRATION ✦',
    primaryColor: '#D4AF37',
    secondaryColor: '#E6C975',
    bgColor: '#16120E',
    frameColor: '#282018',
    textColor: '#FBF8F0',
    accentColor: '#D4AF37',
  },
  {
    id: 'blush-romance',
    name: 'Blush Romance',
    subtitle: 'Haru Film Pastel Cut',
    badge: 'Sweet Pastel',
    icon: '🎀',
    bgClass: 'bg-gradient-to-b from-[#FFF0F5] to-[#FDE8EF]',
    cardBgClass: 'bg-white',
    textClass: 'text-[#88304E]',
    accentClass: 'text-[#DF4F67]',
    borderClass: 'border-[#F8B4C4]',
    tagline: 'sweet moments with you ♡ happily ever after',
    primaryColor: '#DF4F67',
    secondaryColor: '#F8B4C4',
    bgColor: '#FFF0F5',
    frameColor: '#FFFFFF',
    textColor: '#88304E',
    accentColor: '#E11D48',
  },
  {
    id: 'midnight-noir',
    name: 'Midnight Noir',
    subtitle: 'Minimalist Editorial',
    badge: 'Monochrome',
    icon: '🖤',
    bgClass: 'bg-[#111111]',
    cardBgClass: 'bg-[#1C1C1E]',
    textClass: 'text-white',
    accentClass: 'text-neutral-400',
    borderClass: 'border-white/20',
    tagline: 'EDITORIAL EDITION // WEDDING ARCHIVE // 01',
    primaryColor: '#FFFFFF',
    secondaryColor: '#A3A3A3',
    bgColor: '#121212',
    frameColor: '#1E1E1E',
    textColor: '#FFFFFF',
    accentColor: '#A3A3A3',
  },
  {
    id: 'botanical-garden',
    name: 'Botanical Garden',
    subtitle: 'Sage & Eucalyptus Foliage',
    badge: 'Garden Romance',
    icon: '🌿',
    bgClass: 'bg-[#EEF4EF]',
    cardBgClass: 'bg-white',
    textClass: 'text-[#2D4A3E]',
    accentClass: 'text-[#52796F]',
    borderClass: 'border-[#CAD2C5]',
    tagline: 'growing in love • nature & grace • forever',
    primaryColor: '#2D4A3E',
    secondaryColor: '#52796F',
    bgColor: '#EFF5F0',
    frameColor: '#FFFFFF',
    textColor: '#2D4A3E',
    accentColor: '#52796F',
  },
];
