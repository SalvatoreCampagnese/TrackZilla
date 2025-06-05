import React, { useState, useRef, useEffect } from 'react';
import { JobApplication, JobStatus } from '@/types/job';
import { parseJobDescription } from '@/utils/jobParser';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { X, Wand2, Plus, Tag, Calendar } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { useIsMobile } from '@/hooks/use-mobile';

interface AddJobFormProps {
  onAdd: (application: JobApplication) => void;
  onCancel: () => void;
  open: boolean;
}

export const AddJobForm: React.FC<AddJobFormProps> = ({ onAdd, onCancel, open }) => {
  const isMobile = useIsMobile();
  const textareaRef = useRef<HTMLTextAreaElement>(null);
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

  // Effetto per gestire l'autofocus quando la modale si apre
  useEffect(() => {
    if (open && step === 'extract') {
      const timer = setTimeout(() => {
        if (textareaRef.current) {
          textareaRef.current.focus();
        }
      }, 150);
      return () => clearTimeout(timer);
    }
  }, [open, step]);

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

  const handleClose = () => {
    setStep('extract');
    setJobDescription('');
    setApplicationDate(new Date().toISOString().split('T')[0]);
    setParsedData({
      companyName: '',
      roleDescription: '',
      salary: '',
      workMode: 'ND'
    });
    setStatus('in-corso');
    setTags([]);
    setNewTag('');
    onCancel();
  };

  const FormContent = () => (
    <div className="flex flex-col h-full">
      {/* Header with step indicator */}
      <div className="flex-shrink-0 mb-4 sm:mb-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-lg sm:text-xl font-semibold text-foreground">Aggiungi Candidatura</h2>
            <div className="flex items-center gap-2 mt-2">
              <div className={`w-6 h-6 sm:w-8 sm:h-8 rounded-full flex items-center justify-center text-xs sm:text-sm font-medium ${
                step === 'extract' ? 'bg-blue-600 text-white' : 'bg-green-600 text-white'
              }`}>
                1
              </div>
              <span className={`text-xs sm:text-sm ${step === 'extract' ? 'text-blue-600 font-medium' : 'text-green-600'}`}>
                Estrazione
              </span>
              <div className="w-4 sm:w-8 h-0.5 bg-border"></div>
              <div className={`w-6 h-6 sm:w-8 sm:h-8 rounded-full flex items-center justify-center text-xs sm:text-sm font-medium ${
                step === 'details' ? 'bg-blue-600 text-white' : 'bg-muted text-muted-foreground'
              }`}>
                2
              </div>
              <span className={`text-xs sm:text-sm ${step === 'details' ? 'text-blue-600 font-medium' : 'text-muted-foreground'}`}>
                Dettagli
              </span>
            </div>
          </div>
          {!isMobile && (
            <Button variant="ghost" size="sm" onClick={handleClose} className="text-foreground hover:bg-accent">
              <X className="w-4 h-4" />
            </Button>
          )}
        </div>
      </div>

      {/* Form content */}
      <div className="flex-1 overflow-y-auto">
        {step === 'extract' && (
          <div className="space-y-4 sm:space-y-6">
            <div>
              <Label htmlFor="jobDescription" className="text-foreground font-medium">Descrizione del Lavoro *</Label>
              <Textarea
                ref={textareaRef}
                id="jobDescription"
                value={jobDescription}
                onChangeValue={(e) => setJobDescription(e.target.value)}
                placeholder="Incolla qui la job description completa..."
                className="mt-2 min-h-[150px] sm:min-h-[200px] bg-background border-border text-foreground resize-none"
                required
              />
              <p className="text-xs sm:text-sm text-muted-foreground mt-2">
                Incolla l'intera job description per estrarre automaticamente i dati principali
              </p>
            </div>

            <div>
              <Label htmlFor="applicationDate" className="text-foreground font-medium">Data di Candidatura</Label>
              <div className="relative w-fit mt-2">
                <Input
                  id="applicationDate"
                  type="date"
                  value={applicationDate}
                  onChange={(e) => setApplicationDate(e.target.value)}
                  className="bg-background border-border text-foreground pr-10 w-auto [&::-webkit-calendar-picker-indicator]:opacity-0"
                  required
                />
                <Calendar className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-white pointer-events-none" />
              </div>
            </div>
          </div>
        )}

        {step === 'details' && (
          <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
            <div className="space-y-4 p-3 sm:p-4 bg-green-50 dark:bg-green-950/20 rounded-lg border border-green-200 dark:border-green-800">
              <h3 className="font-medium text-green-900 dark:text-green-100 flex items-center gap-2 text-sm sm:text-base">
                <Wand2 className="w-4 h-4" />
                Dati Estratti (modificabili)
              </h3>
              
              <div className="space-y-4">
                <div>
                  <Label htmlFor="companyName" className="text-foreground font-medium">Nome Azienda *</Label>
                  <Input
                    id="companyName"
                    value={parsedData.companyName}
                    onChange={(e) => setParsedData(prev => ({ ...prev, companyName: e.target.value }))}
                    className="mt-1 bg-background border-border text-foreground"
                    required
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="salary" className="text-foreground font-medium">RAL</Label>
                    <Input
                      id="salary"
                      value={parsedData.salary}
                      onChange={(e) => setParsedData(prev => ({ ...prev, salary: e.target.value }))}
                      className="mt-1 bg-background border-border text-foreground"
                      placeholder="es. 45k, ND"
                    />
                  </div>

                  <div>
                    <Label htmlFor="workMode" className="text-foreground font-medium">Modalità di Lavoro</Label>
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
                </div>

                <div>
                  <Label htmlFor="status" className="text-foreground font-medium">Stato Candidatura</Label>
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

                <div>
                  <Label htmlFor="roleDescription" className="text-foreground font-medium">Descrizione Ruolo</Label>
                  <Textarea
                    id="roleDescription"
                    value={parsedData.roleDescription}
                    onChange={(e) => setParsedData(prev => ({ ...prev, roleDescription: e.target.value }))}
                    className="mt-1 bg-background border-border text-foreground resize-none"
                    rows={3}
                  />
                </div>
              </div>
            </div>

            {/* Tags Section */}
            <div className="space-y-3 sm:space-y-4">
              <Label className="flex items-center gap-2 text-foreground font-medium">
                <Tag className="w-4 h-4" />
                Tag Personalizzati
              </Label>
              
              {/* Selected Tags */}
              {tags.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {tags.map((tag, index) => (
                    <div
                      key={index}
                      className="inline-flex items-center gap-1 bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-200 px-2 py-1 rounded-full text-xs sm:text-sm"
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
                <p className="text-xs sm:text-sm text-muted-foreground">Tag predefiniti:</p>
                <div className="flex flex-wrap gap-2">
                  {predefinedTags.filter(tag => !tags.includes(tag)).map((tag) => (
                    <button
                      key={tag}
                      type="button"
                      onClick={() => handleAddTag(tag)}
                      className="inline-flex items-center gap-1 bg-muted hover:bg-accent text-foreground px-2 py-1 rounded-full text-xs sm:text-sm transition-colors"
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
                  className="flex-1 bg-background border-border text-foreground text-sm"
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddCustomTag())}
                />
                <Button
                  type="button"
                  onClick={handleAddCustomTag}
                  variant="outline"
                  size="sm"
                  disabled={!newTag.trim()}
                  className="text-foreground border-border hover:bg-accent px-3"
                >
                  <Plus className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </form>
        )}
      </div>

      {/* Footer buttons */}
      <div className="flex-shrink-0 pt-4 sm:pt-6 border-t mt-4 sm:mt-6">
        {step === 'extract' ? (
          <div className="space-y-3">
            <Button
              type="button"
              onClick={handleParseJob}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white h-10 sm:h-11"
              disabled={!jobDescription.trim()}
            >
              <Wand2 className="w-4 h-4 mr-2" />
              Estrai Dati e Continua
            </Button>
            {isMobile && (
              <Button
                type="button"
                variant="outline"
                onClick={handleClose}
                className="w-full text-foreground border-border hover:bg-accent h-10"
              >
                Annulla
              </Button>
            )}
          </div>
        ) : (
          <div className="flex flex-col sm:flex-row gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={() => setStep('extract')}
              className="flex-1 text-foreground border-border hover:bg-accent h-10 sm:h-11 order-2 sm:order-1"
            >
              Indietro
            </Button>
            <Button 
              onClick={handleSubmit} 
              className="bg-blue-600 hover:bg-blue-700 text-white flex-1 h-10 sm:h-11 order-1 sm:order-2"
            >
              Aggiungi Candidatura
            </Button>
          </div>
        )}
      </div>
    </div>
  );

  if (isMobile) {
    return (
      <Sheet open={open} onOpenChange={handleClose}>
        <SheetContent 
          side="bottom" 
          className="h-[90vh] flex flex-col p-4"
          onOpenAutoFocus={(e) => e.preventDefault()}
          onPointerDownOutside={(e) => e.preventDefault()}
          onInteractOutside={(e) => e.preventDefault()}
        >
          <SheetHeader className="flex-shrink-0">
            <SheetTitle className="sr-only">Aggiungi Candidatura</SheetTitle>
          </SheetHeader>
          <FormContent />
        </SheetContent>
      </Sheet>
    );
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent 
        className="max-w-2xl w-full max-h-[90vh] flex flex-col p-6"
        onOpenAutoFocus={(e) => e.preventDefault()}
        onPointerDownOutside={(e) => e.preventDefault()}
        onInteractOutside={(e) => e.preventDefault()}
      >
        <DialogHeader className="flex-shrink-0">
          <DialogTitle className="sr-only">Aggiungi Candidatura</DialogTitle>
        </DialogHeader>
        <FormContent />
      </DialogContent>
    </Dialog>
  );
};
