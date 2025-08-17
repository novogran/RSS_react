import { useTheme } from '@/hooks/useTheme';
import './ThemeSwitcher.css';
import { useTranslations } from 'next-intl';

const ThemeSwitcher = () => {
  const { theme, toggleTheme } = useTheme();
  const t = useTranslations('ThemeSwitcher');

  return (
    <div className="theme-switcher-container">
      <span className="theme-label">{t('light')}</span>
      <label className="theme-switch">
        <input
          type="checkbox"
          checked={theme === 'dark'}
          onChange={toggleTheme}
          aria-label={t('toggleTheme')}
        />
        <span className="slider round"></span>
      </label>
      <span className="theme-label">{t('dark')}</span>
    </div>
  );
};

export default ThemeSwitcher;
