ALTER TABLE public.horoscope_subscriptions
  ADD COLUMN IF NOT EXISTS unsubscribed_at TIMESTAMP WITH TIME ZONE NULL;

CREATE TABLE IF NOT EXISTS public.horoscope_delivery_log (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  subscription_id UUID NOT NULL,
  email TEXT NOT NULL,
  zodiac_sign TEXT NOT NULL,
  horoscope_date DATE NOT NULL,
  status TEXT NOT NULL,
  provider_id TEXT NULL,
  error_message TEXT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  CONSTRAINT horoscope_delivery_status_check CHECK (status IN ('sent', 'failed'))
);

CREATE INDEX IF NOT EXISTS horoscope_delivery_log_date_idx
  ON public.horoscope_delivery_log (horoscope_date);

CREATE INDEX IF NOT EXISTS horoscope_delivery_log_subscription_idx
  ON public.horoscope_delivery_log (subscription_id);
