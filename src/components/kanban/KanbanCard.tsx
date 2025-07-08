
import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { JobApplication } from '@/types/job';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Trash2, Building2, Calendar, DollarSign, MapPin } from 'lucide-react';
import { format } from 'date-fns';

interface KanbanCardProps {
  application: JobApplication;
  onDelete: (id: string) => Promise<void>;
}

export const KanbanCard: React.FC<KanbanCardProps> = ({
  application,
  onDelete,
}) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: application.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const getWorkModeColor = (workMode: string) => {
    switch (workMode) {
      case 'remoto':
        return 'bg-green-500/20 text-green-300 border-green-400/30';
      case 'ibrido':
        return 'bg-yellow-500/20 text-yellow-300 border-yellow-400/30';
      case 'in-presenza':
        return 'bg-blue-500/20 text-blue-300 border-blue-400/30';
      default:
        return 'bg-gray-500/20 text-gray-300 border-gray-400/30';
    }
  };

  const getWorkModeLabel = (workMode: string) => {
    switch (workMode) {
      case 'remoto':
        return 'Remote';
      case 'ibrido':
        return 'Hybrid';
      case 'in-presenza':
        return 'On-site';
      default:
        return 'N/A';
    }
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className={`
        cursor-grab active:cursor-grabbing
        ${isDragging ? 'opacity-50 scale-105 rotate-2 z-50' : 'hover:scale-102'}
        transition-all duration-200
      `}
    >
      <Card className="bg-white/10 backdrop-blur-sm border-white/20 hover:bg-white/15 hover:border-white/30 transition-all duration-200 shadow-lg">
        <CardContent className="p-4 space-y-3">
          {/* Header with company and delete button */}
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-2 min-w-0 flex-1">
              <Building2 className="w-4 h-4 text-white/70 flex-shrink-0" />
              <h4 className="text-white font-semibold text-sm truncate">
                {application.companyName}
              </h4>
            </div>
            <Button
              onClick={(e) => {
                e.stopPropagation();
                onDelete(application.id);
              }}
              variant="ghost"
              size="sm"
              className="h-6 w-6 p-0 text-red-400 hover:text-red-300 hover:bg-red-500/20 flex-shrink-0"
            >
              <Trash2 className="w-3 h-3" />
            </Button>
          </div>

          {/* Role */}
          <p className="text-white/80 text-sm font-medium line-clamp-2">
            {application.roleDescription}
          </p>

          {/* Details */}
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-white/60 text-xs">
              <Calendar className="w-3 h-3 flex-shrink-0" />
              <span>{format(new Date(application.applicationDate), 'MMM dd, yyyy')}</span>
            </div>

            {application.salary && application.salary !== 'ND' && (
              <div className="flex items-center gap-2 text-white/60 text-xs">
                <DollarSign className="w-3 h-3 flex-shrink-0" />
                <span>{application.salary}</span>
              </div>
            )}

            <div className="flex items-center gap-2 text-white/60 text-xs">
              <MapPin className="w-3 h-3 flex-shrink-0" />
              <Badge 
                variant="outline" 
                className={`text-xs px-2 py-0.5 border ${getWorkModeColor(application.workMode)}`}
              >
                {getWorkModeLabel(application.workMode)}
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
