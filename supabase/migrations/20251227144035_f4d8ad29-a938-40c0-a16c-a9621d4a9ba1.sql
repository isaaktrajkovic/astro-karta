-- Add new columns to orders table for first/last name and city/country
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS first_name text;
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS last_name text;
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS city text;
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS country text;

-- Update existing customer_name to first_name where applicable
UPDATE public.orders SET first_name = customer_name WHERE first_name IS NULL;

-- Make first_name and last_name required for new entries (keep customer_name for compatibility)
ALTER TABLE public.orders ALTER COLUMN first_name SET DEFAULT '';
ALTER TABLE public.orders ALTER COLUMN last_name SET DEFAULT '';
ALTER TABLE public.orders ALTER COLUMN city SET DEFAULT '';
ALTER TABLE public.orders ALTER COLUMN country SET DEFAULT '';