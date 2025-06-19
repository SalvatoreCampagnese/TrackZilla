
export interface JobApplication {
  id: string;
  jobDescription: string;
  applicationDate: string;
  companyName: string;
  roleDescription: string;
  salary: string;
  workMode: 'remoto' | 'ibrido' | 'in-presenza' | 'ND';
  status: JobStatus;
  tags: string[];
  createdAt: string;
  interviewDate?: string;
  deadline?: string;
  alerts?: JobAlert[];
}

export interface JobAlert {
  id: string;
  type: 'interview' | 'deadline';
  alertTime: string; // ISO date string when alert should trigger
  beforeAmount: number; // e.g., 1 for "1 day before"
  beforeUnit: 'minutes' | 'hours' | 'days';
  recurring: boolean;
  isActive: boolean;
}

export type JobStatus = 
  | 'in-corso'
  | 'ghosting'
  | 'primo-colloquio'
  | 'secondo-colloquio'
  | 'colloquio-tecnico'
  | 'colloquio-finale'
  | 'offerta-ricevuta'
  | 'rifiutato'
  | 'ritirato';

export const JOB_STATUS_LABELS: Record<JobStatus, string> = {
  'in-corso': 'In Progress',
  'ghosting': 'Ghosting',
  'primo-colloquio': 'First Interview',
  'secondo-colloquio': 'Second Interview',
  'colloquio-tecnico': 'Technical Interview',
  'colloquio-finale': 'Final Interview',
  'offerta-ricevuta': 'Offer Received',
  'rifiutato': 'Rejected',
  'ritirato': 'Withdrawn'
};
