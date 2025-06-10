
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
