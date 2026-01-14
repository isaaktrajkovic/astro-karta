-- Create subscriptions for daily horoscope delivery
CREATE TABLE public.horoscope_subscriptions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  order_id UUID NULL,
  email TEXT NOT NULL,
  first_name TEXT NULL,
  last_name TEXT NULL,
  zodiac_sign TEXT NOT NULL,
  language TEXT NOT NULL DEFAULT 'sr',
  timezone TEXT NOT NULL DEFAULT 'Europe/Belgrade',
  status TEXT NOT NULL DEFAULT 'active',
  start_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  end_at TIMESTAMP WITH TIME ZONE NOT NULL,
  next_send_at TIMESTAMP WITH TIME ZONE NULL,
  last_sent_at TIMESTAMP WITH TIME ZONE NULL,
  send_count INTEGER NOT NULL DEFAULT 0,
  unsubscribe_token TEXT NOT NULL UNIQUE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  CONSTRAINT horoscope_subscriptions_status_check CHECK (status IN ('active', 'completed', 'unsubscribed'))
);

-- Daily cached horoscopes (one per sign, date, language)
CREATE TABLE public.daily_horoscopes (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  horoscope_date DATE NOT NULL,
  zodiac_sign TEXT NOT NULL,
  language TEXT NOT NULL DEFAULT 'sr',
  work_text TEXT NOT NULL,
  health_text TEXT NOT NULL,
  love_text TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  CONSTRAINT daily_horoscopes_unique UNIQUE (horoscope_date, zodiac_sign, language)
);

CREATE INDEX horoscope_subscriptions_due_idx
  ON public.horoscope_subscriptions (status, next_send_at);
