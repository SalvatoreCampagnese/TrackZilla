
import React, { useState, useEffect } from 'react';
import { DragDropContext, Droppable, Draggable, DropResult } from 'react-beautiful-dnd';
import { JobApplication } from '@/types/job';
import { KanbanColumn } from './KanbanColumn';
import { KanbanCard } from './KanbanCard';
import { ColumnSettings } from './ColumnSettings';
import { AddColumnModal } from './AddColumnModal';
import { Settings, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';

export interface KanbanColumnType {
  id: string;
  title: string;
  statusValues: string[];
  color: string;
  isDefault: boolean;
  enabled: boolean;
}

interface KanbanBoardProps {
  applications: JobApplication[];
  onUpdateStatus: (id: string, status: any) => void;
  onDelete: (id: string) => void;
  onUpdateAlerts?: (applicationId: string, alerts: any[]) => void;
}

const DEFAULT_COLUMNS: KanbanColumnType[] = [
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

export const KanbanBoard: React.FC<KanbanBoardProps> = ({
  applications,
  onUpdateStatus,
  onDelete,
  onUpdateAlerts
}) => {
  const [columns, setColumns] = useState<KanbanColumnType[]>(DEFAULT_COLUMNS);
  const [showSettings, setShowSettings] = useState(false);
  const [showAddColumn, setShowAddColumn] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

  // Load saved columns from localStorage
  useEffect(() => {
    const savedColumns = localStorage.getItem('kanban-columns');
    if (savedColumns) {
      const parsed = JSON.parse(savedColumns);
      // Merge with defaults to ensure isDefault and enabled properties exist
      const mergedColumns = parsed.map((col: any) => ({
        ...col,
        isDefault: DEFAULT_COLUMNS.find(def => def.id === col.id)?.isDefault || false,
        enabled: col.enabled !== undefined ? col.enabled : true
      }));
      setColumns(mergedColumns);
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

  const enabledColumns = columns.filter(col => col.enabled);

  const handleDragStart = () => {
    setIsDragging(true);
  };

  const handleDragEnd = (result: DropResult) => {
    setIsDragging(false);
    
    const { destination, source, draggableId } = result;

    if (!destination) return;

    if (destination.droppableId === source.droppableId && destination.index === source.index) {
      return;
    }

    const destinationColumn = enabledColumns.find(col => col.id === destination.droppableId);
    if (!destinationColumn) return;

    // Get the first status value from the destination column
    const newStatus = destinationColumn.statusValues[0];
    onUpdateStatus(draggableId, newStatus);
  };

  const addNewColumn = (newColumn: KanbanColumnType) => {
    saveColumns([...columns, newColumn]);
  };

  return (
    <div className="h-full relative">
      {/* Header */}
      <div className="flex items-center justify-between mb-4 md:mb-6 px-2 md:px-0">
        <h2 className="text-lg md:text-xl font-semibold text-white">Kanban Board</h2>
        <div className="flex gap-2">
          <Button
            onClick={() => setShowAddColumn(true)}
            variant="outline"
            size="sm"
            className="border-white/20 bg-white/10 hover:bg-white/20 hover:border-white/30 text-white text-xs md:text-sm"
          >
            <Plus className="w-3 h-3 md:w-4 md:h-4 md:mr-2" />
            <span className="hidden md:inline">Add Column</span>
          </Button>
          <Button
            onClick={() => setShowSettings(true)}
            variant="outline"
            size="sm"
            className="border-white/20 bg-white/10 hover:bg-white/20 hover:border-white/30 text-white text-xs md:text-sm"
          >
            <Settings className="w-3 h-3 md:w-4 md:h-4 md:mr-2" />
            <span className="hidden md:inline">Settings</span>
          </Button>
        </div>
      </div>

      {/* Kanban Board */}
      <div className={`relative ${isDragging ? 'overflow-visible' : ''}`}>
        <DragDropContext onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
          <div className="flex gap-2 md:gap-4 overflow-x-auto pb-4 px-2 md:px-0">
            {enabledColumns.map((column) => {
              const columnApplications = getApplicationsForColumn(column);
              
              return (
                <div key={column.id} className="flex-shrink-0 w-72 md:w-80">
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
                                  className="mb-3"
                                  style={{
                                    ...provided.draggableProps.style,
                                    zIndex: snapshot.isDragging ? 10000 : 'auto',
                                    position: snapshot.isDragging ? 'fixed' : 'relative'
                                  }}
                                >
                                  <KanbanCard
                                    application={application}
                                    onDelete={onDelete}
                                    onUpdateAlerts={onUpdateAlerts}
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
      </div>

      {/* Column Settings Modal */}
      <ColumnSettings
        open={showSettings}
        onOpenChange={setShowSettings}
        columns={columns}
        onSave={saveColumns}
      />

      {/* Add Column Modal */}
      <AddColumnModal
        open={showAddColumn}
        onOpenChange={setShowAddColumn}
        onSave={addNewColumn}
      />
    </div>
  );
};
