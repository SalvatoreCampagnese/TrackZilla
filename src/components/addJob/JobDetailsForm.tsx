
import React from 'react';
import { JobStatus } from '@/types/job';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Wand2 } from 'lucide-react';

interface JobDetailsFormProps {
  parsedData: {
    companyName: string;
    roleDescription: string;
    salary: string;
    workMode: 'remoto' | 'ibrido' | 'in-presenza' | 'ND';
  };
  setParsedData: React.Dispatch<React.SetStateAction<{
    companyName: string;
    roleDescription: string;
    salary: string;
    workMode: 'remoto' | 'ibrido' | 'in-presenza' | 'ND';
  }>>;
  status: JobStatus;
  setStatus: (status: JobStatus) => void;
}

export const JobDetailsForm: React.FC<JobDetailsFormProps> = ({
  parsedData,
  setParsedData,
  status,
  setStatus
}) => {
  return (
    <div className="space-y-4 p-3 sm:p-4 bg-white/10 backdrop-blur-md rounded-lg border border-white/20 w-full">
      <h3 className="font-medium text-white flex items-center gap-2 text-sm sm:text-base">
        <Wand2 className="w-4 h-4" />
        Extracted Data (editable)
      </h3>
      
      <div className="space-y-4">
        <div>
          <Label htmlFor="companyName" className="text-white font-medium">Company Name *</Label>
          <Input
            id="companyName"
            value={parsedData.companyName}
            onChange={(e) => setParsedData(prev => ({
              ...prev,
              companyName: e.target.value
            }))}
            className="mt-1 bg-white/10 backdrop-blur-md border-white/20 text-white placeholder:text-white/50 focus-visible:ring-red-500 focus-visible:border-red-500"
            required
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="salary" className="text-white font-medium">Salary</Label>
            <Input
              id="salary"
              value={parsedData.salary}
              onChange={(e) => setParsedData(prev => ({
                ...prev,
                salary: e.target.value
              }))}
              className="mt-1 bg-white/10 backdrop-blur-md border-white/20 text-white placeholder:text-white/50 focus-visible:ring-red-500 focus-visible:border-red-500"
              placeholder="e.g. 45k, ND"
            />
          </div>

          <div>
            <Label htmlFor="workMode" className="text-white font-medium">Work Mode</Label>
            <select
              id="workMode"
              value={parsedData.workMode}
              onChange={(e) => setParsedData(prev => ({
                ...prev,
                workMode: e.target.value as 'remoto' | 'ibrido' | 'in-presenza' | 'ND'
              }))}
              className="mt-1 w-full px-3 py-2 border border-white/20 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 bg-white/10 backdrop-blur-md text-white"
            >
              <option value="ND" className="bg-gray-800 text-white">Not specified</option>
              <option value="remoto" className="bg-gray-800 text-white">Remote</option>
              <option value="ibrido" className="bg-gray-800 text-white">Hybrid</option>
              <option value="in-presenza" className="bg-gray-800 text-white">On-site</option>
            </select>
          </div>
        </div>

        <div>
          <Label htmlFor="status" className="text-white font-medium">Application Status</Label>
          <select
            id="status"
            value={status}
            onChange={(e) => setStatus(e.target.value as JobStatus)}
            className="mt-1 w-full px-3 py-2 border border-white/20 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 bg-white/10 backdrop-blur-md text-white"
          >
            <option value="in-corso" className="bg-gray-800 text-white">In progress</option>
            <option value="primo-colloquio" className="bg-gray-800 text-white">First interview</option>
            <option value="secondo-colloquio" className="bg-gray-800 text-white">Second interview</option>
            <option value="colloquio-tecnico" className="bg-gray-800 text-white">Technical interview</option>
            <option value="colloquio-finale" className="bg-gray-800 text-white">Final interview</option>
            <option value="offerta-ricevuta" className="bg-gray-800 text-white">Offer received</option>
            <option value="rifiutato" className="bg-gray-800 text-white">Rejected</option>
            <option value="ghosting" className="bg-gray-800 text-white">Ghosting</option>
            <option value="ritirato" className="bg-gray-800 text-white">Withdrawn</option>
          </select>
        </div>

        <div>
          <Label htmlFor="roleDescription" className="text-white font-medium">Role Description</Label>
          <Textarea
            id="roleDescription"
            value={parsedData.roleDescription}
            onChange={(e) => setParsedData(prev => ({
              ...prev,
              roleDescription: e.target.value
            }))}
            className="mt-1 bg-white/10 backdrop-blur-md border-white/20 text-white placeholder:text-white/50 resize-none focus-visible:ring-red-500 focus-visible:border-red-500"
            rows={3}
          />
        </div>
      </div>
    </div>
  );
};
