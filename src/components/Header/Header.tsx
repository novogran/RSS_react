'use client';

import './Header.css';
import { Link, usePathname, useRouter } from '@/i18n/navigation';
import { ThemeSwitcher } from '../ThemeSwitcher';
import { useLocale, useTranslations } from 'next-intl';

export const Header = () => {
  const pathname = usePathname();
  const locale = useLocale();
  const router = useRouter();
  const t = useTranslations('Header');

  const switchLanguage = () => {
    const newLocale = locale === 'en' ? 'ru' : 'en';
    router.replace(pathname, { locale: newLocale });
  };

  return (
    <header className="app-header">
      <div className="header-content">
        <button onClick={switchLanguage} className="language-switcher">
          {locale === 'en' ? 'Рус' : 'Eng'}
        </button>
        <h1 className="app-title">
          <Link href="/">{t('title')}</Link>
          <ThemeSwitcher />
        </h1>

        <nav className="nav-links">
          <Link
            href="/"
            className={`nav-link ${pathname === '/' ? 'active' : ''}`}
            passHref
          >
            {t('home')}
          </Link>
          <Link
            href="/about"
            className={`nav-link ${pathname.includes('/about') ? 'active' : ''}`}
            passHref
          >
            {t('about')}
          </Link>
        </nav>
      </div>
    </header>
  );
};

export default Header;
