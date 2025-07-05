
import { useState, useEffect } from 'react';
import { DropResult } from 'react-beautiful-dnd';
import { JobApplication } from '@/types/job';
import { KanbanColumnType } from '@/components/kanban/KanbanBoard';

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

interface UseKanbanBoardProps {
  applications: JobApplication[];
  onUpdateStatus: (id: string, status: any) => void;
}

export const useKanbanBoard = ({ applications, onUpdateStatus }: UseKanbanBoardProps) => {
  const [columns, setColumns] = useState<KanbanColumnType[]>(DEFAULT_COLUMNS);
  const [isDragging, setIsDragging] = useState(false);

  // Load saved columns from localStorage
  useEffect(() => {
    const savedColumns = localStorage.getItem('kanban-columns');
    if (savedColumns) {
      try {
        const parsed = JSON.parse(savedColumns);
        // Merge with defaults to ensure isDefault and enabled properties exist
        const mergedColumns = parsed.map((col: any) => ({
          ...col,
          isDefault: DEFAULT_COLUMNS.find(def => def.id === col.id)?.isDefault || false,
          enabled: col.enabled !== undefined ? col.enabled : true
        }));
        setColumns(mergedColumns);
      } catch (error) {
        console.error('Error parsing saved columns:', error);
        setColumns(DEFAULT_COLUMNS);
      }
    }
  }, []);

  // Save columns to localStorage
  const saveColumns = (newColumns: KanbanColumnType[]) => {
    setColumns(newColumns);
    localStorage.setItem('kanban-columns', JSON.stringify(newColumns));
  };

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

    const enabledColumns = columns.filter(col => col.enabled);
    const destinationColumn = enabledColumns.find(col => col.id === destination.droppableId);
    if (!destinationColumn) return;

    // Get the first status value from the destination column
    const newStatus = destinationColumn.statusValues[0];
    onUpdateStatus(draggableId, newStatus);
  };

  const handleMoveCard = (applicationId: string) => {
    const application = applications.find(app => app.id === applicationId);
    if (!application) return;

    const enabledColumns = columns.filter(col => col.enabled);
    
    // Find current column
    const currentColumnIndex = enabledColumns.findIndex(col => 
      col.statusValues.includes(application.status)
    );
    
    if (currentColumnIndex === -1) return;

    // Move to next column (or back to first if at the end)
    const nextColumnIndex = (currentColumnIndex + 1) % enabledColumns.length;
    const nextColumn = enabledColumns[nextColumnIndex];
    const newStatus = nextColumn.statusValues[0];
    
    onUpdateStatus(applicationId, newStatus);
  };

  const addNewColumn = (newColumn: KanbanColumnType) => {
    saveColumns([...columns, newColumn]);
  };

  return {
    columns,
    isDragging,
    saveColumns,
    handleDragStart,
    handleDragEnd,
    handleMoveCard,
    addNewColumn
  };
};
