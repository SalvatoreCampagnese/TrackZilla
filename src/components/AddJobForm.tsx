import React, { useState, useRef, useEffect } from 'react';
import { JobApplication, JobStatus } from '@/types/job';
import { parseJobDescription } from '@/utils/jobParser';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { X, Wand2, Plus, Tag, Calendar } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { useIsMobile } from '@/hooks/use-mobile';

interface AddJobFormProps {
  onAdd: (application: JobApplication) => void;
  onCancel: () => void;
  open: boolean;
}

export const AddJobForm: React.FC<AddJobFormProps> = ({
  onAdd,
  onCancel,
  open
}) => {
  const isMobile = useIsMobile();
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [step, setStep] = useState<'extract' | 'details'>('extract');
  const [jobDescription, setJobDescription] = useState('');
  const [applicationDate, setApplicationDate] = useState(new Date().toISOString().split('T')[0]);
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

  // Force focus on textarea when modal opens
  useEffect(() => {
    if (open && step === 'extract') {
      // Multiple attempts to ensure focus
      const focusTextarea = () => {
        if (textareaRef.current) {
          textareaRef.current.focus();
          textareaRef.current.setSelectionRange(textareaRef.current.value.length, textareaRef.current.value.length);
        }
      };

      // Immediate focus
      focusTextarea();

      // Delayed focus to override any modal focus management
      const timer1 = setTimeout(focusTextarea, 50);
      const timer2 = setTimeout(focusTextarea, 100);
      const timer3 = setTimeout(focusTextarea, 200);
      return () => {
        clearTimeout(timer1);
        clearTimeout(timer2);
        clearTimeout(timer3);
      };
    }
  }, [open, step]);
  const predefinedTags = ['Dream Job', 'Startup', 'Important', 'Interesting Salary', 'Referral', 'Remote Friendly', 'Big Company', 'Growth Opportunity'];
  const handleParseJob = () => {
    if (!jobDescription.trim()) {
      toast({
        title: "Error",
        description: "Please enter the job description first",
        variant: "destructive"
      });
      return;
    }
    const parsed = parseJobDescription(jobDescription);
    setParsedData(parsed);
    setStep('details');
    toast({
      title: "Data extracted!",
      description: "Data has been automatically extracted. Now complete the details."
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
        title: "Error",
        description: "Company name is required",
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
      title: "Application added!",
      description: "The application has been successfully saved"
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
    <div className="flex flex-col h-full overflow-hidden">
      {/* Header with step indicator */}
      <div className="flex-shrink-0 mb-4 sm:mb-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-lg sm:text-xl font-semibold text-white">Add Application</h2>
            <div className="flex items-center gap-2 mt-2">
              <div className={`w-6 h-6 sm:w-8 sm:h-8 rounded-full flex items-center justify-center text-xs sm:text-sm font-medium ${
                step === 'extract' ? 'bg-red-600 text-white' : 'bg-green-600 text-white'
              }`}>
                1
              </div>
              <span className={`text-xs sm:text-sm ${
                step === 'extract' ? 'text-red-600 font-medium' : 'text-green-600'
              }`}>
                Extraction
              </span>
              <div className="w-4 sm:w-8 h-0.5 bg-white/20"></div>
              <div className={`w-6 h-6 sm:w-8 sm:h-8 rounded-full flex items-center justify-center text-xs sm:text-sm font-medium ${
                step === 'details' ? 'bg-red-600 text-white' : 'bg-white/20 text-white/60'
              }`}>
                2
              </div>
              <span className={`text-xs sm:text-sm ${
                step === 'details' ? 'text-red-600 font-medium' : 'text-white/60'
              }`}>
                Details
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Scrollable form content */}
      <div className="flex-1 overflow-hidden">
        <ScrollArea className="">
          {step === 'extract' && (
            <div className="space-y-4 sm:space-y-6">
              <div>
                <Label htmlFor="jobDescription" className="text-white font-medium">Job Description *</Label>
                <Textarea
                  ref={textareaRef}
                  id="jobDescription"
                  value={jobDescription}
                  onChange={(e) => setJobDescription(e.target.value)}
                  placeholder="Paste the complete job description here..."
                  className="mt-2 min-h-[150px] sm:min-h-[200px] bg-white/10 backdrop-blur-md border-white/20 text-white placeholder:text-white/50 resize-none focus-visible:ring-red-500 focus-visible:border-red-500"
                  required
                  autoFocus
                  onFocus={(e) => {
                    // Ensure cursor is at the end when focused
                    e.target.setSelectionRange(e.target.value.length, e.target.value.length);
                  }}
                />
                <p className="text-xs sm:text-sm text-white/70 mt-2">
                  Paste the entire job description to automatically extract the main data
                </p>
              </div>

              <div>
                <Label htmlFor="applicationDate" className="text-white font-medium">Application Date</Label>
                <div className="relative w-fit mt-2">
                  <Input
                    id="applicationDate"
                    type="date"
                    value={applicationDate}
                    onChange={(e) => setApplicationDate(e.target.value)}
                    className="bg-white/10 backdrop-blur-md border-white/20 text-white pr-10 w-auto [&::-webkit-calendar-picker-indicator]:opacity-0 focus-visible:ring-red-500 focus-visible:border-red-500"
                    required
                  />
                  <Calendar className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-white pointer-events-none" />
                </div>
              </div>
            </div>
          )}

          {step === 'details' && (
            <ScrollArea className="h-full">
              <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6 w-full h-[500px] overflow-scroll sm:h-[300px]">
                <div className="space-y-4 p-3 sm:p-4 bg-white/10 backdrop-blur-md rounded-lg border border-white/20 w-full overflow-scroll">
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

                {/* Tags Section */}
                <div className="space-y-3 sm:space-y-4">
                  <Label className="flex items-center gap-2 text-white font-medium">
                    <Tag className="w-4 h-4" />
                    Custom Tags
                  </Label>
                  
                  {/* Selected Tags */}
                  {tags.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {tags.map((tag, index) => (
                        <div
                          key={index}
                          className="inline-flex items-center gap-1 bg-red-100/20 text-red-300 px-2 py-1 rounded-full text-xs sm:text-sm border border-red-400/30"
                        >
                          <Tag className="w-3 h-3" />
                          {tag}
                          <button
                            type="button"
                            onClick={() => handleRemoveTag(tag)}
                            className="ml-1 text-red-300 hover:text-red-100"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Predefined Tags */}
                  <div className="space-y-2">
                    <p className="text-xs sm:text-sm text-white/70">Predefined tags:</p>
                    <div className="flex flex-wrap gap-2">
                      {predefinedTags.filter(tag => !tags.includes(tag)).map(tag => (
                        <button
                          key={tag}
                          type="button"
                          onClick={() => handleAddTag(tag)}
                          className="inline-flex items-center gap-1 bg-white/10 hover:bg-white/20 text-white px-2 py-1 rounded-full text-xs sm:text-sm transition-colors border border-white/20 hover:border-white/30"
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
                      placeholder="Add custom tag..."
                      className="flex-1 bg-white/10 backdrop-blur-md border-white/20 text-white placeholder:text-white/50 text-sm focus-visible:ring-red-500 focus-visible:border-red-500"
                      onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddCustomTag())}
                    />
                    <Button
                      type="button"
                      onClick={handleAddCustomTag}
                      variant="outline"
                      size="sm"
                      disabled={!newTag.trim()}
                      className="text-white border-white/20 hover:bg-white/20 px-3 rounded-full"
                    >
                      <Plus className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </form>
            </ScrollArea>
          )}
        </ScrollArea>
      </div>

      {/* Footer buttons */}
      <div className="flex-shrink-0 pt-4 sm:pt-6 border-t border-white/20 mt-4 sm:mt-6">
        {step === 'extract' ? (
          <div className="space-y-3">
            <Button
              type="button"
              onClick={handleParseJob}
              className="w-full bg-red-600 hover:bg-red-700 text-white h-10 sm:h-11 rounded-full"
              disabled={!jobDescription.trim()}
            >
              <Wand2 className="w-4 h-4 mr-2" />
              Extract Data and Continue
            </Button>
            {isMobile && (
              <Button
                type="button"
                variant="outline"
                onClick={handleClose}
                className="w-full text-white border-white/20 hover:bg-white/20 h-10 rounded-full"
              >
                Cancel
              </Button>
            )}
          </div>
        ) : (
          <div className="flex flex-col sm:flex-row gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={() => setStep('extract')}
              className="flex-1 text-white border-white/20 hover:bg-white/20 h-10 sm:h-11 order-2 sm:order-1 rounded-full"
            >
              Back
            </Button>
            <Button
              onClick={handleSubmit}
              className="bg-red-600 hover:bg-red-700 text-white flex-1 h-10 sm:h-11 order-1 sm:order-2 rounded-full"
            >
              Add Application
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
          className="h-[90vh] flex flex-col p-4 bg-gradient-to-br from-gray-900 to-gray-800 border-white/20"
          onOpenAutoFocus={(e) => e.preventDefault()}
          onPointerDownOutside={(e) => e.preventDefault()}
          onInteractOutside={(e) => e.preventDefault()}
        >
          <SheetHeader className="flex-shrink-0">
            <SheetTitle className="sr-only">Add Application</SheetTitle>
          </SheetHeader>
          <FormContent />
        </SheetContent>
      </Sheet>
    );
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent
        onOpenAutoFocus={(e) => e.preventDefault()}
        onPointerDownOutside={(e) => e.preventDefault()}
        onInteractOutside={(e) => e.preventDefault()}
        className="max-w-2xl w-full max-h-[90vh] flex flex-col p-6 bg-gradient-to-br from-gray-900 to-gray-800 border-white/20"
      >
        <DialogHeader className="flex-shrink-0">
          <DialogTitle className="sr-only">Add Application</DialogTitle>
        </DialogHeader>
        <FormContent />
      </DialogContent>
    </Dialog>
  );
};
