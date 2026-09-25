
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, User, Clock, Shield, Languages } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { LanguageSelector } from '@/components/common/LanguageSelector';

interface UserProfile {
  firstName?: string;
  middleName?: string;
  lastName?: string;
  role?: string;
  currentCompany?: string;
}

const SettingsPage = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [ghostingDays, setGhostingDays] = useState(14);
  const [savedGhostingDays, setSavedGhostingDays] = useState(14);
  
  const [userProfile, setUserProfile] = useState<UserProfile>({
    firstName: '',
    middleName: '',
    lastName: '',
    role: '',
    currentCompany: ''
  });
  
  const [savedUserProfile, setSavedUserProfile] = useState<UserProfile>({
    firstName: '',
    middleName: '',
    lastName: '',
    role: '',
    currentCompany: ''
  });

  const handleSave = () => {
    localStorage.setItem('ghostingDays', ghostingDays.toString());
    localStorage.setItem('userProfile', JSON.stringify(userProfile));
    
    setSavedGhostingDays(ghostingDays);
    setSavedUserProfile(userProfile);
  };

  // Load saved settings
  React.useEffect(() => {
    const savedGhostingDays = localStorage.getItem('ghostingDays');
    const savedProfile = localStorage.getItem('userProfile');
    
    if (savedGhostingDays) {
      const days = parseInt(savedGhostingDays);
      setGhostingDays(days);
      setSavedGhostingDays(days);
    }
    
    if (savedProfile) {
      const profile = JSON.parse(savedProfile);
      setUserProfile(profile);
      setSavedUserProfile(profile);
    }
  }, []);

  const handleProfileChange = (field: keyof UserProfile, value: string) => {
    setUserProfile(prev => ({
      ...prev,
      [field]: value
    }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800">
      {/* Header */}
      <header className="flex items-center justify-between p-4 lg:p-6 border-b border-white/20">
        <div className="flex items-center gap-4">
          <Button
            onClick={() => navigate('/')}
            variant="ghost"
            size="icon"
            className="text-white hover:bg-white/10"
            aria-label={t('settings.backToHome')}
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-white">{t('settings.title')}</h1>
            <p className="text-sm text-white/70">{t('settings.subtitle')}</p>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 max-w-4xl">
        <div className="space-y-6">
          {/* Personal Information */}
          <Card className="bg-white/10 backdrop-blur-md border-white/20 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-white">
                <User className="w-5 h-5" />
                {t('settings.personalInfo')}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="first-name" className="text-white/90">
                    {t('settings.firstName')}
                  </Label>
                  <Input
                    id="first-name"
                    type="text"
                    value={userProfile.firstName || ''}
                    onChange={(e) => handleProfileChange('firstName', e.target.value)}
                    className="bg-white/10 border-white/20 text-white placeholder:text-white/50"
                    placeholder={t('settings.firstNamePlaceholder')}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="middle-name" className="text-white/90">
                    {t('settings.middleName')}
                  </Label>
                  <Input
                    id="middle-name"
                    type="text"
                    value={userProfile.middleName || ''}
                    onChange={(e) => handleProfileChange('middleName', e.target.value)}
                    className="bg-white/10 border-white/20 text-white placeholder:text-white/50"
                    placeholder={t('settings.middleNamePlaceholder')}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="last-name" className="text-white/90">
                  {t('settings.lastName')}
                </Label>
                <Input
                  id="last-name"
                  type="text"
                  value={userProfile.lastName || ''}
                  onChange={(e) => handleProfileChange('lastName', e.target.value)}
                  className="bg-white/10 border-white/20 text-white placeholder:text-white/50"
                  placeholder={t('settings.lastNamePlaceholder')}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="role" className="text-white/90">
                  {t('settings.role')}
                </Label>
                <Input
                  id="role"
                  type="text"
                  value={userProfile.role || ''}
                  onChange={(e) => handleProfileChange('role', e.target.value)}
                  className="bg-white/10 border-white/20 text-white placeholder:text-white/50"
                  placeholder={t('settings.rolePlaceholder')}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="current-company" className="text-white/90">
                  {t('settings.currentCompany')}
                </Label>
                <Input
                  id="current-company"
                  type="text"
                  value={userProfile.currentCompany || ''}
                  onChange={(e) => handleProfileChange('currentCompany', e.target.value)}
                  className="bg-white/10 border-white/20 text-white placeholder:text-white/50"
                  placeholder={t('settings.currentCompanyPlaceholder')}
                />
              </div>
            </CardContent>
          </Card>

          <Separator className="bg-white/20" />

          {/* Application Settings */}
          <Card className="bg-white/10 backdrop-blur-md border-white/20 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-white">
                <Clock className="w-5 h-5" />
                {t('settings.applicationSettings')}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="ghosting-days" className="text-white/90">
                    {t('settings.ghostingDaysLabel')}
                  </Label>
                  <Input
                    id="ghosting-days"
                    type="number"
                    min="1"
                    max="365"
                    value={ghostingDays}
                    onChange={(e) => setGhostingDays(parseInt(e.target.value) || 14)}
                    className="bg-white/10 border-white/20 text-white w-32"
                  />
                  <p className="text-sm text-white/60">
                    {t('settings.currentlyDays', { count: savedGhostingDays })}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Separator className="bg-white/20" />

          {/* Language */}
          <Card className="bg-white/10 backdrop-blur-md border-white/20 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-white">
                <Languages className="w-5 h-5" />
                {t('settings.language')}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <Label htmlFor="language-select" className="text-white/90">
                  {t('settings.selectLanguage')}
                </Label>
                <LanguageSelector className="bg-white/10 border-white/20 text-white w-full md:w-64" />
              </div>
            </CardContent>
          </Card>

          <Separator className="bg-white/20" />

          {/* Privacy & Security */}
          <Card className="bg-white/10 backdrop-blur-md border-white/20 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-white">
                <Shield className="w-5 h-5" />
                {t('settings.privacySecurity')}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-white/70 text-sm">
                {t('settings.privacyDescription')}
              </p>
            </CardContent>
          </Card>

          {/* Save Button */}
          <div className="flex justify-end pt-4">
            <Button 
              onClick={handleSave}
              className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white px-8"
            >
              {t('settings.saveSettings')}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;
