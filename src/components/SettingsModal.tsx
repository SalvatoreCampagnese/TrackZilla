
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

export const SettingsModal = ({ open, onOpenChange }: SettingsModalProps) => {
  const [ghostingDays, setGhostingDays] = useState(14);
  const [savedGhostingDays, setSavedGhostingDays] = useState(14);

  const handleSave = () => {
    // Save settings to localStorage
    localStorage.setItem('ghostingDays', ghostingDays.toString());
    setSavedGhostingDays(ghostingDays);
    onOpenChange(false);
  };

  // Load saved settings
  React.useEffect(() => {
    const savedGhostingDays = localStorage.getItem('ghostingDays');
    
    if (savedGhostingDays) {
      const days = parseInt(savedGhostingDays);
      setGhostingDays(days);
      setSavedGhostingDays(days);
    }
  }, []);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md bg-card border-gray-700">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-foreground">
            Settings
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
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
