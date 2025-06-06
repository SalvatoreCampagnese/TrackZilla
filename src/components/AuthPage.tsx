
import React, { useState } from 'react';
import { LandingPage } from './LandingPage';
import { AuthForm } from './auth/AuthForm';

export const AuthPage = () => {
  const [showAuth, setShowAuth] = useState(false);
  const [activeTab, setActiveTab] = useState('signin');

  const handleLogin = () => {
    setActiveTab('signin');
    setShowAuth(true);
  };

  const handleSignup = () => {
    setActiveTab('signup');
    setShowAuth(true);
  };

  if (!showAuth) {
    return (
      <LandingPage 
        onGetStarted={() => setShowAuth(true)} 
        onLogin={handleLogin}
        onSignup={handleSignup}
      />
    );
  }

  return (
    <AuthForm
      onBack={() => setShowAuth(false)}
      activeTab={activeTab}
      setActiveTab={setActiveTab}
    />
  );
};
