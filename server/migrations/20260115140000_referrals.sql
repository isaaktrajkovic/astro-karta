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

ALTER TABLE orders
  ADD COLUMN IF NOT EXISTS referral_id INT NULL REFERENCES referrals(id),
  ADD COLUMN IF NOT EXISTS referral_code TEXT NULL,
  ADD COLUMN IF NOT EXISTS base_price_cents INT NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS discount_percent INT NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS discount_amount_cents INT NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS final_price_cents INT NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS referral_commission_percent INT NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS referral_commission_cents INT NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS referral_paid_cents INT NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS referral_paid BOOLEAN NOT NULL DEFAULT FALSE,
  ADD COLUMN IF NOT EXISTS referral_paid_at TIMESTAMPTZ NULL;

CREATE INDEX IF NOT EXISTS orders_referral_idx
  ON orders (referral_id);

UPDATE orders
SET referral_paid_cents = referral_commission_cents
WHERE referral_paid = TRUE
  AND referral_paid_cents = 0;
