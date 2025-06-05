
import React, { useState } from 'react';
import { JobApplication, JobStatus } from '@/types/job';
import { parseJobDescription } from '@/utils/jobParser';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { X, Wand2 } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

interface AddJobFormProps {
  onAdd: (application: JobApplication) => void;
  onCancel: () => void;
}

export const AddJobForm: React.FC<AddJobFormProps> = ({ onAdd, onCancel }) => {
  const [jobDescription, setJobDescription] = useState('');
  const [applicationDate, setApplicationDate] = useState(
    new Date().toISOString().split('T')[0]
  );
  const [parsedData, setParsedData] = useState({
    companyName: '',
    roleDescription: '',
    salary: '',
    workMode: 'ND' as const
  });
  const [status, setStatus] = useState<JobStatus>('in-corso');
  const [isParsed, setIsParsed] = useState(false);

  const handleParseJob = () => {
    if (!jobDescription.trim()) {
      toast({
        title: "Errore",
        description: "Inserisci prima la descrizione del lavoro",
        variant: "destructive"
      });
      return;
    }

    const parsed = parseJobDescription(jobDescription);
    setParsedData(parsed);
    setIsParsed(true);
    toast({
      title: "Dati estratti!",
      description: "I dati sono stati estratti automaticamente dalla job description"
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!jobDescription.trim()) {
      toast({
        title: "Errore",
        description: "La descrizione del lavoro è obbligatoria",
        variant: "destructive"
      });
      return;
    }

    const application: JobApplication = {
      id: Date.now().toString(),
      jobDescription,
      applicationDate,
      companyName: parsedData.companyName || 'ND',
      roleDescription: parsedData.roleDescription || 'ND',
      salary: parsedData.salary || 'ND',
      workMode: parsedData.workMode,
      status,
      createdAt: new Date().toISOString()
    };

    onAdd(application);
    toast({
      title: "Candidatura aggiunta!",
      description: "La candidatura è stata salvata con successo"
    });
  };

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-gray-900">Aggiungi Candidatura</h2>
        <Button variant="ghost" size="sm" onClick={onCancel}>
          <X className="w-4 h-4" />
        </Button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Job Description */}
        <div>
          <Label htmlFor="jobDescription">Descrizione del Lavoro</Label>
          <Textarea
            id="jobDescription"
            value={jobDescription}
            onChange={(e) => setJobDescription(e.target.value)}
            placeholder="Incolla qui la job description completa..."
            className="mt-1 min-h-[120px]"
            required
          />
          <Button
            type="button"
            onClick={handleParseJob}
            className="mt-2 bg-purple-600 hover:bg-purple-700"
            disabled={!jobDescription.trim()}
          >
            <Wand2 className="w-4 h-4 mr-2" />
            Estrai Dati Automaticamente
          </Button>
        </div>

        {/* Application Date */}
        <div>
          <Label htmlFor="applicationDate">Data di Candidatura</Label>
          <Input
            id="applicationDate"
            type="date"
            value={applicationDate}
            onChange={(e) => setApplicationDate(e.target.value)}
            className="mt-1"
            required
          />
        </div>

        {/* Parsed Data (editable) */}
        {isParsed && (
          <div className="space-y-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
            <h3 className="font-medium text-blue-900">Dati Estratti (modificabili)</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="companyName">Nome Azienda</Label>
                <Input
                  id="companyName"
                  value={parsedData.companyName}
                  onChange={(e) => setParsedData(prev => ({ ...prev, companyName: e.target.value }))}
                  className="mt-1"
                />
              </div>

              <div>
                <Label htmlFor="salary">RAL</Label>
                <Input
                  id="salary"
                  value={parsedData.salary}
                  onChange={(e) => setParsedData(prev => ({ ...prev, salary: e.target.value }))}
                  className="mt-1"
                  placeholder="es. 45k, ND"
                />
              </div>

              <div>
                <Label htmlFor="workMode">Modalità di Lavoro</Label>
                <select
                  id="workMode"
                  value={parsedData.workMode}
                  onChange={(e) => setParsedData(prev => ({ 
                    ...prev, 
                    workMode: e.target.value as any 
                  }))}
                  className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="ND">Non specificato</option>
                  <option value="remoto">Remoto</option>
                  <option value="ibrido">Ibrido</option>
                  <option value="in-presenza">In presenza</option>
                </select>
              </div>

              <div>
                <Label htmlFor="status">Stato Candidatura</Label>
                <select
                  id="status"
                  value={status}
                  onChange={(e) => setStatus(e.target.value as JobStatus)}
                  className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="in-corso">In corso</option>
                  <option value="primo-colloquio">Primo colloquio</option>
                  <option value="secondo-colloquio">Secondo colloquio</option>
                  <option value="colloquio-tecnico">Colloquio tecnico</option>
                  <option value="colloquio-finale">Colloquio finale</option>
                  <option value="offerta-ricevuta">Offerta ricevuta</option>
                  <option value="rifiutato">Rifiutato</option>
                  <option value="ghosting">Ghosting</option>
                  <option value="ritirato">Ritirato</option>
                </select>
              </div>
            </div>

            <div>
              <Label htmlFor="roleDescription">Descrizione Ruolo</Label>
              <Textarea
                id="roleDescription"
                value={parsedData.roleDescription}
                onChange={(e) => setParsedData(prev => ({ ...prev, roleDescription: e.target.value }))}
                className="mt-1"
                rows={2}
              />
            </div>
          </div>
        )}

        {/* Submit Buttons */}
        <div className="flex gap-3 pt-4">
          <Button type="submit" className="bg-blue-600 hover:bg-blue-700 flex-1">
            Aggiungi Candidatura
          </Button>
          <Button type="button" variant="outline" onClick={onCancel}>
            Annulla
          </Button>
        </div>
      </form>
    </div>
  );
};
