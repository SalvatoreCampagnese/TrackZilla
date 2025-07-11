
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { JobApplication, JobStatus } from '@/types/job';
import { useTranslatedLabels } from '@/hooks/useTranslatedLabels';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Building2, Calendar, Euro, MapPin, Trash2, ChevronDown, Eye } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { DeleteConfirmationModal } from '@/components/common/DeleteConfirmationModal';

interface JobListProps {
  applications: JobApplication[];
  onUpdateStatus: (id: string, status: JobStatus) => void;
  onDelete: (id: string) => void;
  viewMode?: 'list' | 'grid';
}

export const JobList: React.FC<JobListProps> = ({ 
  applications, 
  onUpdateStatus, 
  onDelete,
  viewMode = 'list'
}) => {
  const { t } = useTranslation();
  const { getJobStatusLabel, jobStatusOptions, getWorkModeLabel } = useTranslatedLabels();
  const navigate = useNavigate();
  const [filter, setFilter] = useState<JobStatus | 'all'>('all');
  const [deleteModal, setDeleteModal] = useState<{ isOpen: boolean; application: JobApplication | null }>({
    isOpen: false,
    application: null
  });

  const filteredApplications = filter === 'all' 
    ? applications 
    : applications.filter(app => app.status === filter);

  const handleDeleteClick = (application: JobApplication) => {
    setDeleteModal({ isOpen: true, application });
  };

  const handleDeleteConfirm = () => {
    if (deleteModal.application) {
      onDelete(deleteModal.application.id);
      setDeleteModal({ isOpen: false, application: null });
    }
  };

  const handleDeleteCancel = () => {
    setDeleteModal({ isOpen: false, application: null });
  };

  const getStatusColor = (status: JobStatus) => {
    const colors = {
      'in-corso': 'bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-200',
      'ghosting': 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200',
      'primo-colloquio': 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-200',
      'secondo-colloquio': 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-200',
      'colloquio-tecnico': 'bg-orange-100 text-orange-800 dark:bg-orange-900/50 dark:text-orange-200',
      'colloquio-finale': 'bg-purple-100 text-purple-800 dark:bg-purple-900/50 dark:text-purple-200',
      'offerta-ricevuta': 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/50 dark:text-emerald-200',
      'rifiutato': 'bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-200',
      'ritirato': 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200'
    };
    return colors[status] || 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200';
  };

  const getWorkModeIcon = (workMode: JobApplication['workMode']) => {
    const icons = {
      'remoto': '🏠',
      'ibrido': '🔄',
      'in-presenza': '🏢',
      'ND': '❓'
    };
    return icons[workMode];
  };

  if (applications.length === 0) {
    return (
      <div className="text-center py-8 sm:py-12 px-4">
        <div className="w-16 h-16 sm:w-24 sm:h-24 mx-auto mb-4 bg-gray-100 dark:bg-red-800/50 rounded-full flex items-center justify-center">
          <Building2 className="w-8 h-8 sm:w-12 sm:h-12 text-gray-400 dark:text-red-300" />
        </div>
        <h3 className="text-base sm:text-lg font-medium text-gray-900 dark:text-white mb-2">{t('applications.noApplications')}</h3>
        <p className="text-sm sm:text-base text-gray-500 dark:text-gray-300">{t('applications.addFirstApplication')}</p>
      </div>
    );
  }

  return (
    <div className="w-full">
      {/* Applications Grid - Mobile optimized */}
      <div className={`grid gap-3 sm:gap-4 md:gap-6 w-full ${
        viewMode === 'grid' ? 'grid-cols-1 md:grid-cols-2 xl:grid-cols-3' : ''
      }`}>
        {filteredApplications.map((application) => (
          <Card key={application.id} className="hover:shadow-lg transition-shadow duration-200 bg-gradient-to-br from-gray-800 to-gray-900 border-white/30 w-full overflow-hidden">
            <CardHeader className="pb-3 px-3 sm:px-6">
              <div className="flex items-start justify-between gap-2 w-full">
                <div className="flex-1 min-w-0">
                  <div className="flex flex-col gap-2 mb-2">
                    <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                      <h3 className="text-sm sm:text-base md:text-lg font-semibold text-gray-900 dark:text-white truncate">
                        {application.companyName}
                      </h3>
                      <Badge className={`${getStatusColor(application.status)} text-xs whitespace-nowrap self-start`}>
                        {getJobStatusLabel(application.status)}
                      </Badge>
                    </div>
                  </div>
                  <p className="text-gray-600 dark:text-gray-200 text-xs sm:text-sm leading-relaxed line-clamp-2 break-words">
                    {application.roleDescription}
                  </p>
                </div>
                <div className="flex gap-1 flex-shrink-0">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => navigate(`/application/${application.id}`)}
                    className="text-blue-500 hover:text-blue-700 hover:bg-blue-50 dark:text-blue-400 dark:hover:text-blue-300 dark:hover:bg-blue-900/20 p-1 h-auto"
                  >
                    <Eye className="w-3 h-3 sm:w-4 sm:h-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDeleteClick(application)}
                    className="text-red-500 hover:text-red-700 hover:bg-red-50 dark:text-red-400 dark:hover:text-red-300 dark:hover:bg-red-900/20 p-1 h-auto"
                  >
                    <Trash2 className="w-3 h-3 sm:w-4 sm:h-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            
            <CardContent className="pt-0 px-3 sm:px-6">
              <div className="grid grid-cols-1 gap-2 sm:gap-3 mb-3 sm:mb-4">
                {/* First row - Date and Salary */}
                <div className="grid grid-cols-2 gap-2 sm:gap-4">
                  <div className="flex items-center gap-2 text-xs sm:text-sm text-gray-600 dark:text-gray-200 min-w-0">
                    <Calendar className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" />
                    <span className="truncate">{new Date(application.applicationDate).toLocaleDateString('en-US')}</span>
                  </div>
                  
                  <div className="flex items-center gap-2 text-xs sm:text-sm text-gray-600 dark:text-gray-200 min-w-0">
                    <Euro className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" />
                    <span className="truncate">{application.salary}</span>
                  </div>
                </div>

                {/* Second row - Work Mode and Status */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-4">
                  <div className="flex items-center gap-2 text-xs sm:text-sm text-gray-600 dark:text-gray-200 min-w-0">
                    <MapPin className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" />
                    <span className="truncate">
                      {getWorkModeIcon(application.workMode)} {getWorkModeLabel(application.workMode)}
                    </span>
                  </div>

                  <div className="w-full">
                    <Select 
                      value={application.status} 
                      onValueChange={(value) => onUpdateStatus(application.id, value as JobStatus)}
                    >
                      <SelectTrigger className="h-7 sm:h-8 text-xs w-full bg-gray-800 border-gray-700 text-white">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-700">
                        {jobStatusOptions.map((option) => (
                          <SelectItem key={option.value} value={option.value} className="text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 text-xs">
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
              
              {/* Job Description Preview */}
              <details className="group">
                <summary className="flex items-center gap-2 text-xs sm:text-sm text-white dark:text-white cursor-pointer hover:text-gray-200 dark:hover:text-gray-200">
                  <ChevronDown className="w-3 h-3 sm:w-4 sm:h-4 transition-transform group-open:rotate-180 flex-shrink-0" />
                  <span className="truncate">{t('applications.viewFullDescription')}</span>
                </summary>
                <div className="mt-3 p-2 sm:p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg text-xs sm:text-sm text-gray-700 dark:text-gray-200 whitespace-pre-wrap break-words max-h-40 overflow-y-auto">
                  {application.jobDescription}
                </div>
              </details>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Delete Confirmation Modal */}
      <DeleteConfirmationModal
        open={deleteModal.isOpen}
        onOpenChange={(open) => !open && handleDeleteCancel()}
        onConfirm={handleDeleteConfirm}
        itemName={deleteModal.application?.companyName || ''}
        itemType="application"
      />
    </div>
  );
};
