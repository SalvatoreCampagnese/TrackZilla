
import React, { useRef, useEffect } from 'react';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Calendar } from 'lucide-react';

interface JobExtractionStepProps {
  jobDescription: string;
  setJobDescription: (value: string) => void;
  applicationDate: string;
  setApplicationDate: (value: string) => void;
}

export const JobExtractionStep: React.FC<JobExtractionStepProps> = ({
  jobDescription,
  setJobDescription,
  applicationDate,
  setApplicationDate
}) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.focus();
    }
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <Label htmlFor="jobDescription" className="text-white font-medium">Job Description *</Label>
        <Textarea
          ref={textareaRef}
          id="jobDescription"
          value={jobDescription}
          onChange={(e) => setJobDescription(e.target.value)}
          placeholder="Paste the complete job description here..."
          className="mt-2 min-h-[300px] bg-white/10 backdrop-blur-md border-white/20 text-white placeholder:text-white/50 resize-none focus-visible:ring-red-500 focus-visible:border-red-500"
          required
          autoFocus
        />
        <p className="text-sm text-white/70 mt-2">
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
  );
};
