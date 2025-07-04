
import React, { useState } from 'react';
import { User, Clock, Shield } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';

interface UserProfile {
  firstName?: string;
  middleName?: string;
  lastName?: string;
  role?: string;
  currentCompany?: string;
}

export const SettingsContent = () => {
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
    <div className="space-y-6 max-w-4xl">
      <div>
        <h2 className="text-2xl font-bold text-white mb-2">Settings</h2>
        <p className="text-white/70">Manage your account preferences</p>
      </div>

      {/* Personal Information */}
      <Card className="bg-white/10 backdrop-blur-md border-white/20 shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-white">
            <User className="w-5 h-5" />
            Personal Information
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="first-name" className="text-white/90">
                First Name
              </Label>
              <Input
                id="first-name"
                type="text"
                value={userProfile.firstName || ''}
                onChange={(e) => handleProfileChange('firstName', e.target.value)}
                className="bg-white/10 border-white/20 text-white placeholder:text-white/50"
                placeholder="Your first name"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="middle-name" className="text-white/90">
                Middle Name
              </Label>
              <Input
                id="middle-name"
                type="text"
                value={userProfile.middleName || ''}
                onChange={(e) => handleProfileChange('middleName', e.target.value)}
                className="bg-white/10 border-white/20 text-white placeholder:text-white/50"
                placeholder="Your middle name"
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="last-name" className="text-white/90">
              Last Name
            </Label>
            <Input
              id="last-name"
              type="text"
              value={userProfile.lastName || ''}
              onChange={(e) => handleProfileChange('lastName', e.target.value)}
              className="bg-white/10 border-white/20 text-white placeholder:text-white/50"
              placeholder="Your last name"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="role" className="text-white/90">
              Role
            </Label>
            <Input
              id="role"
              type="text"
              value={userProfile.role || ''}
              onChange={(e) => handleProfileChange('role', e.target.value)}
              className="bg-white/10 border-white/20 text-white placeholder:text-white/50"
              placeholder="e.g., Software Engineer, Product Manager"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="current-company" className="text-white/90">
              Current Company
            </Label>
            <Input
              id="current-company"
              type="text"
              value={userProfile.currentCompany || ''}
              onChange={(e) => handleProfileChange('currentCompany', e.target.value)}
              className="bg-white/10 border-white/20 text-white placeholder:text-white/50"
              placeholder="Your current company"
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
            Application Settings
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="ghosting-days" className="text-white/90">
                Days after which an application is considered "ghosted"
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
                Currently: {savedGhostingDays} days
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Separator className="bg-white/20" />

      {/* Privacy & Security */}
      <Card className="bg-white/10 backdrop-blur-md border-white/20 shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-white">
            <Shield className="w-5 h-5" />
            Privacy & Security
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-white/70 text-sm">
            Your data is securely stored and encrypted. Only you have access to your job application data.
          </p>
        </CardContent>
      </Card>

      {/* Save Button */}
      <div className="flex justify-end pt-4">
        <Button 
          onClick={handleSave}
          className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white px-8"
        >
          Save Settings
        </Button>
      </div>
    </div>
  );
};
