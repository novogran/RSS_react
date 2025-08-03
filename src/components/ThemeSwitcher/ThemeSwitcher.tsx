import { useTheme } from '../../hooks/useTheme';
import './ThemeSwitcher.css';

const ThemeSwitcher = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <div className="theme-switcher-container">
      <span className="theme-label">Light</span>
      <label className="theme-switch">
        <input
          type="checkbox"
          checked={theme === 'dark'}
          onChange={toggleTheme}
        />
        <span className="slider round"></span>
      </label>
      <span className="theme-label">Dark</span>
    </div>
  );
};

export default ThemeSwitcher;
