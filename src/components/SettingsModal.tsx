
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface SettingsModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

interface UserProfile {
  firstName?: string;
  middleName?: string;
  lastName?: string;
  role?: string;
  currentCompany?: string;
}

export const SettingsModal = ({ open, onOpenChange }: SettingsModalProps) => {
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
    // Save settings to localStorage
    localStorage.setItem('ghostingDays', ghostingDays.toString());
    localStorage.setItem('userProfile', JSON.stringify(userProfile));
    
    setSavedGhostingDays(ghostingDays);
    setSavedUserProfile(userProfile);
    onOpenChange(false);
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
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md bg-card border-gray-700 max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-foreground">
            Settings
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Personal Information */}
          <Card className="bg-gradient-to-br from-card to-gray-800/50 border-gray-700">
            <CardHeader>
              <CardTitle className="text-base text-foreground">Personal Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="first-name" className="text-foreground">
                    First Name
                  </Label>
                  <Input
                    id="first-name"
                    type="text"
                    value={userProfile.firstName || ''}
                    onChange={(e) => handleProfileChange('firstName', e.target.value)}
                    className="bg-background border-gray-600 text-foreground"
                    placeholder="Your first name"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="middle-name" className="text-foreground">
                    Middle Name
                  </Label>
                  <Input
                    id="middle-name"
                    type="text"
                    value={userProfile.middleName || ''}
                    onChange={(e) => handleProfileChange('middleName', e.target.value)}
                    className="bg-background border-gray-600 text-foreground"
                    placeholder="Your middle name"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="last-name" className="text-foreground">
                  Last Name
                </Label>
                <Input
                  id="last-name"
                  type="text"
                  value={userProfile.lastName || ''}
                  onChange={(e) => handleProfileChange('lastName', e.target.value)}
                  className="bg-background border-gray-600 text-foreground"
                  placeholder="Your last name"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="role" className="text-foreground">
                  Role
                </Label>
                <Input
                  id="role"
                  type="text"
                  value={userProfile.role || ''}
                  onChange={(e) => handleProfileChange('role', e.target.value)}
                  className="bg-background border-gray-600 text-foreground"
                  placeholder="e.g., Software Engineer, Product Manager"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="current-company" className="text-foreground">
                  Current Company
                </Label>
                <Input
                  id="current-company"
                  type="text"
                  value={userProfile.currentCompany || ''}
                  onChange={(e) => handleProfileChange('currentCompany', e.target.value)}
                  className="bg-background border-gray-600 text-foreground"
                  placeholder="Your current company"
                />
              </div>
            </CardContent>
          </Card>

          {/* Ghosting days setting */}
          <Card className="bg-gradient-to-br from-card to-gray-800/50 border-gray-700">
            <CardHeader>
              <CardTitle className="text-base text-foreground">Ghosted Applications</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <Label htmlFor="ghosting-days" className="text-foreground">
                  Days after which an application is considered "ghosted"
                </Label>
                <Input
                  id="ghosting-days"
                  type="number"
                  min="1"
                  max="365"
                  value={ghostingDays}
                  onChange={(e) => setGhostingDays(parseInt(e.target.value) || 14)}
                  className="w-full bg-background border-gray-600 text-foreground"
                />
                <p className="text-sm text-muted-foreground">
                  Currently: {savedGhostingDays} days
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="flex justify-end gap-2 mt-6">
          <Button 
            variant="outline" 
            onClick={() => onOpenChange(false)}
            className="border-gray-600 hover:bg-accent"
          >
            Cancel
          </Button>
          <Button 
            onClick={handleSave}
            className="bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white"
          >
            Save Settings
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
