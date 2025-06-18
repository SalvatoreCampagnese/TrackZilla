
import React from 'react';
import { JobApplication } from '@/types/job';
import { JOB_STATUS_LABELS } from '@/types/job';
import { Calendar, DollarSign, MapPin, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

interface KanbanCardProps {
  application: JobApplication;
  onDelete: (id: string) => void;
  isDragging: boolean;
}

export const KanbanCard: React.FC<KanbanCardProps> = ({
  application,
  onDelete,
  isDragging
}) => {
  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    onDelete(application.id);
  };

  const getWorkModeIcon = (workMode: string) => {
    switch (workMode) {
      case 'remoto':
        return '🏠';
      case 'ibrido':
        return '🏢🏠';
      case 'in-presenza':
        return '🏢';
      default:
        return '❓';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <Card className={`bg-white/90 backdrop-blur-md border border-white/30 shadow-lg transition-all duration-200 hover:shadow-xl cursor-grab active:cursor-grabbing ${
      isDragging ? 'shadow-2xl rotate-2' : ''
    }`}>
      <CardContent className="p-4">
        {/* Header */}
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1 min-w-0">
            <h4 className="font-semibold text-gray-900 truncate">
              {application.companyName}
            </h4>
            <p className="text-sm text-gray-600 truncate">
              {application.roleDescription || 'No role specified'}
            </p>
          </div>
          <Button
            onClick={handleDelete}
            variant="ghost"
            size="sm"
            className="text-red-500 hover:text-red-700 hover:bg-red-50 h-6 w-6 p-0 flex-shrink-0 ml-2"
          >
            <Trash2 className="w-3 h-3" />
          </Button>
        </div>

        {/* Details */}
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-xs text-gray-600">
            <Calendar className="w-3 h-3" />
            <span>{formatDate(application.applicationDate)}</span>
          </div>

          {application.salary && application.salary !== 'ND' && (
            <div className="flex items-center gap-2 text-xs text-gray-600">
              <DollarSign className="w-3 h-3" />
              <span>{application.salary}</span>
            </div>
          )}

          <div className="flex items-center gap-2 text-xs text-gray-600">
            <MapPin className="w-3 h-3" />
            <span>{getWorkModeIcon(application.workMode)} {application.workMode}</span>
          </div>
        </div>

        {/* Status Badge */}
        <div className="mt-3">
          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
            {JOB_STATUS_LABELS[application.status]}
          </span>
        </div>

        {/* Tags */}
        {application.tags && application.tags.length > 0 && (
          <div className="mt-2 flex flex-wrap gap-1">
            {application.tags.slice(0, 3).map((tag, index) => (
              <span
                key={index}
                className="inline-flex items-center px-2 py-1 rounded text-xs bg-gray-100 text-gray-700"
              >
                {tag}
              </span>
            ))}
            {application.tags.length > 3 && (
              <span className="text-xs text-gray-500">
                +{application.tags.length - 3} more
              </span>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
