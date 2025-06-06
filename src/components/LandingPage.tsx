
import React from 'react';
import { LandingHeader } from './landing/LandingHeader';
import { HeroSection } from './landing/HeroSection';
import { FeaturesSection } from './landing/FeaturesSection';
import { AnalyticsSection } from './landing/AnalyticsSection';
import { CTASection } from './landing/CTASection';
import { LandingFooter } from './landing/LandingFooter';

interface LandingPageProps {
  onGetStarted: () => void;
  onLogin?: () => void;
  onSignup?: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onGetStarted, onLogin, onSignup }) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800">
      <LandingHeader 
        onLogin={onLogin || onGetStarted} 
        onSignup={onSignup || onGetStarted} 
      />
      <HeroSection onGetStarted={onGetStarted} />
      <FeaturesSection />
      <AnalyticsSection onGetStarted={onGetStarted} />
      <CTASection onGetStarted={onGetStarted} />
      <LandingFooter />
    </div>
  );
};
