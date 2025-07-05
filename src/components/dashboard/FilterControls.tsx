
import React from 'react';
import { List, Grid } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';

interface FilterControlsProps {
  viewMode: 'list' | 'grid';
  onViewModeChange: (mode: 'list' | 'grid') => void;
  sortBy: 'date' | 'company' | 'status';
  onSortByChange: (sortBy: 'date' | 'company' | 'status') => void;
  filterStatus: string;
  onFilterStatusChange: (status: string) => void;
  searchTerm: string;
  onSearchTermChange: (term: string) => void;
}

export const FilterControls: React.FC<FilterControlsProps> = ({
  viewMode,
  onViewModeChange,
  sortBy,
  onSortByChange,
  filterStatus,
  onFilterStatusChange,
  searchTerm,
  onSearchTermChange
}) => {
  const statusOptions = [
    { value: 'all', label: 'All Applications' },
    { value: 'in-corso', label: 'In Progress' },
    { value: 'primo-colloquio', label: 'First Interview' },
    { value: 'secondo-colloquio', label: 'Second Interview' },
    { value: 'colloquio-tecnico', label: 'Technical Interview' },
    { value: 'colloquio-finale', label: 'Final Interview' },
    { value: 'offerta-ricevuta', label: 'Offer Received' },
    { value: 'rifiutato', label: 'Rejected' },
    { value: 'ghosting', label: 'Ghosting' },
    { value: 'ritirato', label: 'Withdrawn' }
  ];

  return (
    <div className="flex flex-col sm:flex-row items-start w-full sm:items-center justify-between gap-6 p-4 sm:p-6 bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl shadow-lg">
      <div className="flex flex-col sm:flex-row gap-4 w-full">
        <Input
          placeholder="Search companies or roles..."
          value={searchTerm}
          onChange={(e) => onSearchTermChange(e.target.value)}
          className="w-full sm:w-[250px] border-white/20 bg-white/10 hover:bg-white/20 text-white placeholder:text-white/50 rounded-xl h-12"
        />
        
        <Select value={filterStatus} onValueChange={onFilterStatusChange}>
          <SelectTrigger className="w-full sm:w-[220px] border-white/20 bg-white/10 hover:bg-white/20 text-white rounded-xl h-12 transition-all duration-200">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent className="bg-gray-800 border-white/20 rounded-xl">
            {statusOptions.map((option) => (
              <SelectItem key={option.value} value={option.value} className="text-white hover:bg-white/10 rounded-lg">
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={sortBy} onValueChange={onSortByChange}>
          <SelectTrigger className="w-full sm:w-[180px] border-white/20 bg-white/10 hover:bg-white/20 text-white rounded-xl h-12 transition-all duration-200">
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent className="bg-gray-800 border-white/20 rounded-xl">
            <SelectItem value="date" className="text-white hover:bg-white/10 rounded-lg">Date</SelectItem>
            <SelectItem value="company" className="text-white hover:bg-white/10 rounded-lg">Company</SelectItem>
            <SelectItem value="status" className="text-white hover:bg-white/10 rounded-lg">Status</SelectItem>
          </SelectContent>
        </Select>
      </div>

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
          onClick={() => onViewModeChange('grid')}
          variant={viewMode === 'grid' ? 'default' : 'ghost'}
          size="sm"
          className={viewMode === 'grid' 
            ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl px-4 sm:px-6 shadow-lg'
            : 'text-white/70 hover:text-white hover:bg-white/10 rounded-xl px-4 sm:px-6'
          }
        >
          <Grid className="w-4 h-4 mr-2" />
          Grid
        </Button>
      </div>
    </div>
  );
};
