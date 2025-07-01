
import { useEffect } from 'react';

export const TermsRedirect = () => {
  useEffect(() => {
    // Redirect to the static HTML file
    window.location.href = '/terms_privacy.html';
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <p>Redirecting to Terms & Privacy Policy...</p>
      </div>
    </div>
  );
};
