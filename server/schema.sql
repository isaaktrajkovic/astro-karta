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
