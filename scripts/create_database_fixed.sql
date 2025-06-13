-- Create database
CREATE DATABASE IF NOT EXISTS car_selling_system;
USE car_selling_system;

-- Users table
CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(50) NOT NULL,
  email VARCHAR(100) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  role ENUM('admin', 'seller', 'buyer', 'support') NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Cars table
CREATE TABLE IF NOT EXISTS cars (
  id INT AUTO_INCREMENT PRIMARY KEY,
  seller_id INT NOT NULL,
  make VARCHAR(50) NOT NULL,
  model VARCHAR(50) NOT NULL,
  year INT NOT NULL,
  price DECIMAL(10, 2) NOT NULL,
  description TEXT,
  mileage INT,
  color VARCHAR(30),
  fuel_type VARCHAR(30),
  transmission VARCHAR(30),
  status ENUM('available', 'sold', 'pending') DEFAULT 'available',
  featured BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (seller_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Car Images table
CREATE TABLE IF NOT EXISTS car_images (
  id INT AUTO_INCREMENT PRIMARY KEY,
  car_id INT NOT NULL,
  image_url VARCHAR(255) NOT NULL,
  is_primary BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (car_id) REFERENCES cars(id) ON DELETE CASCADE
);

-- Offers table
CREATE TABLE IF NOT EXISTS offers (
  id INT AUTO_INCREMENT PRIMARY KEY,
  car_id INT NOT NULL,
  buyer_id INT NOT NULL,
  amount DECIMAL(10, 2) NOT NULL,
  message TEXT,
  status ENUM('pending', 'accepted', 'rejected', 'expired') DEFAULT 'pending',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (car_id) REFERENCES cars(id) ON DELETE CASCADE,
  FOREIGN KEY (buyer_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Purchases table
CREATE TABLE IF NOT EXISTS purchases (
  id INT AUTO_INCREMENT PRIMARY KEY,
  car_id INT NOT NULL,
  buyer_id INT NOT NULL,
  seller_id INT NOT NULL,
  amount DECIMAL(10, 2) NOT NULL,
  transaction_id VARCHAR(100),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (car_id) REFERENCES cars(id) ON DELETE CASCADE,
  FOREIGN KEY (buyer_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (seller_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Complaints table
CREATE TABLE IF NOT EXISTS complaints (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  subject VARCHAR(100) NOT NULL,
  description TEXT NOT NULL,
  status ENUM('pending', 'in_progress', 'resolved') DEFAULT 'pending',
  assigned_to INT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (assigned_to) REFERENCES users(id) ON DELETE SET NULL
);

-- FAQs table
CREATE TABLE IF NOT EXISTS faqs (
  id INT AUTO_INCREMENT PRIMARY KEY,
  question TEXT NOT NULL,
  answer TEXT NOT NULL,
  created_by INT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE CASCADE
);

-- Insert users with plain text passwords
INSERT INTO users (username, email, password, role) VALUES
('admin', 'admin123@gmail.com', '12345678', 'admin'),
('johnseller', 'john@example.com', '12345678', 'seller'),
('marybuyer', 'mary@example.com', '12345678', 'buyer'),
('stevesupp', 'steve@example.com', '12345678', 'support');
