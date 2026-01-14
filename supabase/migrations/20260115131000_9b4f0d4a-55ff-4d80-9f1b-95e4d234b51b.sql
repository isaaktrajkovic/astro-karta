ALTER TABLE public.daily_horoscopes
  ADD COLUMN IF NOT EXISTS gender TEXT NOT NULL DEFAULT 'unspecified';

ALTER TABLE public.daily_horoscopes
  DROP CONSTRAINT IF EXISTS daily_horoscopes_unique;

ALTER TABLE public.daily_horoscopes
  ADD CONSTRAINT daily_horoscopes_unique UNIQUE (horoscope_date, zodiac_sign, language, gender);

ALTER TABLE public.daily_horoscopes
  DROP CONSTRAINT IF EXISTS daily_horoscopes_gender_check;

ALTER TABLE public.daily_horoscopes
  ADD CONSTRAINT daily_horoscopes_gender_check CHECK (gender IN ('male', 'female', 'unspecified'));
