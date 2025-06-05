
import React, { useState } from 'react';
import { JobApplication, JobStatus } from '@/types/job';
import { parseJobDescription } from '@/utils/jobParser';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { X, Wand2, Plus, Tag, Calendar } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

interface AddJobFormProps {
  onAdd: (application: JobApplication) => void;
  onCancel: () => void;
}

export const AddJobForm: React.FC<AddJobFormProps> = ({ onAdd, onCancel }) => {
  const [step, setStep] = useState<'extract' | 'details'>('extract');
  const [jobDescription, setJobDescription] = useState('');
  const [applicationDate, setApplicationDate] = useState(
    new Date().toISOString().split('T')[0]
  );
  const [parsedData, setParsedData] = useState<{
    companyName: string;
    roleDescription: string;
    salary: string;
    workMode: 'remoto' | 'ibrido' | 'in-presenza' | 'ND';
  }>({
    companyName: '',
    roleDescription: '',
    salary: '',
    workMode: 'ND'
  });
  const [status, setStatus] = useState<JobStatus>('in-corso');
  const [tags, setTags] = useState<string[]>([]);
  const [newTag, setNewTag] = useState('');

  const predefinedTags = [
    'Dream Job',
    'Startup',
    'Importante',
    'RAL Interessante',
    'Referral',
    'Remote Friendly',
    'Grande Azienda',
    'Opportunità di Crescita'
  ];

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
    setStep('details');
    toast({
      title: "Dati estratti!",
      description: "I dati sono stati estratti automaticamente. Ora completa i dettagli."
    });
  };

  const handleAddTag = (tag: string) => {
    if (tag && !tags.includes(tag)) {
      setTags(prev => [...prev, tag]);
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(prev => prev.filter(tag => tag !== tagToRemove));
  };

  const handleAddCustomTag = () => {
    if (newTag.trim()) {
      handleAddTag(newTag.trim());
      setNewTag('');
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!parsedData.companyName.trim()) {
      toast({
        title: "Errore",
        description: "Il nome dell'azienda è obbligatorio",
        variant: "destructive"
      });
      return;
    }

    const application: JobApplication = {
      id: Date.now().toString(),
      jobDescription,
      applicationDate,
      companyName: parsedData.companyName,
      roleDescription: parsedData.roleDescription || 'ND',
      salary: parsedData.salary || 'ND',
      workMode: parsedData.workMode,
      status,
      tags,
      createdAt: new Date().toISOString()
    };

    onAdd(application);
    toast({
      title: "Candidatura aggiunta!",
      description: "La candidatura è stata salvata con successo"
    });
  };

  return (
    <div className="p-6 bg-background text-foreground">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-semibold text-foreground">Aggiungi Candidatura</h2>
          <div className="flex items-center gap-2 mt-2">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
              step === 'extract' ? 'bg-blue-600 text-white' : 'bg-green-600 text-white'
            }`}>
              1
            </div>
            <span className={step === 'extract' ? 'text-blue-600 font-medium' : 'text-green-600'}>
              Estrazione Dati
            </span>
            <div className="w-8 h-0.5 bg-border"></div>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
              step === 'details' ? 'bg-blue-600 text-white' : 'bg-muted text-muted-foreground'
            }`}>
              2
            </div>
            <span className={step === 'details' ? 'text-blue-600 font-medium' : 'text-muted-foreground'}>
              Dettagli
            </span>
          </div>
        </div>
        <Button variant="ghost" size="sm" onClick={onCancel} className="text-foreground hover:bg-accent">
          <X className="w-4 h-4" />
        </Button>
      </div>

      {step === 'extract' && (
        <div className="space-y-6">
          <div>
            <Label htmlFor="jobDescription" className="text-foreground">Descrizione del Lavoro *</Label>
            <Textarea
              id="jobDescription"
              value={jobDescription}
              onChange={(e) => setJobDescription(e.target.value)}
              placeholder="Incolla qui la job description completa..."
              className="mt-1 min-h-[200px] bg-background border-border text-foreground"
              required
            />
            <p className="text-sm text-muted-foreground mt-2">
              Incolla l'intera job description per estrarre automaticamente i dati principali
            </p>
          </div>

          <div>
            <Label htmlFor="applicationDate" className="text-foreground">Data di Candidatura</Label>
            <div className="relative w-fit mt-1">
              <Input
                id="applicationDate"
                type="date"
                value={applicationDate}
                onChange={(e) => setApplicationDate(e.target.value)}
                className="bg-background border-border text-foreground pr-10 [&::-webkit-calendar-picker-indicator]:opacity-0"
                required
              />
              <Calendar className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-white pointer-events-none" />
            </div>
          </div>

          <Button
            type="button"
            onClick={handleParseJob}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white"
            disabled={!jobDescription.trim()}
          >
            <Wand2 className="w-4 h-4 mr-2" />
            Estrai Dati e Continua
          </Button>
        </div>
      )}

      {step === 'details' && (
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4 p-4 bg-green-50 dark:bg-green-950/20 rounded-lg border border-green-200 dark:border-green-800">
            <h3 className="font-medium text-green-900 dark:text-green-100 flex items-center gap-2">
              <Wand2 className="w-4 h-4" />
              Dati Estratti (modificabili)
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="companyName" className="text-foreground">Nome Azienda *</Label>
                <Input
                  id="companyName"
                  value={parsedData.companyName}
                  onChange={(e) => setParsedData(prev => ({ ...prev, companyName: e.target.value }))}
                  className="mt-1 bg-background border-border text-foreground"
                  required
                />
              </div>

              <div>
                <Label htmlFor="salary" className="text-foreground">RAL</Label>
                <Input
                  id="salary"
                  value={parsedData.salary}
                  onChange={(e) => setParsedData(prev => ({ ...prev, salary: e.target.value }))}
                  className="mt-1 bg-background border-border text-foreground"
                  placeholder="es. 45k, ND"
                />
              </div>

              <div>
                <Label htmlFor="workMode" className="text-foreground">Modalità di Lavoro</Label>
                <select
                  id="workMode"
                  value={parsedData.workMode}
                  onChange={(e) => setParsedData(prev => ({ 
                    ...prev, 
                    workMode: e.target.value as 'remoto' | 'ibrido' | 'in-presenza' | 'ND'
                  }))}
                  className="mt-1 w-full px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-background text-foreground"
                >
                  <option value="ND">Non specificato</option>
                  <option value="remoto">Remoto</option>
                  <option value="ibrido">Ibrido</option>
                  <option value="in-presenza">In presenza</option>
                </select>
              </div>

              <div>
                <Label htmlFor="status" className="text-foreground">Stato Candidatura</Label>
                <select
                  id="status"
                  value={status}
                  onChange={(e) => setStatus(e.target.value as JobStatus)}
                  className="mt-1 w-full px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-background text-foreground"
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

            <div className="md:col-span-2">
              <Label htmlFor="roleDescription" className="text-foreground">Descrizione Ruolo</Label>
              <Textarea
                id="roleDescription"
                value={parsedData.roleDescription}
                onChange={(e) => setParsedData(prev => ({ ...prev, roleDescription: e.target.value }))}
                className="mt-1 bg-background border-border text-foreground"
                rows={2}
              />
            </div>
          </div>

          {/* Tags Section */}
          <div className="space-y-4">
            <Label className="flex items-center gap-2 text-foreground">
              <Tag className="w-4 h-4" />
              Tag Personalizzati
            </Label>
            
            {/* Selected Tags */}
            {tags.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {tags.map((tag, index) => (
                  <div
                    key={index}
                    className="inline-flex items-center gap-1 bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-200 px-2 py-1 rounded-full text-sm"
                  >
                    <Tag className="w-3 h-3" />
                    {tag}
                    <button
                      type="button"
                      onClick={() => handleRemoveTag(tag)}
                      className="ml-1 text-blue-600 dark:text-blue-300 hover:text-blue-800 dark:hover:text-blue-100"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                ))}
              </div>
            )}

            {/* Predefined Tags */}
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">Tag predefiniti:</p>
              <div className="flex flex-wrap gap-2">
                {predefinedTags.filter(tag => !tags.includes(tag)).map((tag) => (
                  <button
                    key={tag}
                    type="button"
                    onClick={() => handleAddTag(tag)}
                    className="inline-flex items-center gap-1 bg-muted hover:bg-accent text-foreground px-2 py-1 rounded-full text-sm transition-colors"
                  >
                    <Plus className="w-3 h-3" />
                    {tag}
                  </button>
                ))}
              </div>
            </div>

            {/* Custom Tag Input */}
            <div className="flex gap-2">
              <Input
                value={newTag}
                onChange={(e) => setNewTag(e.target.value)}
                placeholder="Aggiungi tag personalizzato..."
                className="flex-1 bg-background border-border text-foreground"
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddCustomTag())}
              />
              <Button
                type="button"
                onClick={handleAddCustomTag}
                variant="outline"
                size="sm"
                disabled={!newTag.trim()}
                className="text-foreground border-border hover:bg-accent"
              >
                <Plus className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* Submit Buttons */}
          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => setStep('extract')}
              className="flex-1 text-foreground border-border hover:bg-accent"
            >
              Indietro
            </Button>
            <Button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white flex-1">
              Aggiungi Candidatura
            </Button>
          </div>
        </form>
      )}
    </div>
  );
};
