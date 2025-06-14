
import React, { useState } from 'react';
import { JobApplication, JOB_STATUS_LABELS, JobStatus } from '@/types/job';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Building2, Calendar, Euro, MapPin, Trash2, ChevronDown } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';

interface JobListProps {
  applications: JobApplication[];
  onUpdateStatus: (id: string, status: JobStatus) => void;
  onDelete: (id: string) => void;
}

export const JobList: React.FC<JobListProps> = ({ 
  applications, 
  onUpdateStatus, 
  onDelete 
}) => {
  const [filter, setFilter] = useState<JobStatus | 'all'>('all');
  const [deleteModal, setDeleteModal] = useState<{ isOpen: boolean; application: JobApplication | null }>({
    isOpen: false,
    application: null
  });
  const [confirmationInput, setConfirmationInput] = useState('');

  const filteredApplications = filter === 'all' 
    ? applications 
    : applications.filter(app => app.status === filter);

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

  const handleDeleteClick = (application: JobApplication) => {
    setDeleteModal({ isOpen: true, application });
    setConfirmationInput('');
  };

  const handleDeleteConfirm = () => {
    if (deleteModal.application && confirmationInput === deleteModal.application.companyName) {
      onDelete(deleteModal.application.id);
      setDeleteModal({ isOpen: false, application: null });
      setConfirmationInput('');
    }
  };

  const handleDeleteCancel = () => {
    setDeleteModal({ isOpen: false, application: null });
    setConfirmationInput('');
  };

  if (applications.length === 0) {
    return (
      <div className="text-center py-8 sm:py-12 px-4">
        <div className="w-16 h-16 sm:w-24 sm:h-24 mx-auto mb-4 bg-gray-100 dark:bg-red-800/50 rounded-full flex items-center justify-center">
          <Building2 className="w-8 h-8 sm:w-12 sm:h-12 text-gray-400 dark:text-red-300" />
        </div>
        <h3 className="text-base sm:text-lg font-medium text-gray-900 dark:text-white mb-2">No applications</h3>
        <p className="text-sm sm:text-base text-gray-500 dark:text-gray-300">Add your first application to start tracking</p>
      </div>
    );
  }

  return (
    <div>
      {/* Filter */}
      <div className="mb-4 sm:mb-6">
        <Select value={filter} onValueChange={(value) => setFilter(value as JobStatus | 'all')}>
          <SelectTrigger className="w-full sm:w-48 bg-gray-800 border-gray-700 text-white">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent className="bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-700">
            <SelectItem value="all" className="text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700">All applications</SelectItem>
            {Object.entries(JOB_STATUS_LABELS).map(([key, label]) => (
              <SelectItem key={key} value={key} className="text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700">
                {label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Applications Grid */}
      <div className="grid gap-4 sm:gap-6">
        {filteredApplications.map((application) => (
          <Card key={application.id} className="hover:shadow-lg transition-shadow duration-200 bg-gradient-to-br from-gray-800 to-gray-900 border-white/30">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between gap-2">
                <div className="flex-1 min-w-0">
                  <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3 mb-2">
                    <h3 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white truncate">
                      {application.companyName}
                    </h3>
                    <Badge className={`${getStatusColor(application.status)} text-xs whitespace-nowrap`}>
                      {JOB_STATUS_LABELS[application.status]}
                    </Badge>
                  </div>
                  <p className="text-gray-600 dark:text-gray-200 text-sm leading-relaxed line-clamp-3">
                    {application.roleDescription}
                  </p>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleDeleteClick(application)}
                  className="text-red-500 hover:text-red-700 hover:bg-red-50 dark:text-red-400 dark:hover:text-red-300 dark:hover:bg-red-900/20 flex-shrink-0"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </CardHeader>
            
            <CardContent className="pt-0">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-4">
                <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-200">
                  <Calendar className="w-4 h-4 flex-shrink-0" />
                  <span className="truncate">{new Date(application.applicationDate).toLocaleDateString('en-US')}</span>
                </div>
                
                <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-200">
                  <Euro className="w-4 h-4 flex-shrink-0" />
                  <span className="truncate">{application.salary}</span>
                </div>
                
                <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-200">
                  <MapPin className="w-4 h-4 flex-shrink-0" />
                  <span className="truncate">
                    {getWorkModeIcon(application.workMode)} {application.workMode}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <Select 
                    value={application.status} 
                    onValueChange={(value) => onUpdateStatus(application.id, value as JobStatus)}
                  >
                    <SelectTrigger className="h-8 text-xs w-full sm:w-auto bg-gray-800 border-gray-700 text-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-700">
                      {Object.entries(JOB_STATUS_LABELS).map(([key, label]) => (
                        <SelectItem key={key} value={key} className="text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 text-xs">
                          {label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              {/* Job Description Preview */}
              <details className="group">
                <summary className="flex items-center gap-2 text-sm text-white dark:text-white cursor-pointer hover:text-gray-200 dark:hover:text-gray-200">
                  <ChevronDown className="w-4 h-4 transition-transform group-open:rotate-180 flex-shrink-0" />
                  <span className="truncate">View full job description</span>
                </summary>
                <div className="mt-3 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg text-sm text-gray-700 dark:text-gray-200 whitespace-pre-wrap break-words">
                  {application.jobDescription}
                </div>
              </details>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Delete Confirmation Modal */}
      <AlertDialog open={deleteModal.isOpen} onOpenChange={(open) => !open && handleDeleteCancel()}>
        <AlertDialogContent className="bg-card border-gray-700">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-foreground">Confirm Deletion</AlertDialogTitle>
            <AlertDialogDescription className="text-muted-foreground">
              This action cannot be undone. To confirm deletion, please type the company name "{deleteModal.application?.companyName}" below.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="my-4">
            <Input
              value={confirmationInput}
              onChange={(e) => setConfirmationInput(e.target.value)}
              placeholder="Type company name to confirm"
              className="bg-background border-gray-600 text-foreground"
            />
          </div>
          <AlertDialogFooter>
            <AlertDialogCancel 
              onClick={handleDeleteCancel}
              className="border-gray-600 hover:bg-accent"
            >
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleDeleteConfirm}
              disabled={confirmationInput !== deleteModal.application?.companyName}
              className="bg-red-600 hover:bg-red-700 text-white disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Delete Application
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};
