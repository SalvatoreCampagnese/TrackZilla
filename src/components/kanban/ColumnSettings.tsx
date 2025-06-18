
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
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import {
  useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

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

interface SortableColumnItemProps {
  column: KanbanColumnType;
  columnIndex: number;
  onUpdateColumn: (index: number, updates: Partial<KanbanColumnType>) => void;
  onDeleteColumn: (index: number) => void;
  onAddStatus: (columnIndex: number) => void;
  onRemoveStatus: (columnIndex: number, statusIndex: number) => void;
  onUpdateStatus: (columnIndex: number, statusIndex: number, newStatus: JobStatus) => void;
}

const SortableColumnItem: React.FC<SortableColumnItemProps> = ({
  column,
  columnIndex,
  onUpdateColumn,
  onDeleteColumn,
  onAddStatus,
  onRemoveStatus,
  onUpdateStatus,
}) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: column.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="border rounded-lg p-4 space-y-4 bg-white"
    >
      <div className="flex items-center gap-4">
        <div
          {...attributes}
          {...listeners}
          className="cursor-grab active:cursor-grabbing touch-none"
        >
          <GripVertical className="w-5 h-5 text-gray-400" />
        </div>
        
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
                onCheckedChange={(checked) => onUpdateColumn(columnIndex, { enabled: checked })}
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
                onChange={(e) => onUpdateColumn(columnIndex, { title: e.target.value })}
              />
            </div>
            
            <div>
              <Label htmlFor={`color-${columnIndex}`}>Color</Label>
              <Select
                value={column.color}
                onValueChange={(value) => onUpdateColumn(columnIndex, { color: value })}
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
                onClick={() => onDeleteColumn(columnIndex)}
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
                onClick={() => onAddStatus(columnIndex)}
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
                  // Default columns - show status with better styling
                  <div className="flex-1 p-2 bg-gray-50 border border-gray-200 rounded text-sm text-gray-800 font-medium">
                    {JOB_STATUS_LABELS[status as JobStatus] || status}
                  </div>
                ) : (
                  // Custom columns - allow full editing
                  <>
                    <Select
                      value={status}
                      onValueChange={(value) => onUpdateStatus(columnIndex, statusIndex, value as JobStatus)}
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
                      onClick={() => onRemoveStatus(columnIndex, statusIndex)}
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
  );
};

export const ColumnSettings: React.FC<ColumnSettingsProps> = ({
  open,
  onOpenChange,
  columns,
  onSave
}) => {
  const [editedColumns, setEditedColumns] = useState<KanbanColumnType[]>(columns);
  
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  React.useEffect(() => {
    setEditedColumns(columns);
  }, [columns]);

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (active.id !== over?.id) {
      const oldIndex = editedColumns.findIndex((column) => column.id === active.id);
      const newIndex = editedColumns.findIndex((column) => column.id === over?.id);

      setEditedColumns((columns) => arrayMove(columns, oldIndex, newIndex));
    }
  };

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
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
          >
            <SortableContext
              items={editedColumns.map(col => col.id)}
              strategy={verticalListSortingStrategy}
            >
              {editedColumns.map((column, columnIndex) => (
                <SortableColumnItem
                  key={column.id}
                  column={column}
                  columnIndex={columnIndex}
                  onUpdateColumn={updateColumn}
                  onDeleteColumn={deleteColumn}
                  onAddStatus={addStatus}
                  onRemoveStatus={removeStatus}
                  onUpdateStatus={updateStatus}
                />
              ))}
            </SortableContext>
          </DndContext>
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
