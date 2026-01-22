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
  utm_source VARCHAR(255) NULL,
  utm_medium VARCHAR(255) NULL,
  utm_campaign VARCHAR(255) NULL,
  utm_term VARCHAR(255) NULL,
  utm_content VARCHAR(255) NULL,
  referrer TEXT NULL,
  landing_path VARCHAR(512) NULL,
  session_id VARCHAR(255) NULL,
  referral_id INT NULL,
  referral_code VARCHAR(64) NULL,
  base_price_cents INT NOT NULL DEFAULT 0,
  discount_percent INT NOT NULL DEFAULT 0,
  discount_amount_cents INT NOT NULL DEFAULT 0,
  final_price_cents INT NOT NULL DEFAULT 0,
  referral_commission_percent INT NOT NULL DEFAULT 0,
  referral_commission_cents INT NOT NULL DEFAULT 0,
  referral_paid_cents INT NOT NULL DEFAULT 0,
  referral_paid TINYINT(1) NOT NULL DEFAULT 0,
  referral_paid_at TIMESTAMP NULL DEFAULT NULL,
  status ENUM('pending', 'processing', 'completed', 'cancelled') NOT NULL DEFAULT 'pending',
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT orders_referral_fk FOREIGN KEY (referral_id) REFERENCES referrals(id)
);

CREATE TABLE IF NOT EXISTS blog_posts (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  slug VARCHAR(255) NOT NULL UNIQUE,
  excerpt TEXT NOT NULL,
  content LONGTEXT NOT NULL,
  image_urls TEXT NOT NULL,
  attachment_urls TEXT NOT NULL,
  is_published TINYINT(1) NOT NULL DEFAULT 1,
  published_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX blog_posts_published_at_idx ON blog_posts (published_at);

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

CREATE TABLE IF NOT EXISTS analytics_events (
  id BIGINT AUTO_INCREMENT PRIMARY KEY,
  event_type VARCHAR(64) NOT NULL,
  path VARCHAR(512) NULL,
  referrer TEXT NULL,
  referrer_host VARCHAR(255) NULL,
  utm_source VARCHAR(255) NULL,
  utm_medium VARCHAR(255) NULL,
  utm_campaign VARCHAR(255) NULL,
  utm_term VARCHAR(255) NULL,
  utm_content VARCHAR(255) NULL,
  referral_code VARCHAR(64) NULL,
  product_id VARCHAR(255) NULL,
  order_id INT NULL,
  value_cents INT NULL,
  currency VARCHAR(16) NULL,
  session_id VARCHAR(255) NULL,
  user_agent VARCHAR(255) NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX analytics_events_created_at_idx ON analytics_events (created_at);
CREATE INDEX analytics_events_type_idx ON analytics_events (event_type);
CREATE INDEX analytics_events_session_idx ON analytics_events (session_id);
CREATE INDEX analytics_events_referral_idx ON analytics_events (referral_code);
CREATE INDEX analytics_events_path_idx ON analytics_events (path);
CREATE INDEX analytics_events_referrer_idx ON analytics_events (referrer_host);
CREATE INDEX analytics_events_product_idx ON analytics_events (product_id);
