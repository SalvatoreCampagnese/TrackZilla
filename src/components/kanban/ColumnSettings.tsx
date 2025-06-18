
import React, { useState } from 'react';
import { KanbanColumnType } from './KanbanBoard';
import { JobStatus, JOB_STATUS_LABELS } from '@/types/job';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
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
import { SortableColumnItem } from './settings/SortableColumnItem';

interface ColumnSettingsProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  columns: KanbanColumnType[];
  onSave: (columns: KanbanColumnType[]) => void;
}

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
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto bg-background border-border">
        <DialogHeader>
          <DialogTitle className="text-foreground">Customize Kanban Columns</DialogTitle>
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
