CREATE DATABASE IF NOT EXISTS konser_ojol
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE konser_ojol;

CREATE TABLE IF NOT EXISTS users (
  id BIGINT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(150) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  phone VARCHAR(30) DEFAULT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS events (
  id BIGINT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
  title VARCHAR(200) NOT NULL,
  description TEXT DEFAULT NULL,
  event_date DATE NOT NULL,
  location VARCHAR(200) NOT NULL,
  price DECIMAL(12,2) NOT NULL DEFAULT 0.00,
  category VARCHAR(100) NOT NULL,
  organizer VARCHAR(150) DEFAULT NULL,
  status ENUM('available','soldout') NOT NULL DEFAULT 'available',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS promos (
  id BIGINT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
  code VARCHAR(50) NOT NULL UNIQUE,
  title VARCHAR(150) NOT NULL,
  description TEXT DEFAULT NULL,
  discount_percent INT NOT NULL DEFAULT 0,
  expires_at DATE DEFAULT NULL,
  is_active TINYINT(1) NOT NULL DEFAULT 1,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS orders (
  id BIGINT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
  user_id BIGINT UNSIGNED NOT NULL,
  event_id BIGINT UNSIGNED NOT NULL,
  quantity INT NOT NULL DEFAULT 1,
  promo_code VARCHAR(50) DEFAULT NULL,
  payment_method ENUM('debit','bank','e-wallet','qris') NOT NULL DEFAULT 'debit',
  subtotal DECIMAL(12,2) NOT NULL DEFAULT 0.00,
  discount_amount DECIMAL(12,2) NOT NULL DEFAULT 0.00,
  total DECIMAL(12,2) NOT NULL DEFAULT 0.00,
  status ENUM('pending','paid','cancelled') NOT NULL DEFAULT 'pending',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT fk_orders_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  CONSTRAINT fk_orders_event FOREIGN KEY (event_id) REFERENCES events(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE INDEX idx_events_category ON events(category);
CREATE INDEX idx_orders_user_id ON orders(user_id);
CREATE INDEX idx_orders_event_id ON orders(event_id);

INSERT INTO events (title, description, event_date, location, price, category, organizer, status) VALUES
('Weekend Festival', 'Festival musik malam minggu yang penuh hiburan.', '2026-09-12', 'Jakarta', 250000.00, 'Festival', 'KonserKu', 'available'),
('Indie Night', 'Konser indie akustik dan live performance.', '2026-09-25', 'Bandung', 180000.00, 'Konser', 'SoundWave', 'available'),
('SNOOPY RUN 2026', 'Lomba lari santai dengan suasana keluarga.', '2026-09-06', 'Tangerang', 499000.00, 'Sports', 'Provaliant', 'available');

INSERT INTO promos (code, title, description, discount_percent, expires_at, is_active) VALUES
('EARLYBIRD30', 'Early Bird', 'Diskon 30% untuk pemesanan awal.', 30, '2026-08-31', 1),
('NEWUSER2026', 'Pengguna Baru', 'Bebas biaya admin untuk pengguna baru.', 0, NULL, 1);
