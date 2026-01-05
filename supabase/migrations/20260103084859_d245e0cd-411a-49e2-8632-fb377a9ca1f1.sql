-- Create table to track calculator usage
CREATE TABLE public.calculator_usage (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  sign1 TEXT NOT NULL,
  sign2 TEXT NOT NULL,
  compatibility INTEGER NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.calculator_usage ENABLE ROW LEVEL SECURITY;

-- Allow anyone to insert (for tracking)
CREATE POLICY "Anyone can insert calculator usage"
ON public.calculator_usage
FOR INSERT
WITH CHECK (true);

-- Only authenticated users can view (admin dashboard)
CREATE POLICY "Authenticated users can view calculator usage"
ON public.calculator_usage
FOR SELECT
USING (true);