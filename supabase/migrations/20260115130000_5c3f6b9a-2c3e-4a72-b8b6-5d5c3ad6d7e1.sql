ALTER TABLE public.orders
  ADD COLUMN IF NOT EXISTS gender TEXT NOT NULL DEFAULT 'unspecified';

ALTER TABLE public.horoscope_subscriptions
  ADD COLUMN IF NOT EXISTS gender TEXT NOT NULL DEFAULT 'unspecified';
