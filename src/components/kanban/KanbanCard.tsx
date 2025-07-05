
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { JobApplication } from '@/types/job';
import { JOB_STATUS_LABELS } from '@/types/job';
import { Calendar, DollarSign, MapPin, Trash2, Bell, Clock, Eye, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { AlertsManager } from '@/components/alerts/AlertsManager';
import { DeleteConfirmationModal } from '@/components/common/DeleteConfirmationModal';
import { useIsMobile } from '@/hooks/use-mobile';

interface KanbanCardProps {
  application: JobApplication;
  onDelete: (id: string) => void;
  onUpdateAlerts?: (applicationId: string, alerts: any[]) => void;
  onMoveCard?: (applicationId: string) => void;
  isDragging: boolean;
}

export const KanbanCard: React.FC<KanbanCardProps> = ({
  application,
  onDelete,
  onUpdateAlerts,
  onMoveCard,
  isDragging
}) => {
  const navigate = useNavigate();
  const isMobile = useIsMobile();
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

  const handleMoveClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onMoveCard) {
      onMoveCard(application.id);
    }
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
        className={`bg-white rounded-lg border shadow-sm p-4 transition-all duration-200 w-full ${
          isDragging 
            ? 'shadow-2xl rotate-2 scale-105 cursor-grabbing' 
            : 'cursor-grab hover:shadow-md hover:scale-[1.02]'
        }`}
        style={{
          width: '100%',
          maxWidth: '100%',
          minWidth: '250px',
          zIndex: isDragging ? 10000 : 'auto',
          pointerEvents: isDragging ? 'none' : 'auto'
        }}
      >
        {/* Header */}
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1 min-w-0">
            <h4 className="font-semibold text-gray-900 truncate text-base">
              {application.companyName}
            </h4>
            <p className="text-sm text-gray-600 truncate mt-1">
              {application.roleDescription || 'No role specified'}
            </p>
          </div>
          <div className="flex items-center gap-1 flex-shrink-0 ml-2">
            {/* Mobile Move Button */}
            {isMobile && onMoveCard && (
              <Button
                onClick={handleMoveClick}
                variant="ghost"
                size="sm"
                className="text-indigo-500 hover:text-indigo-700 hover:bg-indigo-50 h-8 w-8 p-0"
                title="Move to next column"
              >
                <ArrowRight className="w-4 h-4" />
              </Button>
            )}
            
            {(application.alerts && application.alerts.length > 0) && (
              <div className="text-green-500" title="Alerts set">
                <Bell className="w-4 h-4" />
              </div>
            )}
            <Button
              onClick={handleDetailClick}
              variant="ghost"
              size="sm"
              className="text-blue-500 hover:text-blue-700 hover:bg-blue-50 h-6 w-6 p-0"
              title="View details"
            >
              <Eye className="w-3 h-3" />
            </Button>
            <Button
              onClick={handleAlertsClick}
              variant="ghost"
              size="sm"
              className="text-amber-500 hover:text-amber-700 hover:bg-amber-50 h-6 w-6 p-0"
              title="Manage alerts"
            >
              <Bell className="w-3 h-3" />
            </Button>
            <Button
              onClick={handleDelete}
              variant="ghost"
              size="sm"
              className="text-red-500 hover:text-red-700 hover:bg-red-50 h-6 w-6 p-0"
              title="Delete"
            >
              <Trash2 className="w-3 h-3" />
            </Button>
          </div>
        </div>

        {/* Details */}
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-xs text-gray-500">
            <Calendar className="w-3 h-3 flex-shrink-0" />
            <span className="truncate">{formatDate(application.applicationDate)}</span>
          </div>

          {application.interviewDate && (
            <div className="flex items-center gap-2 text-xs text-blue-600">
              <Bell className="w-3 h-3 flex-shrink-0" />
              <span className="truncate">Interview: {formatDate(application.interviewDate)}</span>
            </div>
          )}

          {application.deadline && (
            <div className="flex items-center gap-2 text-xs text-orange-600">
              <Clock className="w-3 h-3 flex-shrink-0" />
              <span className="truncate">Deadline: {formatDate(application.deadline)}</span>
            </div>
          )}

          {application.salary && application.salary !== 'ND' && (
            <div className="flex items-center gap-2 text-xs text-gray-500">
              <DollarSign className="w-3 h-3 flex-shrink-0" />
              <span className="truncate">{application.salary}</span>
            </div>
          )}

          <div className="flex items-center gap-2 text-xs text-gray-500">
            <MapPin className="w-3 h-3 flex-shrink-0" />
            <span className="truncate">{getWorkModeIcon(application.workMode)} {application.workMode}</span>
          </div>
        </div>

        {/* Status Badge */}
        <div className="mt-3">
          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800 border border-indigo-200">
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
