// Silver Membership Theme Configuration
export const silverTheme = {
  name: 'SILVER',
  displayName: 'Silver',

  // ─── Core Brand Colors (3 only) ───────────────────────────
  brand: {
    red:   '#cc0000',   // primary red (buttons, header bg, highlights)
    gold:  '#D4A017',   // gold (accents, badges, subtitles, borders)
    white: '#ffffff',   // white (text on red, card backgrounds)
  },

  // Color Palette
  colors: {
    primary:      '#cc0000',   // red
    primaryDark:  '#990000',   // darker red (hover states)
    primaryLight: '#e83030',   // lighter red
    accent:       '#D4A017',   // gold
    accentDark:   '#a87c10',   // darker gold (hover)
    accentLight:  '#f0c040',   // lighter gold (glow/shine effect)

    // Backgrounds
    bgGradientStyle: 'linear-gradient(135deg, #fff5f5 0%, #fffdf0 100%)',

    // Header
    headerGradientStyle: 'linear-gradient(to right, #990000, #cc0000, #990000)',

    // Text
    textOnRed:    '#ffffff',   // white text on red backgrounds
    textOnWhite:  '#cc0000',   // red text on white backgrounds
    textGold:     '#D4A017',   // gold text (subtitles, labels)
    textMuted:    '#888888',

    // Badge (e.g. SILVER MEMBER)
    badgeBg:      '#D4A017',   // gold background
    badgeText:    '#ffffff',   // white text

    // Active filter chip (e.g. "Hindu x")
    chipBg:       '#fff0f0',
    chipText:     '#cc0000',
    chipBorder:   '#cc0000',

    // Welcome card
    welcomeCardGradient: 'linear-gradient(to right, #cc0000, #990000)',
    welcomeBadgeBg:  '#D4A017',
    welcomeBadgeText: '#ffffff',
  },

  // Tailwind Classes
  classes: {
    bgGradient:  'from-red-50 to-amber-50',
    blob1:       'bg-red-600',
    blob2:       'bg-amber-500',
    blob3:       'bg-red-300',
    header:      'from-red-800 via-red-600 to-red-800',
    cardBg:      'bg-white',
    textColor:   'text-red-700',
    badge:       'bg-amber-500 text-white',
  },

  // UI Component Styles
  components: {
    button: {
      // Primary CTA — Red with white text (like "Register Now")
      primary:   'bg-red-600 hover:bg-red-700 text-white font-semibold rounded-lg',
      // Secondary — Gold with white text
      secondary: 'bg-amber-500 hover:bg-amber-600 text-white font-semibold rounded-lg',
      // Outline — Red border, red text on white
      outline:   'border-2 border-red-600 text-red-600 hover:bg-red-50 bg-white rounded-lg',
    },

    // Quick filter pills (e.g. Religion: Hindu / Muslim)
    filterPill: {
      active:   'bg-red-600 text-white border border-red-700',          // red when selected
      inactive: 'bg-white text-red-600 border border-red-300 hover:bg-red-50',
    },

    // Active filter chips (e.g. "Hindu x")
    chip: {
      base: 'bg-red-50 text-red-700 border border-red-400',
    },

    // "Show All Profiles" button → RED
    ctaButton: 'bg-red-600 hover:bg-red-700 text-white font-bold rounded-lg',

    card: {
      base:  'bg-white border border-gray-200',
      hover: 'hover:shadow-lg hover:border-red-400',
    },

    input: {
      base: 'border-red-300 focus:border-red-600 focus:ring-red-600',
    },

    // Header title style (like "Eliteinova Matrimonial Services")
    heading: {
      title:    'text-white font-bold',       // white
      subtitle: 'text-amber-400 font-medium', // gold
    },
  },

  background: {
    type:      'animated',
    animation: 'silver',
    image:     null,
  },
};

export default silverTheme;