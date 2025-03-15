import { createContext, PropsWithChildren, useEffect, useState } from "react";
import { darkColors, lightColors, ThemeColors } from "../../config/theme/theme";
import { Appearance, AppState } from "react-native";

type ThemeColor = 'light' | 'dark';

interface ThemeContextProps {
  theme: {
    colors: ThemeColors;
    isDark: boolean;
    currentTheme: ThemeColor;
    spacing: {
      xs: number;
      sm: number;
      md: number;
      lg: number;
      xl: number;
      xxl: number;
      xxxl: number;
    };
    borderRadius: {
      small: number;
      medium: number;
      large: number;
      round: number;
    };
    typography: {
      fontSize: {
        xs: number;
        sm: number;
        md: number;
        lg: number;
        xl: number;
        xxl: number;
        xxxl: number;
      };
    };
    shadows: {
      small: {
        shadowColor: string;
        shadowOffset: { width: number; height: number };
        shadowOpacity: number;
        shadowRadius: number;
        elevation: number;
      };
      medium: {
        shadowColor: string;
        shadowOffset: { width: number; height: number };
        shadowOpacity: number;
        shadowRadius: number;
        elevation: number;
      },
      large: {
        shadowColor: string;
        shadowOffset: { width: number; height: number };
        shadowOpacity: number;
        shadowRadius: number;
        elevation: number;
      }
    };
  },
  toggleTheme: () => void;
  setTheme: (theme: ThemeColor) => void;
}

export const ThemeContext = createContext({} as ThemeContextProps);

export const ThemeProvider = ({ children }: PropsWithChildren) => {
  const [currentTheme, setCurrentTheme] = useState<ThemeColor>('light')

  const isDark = currentTheme === 'dark'
  const colors = isDark ? darkColors : lightColors

  const spacing = {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
    xxl: 48,
    xxxl: 64,
  };

  const borderRadius = {
    small: 4,
    medium: 8,
    large: 16,
    round: 9999,
  };

  const typography = {
    fontSize: {
      xs: 12,
      sm: 14,
      md: 16,
      lg: 18,
      xl: 20,
      xxl: 24,
      xxxl: 32,
    },
  };

  const shadows = {
    small: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.2,
      shadowRadius: 1.41,
      elevation: 2,
    },
    medium: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.23,
      shadowRadius: 2.62,
      elevation: 4,
    },
    large: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.3,
      shadowRadius: 4.65,
      elevation: 6,
    },
  };

  const theme = {
    colors,
    isDark,
    currentTheme,
    spacing,
    borderRadius,
    typography,
    shadows,
  };

  const setTheme = (theme: ThemeColor) => {
    setCurrentTheme(theme)
  }

  const toggleTheme = () => {
    setCurrentTheme(prevTheme => (prevTheme === 'light' ? 'dark' : 'light'));
  };

  useEffect(() => {
    const subscription = AppState.addEventListener('change', nextAppState => {
      const colorScheme = Appearance.getColorScheme();
      setCurrentTheme(colorScheme === 'dark' ? 'dark' : 'light')
    });

    return () => {
      subscription.remove()
    }
  }, [])

  return (
    <ThemeContext.Provider
      value={{
        theme,
        toggleTheme: toggleTheme,
        setTheme: setTheme
      }}
    >
      {children}
    </ThemeContext.Provider>
  )
}
