// Silver Membership Theme Configuration
export const silverTheme = {
  name: 'SILVER',
  displayName: 'Silver',

  // ─── Core Brand Colors (3 only) ───────────────────────────
  brand: {
    red:   '#dc2626',   // primary red (buttons, header bg, highlights) - matches navbar red-600
    gold:  '#eab308',   // gold (accents, badges, subtitles, borders) - matches navbar yellow-500
    white: '#ffffff',   // white (text on red, card backgrounds)
  },

  // Color Palette
  colors: {
    primary:      '#dc2626',   // red-600 - primary red
    primaryDark:  '#b91c1c',   // red-700 - darker red (hover states)
    primaryLight: '#ef4444',   // red-500 - lighter red
    accent:       '#eab308',   // yellow-500 - gold
    accentDark:   '#ca8a04',   // yellow-600 - darker gold (hover)
    accentLight:  '#fbbf24',   // yellow-400 - lighter gold (glow/shine effect)

    // Backgrounds
    bgGradientStyle: 'linear-gradient(135deg, #fef2f2 0%, #fefce8 100%)', // red-50 to yellow-50

    // Header
    headerGradientStyle: 'linear-gradient(to right, #b91c1c, #dc2626, #b91c1c)', // red-700 to red-600 to red-700

    // Text - All clearly visible
    textOnRed:    '#ffffff',   // white text on red backgrounds - HIGHLY VISIBLE
    textOnWhite:  '#b91c1c',   // red-700 text on white backgrounds
    textGold:     '#eab308',   // yellow-500 - gold text (subtitles, labels)
    textDark:     '#1f2937',   // gray-800 - dark text for better readability on light backgrounds
    textMuted:    '#6b7280',   // gray-500

    // Badge (e.g. SILVER MEMBER)
    badgeBg:      '#eab308',   // gold background
    badgeText:    '#ffffff',   // white text

    // Active filter chip (e.g. "Hindu x")
    chipBg:       '#fee2e2',   // red-100
    chipText:     '#b91c1c',   // red-700
    chipBorder:   '#dc2626',   // red-600

    // Welcome card
    welcomeCardGradient: 'linear-gradient(to right, #dc2626, #b91c1c)', // red-600 to red-700
    welcomeBadgeBg:  '#eab308',   // gold
    welcomeBadgeText: '#ffffff',  // white text
    
    // Card backgrounds
    cardBg:       '#ffffff',   // white
    cardBorder:   '#f3f4f6',   // gray-100
    
    // Section backgrounds
    sectionBg:    '#f9fafb',   // gray-50
  },

  // Tailwind Classes - Updated to match navbar
  classes: {
    bgGradient:  'from-red-50 to-yellow-50',
    blob1:       'bg-red-600',      // primary blob
    blob2:       'bg-yellow-500',   // gold blob
    blob3:       'bg-red-400',      // lighter red blob
    header:      'from-red-700 via-red-600 to-red-700',  // matches navbar gradient
    cardBg:      'bg-white',
    textColor:   'text-red-700',
    textMuted:   'text-gray-600',
    textGold:    'text-yellow-500',
    badge:       'bg-yellow-500 text-white',
    border:      'border-red-200',
    borderGold:  'border-yellow-500',
  },

  // UI Component Styles
  components: {
    button: {
      // Primary CTA — Red with white text (like "Register Now") - matches navbar buttons
      primary:   'bg-red-600 hover:bg-red-700 text-white font-semibold rounded-lg shadow-md hover:shadow-lg transition-all duration-300',
      // Secondary — Gold with white text
      secondary: 'bg-yellow-500 hover:bg-yellow-600 text-white font-semibold rounded-lg shadow-md hover:shadow-lg transition-all duration-300',
      // Outline — Red border, red text on white
      outline:   'border-2 border-red-600 text-red-600 hover:bg-red-50 bg-white rounded-lg font-semibold transition-all duration-300',
      // Gold outline
      outlineGold: 'border-2 border-yellow-500 text-yellow-600 hover:bg-yellow-50 bg-white rounded-lg font-semibold transition-all duration-300',
    },

    // Quick filter pills (e.g. Religion: Hindu / Muslim)
    filterPill: {
      active:   'bg-red-600 text-white border border-red-700 font-medium',          // red when selected
      inactive: 'bg-white text-gray-700 border border-gray-300 hover:bg-red-50 hover:border-red-300 font-medium',
    },

    // Active filter chips (e.g. "Hindu x")
    chip: {
      base: 'bg-red-100 text-red-700 border border-red-400 rounded-full px-3 py-1 text-sm font-medium',
      remove: 'hover:bg-red-200 rounded-full p-1 ml-1',
    },

    // "Show All Profiles" button → RED
    ctaButton: 'bg-red-600 hover:bg-red-700 text-white font-bold rounded-lg px-6 py-3 shadow-lg hover:shadow-xl transition-all duration-300',

    card: {
      base:  'bg-white border border-gray-200 rounded-xl shadow-sm',
      hover: 'hover:shadow-lg hover:border-red-400 hover:shadow-red-100 transition-all duration-300',
      gold:  'border-t-4 border-t-yellow-500', // Gold accent on top
    },

    input: {
      base: 'border-gray-300 focus:border-red-600 focus:ring-red-600 rounded-lg',
      gold: 'border-gray-300 focus:border-yellow-500 focus:ring-yellow-500 rounded-lg',
    },

    // Header title style (like "Eliteinova Matrimonial Services") - matches navbar
    heading: {
      title:    'text-white font-bold text-2xl',       // white
      subtitle: 'text-yellow-400 font-medium', // gold - matches navbar
      section:  'text-red-700 font-bold text-xl', // for section headings
      gold:     'text-yellow-500 font-semibold', // gold text
    },

    // Navigation links - matches navbar
    navLink: {
      active:   'text-yellow-400 font-bold',
      inactive: 'text-white hover:text-yellow-300',
    },

    // Badges
    badge: {
      gold:  'bg-yellow-500 text-white px-3 py-1 rounded-full text-xs font-bold',
      red:   'bg-red-600 text-white px-3 py-1 rounded-full text-xs font-bold',
      outline: 'border border-yellow-500 text-yellow-600 bg-white px-3 py-1 rounded-full text-xs font-bold',
    },

    // Text styles
    text: {
      body:    'text-gray-700',      // Dark gray for body text - clearly visible
      muted:   'text-gray-500',
      red:     'text-red-600',
      gold:    'text-yellow-600',
      white:   'text-white',
      heading: 'text-gray-900 font-bold', // Almost black for headings
    },
  },

  background: {
    type:      'animated',
    animation: 'silver',
    image:     null,
  },

  // Additional theme utilities
  utilities: {
    gradient: {
      redToGold: 'bg-gradient-to-r from-red-600 to-yellow-500',
      goldToRed: 'bg-gradient-to-r from-yellow-500 to-red-600',
      redToDark: 'bg-gradient-to-r from-red-600 to-red-800',
    },
    shadows: {
      red:   'shadow-lg shadow-red-100',
      gold:  'shadow-lg shadow-yellow-100',
    },
  },
};

export default silverTheme;