
import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { KanbanColumnType } from '../KanbanBoard';
import { JobStatus } from '@/types/job';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Trash2, GripVertical } from 'lucide-react';
import { ColorSelector } from './ColorSelector';
import { StatusManager } from './StatusManager';

interface SortableColumnItemProps {
  column: KanbanColumnType;
  columnIndex: number;
  onUpdateColumn: (index: number, updates: Partial<KanbanColumnType>) => void;
  onDeleteColumn: (index: number) => void;
  onAddStatus: (columnIndex: number) => void;
  onRemoveStatus: (columnIndex: number, statusIndex: number) => void;
  onUpdateStatus: (columnIndex: number, statusIndex: number, newStatus: JobStatus) => void;
}

export const SortableColumnItem: React.FC<SortableColumnItemProps> = ({
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

  const handleAddStatus = () => onAddStatus(columnIndex);
  const handleRemoveStatus = (statusIndex: number) => onRemoveStatus(columnIndex, statusIndex);
  const handleUpdateStatus = (statusIndex: number, newStatus: JobStatus) => 
    onUpdateStatus(columnIndex, statusIndex, newStatus);

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="border border-border rounded-lg p-4 space-y-4 bg-card"
    >
      <div className="flex items-center gap-4">
        <div
          {...attributes}
          {...listeners}
          className="cursor-grab active:cursor-grabbing touch-none"
        >
          <GripVertical className="w-5 h-5 text-muted-foreground" />
        </div>
        
        {column.isDefault ? (
          <div className="flex-1 grid grid-cols-3 gap-4">
            <div>
              <Label className="text-sm font-medium text-foreground">{column.title}</Label>
              <p className="text-xs text-muted-foreground mt-1">Default column</p>
            </div>
            
            <div className="flex items-center space-x-2">
              <Switch
                checked={column.enabled}
                onCheckedChange={(checked) => onUpdateColumn(columnIndex, { enabled: checked })}
              />
              <Label className="text-sm text-foreground">
                {column.enabled ? 'Enabled' : 'Disabled'}
              </Label>
            </div>
            
            <div className="flex items-center gap-2">
              <div className={`w-3 h-3 rounded-full ${column.color}`}></div>
              <span className="text-sm text-muted-foreground">{column.color.replace('bg-', '').replace('-500', '')}</span>
            </div>
          </div>
        ) : (
          <div className="flex-1 grid grid-cols-3 gap-4">
            <div>
              <Label htmlFor={`title-${columnIndex}`} className="text-foreground">Column Title</Label>
              <Input
                id={`title-${columnIndex}`}
                value={column.title}
                onChange={(e) => onUpdateColumn(columnIndex, { title: e.target.value })}
                className="bg-background border-border text-foreground"
              />
            </div>
            
            <ColorSelector
              value={column.color}
              onChange={(value) => onUpdateColumn(columnIndex, { color: value })}
              id={`color-${columnIndex}`}
            />
            
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

      {(column.enabled || !column.isDefault) && (
        <StatusManager
          statusValues={column.statusValues}
          isDefault={column.isDefault}
          onAddStatus={handleAddStatus}
          onRemoveStatus={handleRemoveStatus}
          onUpdateStatus={handleUpdateStatus}
        />
      )}
    </div>
  );
};
