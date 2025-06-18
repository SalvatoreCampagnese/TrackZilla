
import React, { useState } from 'react';
import { KanbanColumnType } from './KanbanBoard';
import { JobStatus, JOB_STATUS_LABELS } from '@/types/job';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Trash2, Plus, GripVertical } from 'lucide-react';

interface ColumnSettingsProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  columns: KanbanColumnType[];
  onSave: (columns: KanbanColumnType[]) => void;
}

const AVAILABLE_COLORS = [
  { name: 'Blue', value: 'bg-blue-500' },
  { name: 'Green', value: 'bg-green-500' },
  { name: 'Yellow', value: 'bg-yellow-500' },
  { name: 'Orange', value: 'bg-orange-500' },
  { name: 'Red', value: 'bg-red-500' },
  { name: 'Purple', value: 'bg-purple-500' },
  { name: 'Pink', value: 'bg-pink-500' },
  { name: 'Indigo', value: 'bg-indigo-500' },
  { name: 'Gray', value: 'bg-gray-500' },
];

export const ColumnSettings: React.FC<ColumnSettingsProps> = ({
  open,
  onOpenChange,
  columns,
  onSave
}) => {
  const [editedColumns, setEditedColumns] = useState<KanbanColumnType[]>(columns);

  React.useEffect(() => {
    setEditedColumns(columns);
  }, [columns]);

  const updateColumn = (index: number, updates: Partial<KanbanColumnType>) => {
    const newColumns = [...editedColumns];
    newColumns[index] = { ...newColumns[index], ...updates };
    setEditedColumns(newColumns);
  };

  const deleteColumn = (index: number) => {
    setEditedColumns(editedColumns.filter((_, i) => i !== index));
  };

  const addStatus = (columnIndex: number) => {
    const newColumns = [...editedColumns];
    // Add a default status if available
    const availableStatuses = Object.keys(JOB_STATUS_LABELS) as JobStatus[];
    const usedStatuses = newColumns[columnIndex].statusValues;
    const availableStatus = availableStatuses.find(status => !usedStatuses.includes(status));
    
    if (availableStatus) {
      newColumns[columnIndex].statusValues.push(availableStatus);
      setEditedColumns(newColumns);
    }
  };

  const removeStatus = (columnIndex: number, statusIndex: number) => {
    const newColumns = [...editedColumns];
    newColumns[columnIndex].statusValues.splice(statusIndex, 1);
    setEditedColumns(newColumns);
  };

  const updateStatus = (columnIndex: number, statusIndex: number, newStatus: JobStatus) => {
    const newColumns = [...editedColumns];
    newColumns[columnIndex].statusValues[statusIndex] = newStatus;
    setEditedColumns(newColumns);
  };

  const handleSave = () => {
    onSave(editedColumns);
    onOpenChange(false);
  };

  const resetToDefaults = () => {
    const defaultColumns: KanbanColumnType[] = [
      {
        id: 'sent',
        title: 'Sent',
        statusValues: ['in-corso'],
        color: 'bg-blue-500',
        isDefault: true,
        enabled: true
      },
      {
        id: 'first-interview',
        title: '1st Interview',
        statusValues: ['primo-colloquio'],
        color: 'bg-yellow-500',
        isDefault: true,
        enabled: true
      },
      {
        id: 'second-interview',
        title: '2nd Interview',
        statusValues: ['secondo-colloquio'],
        color: 'bg-orange-500',
        isDefault: true,
        enabled: true
      },
      {
        id: 'third-interview',
        title: '3rd Interview',
        statusValues: ['colloquio-tecnico', 'colloquio-finale'],
        color: 'bg-purple-500',
        isDefault: true,
        enabled: true
      },
      {
        id: 'offer',
        title: 'Offer',
        statusValues: ['offerta-ricevuta'],
        color: 'bg-green-500',
        isDefault: true,
        enabled: true
      },
      {
        id: 'closed',
        title: 'Closed',
        statusValues: ['rifiutato', 'ritirato', 'ghosting'],
        color: 'bg-gray-500',
        isDefault: true,
        enabled: true
      }
    ];
    setEditedColumns(defaultColumns);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Customize Kanban Columns</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {editedColumns.map((column, columnIndex) => (
            <div key={column.id} className="border rounded-lg p-4 space-y-4">
              <div className="flex items-center gap-4">
                <GripVertical className="w-5 h-5 text-gray-400" />
                
                {column.isDefault ? (
                  // Default columns - only show enable/disable toggle
                  <div className="flex-1 grid grid-cols-3 gap-4">
                    <div>
                      <Label className="text-sm font-medium">{column.title}</Label>
                      <p className="text-xs text-gray-500 mt-1">Default column</p>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <Switch
                        checked={column.enabled}
                        onCheckedChange={(checked) => updateColumn(columnIndex, { enabled: checked })}
                      />
                      <Label className="text-sm">
                        {column.enabled ? 'Enabled' : 'Disabled'}
                      </Label>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <div className={`w-3 h-3 rounded-full ${column.color}`}></div>
                      <span className="text-sm text-gray-600">{column.color.replace('bg-', '').replace('-500', '')}</span>
                    </div>
                  </div>
                ) : (
                  // Custom columns - full editing
                  <div className="flex-1 grid grid-cols-3 gap-4">
                    <div>
                      <Label htmlFor={`title-${columnIndex}`}>Column Title</Label>
                      <Input
                        id={`title-${columnIndex}`}
                        value={column.title}
                        onChange={(e) => updateColumn(columnIndex, { title: e.target.value })}
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor={`color-${columnIndex}`}>Color</Label>
                      <Select
                        value={column.color}
                        onValueChange={(value) => updateColumn(columnIndex, { color: value })}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {AVAILABLE_COLORS.map((color) => (
                            <SelectItem key={color.value} value={color.value}>
                              <div className="flex items-center gap-2">
                                <div className={`w-3 h-3 rounded-full ${color.value}`}></div>
                                {color.name}
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="flex items-end">
                      <Button
                        onClick={() => deleteColumn(columnIndex)}
                        variant="destructive"
                        size="sm"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                )}
              </div>

              {/* Status Values - only for enabled columns or custom columns */}
              {(column.enabled || !column.isDefault) && (
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <Label>Status Values</Label>
                    {!column.isDefault && (
                      <Button
                        onClick={() => addStatus(columnIndex)}
                        variant="outline"
                        size="sm"
                      >
                        <Plus className="w-4 h-4 mr-2" />
                        Add Status
                      </Button>
                    )}
                  </div>
                  
                  <div className="grid grid-cols-2 gap-2">
                    {column.statusValues.map((status, statusIndex) => (
                      <div key={statusIndex} className="flex items-center gap-2">
                        {column.isDefault ? (
                          // Default columns - show status but don't allow editing
                          <div className="flex-1 p-2 bg-gray-50 rounded border text-sm">
                            {JOB_STATUS_LABELS[status as JobStatus] || status}
                          </div>
                        ) : (
                          // Custom columns - allow full editing
                          <>
                            <Select
                              value={status}
                              onValueChange={(value) => updateStatus(columnIndex, statusIndex, value as JobStatus)}
                            >
                              <SelectTrigger className="flex-1">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                {Object.entries(JOB_STATUS_LABELS).map(([key, label]) => (
                                  <SelectItem key={key} value={key}>
                                    {label}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            
                            <Button
                              onClick={() => removeStatus(columnIndex, statusIndex)}
                              variant="ghost"
                              size="sm"
                              disabled={column.statusValues.length <= 1}
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="flex items-center justify-between pt-4">
          <Button onClick={resetToDefaults} variant="outline">
            Reset to Defaults
          </Button>
          
          <div className="flex gap-2">
            <Button onClick={() => onOpenChange(false)} variant="outline">
              Cancel
            </Button>
            <Button onClick={handleSave}>
              Save Changes
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
