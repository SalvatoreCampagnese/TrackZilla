
import React from 'react';
import { DragDropContext, DropResult } from 'react-beautiful-dnd';
import { JobApplication } from '@/types/job';
import { KanbanColumnType } from './KanbanBoard';
import { KanbanColumnRenderer } from './KanbanColumnRenderer';

interface KanbanBoardGridProps {
  columns: KanbanColumnType[];
  applications: JobApplication[];
  isDragging: boolean;
  onDragStart: () => void;
  onDragEnd: (result: DropResult) => void;
  onDelete: (id: string) => void;
  onUpdateAlerts?: (applicationId: string, alerts: any[]) => void;
  onMoveCard: (applicationId: string) => void;
}

export const KanbanBoardGrid: React.FC<KanbanBoardGridProps> = ({
  columns,
  applications,
  isDragging,
  onDragStart,
  onDragEnd,
  onDelete,
  onUpdateAlerts,
  onMoveCard
}) => {
  const getApplicationsForColumn = (column: KanbanColumnType) => {
    return applications.filter(app => column.statusValues.includes(app.status));
  };

  const enabledColumns = columns.filter(col => col.enabled);

  return (
    <div className="relative">
      <DragDropContext onDragStart={onDragStart} onDragEnd={onDragEnd}>
        <div className="flex gap-2 md:gap-4 overflow-x-auto pb-4 px-2 md:px-0">
          {enabledColumns.map((column) => {
            const columnApplications = getApplicationsForColumn(column);
            
            return (
              <KanbanColumnRenderer
                key={column.id}
                column={column}
                applications={columnApplications}
                isDragging={isDragging}
                onDelete={onDelete}
                onUpdateAlerts={onUpdateAlerts}
                onMoveCard={onMoveCard}
              />
            );
          })}
        </div>
      </DragDropContext>
    </div>
  );
};
