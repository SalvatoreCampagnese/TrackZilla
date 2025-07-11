-- Add language preference to user_profiles table
ALTER TABLE public.user_profiles 
ADD COLUMN language_preference text DEFAULT 'it' CHECK (language_preference IN ('it', 'en'));

-- Add comment for the new column
COMMENT ON COLUMN public.user_profiles.language_preference IS 'User preferred language: it (Italian) or en (English)';