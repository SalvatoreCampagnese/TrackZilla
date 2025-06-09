
import { useEffect } from 'react';

const TermsPage = () => {
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

export default TermsPage;
