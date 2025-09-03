import { useEffect, useState } from 'react';
import { ThemeContext, type Theme } from './ThemeContext';

export const ThemeProvider = ({
  children,
  initialTheme = 'light',
}: {
  children: React.ReactNode;
  initialTheme?: Theme;
}) => {
  const [theme, setTheme] = useState<Theme>(initialTheme);

  useEffect(() => {
    const savedTheme = (localStorage.getItem('theme') as Theme) || 'light';
    setTheme(savedTheme);
    document.documentElement.setAttribute('data-theme', savedTheme);
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
    document.documentElement.setAttribute('data-theme', newTheme);
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};
