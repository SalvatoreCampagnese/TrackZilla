
import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search, List, Grid3X3, LayoutBoard, Crown } from 'lucide-react';
import { JOB_STATUS_LABELS } from '@/types/job';
import { useSubscription } from '@/hooks/useSubscription';

interface FilterControlsProps {
  viewMode: 'list' | 'grid' | 'kanban';
  onViewModeChange: (mode: 'list' | 'grid' | 'kanban') => void;
  sortBy: 'date' | 'company' | 'status';
  onSortByChange: (sortBy: 'date' | 'company' | 'status') => void;
  filterStatus: string;
  onFilterStatusChange: (status: string) => void;
  searchTerm: string;
  onSearchTermChange: (term: string) => void;
  onProClick?: () => void;
}

export const FilterControls: React.FC<FilterControlsProps> = ({
  viewMode,
  onViewModeChange,
  sortBy,
  onSortByChange,
  filterStatus,
  onFilterStatusChange,
  searchTerm,
  onSearchTermChange,
  onProClick
}) => {
  const { subscribed } = useSubscription();

  const handleKanbanClick = () => {
    if (!subscribed && onProClick) {
      onProClick();
    } else {
      onViewModeChange('kanban');
    }
  };

  return (
    <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-xl p-3 sm:p-4 lg:p-6">
      <div className="flex flex-col gap-4">
        {/* Search Bar */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/50 w-4 h-4" />
          <Input
            placeholder="Search applications..."
            value={searchTerm}
            onChange={(e) => onSearchTermChange(e.target.value)}
            className="pl-10 bg-white/10 border-white/20 text-white placeholder:text-white/50 focus:border-white/40"
          />
        </div>

        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
          {/* View Mode Buttons */}
          <div className="flex gap-2">
            <Button
              variant={viewMode === 'list' ? 'default' : 'outline'}
              size="sm"
              onClick={() => onViewModeChange('list')}
              className={`${
                viewMode === 'list'
                  ? 'bg-gradient-to-r from-red-500 to-red-600 text-white'
                  : 'border-white/20 bg-white/10 hover:bg-white/20 text-white'
              }`}
            >
              <List className="w-4 h-4" />
              <span className="hidden sm:inline ml-2">List</span>
            </Button>
            
            <Button
              variant={viewMode === 'grid' ? 'default' : 'outline'}
              size="sm"
              onClick={() => onViewModeChange('grid')}
              className={`${
                viewMode === 'grid'
                  ? 'bg-gradient-to-r from-red-500 to-red-600 text-white'
                  : 'border-white/20 bg-white/10 hover:bg-white/20 text-white'
              }`}
            >
              <Grid3X3 className="w-4 h-4" />
              <span className="hidden sm:inline ml-2">Grid</span>
            </Button>
            
            <Button
              variant={viewMode === 'kanban' ? 'default' : 'outline'}
              size="sm"
              onClick={handleKanbanClick}
              disabled={!subscribed}
              className={`${
                viewMode === 'kanban' && subscribed
                  ? 'bg-gradient-to-r from-red-500 to-red-600 text-white'
                  : 'border-white/20 bg-white/10 hover:bg-white/20 text-white'
              } relative`}
            >
              <LayoutBoard className="w-4 h-4" />
              <span className="hidden sm:inline ml-2">Kanban</span>
              {!subscribed && (
                <Crown className="w-3 h-3 absolute -top-1 -right-1 text-yellow-400" />
              )}
            </Button>
          </div>

          {/* Filters */}
          <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
            <Select value={filterStatus} onValueChange={onFilterStatusChange}>
              <SelectTrigger className="bg-white/10 border-white/20 text-white w-full sm:w-[180px]">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent className="bg-gray-800 border-gray-700">
                <SelectItem value="all" className="text-white hover:bg-gray-700">All Status</SelectItem>
                {Object.entries(JOB_STATUS_LABELS).map(([key, label]) => (
                  <SelectItem key={key} value={key} className="text-white hover:bg-gray-700">
                    {label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={sortBy} onValueChange={onSortByChange}>
              <SelectTrigger className="bg-white/10 border-white/20 text-white w-full sm:w-[180px]">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent className="bg-gray-800 border-gray-700">
                <SelectItem value="date" className="text-white hover:bg-gray-700">Date</SelectItem>
                <SelectItem value="company" className="text-white hover:bg-gray-700">Company</SelectItem>
                <SelectItem value="status" className="text-white hover:bg-gray-700">Status</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>
    </div>
  );
};
