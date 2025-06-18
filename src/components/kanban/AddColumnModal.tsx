
import React, { useState } from 'react';
import { KanbanColumnType } from './KanbanBoard';
import { JobStatus, JOB_STATUS_LABELS } from '@/types/job';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus, Trash2 } from 'lucide-react';
import { ColorSelector } from './settings/ColorSelector';

interface AddColumnModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (column: KanbanColumnType) => void;
}

export const AddColumnModal: React.FC<AddColumnModalProps> = ({
  open,
  onOpenChange,
  onSave
}) => {
  const [title, setTitle] = useState('');
  const [color, setColor] = useState('bg-blue-500');
  const [statusValues, setStatusValues] = useState<string[]>(['in-corso']);

  const handleSave = () => {
    if (!title.trim()) return;

    const newColumn: KanbanColumnType = {
      id: `column-${Date.now()}`,
      title: title.trim(),
      statusValues,
      color,
      isDefault: false,
      enabled: true
    };

    onSave(newColumn);
    
    // Reset form
    setTitle('');
    setColor('bg-blue-500');
    setStatusValues(['in-corso']);
    onOpenChange(false);
  };

  const addStatus = () => {
    const availableStatuses = Object.keys(JOB_STATUS_LABELS) as JobStatus[];
    const availableStatus = availableStatuses.find(status => !statusValues.includes(status));
    
    if (availableStatus) {
      setStatusValues([...statusValues, availableStatus]);
    }
  };

  const removeStatus = (index: number) => {
    if (statusValues.length > 1) {
      setStatusValues(statusValues.filter((_, i) => i !== index));
    }
  };

  const updateStatus = (index: number, newStatus: string) => {
    const newStatusValues = [...statusValues];
    newStatusValues[index] = newStatus;
    setStatusValues(newStatusValues);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md bg-background border-border">
        <DialogHeader>
          <DialogTitle className="text-foreground">Add New Column</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div>
            <Label htmlFor="column-title" className="text-foreground">Column Title</Label>
            <Input
              id="column-title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter column title"
              className="bg-background border-border text-foreground"
            />
          </div>

          <ColorSelector
            value={color}
            onChange={setColor}
            id="column-color"
          />

          <div>
            <div className="flex items-center justify-between mb-2">
              <Label className="text-foreground">Status Values</Label>
              <Button
                onClick={addStatus}
                variant="outline"
                size="sm"
                type="button"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Status
              </Button>
            </div>
            
            <div className="space-y-2">
              {statusValues.map((status, index) => (
                <div key={index} className="flex items-center gap-2">
                  <Select
                    value={status}
                    onValueChange={(value) => updateStatus(index, value)}
                  >
                    <SelectTrigger className="flex-1 bg-background border-border text-foreground">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-background border-border">
                      {Object.entries(JOB_STATUS_LABELS).map(([key, label]) => (
                        <SelectItem key={key} value={key}>
                          {label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  
                  <Button
                    onClick={() => removeStatus(index)}
                    variant="ghost"
                    size="sm"
                    disabled={statusValues.length <= 1}
                    type="button"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-2 pt-4">
          <Button onClick={() => onOpenChange(false)} variant="outline">
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={!title.trim()}>
            Add Column
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
