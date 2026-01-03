// Theme Index - Export all themes and utility functions
import silverTheme from './silverTheme';
import goldTheme from './goldTheme';
import diamondTheme from './diamondTheme';

// Theme mapping
export const themes = {
  SILVER: silverTheme,
  GOLD: goldTheme,
  DIAMOND: diamondTheme,
  FREE: silverTheme, // Default to silver for FREE members
};

/**
 * Get theme by membership type
 * @param {string} membershipType - Membership type (SILVER, GOLD, DIAMOND, FREE)
 * @returns {object} Theme configuration object
 */
export const getThemeByMembership = (membershipType) => {
  if (!membershipType) {
    return silverTheme; // Default theme
  }
  
  const normalizedType = membershipType.toUpperCase();
  return themes[normalizedType] || silverTheme;
};

/**
 * Get theme colors
 * @param {string} membershipType - Membership type
 * @returns {object} Color palette
 */
export const getThemeColors = (membershipType) => {
  const theme = getThemeByMembership(membershipType);
  return theme.colors;
};

/**
 * Get theme classes
 * @param {string} membershipType - Membership type
 * @returns {object} Tailwind classes
 */
export const getThemeClasses = (membershipType) => {
  const theme = getThemeByMembership(membershipType);
  return theme.classes;
};

// Export individual themes
export { silverTheme, goldTheme, diamondTheme };

// Default export
export default themes;

