
import React from 'react';
import { Settings, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface KanbanBoardHeaderProps {
  onShowSettings: () => void;
  onShowAddColumn: () => void;
}

export const KanbanBoardHeader: React.FC<KanbanBoardHeaderProps> = ({
  onShowSettings,
  onShowAddColumn
}) => {
  return (
    <div className="flex items-center justify-between mb-4 md:mb-6 px-2 md:px-0">
      <h2 className="text-lg md:text-xl font-semibold text-white">Kanban Board</h2>
      <div className="flex gap-2">
        <Button
          onClick={onShowAddColumn}
          variant="outline"
          size="sm"
          className="border-white/20 bg-white/10 hover:bg-white/20 hover:border-white/30 text-white text-xs md:text-sm"
        >
          <Plus className="w-3 h-3 md:w-4 md:h-4 md:mr-2" />
          <span className="hidden md:inline">Add Column</span>
        </Button>
        <Button
          onClick={onShowSettings}
          variant="outline"
          size="sm"
          className="border-white/20 bg-white/10 hover:bg-white/20 hover:border-white/30 text-white text-xs md:text-sm"
        >
          <Settings className="w-3 h-3 md:w-4 md:h-4 md:mr-2" />
          <span className="hidden md:inline">Settings</span>
        </Button>
      </div>
    </div>
  );
};
