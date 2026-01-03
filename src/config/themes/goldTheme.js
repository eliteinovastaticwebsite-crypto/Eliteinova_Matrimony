// Gold Membership Theme Configuration
export const goldTheme = {
  name: 'GOLD',
  displayName: 'Gold',
  
  // Color Palette
  colors: {
    primary: '#D97706',      // amber-600 / yellow-600
    primaryDark: '#B45309',   // amber-700
    primaryLight: '#F59E0B',  // amber-500
    secondary: '#FBBF24',     // amber-400
    accent: '#D97706',
    accentLight: '#FEF3C7',   // amber-100
    
    // Background gradients
    bgGradient: 'from-yellow-50 via-amber-50 to-yellow-100',
    bgGradientStyle: 'linear-gradient(to bottom right, #FFFBEB, #FEF3C7, #FDE68A)',
    
    // Header
    headerGradient: 'from-yellow-700 to-yellow-800',
    headerGradientStyle: 'linear-gradient(to right, #B45309, #92400E)',
    
    // Card
    cardBg: 'bg-yellow-50',
    cardBorder: '#FDE68A',
    
    // Text
    textPrimary: 'text-yellow-900',
    textSecondary: 'text-yellow-800',
    textMuted: 'text-yellow-700',
    
    // Badge
    badgeBg: 'bg-yellow-200',
    badgeText: 'text-yellow-900',
    
    // Blobs (for animated background)
    blob1: '#FBBF24',  // yellow-400 / amber-400
    blob2: '#F59E0B',  // amber-500
    blob3: '#D97706',  // amber-600
    
    // Welcome card
    welcomeCardGradient: 'linear-gradient(to right, #D97706, #B45309)',
    welcomeBadgeBg: '#FEF3C7',
    welcomeBadgeText: '#92400E',
  },
  
  // Tailwind Classes
  classes: {
    primary: 'from-yellow-600 to-yellow-700',
    secondary: 'from-yellow-500 to-yellow-600',
    accent: 'yellow',
    bgGradient: 'from-yellow-50 via-amber-50 to-yellow-100',
    blob1: 'bg-yellow-400',
    blob2: 'bg-amber-400',
    blob3: 'bg-yellow-500',
    header: 'from-yellow-700 to-yellow-800',
    cardBg: 'bg-yellow-50',
    textColor: 'text-yellow-900',
    badge: 'bg-yellow-200 text-yellow-900',
  },
  
  // Background Image/Animation Settings
  background: {
    type: 'animated',
    animation: 'gold',
    // You can add background image paths here if needed
    image: null,
  },
  
  // UI Component Styles
  components: {
    button: {
      primary: 'bg-yellow-600 hover:bg-yellow-700 text-white',
      secondary: 'bg-yellow-500 hover:bg-yellow-600 text-white',
    },
    card: {
      base: 'bg-yellow-50 border-yellow-200',
      hover: 'hover:border-yellow-300 hover:shadow-lg',
    },
    input: {
      base: 'border-yellow-300 focus:border-yellow-500 focus:ring-yellow-500',
    },
  },
};

export default goldTheme;

