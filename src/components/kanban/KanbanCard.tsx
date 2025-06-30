
import React, { useState } from 'react';
import { JobApplication } from '@/types/job';
import { JOB_STATUS_LABELS } from '@/types/job';
import { Calendar, DollarSign, MapPin, Trash2, Bell, Settings, Clock } from 'lucide-react';
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
        className={`bg-white backdrop-blur-md border shadow-lg transition-all duration-200 rounded-lg p-3 md:p-4 touch-manipulation select-none ${
          isDragging 
            ? 'shadow-2xl transform rotate-2 scale-105 cursor-grabbing border-blue-400 bg-white opacity-100' 
            : 'cursor-grab hover:cursor-grab hover:shadow-xl border-white/40 bg-white/95'
        }`}
        style={{
          transformOrigin: 'center center',
          zIndex: isDragging ? 99999 : 1,
          position: isDragging ? 'fixed' : 'relative'
        }}
      >
        {/* Header */}
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1 min-w-0 cursor-inherit">
            <h4 className="font-semibold text-gray-900 truncate text-sm md:text-base cursor-inherit">
              {application.companyName}
            </h4>
            <p className="text-xs md:text-sm text-gray-600 truncate cursor-inherit">
              {application.roleDescription || 'No role specified'}
            </p>
          </div>
          <div className="flex items-center gap-1 flex-shrink-0 ml-2">
            {(application.alerts && application.alerts.length > 0) && (
              <div className="text-green-500" title="Alerts set">
                <Bell className="w-3 h-3 md:w-3.5 md:h-3.5" />
              </div>
            )}
            <Button
              onClick={handleAlertsClick}
              variant="ghost"
              size="sm"
              className="text-blue-500 hover:text-blue-700 hover:bg-blue-50 h-5 w-5 md:h-6 md:w-6 p-0 touch-manipulation cursor-pointer"
              title="Manage alerts"
            >
              <Settings className="w-2.5 h-2.5 md:w-3 md:h-3" />
            </Button>
            <Button
              onClick={handleDelete}
              variant="ghost"
              size="sm"
              className="text-red-500 hover:text-red-700 hover:bg-red-50 h-5 w-5 md:h-6 md:w-6 p-0 touch-manipulation cursor-pointer"
            >
              <Trash2 className="w-2.5 h-2.5 md:w-3 md:h-3" />
            </Button>
          </div>
        </div>

        {/* Details */}
        <div className="space-y-1.5 md:space-y-2 cursor-inherit">
          <div className="flex items-center gap-2 text-xs text-gray-600 cursor-inherit">
            <Calendar className="w-2.5 h-2.5 md:w-3 md:h-3 flex-shrink-0" />
            <span className="truncate">{formatDate(application.applicationDate)}</span>
          </div>

          {application.interviewDate && (
            <div className="flex items-center gap-2 text-xs text-blue-600 cursor-inherit">
              <Bell className="w-2.5 h-2.5 md:w-3 md:h-3 flex-shrink-0" />
              <span className="truncate">Interview: {formatDate(application.interviewDate)}</span>
            </div>
          )}

          {application.deadline && (
            <div className="flex items-center gap-2 text-xs text-orange-600 cursor-inherit">
              <Clock className="w-2.5 h-2.5 md:w-3 md:h-3 flex-shrink-0" />
              <span className="truncate">Deadline: {formatDate(application.deadline)}</span>
            </div>
          )}

          {application.salary && application.salary !== 'ND' && (
            <div className="flex items-center gap-2 text-xs text-gray-600 cursor-inherit">
              <DollarSign className="w-2.5 h-2.5 md:w-3 md:h-3 flex-shrink-0" />
              <span className="truncate">{application.salary}</span>
            </div>
          )}

          <div className="flex items-center gap-2 text-xs text-gray-600 cursor-inherit">
            <MapPin className="w-2.5 h-2.5 md:w-3 md:h-3 flex-shrink-0" />
            <span className="truncate">{getWorkModeIcon(application.workMode)} {application.workMode}</span>
          </div>
        </div>

        {/* Status Badge */}
        <div className="mt-2 md:mt-3 cursor-inherit">
          <span className="inline-flex items-center px-2 py-0.5 md:py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
            {JOB_STATUS_LABELS[application.status]}
          </span>
        </div>

        {/* Tags */}
        {application.tags && application.tags.length > 0 && (
          <div className="mt-2 flex flex-wrap gap-1 cursor-inherit">
            {application.tags.slice(0, 2).map((tag, index) => (
              <span
                key={index}
                className="inline-flex items-center px-1.5 md:px-2 py-0.5 md:py-1 rounded text-xs bg-gray-100 text-gray-700 truncate max-w-20 md:max-w-24"
              >
                {tag}
              </span>
            ))}
            {application.tags.length > 2 && (
              <span className="text-xs text-gray-500">
                +{application.tags.length - 2}
              </span>
            )}
          </div>
        )}
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
