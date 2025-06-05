
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
  'in-corso': 'In corso',
  'ghosting': 'Ghosting',
  'primo-colloquio': 'Primo colloquio',
  'secondo-colloquio': 'Secondo colloquio',
  'colloquio-tecnico': 'Colloquio tecnico',
  'colloquio-finale': 'Colloquio finale',
  'offerta-ricevuta': 'Offerta ricevuta',
  'rifiutato': 'Rifiutato',
  'ritirato': 'Ritirato'
};
