// Diamond Membership Theme Configuration
export const diamondTheme = {
  name: 'DIAMOND',
  displayName: 'Diamond',
  
  // Color Palette
  colors: {
    primary: '#9333EA',      // purple-600
    primaryDark: '#7C3AED',   // purple-700
    primaryLight: '#A855F7',  // purple-500
    secondary: '#C084FC',     // purple-400
    accent: '#9333EA',
    accentLight: '#F3E8FF',   // purple-100
    
    // Background gradients
    bgGradient: 'from-purple-50 via-indigo-50 to-purple-100',
    bgGradientStyle: 'linear-gradient(to bottom right, #FAF5FF, #F3E8FF, #E9D5FF)',
    
    // Header
    headerGradient: 'from-purple-700 to-indigo-800',
    headerGradientStyle: 'linear-gradient(to right, #7C3AED, #5B21B6)',
    
    // Card
    cardBg: 'bg-purple-50',
    cardBorder: '#E9D5FF',
    
    // Text
    textPrimary: 'text-purple-900',
    textSecondary: 'text-purple-800',
    textMuted: 'text-purple-700',
    
    // Badge
    badgeBg: 'bg-purple-200',
    badgeText: 'text-purple-900',
    
    // Blobs (for animated background)
    blob1: '#A78BFA',  // purple-400
    blob2: '#8B5CF6',  // indigo-500 / purple-500
    blob3: '#9333EA',  // purple-600
    
    // Welcome card
    welcomeCardGradient: 'linear-gradient(to right, #9333EA, #7C3AED)',
    welcomeBadgeBg: '#F3E8FF',
    welcomeBadgeText: '#6B21A8',
  },
  
  // Tailwind Classes
  classes: {
    primary: 'from-purple-600 to-indigo-700',
    secondary: 'from-purple-500 to-indigo-600',
    accent: 'purple',
    bgGradient: 'from-purple-50 via-indigo-50 to-purple-100',
    blob1: 'bg-purple-400',
    blob2: 'bg-indigo-400',
    blob3: 'bg-purple-500',
    header: 'from-purple-700 to-indigo-800',
    cardBg: 'bg-purple-50',
    textColor: 'text-purple-900',
    badge: 'bg-purple-200 text-purple-900',
  },
  
  // Background Image/Animation Settings
  background: {
    type: 'animated',
    animation: 'diamond',
    // You can add background image paths here if needed
    image: null,
  },
  
  // UI Component Styles
  components: {
    button: {
      primary: 'bg-purple-600 hover:bg-purple-700 text-white',
      secondary: 'bg-purple-500 hover:bg-purple-600 text-white',
    },
    card: {
      base: 'bg-purple-50 border-purple-200',
      hover: 'hover:border-purple-300 hover:shadow-lg',
    },
    input: {
      base: 'border-purple-300 focus:border-purple-500 focus:ring-purple-500',
    },
  },
};

export default diamondTheme;

