import React, { useState } from 'react';
import { JobApplication, JobAlert } from '@/types/job';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Bell, Plus, Trash2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface AlertsManagerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  application: JobApplication;
  onSave: (applicationId: string, alerts: JobAlert[]) => void;
}

export const AlertsManager: React.FC<AlertsManagerProps> = ({
  open,
  onOpenChange,
  application,
  onSave
}) => {
  const [alerts, setAlerts] = useState<JobAlert[]>(application.alerts || []);
  const [interviewDate, setInterviewDate] = useState(application.interviewDate || '');
  const [deadline, setDeadline] = useState(application.deadline || '');

  const addAlert = (type: 'interview' | 'deadline') => {
    const baseDate = type === 'interview' ? interviewDate : deadline;
    if (!baseDate) return;

    const newAlert: JobAlert = {
      id: `alert-${Date.now()}`,
      type,
      alertTime: new Date(baseDate).toISOString(),
      beforeAmount: 1,
      beforeUnit: 'days',
      recurring: false,
      isActive: true
    };

    setAlerts(prev => [...prev, newAlert]);
  };

  const updateAlert = (alertId: string, updates: Partial<JobAlert>) => {
    setAlerts(prev => prev.map(alert => 
      alert.id === alertId ? { ...alert, ...updates } : alert
    ));
  };

  const removeAlert = (alertId: string) => {
    setAlerts(prev => prev.filter(alert => alert.id !== alertId));
  };

  const handleSave = () => {
    // Calculate alert times based on before settings
    const updatedAlerts = alerts.map(alert => {
      const baseDate = alert.type === 'interview' ? interviewDate : deadline;
      if (!baseDate) return alert;

      const baseTime = new Date(baseDate);
      const alertTime = new Date(baseTime);

      // Subtract the "before" time
      switch (alert.beforeUnit) {
        case 'minutes':
          alertTime.setMinutes(alertTime.getMinutes() - alert.beforeAmount);
          break;
        case 'hours':
          alertTime.setHours(alertTime.getHours() - alert.beforeAmount);
          break;
        case 'days':
          alertTime.setDate(alertTime.getDate() - alert.beforeAmount);
          break;
      }

      return { ...alert, alertTime: alertTime.toISOString() };
    });

    onSave(application.id, updatedAlerts);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl bg-gray-900 border-gray-700 text-white max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Bell className="w-5 h-5" />
            Manage Alerts - {application.companyName}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Date Settings */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="interview-date">Interview Date</Label>
              <Input
                id="interview-date"
                type="datetime-local"
                value={interviewDate}
                onChange={(e) => setInterviewDate(e.target.value)}
                className="bg-gray-800 border-gray-600 text-white"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="deadline">Deadline</Label>
              <Input
                id="deadline"
                type="datetime-local"
                value={deadline}
                onChange={(e) => setDeadline(e.target.value)}
                className="bg-gray-800 border-gray-600 text-white"
              />
            </div>
          </div>

          {/* Add Alert Buttons */}
          <div className="flex gap-2">
            <Button
              onClick={() => addAlert('interview')}
              disabled={!interviewDate}
              variant="outline"
              size="sm"
              className="border-blue-500 text-blue-400 hover:bg-blue-500/20"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Interview Alert
            </Button>
            <Button
              onClick={() => addAlert('deadline')}
              disabled={!deadline}
              variant="outline"
              size="sm"
              className="border-orange-500 text-orange-400 hover:bg-orange-500/20"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Deadline Alert
            </Button>
          </div>

          {/* Existing Alerts */}
          {alerts.length > 0 && (
            <div className="space-y-3">
              <h3 className="text-lg font-semibold">Active Alerts</h3>
              {alerts.map((alert) => (
                <Card key={alert.id} className="bg-gray-800 border-gray-600">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm flex items-center justify-between">
                      <span className="capitalize">{alert.type} Alert</span>
                      <Button
                        onClick={() => removeAlert(alert.id)}
                        variant="ghost"
                        size="sm"
                        className="text-red-400 hover:text-red-300 hover:bg-red-500/20"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Alert Before</Label>
                        <div className="flex gap-2">
                          <Input
                            type="number"
                            min="1"
                            value={alert.beforeAmount}
                            onChange={(e) => updateAlert(alert.id, { beforeAmount: parseInt(e.target.value) })}
                            className="bg-gray-700 border-gray-600 text-white"
                          />
                          <Select
                            value={alert.beforeUnit}
                            onValueChange={(value: 'minutes' | 'hours' | 'days') => 
                              updateAlert(alert.id, { beforeUnit: value })
                            }
                          >
                            <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent className="bg-gray-800 border-gray-600">
                              <SelectItem value="minutes">Minutes</SelectItem>
                              <SelectItem value="hours">Hours</SelectItem>
                              <SelectItem value="days">Days</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Switch
                          checked={alert.recurring}
                          onCheckedChange={(checked) => updateAlert(alert.id, { recurring: checked })}
                        />
                        <Label>Recurring</Label>
                      </div>
                      <div className="flex items-center gap-2">
                        <Switch
                          checked={alert.isActive}
                          onCheckedChange={(checked) => updateAlert(alert.id, { isActive: checked })}
                        />
                        <Label>Active</Label>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          {/* Save Button */}
          <div className="flex justify-end gap-2 pt-4">
            <Button
              onClick={() => onOpenChange(false)}
              variant="outline"
              className="border-gray-600 text-gray-300 hover:bg-gray-800"
            >
              Cancel
            </Button>
            <Button
              onClick={handleSave}
              className="bg-red-500 hover:bg-red-600 text-white"
            >
              Save Alerts
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
