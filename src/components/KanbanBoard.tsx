
import React from 'react';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
  DragOverEvent,
} from '@dnd-kit/core';
import {
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { JobApplication, JobStatus, JOB_STATUS_LABELS } from '@/types/job';
import { KanbanColumn } from './kanban/KanbanColumn';

interface KanbanBoardProps {
  applications: JobApplication[];
  onUpdateStatus: (id: string, status: JobStatus) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
}

export const KanbanBoard: React.FC<KanbanBoardProps> = ({
  applications,
  onUpdateStatus,
  onDelete,
}) => {
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const columns: JobStatus[] = [
    'in-corso',
    'primo-colloquio',
    'secondo-colloquio',
    'colloquio-tecnico',
    'colloquio-finale',
    'offerta-ricevuta',
    'rifiutato',
    'ghosting',
    'ritirato'
  ];

  const getApplicationsByStatus = (status: JobStatus) => {
    return applications.filter(app => app.status === status);
  };

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;

    if (!over) return;

    const activeId = active.id as string;
    const overId = over.id as string;

    console.log('Drag end - Active:', activeId, 'Over:', overId);

    // Find the application being dragged
    const application = applications.find(app => app.id === activeId);
    if (!application) return;

    // Check if dropped on a column (status change)
    if (columns.includes(overId as JobStatus)) {
      const newStatus = overId as JobStatus;
      if (application.status !== newStatus) {
        console.log('Updating status from', application.status, 'to', newStatus);
        await onUpdateStatus(activeId, newStatus);
      }
    }
  };

  const handleDragOver = (event: DragOverEvent) => {
    const { active, over } = event;
    
    if (!over) return;
    
    console.log('Drag over - Active:', active.id, 'Over:', over.id);
  };

  return (
    <div className="w-full">
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
        onDragOver={handleDragOver}
      >
        <div className="flex gap-4 overflow-x-auto pb-4 min-h-[600px]">
          {columns.map((status) => (
            <SortableContext
              key={status}
              items={getApplicationsByStatus(status).map(app => app.id)}
              strategy={verticalListSortingStrategy}
            >
              <KanbanColumn
                id={status}
                title={JOB_STATUS_LABELS[status]}
                applications={getApplicationsByStatus(status)}
                onDelete={onDelete}
              />
            </SortableContext>
          ))}
        </div>
      </DndContext>
    </div>
  );
};
