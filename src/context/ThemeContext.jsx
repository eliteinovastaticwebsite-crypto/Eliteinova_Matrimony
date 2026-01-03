// Theme Context - Provides membership-based theme throughout the app
import React, { createContext, useContext, useMemo } from 'react';
import { useAuth } from './AuthContext';
import { getThemeByMembership } from '../config/themes';

const ThemeContext = createContext();

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

export const ThemeProvider = ({ children }) => {
  const { user } = useAuth();

  // Get membership type from user
  const getMembershipType = () => {
    if (!user) {
      console.log('🎨 ThemeContext: No user found, defaulting to SILVER');
      return 'SILVER';
    }
    
    const membership = user.membership || user.membershipType || user.membershipPlan?.planName || user.plan?.name;
    
    console.log('🎨 ThemeContext: User object:', user);
    console.log('🎨 ThemeContext: Membership field values:', {
      'user.membership': user.membership,
      'user.membershipType': user.membershipType,
      'user.membershipPlan?.planName': user.membershipPlan?.planName,
      'user.plan?.name': user.plan?.name,
      'detected': membership
    });
    
    if (!membership) {
      console.log('🎨 ThemeContext: No membership found, defaulting to SILVER');
      return 'SILVER';
    }
    
    const normalized = String(membership).toUpperCase();
    console.log('🎨 ThemeContext: Normalized membership:', normalized);
    
    if (normalized.includes('SILVER')) return 'SILVER';
    if (normalized.includes('GOLD')) return 'GOLD';
    if (normalized.includes('DIAMOND')) return 'DIAMOND';
    if (normalized.includes('FREE')) return 'FREE';
    
    console.log('🎨 ThemeContext: Using normalized membership type:', normalized);
    return normalized;
  };

  const membershipType = useMemo(() => {
    const type = getMembershipType();
    console.log('🎨 ThemeContext: Final membership type:', type);
    return type;
  }, [user]);
  
  const theme = useMemo(() => {
    const selectedTheme = getThemeByMembership(membershipType);
    console.log('🎨 ThemeContext: Selected theme:', selectedTheme.name);
    return selectedTheme;
  }, [membershipType]);

  const value = {
    membershipType,
    theme,
    colors: theme.colors,
    classes: theme.classes,
    background: theme.background,
    components: theme.components,
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
};

export default ThemeContext;

