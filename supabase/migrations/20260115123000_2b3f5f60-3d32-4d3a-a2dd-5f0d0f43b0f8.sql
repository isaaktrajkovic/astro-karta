ALTER TABLE public.horoscope_subscriptions
  ADD COLUMN IF NOT EXISTS plan TEXT NOT NULL DEFAULT 'basic';

ALTER TABLE public.horoscope_subscriptions
  ADD COLUMN IF NOT EXISTS birth_time TIME NULL;
