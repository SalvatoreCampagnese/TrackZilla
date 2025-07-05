
import React from 'react';
import { Droppable, Draggable, DraggingStyle } from 'react-beautiful-dnd';
import { JobApplication } from '@/types/job';
import { KanbanColumnType } from './KanbanBoard';
import { KanbanCard } from './KanbanCard';

interface KanbanColumnProps {
  column: KanbanColumnType;
  applications: JobApplication[];
  isDragging: boolean;
  onDelete: (id: string) => void;
  onUpdateAlerts?: (applicationId: string, alerts: any[]) => void;
  onMoveCard: (applicationId: string) => void;
}

export const KanbanColumn: React.FC<KanbanColumnProps> = ({
  column,
  applications,
  isDragging,
  onDelete,
  onUpdateAlerts,
  onMoveCard
}) => {
  return (
    <div className="flex-shrink-0 w-72 md:w-80">
      <div 
        className="bg-white/10 backdrop-blur-md border border-white/20 rounded-xl p-3 md:p-4 shadow-lg h-full flex flex-col"
        style={{ zIndex: 1 }}
      >
        {/* Column Header */}
        <div className="flex items-center justify-between mb-3 md:mb-4 flex-shrink-0">
          <div className="flex items-center gap-2 md:gap-3">
            <div className={`w-2.5 h-2.5 md:w-3 md:h-3 rounded-full ${column.color}`}></div>
            <h3 className="font-medium text-white text-sm md:text-base truncate">{column.title}</h3>
          </div>
          <div className="bg-white/20 text-white text-xs px-1.5 md:px-2 py-0.5 md:py-1 rounded-full flex-shrink-0">
            {applications.length}
          </div>
        </div>

        {/* Droppable Area */}
        <Droppable droppableId={column.id}>
          {(provided, snapshot) => (
            <div
              ref={provided.innerRef}
              {...provided.droppableProps}
              className={`flex-1 min-h-[200px] p-2 rounded-lg transition-colors relative ${
                snapshot.isDraggingOver ? 'bg-white/10' : 'bg-white/5'
              }`}
              style={{ zIndex: 1 }}
            >
              {applications.map((application, index) => (
                <Draggable
                  key={application.id}
                  draggableId={application.id}
                  index={index}
                >
                  {(provided, snapshot) => {
                    const style = provided.draggableProps.style;
                    const isDragging = snapshot.isDragging;
                    
                    // Type guard to check if style is DraggingStyle
                    const isDraggingStyle = (style: any): style is DraggingStyle => {
                      return style && typeof style.top !== 'undefined';
                    };
                    
                    const draggingStyle = isDraggingStyle(style) ? style : null;
                    
                    return (
                      <div
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                        className="mb-3"
                        style={{
                          ...style,
                          zIndex: isDragging ? 9999 : 'auto',
                          position: isDragging ? 'fixed' : 'relative',
                          top: isDragging && draggingStyle ? draggingStyle.top : 'auto',
                          left: isDragging && draggingStyle ? draggingStyle.left : 'auto',
                          transform: isDragging && style ? style.transform : 'none',
                          opacity: isDragging ? 0.9 : 1,
                          cursor: isDragging ? 'grabbing' : 'grab'
                        }}
                      >
                        <KanbanCard
                          application={application}
                          onDelete={onDelete}
                          onUpdateAlerts={onUpdateAlerts}
                          onMoveCard={onMoveCard}
                          isDragging={isDragging}
                        />
                      </div>
                    );
                  }}
                </Draggable>
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </div>
    </div>
  );
};
