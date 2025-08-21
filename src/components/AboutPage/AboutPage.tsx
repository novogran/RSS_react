import { Link } from '@/i18n/navigation';
import './AboutPage.css';
import { useTranslations } from 'next-intl';

export function AboutPage() {
  const t = useTranslations('AboutPage');

  return (
    <div className="about-container">
      <div className="about-content">
        <h1>{t('title')}</h1>

        <div className="developer-info">
          <div
            className="avatar-placeholder"
            data-testid="avatar-placeholder"
            aria-hidden="true"
          ></div>
          <div className="developer-details">
            <h2>{t('developerName')}</h2>
            <ul
              className="developer-stats"
              aria-label={t('developerStatsLabel')}
            >
              <li>
                <strong>{t('ageLabel')}:</strong> {t('ageValue')}
              </li>
              <li>
                <strong>{t('locationLabel')}:</strong> {t('locationValue')}
              </li>
              <li>
                <strong>{t('specialtyLabel')}:</strong> {t('specialtyValue')}
              </li>
            </ul>
          </div>
        </div>

        <div className="developer-story">
          <h3>{t('journeyTitle')}</h3>
          <p>{t('journeyParagraph1')}</p>
          <p>{t('journeyParagraph2')}</p>

          <h3>{t('interestsTitle')}</h3>
          <p>{t('interestsIntro')}</p>
          <ul aria-label={t('interestsListLabel')}>
            <li>🎮 {t('interest1')}</li>
            <li>🔧 {t('interest2')}</li>
            <li>🏊 {t('interest3')}</li>
          </ul>

          <h3>{t('aspirationsTitle')}</h3>
          <p>{t('aspirationsText')}</p>
        </div>

        <div className="rs-school">
          <h3>{t('educationTitle')}</h3>
          <p>{t('educationText')}</p>
          <Link
            href="https://rs.school/courses/reactjs"
            target="_blank"
            rel="noopener noreferrer"
            className="rs-link"
            aria-label={t('rsSchoolLinkLabel')}
          >
            {t('rsSchoolLinkText')}
          </Link>
        </div>
      </div>
    </div>
  );
}

export default AboutPage;
