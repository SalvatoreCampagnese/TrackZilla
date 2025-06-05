
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Moon, Sun } from 'lucide-react';

interface SettingsModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const SettingsModal = ({ open, onOpenChange }: SettingsModalProps) => {
  const [ghostingDays, setGhostingDays] = useState(14);
  const [isDarkMode, setIsDarkMode] = useState(false);

  const handleSave = () => {
    // Salva le impostazioni nel localStorage
    localStorage.setItem('ghostingDays', ghostingDays.toString());
    localStorage.setItem('darkMode', isDarkMode.toString());
    
    // Applica il dark mode con transizione fluida
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    
    onOpenChange(false);
  };

  const handleDarkModeToggle = (checked: boolean) => {
    setIsDarkMode(checked);
    // Applica immediatamente per preview
    if (checked) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  // Carica le impostazioni salvate
  React.useEffect(() => {
    const savedGhostingDays = localStorage.getItem('ghostingDays');
    const savedDarkMode = localStorage.getItem('darkMode');
    
    if (savedGhostingDays) {
      setGhostingDays(parseInt(savedGhostingDays));
    }
    
    if (savedDarkMode) {
      const darkMode = savedDarkMode === 'true';
      setIsDarkMode(darkMode);
      if (darkMode) {
        document.documentElement.classList.add('dark');
      }
    }
  }, []);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            Impostazioni
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Impostazione giorni ghosting */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Candidature Ghosted</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <Label htmlFor="ghosting-days">
                  Giorni dopo cui una candidatura è considerata "ghosted"
                </Label>
                <Input
                  id="ghosting-days"
                  type="number"
                  min="1"
                  max="365"
                  value={ghostingDays}
                  onChange={(e) => setGhostingDays(parseInt(e.target.value) || 14)}
                  className="w-full"
                />
                <p className="text-sm text-muted-foreground">
                  Attualmente: {ghostingDays} giorni
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Impostazione dark mode */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Aspetto</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {isDarkMode ? (
                    <Moon className="w-4 h-4 text-blue-400" />
                  ) : (
                    <Sun className="w-4 h-4 text-yellow-500" />
                  )}
                  <Label htmlFor="dark-mode">
                    Modalità scura
                  </Label>
                </div>
                <Switch
                  id="dark-mode"
                  checked={isDarkMode}
                  onCheckedChange={handleDarkModeToggle}
                />
              </div>
              <p className="text-xs text-muted-foreground mt-2">
                {isDarkMode ? 'Tema scuro attivo - perfetto contrasto' : 'Tema chiaro attivo'}
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="flex justify-end gap-2 mt-6">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Annulla
          </Button>
          <Button onClick={handleSave}>
            Salva Impostazioni
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
