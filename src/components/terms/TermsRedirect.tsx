
import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';

export const TermsRedirect = () => {
  const { t } = useTranslation();
  useEffect(() => {
    // Redirect to the static HTML file
    window.location.href = '/terms_privacy.html';
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <p>{t('terms.redirecting')}</p>
      </div>
    </div>
  );
};
