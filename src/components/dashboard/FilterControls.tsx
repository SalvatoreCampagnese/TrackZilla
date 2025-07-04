
import React from 'react';
import { List, Columns } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface FilterControlsProps {
  statusFilter: string;
  onStatusFilterChange: (value: string) => void;
  viewMode: 'list' | 'kanban';
  onViewModeChange: (mode: 'list' | 'kanban') => void;
  uniqueStatuses: string[];
}

export const FilterControls: React.FC<FilterControlsProps> = ({
  statusFilter,
  onStatusFilterChange,
  viewMode,
  onViewModeChange,
  uniqueStatuses
}) => {
  return (
    <div className="flex flex-col sm:flex-row items-start w-full sm:items-center justify-between gap-6 p-4 sm:p-6 bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl shadow-lg">
      <Select value={statusFilter} onValueChange={onStatusFilterChange}>
        <SelectTrigger className="w-full sm:w-[220px] border-white/20 bg-white/10 hover:bg-white/20 text-white rounded-xl h-12 transition-all duration-200">
          <SelectValue placeholder="Filter by status" />
        </SelectTrigger>
        <SelectContent className="bg-gray-800 border-white/20 rounded-xl">
          <SelectItem value="all" className="text-white hover:bg-white/10 rounded-lg">All Applications</SelectItem>
          {uniqueStatuses.map((status) => (
            <SelectItem key={status} value={status} className="text-white hover:bg-white/10 rounded-lg">
              {status === 'in-corso' ? 'In Progress' :
               status === 'primo-colloquio' ? 'First Interview' :
               status === 'secondo-colloquio' ? 'Second Interview' :
               status === 'colloquio-tecnico' ? 'Technical Interview' :
               status === 'colloquio-finale' ? 'Final Interview' :
               status === 'offerta-ricevuta' ? 'Offer Received' :
               status === 'rifiutato' ? 'Rejected' :
               status === 'ghosting' ? 'Ghosting' :
               status === 'ritirato' ? 'Withdrawn' : status}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <div className="flex items-center gap-3 p-2 bg-white/10 rounded-2xl backdrop-blur-sm w-full sm:w-auto justify-center">
        <Button
          onClick={() => onViewModeChange('list')}
          variant={viewMode === 'list' ? 'default' : 'ghost'}
          size="sm"
          className={viewMode === 'list' 
            ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl px-4 sm:px-6 shadow-lg'
            : 'text-white/70 hover:text-white hover:bg-white/10 rounded-xl px-4 sm:px-6'
          }
        >
          <List className="w-4 h-4 mr-2" />
          List
        </Button>
        <Button
          onClick={() => onViewModeChange('kanban')}
          variant={viewMode === 'kanban' ? 'default' : 'ghost'}
          size="sm"
          className={viewMode === 'kanban' 
            ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl px-4 sm:px-6 shadow-lg'
            : 'text-white/70 hover:text-white hover:bg-white/10 rounded-xl px-4 sm:px-6'
          }
        >
          <Columns className="w-4 h-4 mr-2" />
          Kanban
        </Button>
      </div>
    </div>
  );
};
