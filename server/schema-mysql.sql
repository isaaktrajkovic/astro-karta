CREATE TABLE IF NOT EXISTS referrals (
  id INT AUTO_INCREMENT PRIMARY KEY,
  code VARCHAR(64) NOT NULL UNIQUE,
  owner_first_name VARCHAR(255) NOT NULL,
  owner_last_name VARCHAR(255) NOT NULL,
  discount_percent INT NOT NULL DEFAULT 0,
  commission_percent INT NOT NULL DEFAULT 0,
  is_active TINYINT(1) NOT NULL DEFAULT 1,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS orders (
  id INT AUTO_INCREMENT PRIMARY KEY,
  product_id VARCHAR(255) NOT NULL,
  product_name VARCHAR(255) NOT NULL,
  customer_name VARCHAR(255) NOT NULL,
  first_name VARCHAR(255) NOT NULL,
  last_name VARCHAR(255) NOT NULL,
  birth_date DATE NOT NULL,
  birth_time TIME NULL,
  birth_place VARCHAR(255) NOT NULL,
  city VARCHAR(255) NOT NULL,
  country VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  gender ENUM('male', 'female', 'unspecified') NOT NULL DEFAULT 'unspecified',
  note TEXT NULL,
  consultation_description TEXT NULL,
  language VARCHAR(8) NOT NULL DEFAULT 'sr',
  referral_id INT NULL,
  referral_code VARCHAR(64) NULL,
  base_price_cents INT NOT NULL DEFAULT 0,
  discount_percent INT NOT NULL DEFAULT 0,
  discount_amount_cents INT NOT NULL DEFAULT 0,
  final_price_cents INT NOT NULL DEFAULT 0,
  referral_commission_percent INT NOT NULL DEFAULT 0,
  referral_commission_cents INT NOT NULL DEFAULT 0,
  referral_paid TINYINT(1) NOT NULL DEFAULT 0,
  referral_paid_at TIMESTAMP NULL DEFAULT NULL,
  status ENUM('pending', 'processing', 'completed', 'cancelled') NOT NULL DEFAULT 'pending',
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT orders_referral_fk FOREIGN KEY (referral_id) REFERENCES referrals(id)
);

CREATE TABLE IF NOT EXISTS admins (
  id INT AUTO_INCREMENT PRIMARY KEY,
  email VARCHAR(255) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  name VARCHAR(255) NULL,
  status ENUM('active', 'disabled') NOT NULL DEFAULT 'active',
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  last_login TIMESTAMP NULL DEFAULT NULL
);

CREATE TABLE IF NOT EXISTS calculator_usage (
  id INT AUTO_INCREMENT PRIMARY KEY,
  sign1 VARCHAR(32) NOT NULL,
  sign2 VARCHAR(32) NOT NULL,
  compatibility INT NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS horoscope_subscriptions (
  id INT AUTO_INCREMENT PRIMARY KEY,
  order_id INT NULL,
  email VARCHAR(255) NOT NULL,
  first_name VARCHAR(255) NULL,
  last_name VARCHAR(255) NULL,
  zodiac_sign VARCHAR(32) NOT NULL,
  language VARCHAR(8) NOT NULL DEFAULT 'sr',
  timezone VARCHAR(64) NOT NULL DEFAULT 'Europe/Belgrade',
  plan ENUM('basic', 'premium') NOT NULL DEFAULT 'basic',
  birth_time TIME NULL,
  send_hour TINYINT NOT NULL DEFAULT 8,
  gender ENUM('male', 'female', 'unspecified') NOT NULL DEFAULT 'unspecified',
  status ENUM('active', 'completed', 'unsubscribed') NOT NULL DEFAULT 'active',
  start_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  end_at TIMESTAMP NOT NULL,
  next_send_at TIMESTAMP NULL DEFAULT NULL,
  last_sent_at TIMESTAMP NULL DEFAULT NULL,
  send_count INT NOT NULL DEFAULT 0,
  unsubscribe_token VARCHAR(128) NOT NULL UNIQUE,
  unsubscribed_at TIMESTAMP NULL DEFAULT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS daily_horoscopes (
  id INT AUTO_INCREMENT PRIMARY KEY,
  horoscope_date DATE NOT NULL,
  zodiac_sign VARCHAR(32) NOT NULL,
  language VARCHAR(8) NOT NULL DEFAULT 'sr',
  gender ENUM('male', 'female', 'unspecified') NOT NULL DEFAULT 'unspecified',
  work_text TEXT NOT NULL,
  health_text TEXT NOT NULL,
  love_text TEXT NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  UNIQUE KEY daily_horoscopes_unique (horoscope_date, zodiac_sign, language, gender)
);

CREATE TABLE IF NOT EXISTS horoscope_delivery_log (
  id INT AUTO_INCREMENT PRIMARY KEY,
  subscription_id VARCHAR(64) NOT NULL,
  email VARCHAR(255) NOT NULL,
  zodiac_sign VARCHAR(32) NOT NULL,
  horoscope_date DATE NOT NULL,
  status VARCHAR(16) NOT NULL,
  provider_id VARCHAR(128) NULL,
  error_message TEXT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX horoscope_subscriptions_due_idx ON horoscope_subscriptions (status, next_send_at);
CREATE INDEX horoscope_delivery_log_date_idx ON horoscope_delivery_log (horoscope_date);
CREATE INDEX horoscope_delivery_log_subscription_idx ON horoscope_delivery_log (subscription_id);

CREATE INDEX orders_referral_idx ON orders (referral_id);
