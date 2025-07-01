
-- Create table for interview questions
CREATE TABLE public.interview_questions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  application_id UUID REFERENCES public.job_applications(id) ON DELETE CASCADE NOT NULL,
  user_id UUID NOT NULL,
  question TEXT NOT NULL,
  interview_round TEXT, -- e.g., 'first', 'second', 'technical', 'final'
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create table for company reviews
CREATE TABLE public.company_reviews (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  company_name TEXT NOT NULL,
  user_id UUID NOT NULL,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  comment TEXT,
  role_applied TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(company_name, user_id) -- One review per user per company
);

-- Enable RLS on interview_questions
ALTER TABLE public.interview_questions ENABLE ROW LEVEL SECURITY;

-- RLS policies for interview_questions - allow all authenticated users to view questions
CREATE POLICY "All authenticated users can view interview questions" 
  ON public.interview_questions 
  FOR SELECT 
  TO authenticated
  USING (true);

CREATE POLICY "Users can create their own interview questions" 
  ON public.interview_questions 
  FOR INSERT 
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own interview questions" 
  ON public.interview_questions 
  FOR UPDATE 
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own interview questions" 
  ON public.interview_questions 
  FOR DELETE 
  TO authenticated
  USING (auth.uid() = user_id);

-- Enable RLS on company_reviews
ALTER TABLE public.company_reviews ENABLE ROW LEVEL SECURITY;

-- RLS policies for company_reviews - allow all authenticated users to view reviews
CREATE POLICY "All authenticated users can view company reviews" 
  ON public.company_reviews 
  FOR SELECT 
  TO authenticated
  USING (true);

CREATE POLICY "Users can create their own company reviews" 
  ON public.company_reviews 
  FOR INSERT 
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own company reviews" 
  ON public.company_reviews 
  FOR UPDATE 
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own company reviews" 
  ON public.company_reviews 
  FOR DELETE 
  TO authenticated
  USING (auth.uid() = user_id);

-- Add updated_at triggers
CREATE TRIGGER interview_questions_updated_at 
  BEFORE UPDATE ON public.interview_questions 
  FOR EACH ROW EXECUTE PROCEDURE public.update_updated_at_column();

CREATE TRIGGER company_reviews_updated_at 
  BEFORE UPDATE ON public.company_reviews 
  FOR EACH ROW EXECUTE PROCEDURE public.update_updated_at_column();
