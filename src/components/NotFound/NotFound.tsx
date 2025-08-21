import { Link } from '@/i18n/navigation';
import './NotFound.css';
import { useTranslations } from 'next-intl';

const NotFound = () => {
  const t = useTranslations('NotFound');

  return (
    <div className="not-found" data-testid="not-found-container">
      <div className="not-found-content" data-testid="not-found-content">
        <div className="sad-pikachu" role="img" aria-label={t('sadPikachuAlt')}>
          😢
        </div>
        <h1>{t('title')}</h1>
        <p>{t('message')}</p>
        <Link href="/" className="home-link">
          {t('returnLink')}
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
