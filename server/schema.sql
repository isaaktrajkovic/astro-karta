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
  note TEXT NULL,
  consultation_description TEXT NULL,
  status TEXT NOT NULL DEFAULT 'pending',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT orders_status_check CHECK (status IN ('pending', 'processing', 'completed', 'cancelled'))
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
  CONSTRAINT horoscope_subscriptions_plan_check CHECK (plan IN ('basic', 'premium'))
);

CREATE TABLE IF NOT EXISTS daily_horoscopes (
  id SERIAL PRIMARY KEY,
  horoscope_date DATE NOT NULL,
  zodiac_sign TEXT NOT NULL,
  language TEXT NOT NULL DEFAULT 'sr',
  work_text TEXT NOT NULL,
  health_text TEXT NOT NULL,
  love_text TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT daily_horoscopes_unique UNIQUE (horoscope_date, zodiac_sign, language)
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
