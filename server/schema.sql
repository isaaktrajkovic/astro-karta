CREATE TABLE IF NOT EXISTS referrals (
  id SERIAL PRIMARY KEY,
  code TEXT NOT NULL UNIQUE,
  owner_first_name TEXT NOT NULL,
  owner_last_name TEXT NOT NULL,
  discount_percent INT NOT NULL DEFAULT 0,
  commission_percent INT NOT NULL DEFAULT 0,
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS orders (
  id SERIAL PRIMARY KEY,
  product_id TEXT NOT NULL,
  product_name TEXT NOT NULL,
  customer_name TEXT NOT NULL,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  birth_date DATE NOT NULL,
  birth_time TIME NULL,
  birth_place TEXT NOT NULL,
  city TEXT NOT NULL,
  country TEXT NOT NULL,
  email TEXT NOT NULL,
  gender TEXT NOT NULL DEFAULT 'unspecified',
  note TEXT NULL,
  consultation_description TEXT NULL,
  language TEXT NOT NULL DEFAULT 'sr',
  referral_id INT NULL REFERENCES referrals(id),
  referral_code TEXT NULL,
  base_price_cents INT NOT NULL DEFAULT 0,
  discount_percent INT NOT NULL DEFAULT 0,
  discount_amount_cents INT NOT NULL DEFAULT 0,
  final_price_cents INT NOT NULL DEFAULT 0,
  referral_commission_percent INT NOT NULL DEFAULT 0,
  referral_commission_cents INT NOT NULL DEFAULT 0,
  referral_paid BOOLEAN NOT NULL DEFAULT FALSE,
  referral_paid_at TIMESTAMPTZ NULL,
  status TEXT NOT NULL DEFAULT 'pending',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT orders_status_check CHECK (status IN ('pending', 'processing', 'completed', 'cancelled')),
  CONSTRAINT orders_gender_check CHECK (gender IN ('male', 'female', 'unspecified'))
);

CREATE TABLE IF NOT EXISTS admins (
  id SERIAL PRIMARY KEY,
  email TEXT NOT NULL UNIQUE,
  password_hash TEXT NOT NULL,
  name TEXT NULL,
  status TEXT NOT NULL DEFAULT 'active',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  last_login TIMESTAMPTZ NULL,
  CONSTRAINT admins_status_check CHECK (status IN ('active', 'disabled'))
);

CREATE TABLE IF NOT EXISTS calculator_usage (
  id SERIAL PRIMARY KEY,
  sign1 TEXT NOT NULL,
  sign2 TEXT NOT NULL,
  compatibility INT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS horoscope_subscriptions (
  id SERIAL PRIMARY KEY,
  order_id INT NULL,
  email TEXT NOT NULL,
  first_name TEXT NULL,
  last_name TEXT NULL,
  zodiac_sign TEXT NOT NULL,
  language TEXT NOT NULL DEFAULT 'sr',
  timezone TEXT NOT NULL DEFAULT 'Europe/Belgrade',
  plan TEXT NOT NULL DEFAULT 'basic',
  birth_time TIME NULL,
  send_hour INT NOT NULL DEFAULT 8,
  gender TEXT NOT NULL DEFAULT 'unspecified',
  status TEXT NOT NULL DEFAULT 'active',
  start_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  end_at TIMESTAMPTZ NOT NULL,
  next_send_at TIMESTAMPTZ NULL,
  last_sent_at TIMESTAMPTZ NULL,
  send_count INT NOT NULL DEFAULT 0,
  unsubscribe_token TEXT NOT NULL UNIQUE,
  unsubscribed_at TIMESTAMPTZ NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT horoscope_subscriptions_status_check CHECK (status IN ('active', 'completed', 'unsubscribed')),
  CONSTRAINT horoscope_subscriptions_plan_check CHECK (plan IN ('basic', 'premium')),
  CONSTRAINT horoscope_subscriptions_gender_check CHECK (gender IN ('male', 'female', 'unspecified'))
);

CREATE TABLE IF NOT EXISTS daily_horoscopes (
  id SERIAL PRIMARY KEY,
  horoscope_date DATE NOT NULL,
  zodiac_sign TEXT NOT NULL,
  language TEXT NOT NULL DEFAULT 'sr',
  gender TEXT NOT NULL DEFAULT 'unspecified',
  work_text TEXT NOT NULL,
  health_text TEXT NOT NULL,
  love_text TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT daily_horoscopes_unique UNIQUE (horoscope_date, zodiac_sign, language, gender),
  CONSTRAINT daily_horoscopes_gender_check CHECK (gender IN ('male', 'female', 'unspecified'))
);

CREATE TABLE IF NOT EXISTS horoscope_delivery_log (
  id SERIAL PRIMARY KEY,
  subscription_id TEXT NOT NULL,
  email TEXT NOT NULL,
  zodiac_sign TEXT NOT NULL,
  horoscope_date DATE NOT NULL,
  status TEXT NOT NULL,
  provider_id TEXT NULL,
  error_message TEXT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT horoscope_delivery_status_check CHECK (status IN ('sent', 'failed'))
);

CREATE INDEX IF NOT EXISTS horoscope_subscriptions_due_idx
  ON horoscope_subscriptions (status, next_send_at);

CREATE INDEX IF NOT EXISTS horoscope_delivery_log_date_idx
  ON horoscope_delivery_log (horoscope_date);

CREATE INDEX IF NOT EXISTS horoscope_delivery_log_subscription_idx
  ON horoscope_delivery_log (subscription_id);

CREATE INDEX IF NOT EXISTS orders_referral_idx
  ON orders (referral_id);
