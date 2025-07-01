
-- Add role and technologies columns to interview_questions table
ALTER TABLE public.interview_questions 
ADD COLUMN role text,
ADD COLUMN technologies text;
