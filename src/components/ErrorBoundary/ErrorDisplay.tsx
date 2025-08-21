import { useTranslations } from 'next-intl';

export default function ErrorDisplay({
  error,
  onReset,
}: {
  error: Error | null;
  onReset: () => void;
}) {
  const t = useTranslations('ErrorBoundary');

  return (
    <div className="error-boundary" role="alert">
      <div className="error-content">
        <h3>{t('title')}</h3>
        <p>{error?.message || t('defaultErrorMessage')}</p>
        <button
          onClick={onReset}
          className="error-button"
          aria-label={t('recoverButtonLabel')}
        >
          {t('recoverButtonText')}
        </button>
      </div>
    </div>
  );
}
