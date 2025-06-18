
import React from 'react';
import { JobStatus, JOB_STATUS_LABELS } from '@/types/job';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus, Trash2 } from 'lucide-react';

interface StatusManagerProps {
  statusValues: string[];
  isDefault: boolean;
  onAddStatus: () => void;
  onRemoveStatus: (index: number) => void;
  onUpdateStatus: (index: number, newStatus: JobStatus) => void;
}

export const StatusManager: React.FC<StatusManagerProps> = ({
  statusValues,
  isDefault,
  onAddStatus,
  onRemoveStatus,
  onUpdateStatus
}) => {
  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <Label className="text-foreground">Status Values</Label>
        {!isDefault && (
          <Button
            onClick={onAddStatus}
            variant="outline"
            size="sm"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Status
          </Button>
        )}
      </div>
      
      <div className="grid grid-cols-2 gap-2">
        {statusValues.map((status, statusIndex) => (
          <div key={statusIndex} className="flex items-center gap-2">
            {isDefault ? (
              <div className="flex-1 p-2 bg-muted border border-border rounded text-sm text-foreground font-medium">
                {JOB_STATUS_LABELS[status as JobStatus] || status}
              </div>
            ) : (
              <>
                <Select
                  value={status}
                  onValueChange={(value) => onUpdateStatus(statusIndex, value as JobStatus)}
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
                  onClick={() => onRemoveStatus(statusIndex)}
                  variant="ghost"
                  size="sm"
                  disabled={statusValues.length <= 1}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
