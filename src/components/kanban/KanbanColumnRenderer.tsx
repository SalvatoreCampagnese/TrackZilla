
import React from 'react';
import { Droppable, Draggable } from 'react-beautiful-dnd';
import { JobApplication } from '@/types/job';
import { KanbanColumnType } from './KanbanBoard';
import { KanbanColumn } from './KanbanColumn';
import { KanbanCard } from './KanbanCard';

interface KanbanColumnRendererProps {
  column: KanbanColumnType;
  applications: JobApplication[];
  isDragging: boolean;
  onDelete: (id: string) => void;
  onUpdateAlerts?: (applicationId: string, alerts: any[]) => void;
  onMoveCard: (applicationId: string) => void;
}

export const KanbanColumnRenderer: React.FC<KanbanColumnRendererProps> = ({
  column,
  applications,
  isDragging,
  onDelete,
  onUpdateAlerts,
  onMoveCard
}) => {
  return (
    <div className="flex-shrink-0 w-72 md:w-80">
      <KanbanColumn column={column} applicationCount={applications.length} isDragging={isDragging}>
        <Droppable droppableId={column.id}>
          {(provided, snapshot) => (
            <div
              ref={provided.innerRef}
              {...provided.droppableProps}
              className={`min-h-[200px] p-2 rounded-lg transition-colors ${
                snapshot.isDraggingOver ? 'bg-white/10' : 'bg-white/5'
              }`}
            >
              {applications.map((application, index) => (
                <Draggable
                  key={application.id}
                  draggableId={application.id}
                  index={index}
                >
                  {(provided, snapshot) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                      className="mb-3"
                      style={{
                        ...provided.draggableProps.style,
                        // Ensure proper positioning during drag
                        transform: snapshot.isDragging 
                          ? provided.draggableProps.style?.transform 
                          : 'none',
                        zIndex: snapshot.isDragging ? 10000 : 1,
                      }}
                    >
                      <KanbanCard
                        application={application}
                        onDelete={onDelete}
                        onUpdateAlerts={onUpdateAlerts}
                        onMoveCard={onMoveCard}
                        isDragging={snapshot.isDragging}
                      />
                    </div>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </KanbanColumn>
    </div>
  );
};
