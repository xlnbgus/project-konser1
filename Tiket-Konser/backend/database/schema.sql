CREATE DATABASE IF NOT EXISTS konser_ukk CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

USE konser_ukk;

CREATE TABLE IF NOT EXISTS users (
  id BIGINT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(150) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  phone VARCHAR(30) DEFAULT NULL,
  role ENUM('user','admin') NOT NULL DEFAULT 'user',
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
  category VARCHAR(100) NOT NULL DEFAULT 'Umum',
  organizer VARCHAR(150) DEFAULT NULL,
  status ENUM('available','soldout','cancelled') NOT NULL DEFAULT 'available',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS ticket_categories (
  id BIGINT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(100) NOT NULL,
  description TEXT DEFAULT NULL,
  quota INT NOT NULL DEFAULT 0,
  price_adjustment DECIMAL(12,2) NOT NULL DEFAULT 0.00,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS artists (
  id BIGINT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(150) NOT NULL,
  genre VARCHAR(100) DEFAULT NULL,
  status ENUM('active','inactive') NOT NULL DEFAULT 'active',
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
  user_id VARCHAR(50) NOT NULL,
  event_id BIGINT UNSIGNED NOT NULL,
  quantity INT NOT NULL DEFAULT 1,
  promo_code VARCHAR(50) DEFAULT NULL,
  payment_method ENUM('debit','bank','e-wallet','qris') NOT NULL DEFAULT 'debit',
  subtotal DECIMAL(12,2) NOT NULL DEFAULT 0.00,
  discount_amount DECIMAL(12,2) NOT NULL DEFAULT 0.00,
  total DECIMAL(12,2) NOT NULL DEFAULT 0.00,
  status ENUM('pending','paid','verified','cancelled') NOT NULL DEFAULT 'pending',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT fk_orders_event FOREIGN KEY (event_id) REFERENCES events(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS sales_settings (
  id INT PRIMARY KEY DEFAULT 1,
  is_sales_open TINYINT(1) NOT NULL DEFAULT 1,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE INDEX idx_events_category ON events(category);
CREATE INDEX idx_events_status ON events(status);
CREATE INDEX idx_orders_user_id ON orders(user_id);
CREATE INDEX idx_orders_event_id ON orders(event_id);
CREATE INDEX idx_orders_status ON orders(status);
CREATE INDEX idx_promos_code ON promos(code);
CREATE INDEX idx_users_email ON users(email);

INSERT INTO users (name, email, password_hash, phone, role) VALUES
('Admin KonserOjol', 'admin@konserojol.com', '$2b$10$C1AtUepxGJYBdbF2OGVX5uJkXDwYeype2dXMjtwaFzhfvdJzM6Ela', '081000000000', 'admin');

INSERT INTO events (title, description, event_date, location, price, category, organizer, status) VALUES
('Weekend Festival', 'Festival musik akhir pekan dengan berbagai penampilan artis lokal dan nasional.', '2026-09-12', 'Jakarta', 250000.00, 'Festival', 'KonserOjol Official', 'available'),
('Indie Night', 'Konser indie akustik dan live performance dari band-band lokal terbaik.', '2026-09-25', 'Bandung', 180000.00, 'Konser', 'SoundWave', 'available'),
('SNOOPY RUN 2026', 'Lomba lari santai dengan suasana keluarga. Cocok untuk semua usia.', '2026-09-06', 'Tangerang', 499000.00, 'Sports', 'Provaliant', 'available'),
('UNGU – Waktu yang Dinanti Final Chapter', 'Konser perpisahan UNGU setelah lebih dari 20 tahun berkarya.', '2026-10-30', 'ICE BSD, Tangerang', 550000.00, 'Konser', 'TipTip', 'available'),
('Beyond Eyes 15th Anniversary – Surabaya', 'Rayakan 15 tahun Beyond Eyes dengan konser spektakuler di Surabaya.', '2026-08-28', 'Surabaya Convention Center', 900000.00, 'Konser', 'Maryhouse Media', 'available'),
('LaLaLa Festival 2026', 'Festival musik dua hari dengan lineup artis lokal dan internasional terpilih.', '2026-08-22', 'Jakarta', 800000.00, 'Festival', 'The Group', 'available'),
('Raisa Live in Concert 2026', 'Konser solo Raisa dengan setlist hits terbaik sepanjang karir.', '2026-12-12', 'Jakarta', 650000.00, 'Konser', 'Raisa Production', 'available'),
('Synchronize Festival 2026', 'Festival musik tahunan terbesar di Indonesia selama 3 hari penuh.', '2026-10-03', 'Gambir Expo, Jakarta', 600000.00, 'Festival', 'Demajors', 'available');

INSERT INTO ticket_categories (name, description, quota, price_adjustment) VALUES
('VIP', 'Area depan panggung dengan fasilitas premium dan akses backstage.', 120, 0.00),
('Festival', 'Area festival dengan standing room seluas-luasnya.', 500, 0.00),
('Regular', 'Area tribun utama dengan tempat duduk nyaman.', 300, 0.00),
('VVIP', 'Paket eksklusif termasuk meet & greet dengan artis.', 50, 0.00),
('Early Bird', 'Harga spesial pembelian awal, tempat duduk tribun.', 200, -50000.00);

INSERT INTO artists (name, genre, status) VALUES
('Ari Lasso', 'Pop', 'active'),
('RAN', 'Pop', 'active'),
('Raisa', 'Pop', 'active'),
('UNGU', 'Rock', 'active'),
('Westlife', 'Pop', 'active'),
('Noah', 'Alternative', 'active'),
('Dewa 19', 'Rock', 'active'),
('Isyana', 'Pop', 'active'),
('Payung Teduh', 'Folk', 'active'),
('Sheila On 7', 'Pop Rock', 'active');

INSERT INTO promos (code, title, description, discount_percent, expires_at, is_active) VALUES
('EARLYBIRD30', 'Early Bird', 'Diskon 30% untuk pemesanan awal sebelum H-30.', 30, '2026-08-31', 1),
('NEWUSER2026', 'Pengguna Baru', 'Bebas biaya admin untuk pembelian pertama.', 0, NULL, 1);

INSERT INTO sales_settings (id, is_sales_open) VALUES (1, 1);
