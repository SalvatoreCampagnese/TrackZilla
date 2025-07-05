
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { JobApplication } from '@/types/job';
import { JOB_STATUS_LABELS } from '@/types/job';
import { Calendar, DollarSign, MapPin, Trash2, Bell, Clock, Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { AlertsManager } from '@/components/alerts/AlertsManager';
import { DeleteConfirmationModal } from '@/components/common/DeleteConfirmationModal';

interface KanbanCardProps {
  application: JobApplication;
  onDelete: (id: string) => void;
  onUpdateAlerts?: (applicationId: string, alerts: any[]) => void;
  isDragging: boolean;
}

export const KanbanCard: React.FC<KanbanCardProps> = ({
  application,
  onDelete,
  onUpdateAlerts,
  isDragging
}) => {
  const navigate = useNavigate();
  const [showAlerts, setShowAlerts] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowDeleteModal(true);
  };

  const handleConfirmDelete = () => {
    onDelete(application.id);
    setShowDeleteModal(false);
  };

  const handleAlertsClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowAlerts(true);
  };

  const handleDetailClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigate(`/application/${application.id}`);
  };

  const handleSaveAlerts = (applicationId: string, alerts: any[]) => {
    if (onUpdateAlerts) {
      onUpdateAlerts(applicationId, alerts);
    }
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
    <>
      <div 
        className={`card-modern bg-card text-card-foreground border border-border rounded-xl p-4 transition-all duration-200 touch-manipulation select-none ${
          isDragging 
            ? 'shadow-2xl transform rotate-1 scale-105 cursor-grabbing opacity-95 z-[9999]' 
            : 'cursor-grab hover:cursor-grab hover:shadow-lg'
        }`}
        style={{
          transformOrigin: 'center center',
          ...(isDragging && {
            zIndex: 9999,
            position: 'fixed',
            pointerEvents: 'none',
            width: '280px'
          })
        }}
      >
        {/* Header */}
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1 min-w-0 cursor-inherit">
            <h4 className="font-semibold text-foreground truncate text-base cursor-inherit">
              {application.companyName}
            </h4>
            <p className="text-sm text-muted-foreground truncate cursor-inherit mt-1">
              {application.roleDescription || 'No role specified'}
            </p>
          </div>
          <div className="flex items-center gap-1 flex-shrink-0 ml-2">
            {(application.alerts && application.alerts.length > 0) && (
              <div className="text-green-500" title="Alerts set">
                <Bell className="w-4 h-4" />
              </div>
            )}
            <Button
              onClick={handleDetailClick}
              variant="ghost"
              size="sm"
              className="text-blue-500 hover:text-blue-700 hover:bg-blue-50 h-6 w-6 p-0 touch-manipulation cursor-pointer"
              title="View details"
            >
              <Eye className="w-3 h-3" />
            </Button>
            <Button
              onClick={handleAlertsClick}
              variant="ghost"
              size="sm"
              className="text-amber-500 hover:text-amber-700 hover:bg-amber-50 h-6 w-6 p-0 touch-manipulation cursor-pointer"
              title="Manage alerts"
            >
              <Bell className="w-3 h-3" />
            </Button>
            <Button
              onClick={handleDelete}
              variant="ghost"
              size="sm"
              className="text-red-500 hover:text-red-700 hover:bg-red-50 h-6 w-6 p-0 touch-manipulation cursor-pointer"
            >
              <Trash2 className="w-3 h-3" />
            </Button>
          </div>
        </div>

        {/* Details */}
        <div className="space-y-2 cursor-inherit">
          <div className="flex items-center gap-2 text-xs text-muted-foreground cursor-inherit">
            <Calendar className="w-3 h-3 flex-shrink-0" />
            <span className="truncate">{formatDate(application.applicationDate)}</span>
          </div>

          {application.interviewDate && (
            <div className="flex items-center gap-2 text-xs text-blue-600 cursor-inherit">
              <Bell className="w-3 h-3 flex-shrink-0" />
              <span className="truncate">Interview: {formatDate(application.interviewDate)}</span>
            </div>
          )}

          {application.deadline && (
            <div className="flex items-center gap-2 text-xs text-orange-600 cursor-inherit">
              <Clock className="w-3 h-3 flex-shrink-0" />
              <span className="truncate">Deadline: {formatDate(application.deadline)}</span>
            </div>
          )}

          {application.salary && application.salary !== 'ND' && (
            <div className="flex items-center gap-2 text-xs text-muted-foreground cursor-inherit">
              <DollarSign className="w-3 h-3 flex-shrink-0" />
              <span className="truncate">{application.salary}</span>
            </div>
          )}

          <div className="flex items-center gap-2 text-xs text-muted-foreground cursor-inherit">
            <MapPin className="w-3 h-3 flex-shrink-0" />
            <span className="truncate">{getWorkModeIcon(application.workMode)} {application.workMode}</span>
          </div>
        </div>

        {/* Status Badge */}
        <div className="mt-3 cursor-inherit">
          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-primary/10 text-primary border border-primary/20">
            {JOB_STATUS_LABELS[application.status]}
          </span>
        </div>
      </div>

      {/* Alerts Manager Modal */}
      <AlertsManager
        open={showAlerts}
        onOpenChange={setShowAlerts}
        application={application}
        onSave={handleSaveAlerts}
      />

      {/* Delete Confirmation Modal */}
      <DeleteConfirmationModal
        open={showDeleteModal}
        onOpenChange={setShowDeleteModal}
        onConfirm={handleConfirmDelete}
        itemName={application.companyName}
        itemType="application"
      />
    </>
  );
};
