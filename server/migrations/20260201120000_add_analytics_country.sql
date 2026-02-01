ALTER TABLE analytics_events
  ADD COLUMN IF NOT EXISTS country TEXT;

CREATE INDEX IF NOT EXISTS analytics_events_country_idx
  ON analytics_events (country);
