
import React, { useState, useEffect } from 'react';
import { DragDropContext, Droppable, Draggable, DropResult } from 'react-beautiful-dnd';
import { JobApplication } from '@/types/job';
import { KanbanColumn } from './KanbanColumn';
import { KanbanCard } from './KanbanCard';
import { ColumnSettings } from './ColumnSettings';
import { Settings, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';

export interface KanbanColumnType {
  id: string;
  title: string;
  statusValues: string[];
  color: string;
}

interface KanbanBoardProps {
  applications: JobApplication[];
  onUpdateStatus: (id: string, status: any) => void;
  onDelete: (id: string) => void;
}

const DEFAULT_COLUMNS: KanbanColumnType[] = [
  {
    id: 'sent',
    title: 'Sent',
    statusValues: ['in-corso'],
    color: 'bg-blue-500'
  },
  {
    id: 'first-interview',
    title: '1st Interview',
    statusValues: ['primo-colloquio'],
    color: 'bg-yellow-500'
  },
  {
    id: 'second-interview',
    title: '2nd Interview',
    statusValues: ['secondo-colloquio'],
    color: 'bg-orange-500'
  },
  {
    id: 'third-interview',
    title: '3rd Interview',
    statusValues: ['colloquio-tecnico', 'colloquio-finale'],
    color: 'bg-purple-500'
  },
  {
    id: 'offer',
    title: 'Offer',
    statusValues: ['offerta-ricevuta'],
    color: 'bg-green-500'
  },
  {
    id: 'closed',
    title: 'Closed',
    statusValues: ['rifiutato', 'ritirato', 'ghosting'],
    color: 'bg-gray-500'
  }
];

export const KanbanBoard: React.FC<KanbanBoardProps> = ({
  applications,
  onUpdateStatus,
  onDelete
}) => {
  const [columns, setColumns] = useState<KanbanColumnType[]>(DEFAULT_COLUMNS);
  const [showSettings, setShowSettings] = useState(false);

  // Load saved columns from localStorage
  useEffect(() => {
    const savedColumns = localStorage.getItem('kanban-columns');
    if (savedColumns) {
      setColumns(JSON.parse(savedColumns));
    }
  }, []);

  // Save columns to localStorage
  const saveColumns = (newColumns: KanbanColumnType[]) => {
    setColumns(newColumns);
    localStorage.setItem('kanban-columns', JSON.stringify(newColumns));
  };

  const getApplicationsForColumn = (column: KanbanColumnType) => {
    return applications.filter(app => column.statusValues.includes(app.status));
  };

  const handleDragEnd = (result: DropResult) => {
    const { destination, source, draggableId } = result;

    if (!destination) return;

    if (destination.droppableId === source.droppableId && destination.index === source.index) {
      return;
    }

    const destinationColumn = columns.find(col => col.id === destination.droppableId);
    if (!destinationColumn) return;

    // Get the first status value from the destination column
    const newStatus = destinationColumn.statusValues[0];
    onUpdateStatus(draggableId, newStatus);
  };

  const addNewColumn = () => {
    const newColumn: KanbanColumnType = {
      id: `column-${Date.now()}`,
      title: 'New Column',
      statusValues: ['in-corso'], // Default status
      color: 'bg-gray-500'
    };
    saveColumns([...columns, newColumn]);
  };

  return (
    <div className="h-full">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-white">Kanban Board</h2>
        <div className="flex gap-2">
          <Button
            onClick={addNewColumn}
            variant="outline"
            size="sm"
            className="border-white/20 bg-white/10 hover:bg-white/20 hover:border-white/30 text-white"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Column
          </Button>
          <Button
            onClick={() => setShowSettings(true)}
            variant="outline"
            size="sm"
            className="border-white/20 bg-white/10 hover:bg-white/20 hover:border-white/30 text-white"
          >
            <Settings className="w-4 h-4 mr-2" />
            Settings
          </Button>
        </div>
      </div>

      {/* Kanban Board */}
      <DragDropContext onDragEnd={handleDragEnd}>
        <div className="flex gap-4 overflow-x-auto pb-4">
          {columns.map((column) => {
            const columnApplications = getApplicationsForColumn(column);
            
            return (
              <div key={column.id} className="flex-shrink-0 w-80">
                <KanbanColumn column={column} applicationCount={columnApplications.length}>
                  <Droppable droppableId={column.id}>
                    {(provided, snapshot) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.droppableProps}
                        className={`min-h-[200px] p-2 rounded-lg transition-colors ${
                          snapshot.isDraggingOver ? 'bg-white/10' : 'bg-white/5'
                        }`}
                      >
                        {columnApplications.map((application, index) => (
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
                                className={`mb-3 ${snapshot.isDragging ? 'opacity-50' : ''}`}
                              >
                                <KanbanCard
                                  application={application}
                                  onDelete={onDelete}
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
          })}
        </div>
      </DragDropContext>

      {/* Column Settings Modal */}
      <ColumnSettings
        open={showSettings}
        onOpenChange={setShowSettings}
        columns={columns}
        onSave={saveColumns}
      />
    </div>
  );
};
