ALTER TABLE orders
  ADD COLUMN IF NOT EXISTS utm_source TEXT,
  ADD COLUMN IF NOT EXISTS utm_medium TEXT,
  ADD COLUMN IF NOT EXISTS utm_campaign TEXT,
  ADD COLUMN IF NOT EXISTS utm_term TEXT,
  ADD COLUMN IF NOT EXISTS utm_content TEXT,
  ADD COLUMN IF NOT EXISTS referrer TEXT,
  ADD COLUMN IF NOT EXISTS landing_path TEXT,
  ADD COLUMN IF NOT EXISTS session_id TEXT;

CREATE TABLE IF NOT EXISTS analytics_events (
  id BIGSERIAL PRIMARY KEY,
  event_type TEXT NOT NULL,
  path TEXT NULL,
  referrer TEXT NULL,
  referrer_host TEXT NULL,
  utm_source TEXT NULL,
  utm_medium TEXT NULL,
  utm_campaign TEXT NULL,
  utm_term TEXT NULL,
  utm_content TEXT NULL,
  referral_code TEXT NULL,
  product_id TEXT NULL,
  order_id INT NULL,
  value_cents INT NULL,
  currency TEXT NULL,
  session_id TEXT NULL,
  user_agent TEXT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS analytics_events_created_at_idx
  ON analytics_events (created_at DESC);

CREATE INDEX IF NOT EXISTS analytics_events_type_idx
  ON analytics_events (event_type);

CREATE INDEX IF NOT EXISTS analytics_events_session_idx
  ON analytics_events (session_id);

CREATE INDEX IF NOT EXISTS analytics_events_referral_idx
  ON analytics_events (referral_code);

CREATE INDEX IF NOT EXISTS analytics_events_path_idx
  ON analytics_events (path);

CREATE INDEX IF NOT EXISTS analytics_events_referrer_idx
  ON analytics_events (referrer_host);

CREATE INDEX IF NOT EXISTS analytics_events_product_idx
  ON analytics_events (product_id);
