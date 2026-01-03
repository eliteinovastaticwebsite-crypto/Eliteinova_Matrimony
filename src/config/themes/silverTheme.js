// Silver Membership Theme Configuration
export const silverTheme = {
  name: 'SILVER',
  displayName: 'Silver',
  
  // Color Palette
  colors: {
    primary: '#4B5563',      // gray-600
    primaryDark: '#374151',   // gray-700
    primaryLight: '#6B7280',  // gray-500
    secondary: '#9CA3AF',     // gray-400
    accent: '#4B5563',
    accentLight: '#F3F4F6',   // gray-100
    
    // Background gradients - Made more visible for Silver theme
    bgGradient: 'from-gray-50 via-gray-100 to-gray-200',
    bgGradientStyle: 'linear-gradient(135deg, #F3F4F6 0%, #E5E7EB 50%, #D1D5DB 100%)',
    
    // Header
    headerGradient: 'from-gray-700 to-gray-800',
    headerGradientStyle: 'linear-gradient(to right, #374151, #1F2937)',
    
    // Card
    cardBg: 'bg-gray-50',
    cardBorder: '#E5E7EB',
    
    // Text
    textPrimary: 'text-gray-800',
    textSecondary: 'text-gray-600',
    textMuted: 'text-gray-500',
    
    // Badge
    badgeBg: 'bg-gray-200',
    badgeText: 'text-gray-800',
    
    // Blobs (for animated background)
    blob1: '#9CA3AF',  // gray-400
    blob2: '#6B7280',  // gray-500
    blob3: '#4B5563',  // gray-600
    
    // Welcome card
    welcomeCardGradient: 'linear-gradient(to right, #4B5563, #374151)',
    welcomeBadgeBg: '#E5E7EB',
    welcomeBadgeText: '#1F2937',
  },
  
  // Tailwind Classes
  classes: {
    primary: 'from-gray-600 to-gray-700',
    secondary: 'from-gray-500 to-gray-600',
    accent: 'gray',
    bgGradient: 'from-gray-50 via-gray-100 to-gray-200',
    blob1: 'bg-gray-400',
    blob2: 'bg-gray-500',
    blob3: 'bg-gray-600',
    header: 'from-gray-700 to-gray-800',
    cardBg: 'bg-gray-50',
    textColor: 'text-gray-800',
    badge: 'bg-gray-200 text-gray-800',
  },
  
  // Background Image/Animation Settings
  background: {
    type: 'animated',
    animation: 'silver',
    // You can add background image paths here if needed
    image: null,
  },
  
  // UI Component Styles
  components: {
    button: {
      primary: 'bg-gray-600 hover:bg-gray-700 text-white',
      secondary: 'bg-gray-500 hover:bg-gray-600 text-white',
    },
    card: {
      base: 'bg-gray-50 border-gray-200',
      hover: 'hover:border-gray-300 hover:shadow-lg',
    },
    input: {
      base: 'border-gray-300 focus:border-gray-500 focus:ring-gray-500',
    },
  },
};

export default silverTheme;

