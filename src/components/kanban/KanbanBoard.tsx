
import React, { useState } from 'react';
import { JobApplication } from '@/types/job';
import { KanbanBoardHeader } from './KanbanBoardHeader';
import { KanbanBoardGrid } from './KanbanBoardGrid';
import { ColumnSettings } from './ColumnSettings';
import { AddColumnModal } from './AddColumnModal';
import { useKanbanBoard } from '@/hooks/useKanbanBoard';

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

export const KanbanBoard: React.FC<KanbanBoardProps> = ({
  applications,
  onUpdateStatus,
  onDelete,
  onUpdateAlerts
}) => {
  const [showSettings, setShowSettings] = useState(false);
  const [showAddColumn, setShowAddColumn] = useState(false);

  const {
    columns,
    isDragging,
    saveColumns,
    handleDragStart,
    handleDragEnd,
    handleMoveCard,
    addNewColumn
  } = useKanbanBoard({ applications, onUpdateStatus });

  return (
    <div className="h-full relative">
      <KanbanBoardHeader
        onShowSettings={() => setShowSettings(true)}
        onShowAddColumn={() => setShowAddColumn(true)}
      />

      <KanbanBoardGrid
        columns={columns}
        applications={applications}
        isDragging={isDragging}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
        onDelete={onDelete}
        onUpdateAlerts={onUpdateAlerts}
        onMoveCard={handleMoveCard}
      />

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
