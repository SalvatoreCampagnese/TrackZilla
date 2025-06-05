
import React, { useState } from 'react';
import { JobApplication, JOB_STATUS_LABELS, JobStatus } from '@/types/job';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Building2, Calendar, Euro, MapPin, Trash2, ChevronDown } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

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

  const filteredApplications = filter === 'all' 
    ? applications 
    : applications.filter(app => app.status === filter);

  const getStatusColor = (status: JobStatus) => {
    const colors = {
      'in-corso': 'bg-blue-100 text-blue-800',
      'ghosting': 'bg-gray-100 text-gray-800',
      'primo-colloquio': 'bg-green-100 text-green-800',
      'secondo-colloquio': 'bg-green-100 text-green-800',
      'colloquio-tecnico': 'bg-orange-100 text-orange-800',
      'colloquio-finale': 'bg-purple-100 text-purple-800',
      'offerta-ricevuta': 'bg-emerald-100 text-emerald-800',
      'rifiutato': 'bg-red-100 text-red-800',
      'ritirato': 'bg-gray-100 text-gray-800'
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
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
      <div className="text-center py-12">
        <div className="w-24 h-24 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
          <Building2 className="w-12 h-12 text-gray-400" />
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">Nessuna candidatura</h3>
        <p className="text-gray-500">Aggiungi la tua prima candidatura per iniziare il tracking</p>
      </div>
    );
  }

  return (
    <div>
      {/* Filter */}
      <div className="mb-6">
        <Select value={filter} onValueChange={(value) => setFilter(value as JobStatus | 'all')}>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="Filtra per stato" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tutte le candidature</SelectItem>
            {Object.entries(JOB_STATUS_LABELS).map(([key, label]) => (
              <SelectItem key={key} value={key}>
                {label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Applications Grid */}
      <div className="grid gap-6">
        {filteredApplications.map((application) => (
          <Card key={application.id} className="hover:shadow-lg transition-shadow duration-200">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-lg font-semibold text-gray-900">
                      {application.companyName}
                    </h3>
                    <Badge className={getStatusColor(application.status)}>
                      {JOB_STATUS_LABELS[application.status]}
                    </Badge>
                  </div>
                  <p className="text-gray-600 text-sm leading-relaxed">
                    {application.roleDescription}
                  </p>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onDelete(application.id)}
                  className="text-red-500 hover:text-red-700 hover:bg-red-50"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </CardHeader>
            
            <CardContent className="pt-0">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Calendar className="w-4 h-4" />
                  <span>{new Date(application.applicationDate).toLocaleDateString('it-IT')}</span>
                </div>
                
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Euro className="w-4 h-4" />
                  <span>{application.salary}</span>
                </div>
                
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <MapPin className="w-4 h-4" />
                  <span>
                    {getWorkModeIcon(application.workMode)} {application.workMode}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <Select 
                    value={application.status} 
                    onValueChange={(value) => onUpdateStatus(application.id, value as JobStatus)}
                  >
                    <SelectTrigger className="h-8 text-xs">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.entries(JOB_STATUS_LABELS).map(([key, label]) => (
                        <SelectItem key={key} value={key}>
                          {label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              {/* Job Description Preview */}
              <details className="group">
                <summary className="flex items-center gap-2 text-sm text-blue-600 cursor-pointer hover:text-blue-700">
                  <ChevronDown className="w-4 h-4 transition-transform group-open:rotate-180" />
                  Visualizza job description completa
                </summary>
                <div className="mt-3 p-3 bg-gray-50 rounded-lg text-sm text-gray-700 whitespace-pre-wrap">
                  {application.jobDescription}
                </div>
              </details>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};
