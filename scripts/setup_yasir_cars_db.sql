-- Create database
CREATE DATABASE IF NOT EXISTS car_selling_system;
USE car_selling_system;

-- Drop existing tables to start fresh
DROP TABLE IF EXISTS purchases;
DROP TABLE IF EXISTS offers;
DROP TABLE IF EXISTS car_images;
DROP TABLE IF EXISTS cars;
DROP TABLE IF EXISTS complaints;
DROP TABLE IF EXISTS faqs;
DROP TABLE IF EXISTS users;

-- Users table
CREATE TABLE users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(50) NOT NULL,
  email VARCHAR(100) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  role ENUM('admin', 'seller', 'buyer', 'support') NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Cars table with all necessary columns
CREATE TABLE cars (
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
  image_url VARCHAR(255) DEFAULT NULL,
  views INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (seller_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Car Images table
CREATE TABLE car_images (
  id INT AUTO_INCREMENT PRIMARY KEY,
  car_id INT NOT NULL,
  image_url VARCHAR(255) NOT NULL,
  is_primary BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (car_id) REFERENCES cars(id) ON DELETE CASCADE
);

-- Offers table
CREATE TABLE offers (
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
CREATE TABLE purchases (
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
CREATE TABLE complaints (
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
CREATE TABLE faqs (
  id INT AUTO_INCREMENT PRIMARY KEY,
  question TEXT NOT NULL,
  answer TEXT NOT NULL,
  created_by INT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE CASCADE
);

-- Insert users with plain text passwords for easy testing
INSERT INTO users (username, email, password, role) VALUES
('admin', 'admin@yasircars.com', '12345678', 'admin'),
('yasir_ahmed', 'yasir@yasircars.com', '12345678', 'seller'),
('ahmad_seller', 'ahmad@example.com', '12345678', 'seller'),
('sara_buyer', 'sara@example.com', '12345678', 'buyer'),
('hassan_support', 'hassan@yasircars.com', '12345678', 'support'),
('fatima_seller', 'fatima@example.com', '12345678', 'seller'),
('ali_seller', 'ali@example.com', '12345678', 'seller'),
('zara_buyer', 'zara@example.com', '12345678', 'buyer'),
('usman_buyer', 'usman@example.com', '12345678', 'buyer'),
('maria_buyer', 'maria@example.com', '12345678', 'buyer'),
('admin123', 'admin123@gmail.com', '12345678', 'admin'),
('buyer123', 'buyer@test.com', 'buyer123', 'buyer'),
('seller123', 'seller@test.com', 'seller123', 'seller'),
('support123', 'support@test.com', 'support123', 'support');

-- Insert premium car listings with beautiful images
INSERT INTO cars (seller_id, make, model, year, price, description, mileage, color, fuel_type, transmission, status, image_url, views, featured) VALUES
(2, 'BMW', 'M4 Competition', 2023, 85000.00, 'Stunning BMW M4 Competition with twin-turbo V6 engine. Carbon fiber accents, premium leather interior, and track-ready performance. Barely driven with full warranty.', 2500, 'Alpine White', 'Gasoline', 'Automatic', 'available', '/images/car1.png', 156, TRUE),
(2, 'Mercedes-Benz', 'C-Class AMG', 2022, 72000.00, 'Elegant Mercedes-Benz C-Class AMG with handcrafted engine. Premium MBUX infotainment, panoramic sunroof, and advanced driver assistance. Showroom condition.', 8500, 'Obsidian Black', 'Gasoline', 'Automatic', 'available', '/images/car2.png', 203, TRUE),
(3, 'Porsche', '911 Carrera', 2021, 125000.00, 'Iconic Porsche 911 Carrera with naturally aspirated flat-six engine. Sport Chrono package, premium leather, and exceptional build quality. A true drivers car.', 12000, 'Guards Red', 'Gasoline', 'Manual', 'available', '/images/car3.png', 89, TRUE),
(3, 'Audi', 'RS6 Avant', 2023, 95000.00, 'Powerful Audi RS6 Avant wagon with twin-turbo V8. Quattro all-wheel drive, virtual cockpit, and incredible versatility. Perfect blend of performance and practicality.', 5200, 'Nardo Gray', 'Gasoline', 'Automatic', 'available', '/images/car4.png', 134, FALSE),
(6, 'Tesla', 'Model S Plaid', 2022, 110000.00, 'Revolutionary Tesla Model S Plaid with tri-motor setup. Ludicrous acceleration, autopilot, and over-the-air updates. Zero emissions with incredible range.', 15000, 'Pearl White', 'Electric', 'Automatic', 'available', '/images/car5.png', 278, TRUE),
(6, 'Lamborghini', 'Huracán EVO', 2021, 245000.00, 'Exotic Lamborghini Huracán EVO with naturally aspirated V10. Carbon fiber body, advanced aerodynamics, and track-focused engineering. Absolutely pristine.', 3800, 'Arancio Borealis', 'Gasoline', 'Automatic', 'sold', '/images/car6.png', 445, FALSE),
(7, 'Ferrari', '488 GTB', 2020, 285000.00, 'Legendary Ferrari 488 GTB with twin-turbo V8 engine. Racing heritage, carbon fiber construction, and unmatched Italian craftsmanship. Collectors dream.', 6500, 'Rosso Corsa', 'Gasoline', 'Automatic', 'available', '/images/car7.png', 356, TRUE),
(7, 'McLaren', '720S', 2021, 295000.00, 'Cutting-edge McLaren 720S with carbon fiber monocoque. Active aerodynamics, butterfly doors, and mind-bending performance. Engineering masterpiece.', 4200, 'Volcano Orange', 'Gasoline', 'Automatic', 'available', '/images/car8.png', 189, FALSE),
(6, 'Bentley', 'Continental GT', 2022, 185000.00, 'Luxurious Bentley Continental GT with handcrafted interior. Twin-turbo W12 engine, diamond-quilted leather, and unparalleled refinement. Pure elegance.', 7800, 'Beluga Black', 'Gasoline', 'Automatic', 'available', '/images/car9.png', 167, FALSE),
(7, 'Rolls-Royce', 'Ghost', 2023, 350000.00, 'Majestic Rolls-Royce Ghost with whisper-quiet cabin. Starlight headliner, lamb wool carpets, and effortless power delivery. The pinnacle of luxury.', 1200, 'Arctic White', 'Gasoline', 'Automatic', 'available', '/images/car10.png', 234, TRUE),
(13, 'Toyota', 'Camry', 2022, 28000.00, 'Reliable Toyota Camry with excellent fuel economy. Well-maintained with full service history. Perfect for daily commuting and family use.', 25000, 'Silver', 'Gasoline', 'Automatic', 'available', '/images/car1.png', 45, FALSE),
(13, 'Honda', 'Civic', 2023, 26000.00, 'Brand new Honda Civic with latest technology. Excellent safety ratings, spacious interior, and outstanding reliability. Still under warranty.', 5000, 'Blue', 'Gasoline', 'Automatic', 'available', '/images/car2.png', 67, FALSE),
(13, 'Nissan', 'Altima', 2021, 24000.00, 'Modern Nissan Altima with advanced safety features. Comfortable ride, fuel efficient, and well-equipped with technology features.', 18000, 'White', 'Gasoline', 'Automatic', 'available', '/images/car3.png', 34, FALSE),
(6, 'Hyundai', 'Elantra', 2022, 22000.00, 'Stylish Hyundai Elantra with comprehensive warranty. Great value with modern features and excellent fuel economy.', 12000, 'Red', 'Gasoline', 'Automatic', 'available', '/images/car4.png', 28, FALSE),
(7, 'Volkswagen', 'Jetta', 2021, 25000.00, 'European-engineered Volkswagen Jetta with premium interior. Solid build quality and refined driving experience.', 22000, 'Gray', 'Gasoline', 'Automatic', 'available', '/images/car5.png', 41, FALSE);

-- Insert car images with beautiful photos
INSERT INTO car_images (car_id, image_url, is_primary) VALUES
(1, '/images/car1.png', TRUE),
(1, '/images/car7.png', FALSE),
(1, '/images/car8.png', FALSE),
(2, '/images/car2.png', TRUE),
(2, '/images/car9.png', FALSE),
(2, '/images/car10.png', FALSE),
(3, '/images/car3.png', TRUE),
(3, '/images/car1.png', FALSE),
(3, '/images/car2.png', FALSE),
(4, '/images/car4.png', TRUE),
(4, '/images/car3.png', FALSE),
(4, '/images/car5.png', FALSE),
(5, '/images/car5.png', TRUE),
(5, '/images/car6.png', FALSE),
(5, '/images/car7.png', FALSE),
(6, '/images/car6.png', TRUE),
(6, '/images/car8.png', FALSE),
(6, '/images/car9.png', FALSE),
(7, '/images/car7.png', TRUE),
(7, '/images/car10.png', FALSE),
(7, '/images/car1.png', FALSE),
(8, '/images/car8.png', TRUE),
(8, '/images/car2.png', FALSE),
(8, '/images/car3.png', FALSE),
(9, '/images/car9.png', TRUE),
(9, '/images/car4.png', FALSE),
(9, '/images/car5.png', FALSE),
(10, '/images/car10.png', TRUE),
(10, '/images/car6.png', FALSE),
(10, '/images/car7.png', FALSE),
(11, '/images/car1.png', TRUE),
(12, '/images/car2.png', TRUE),
(13, '/images/car3.png', TRUE),
(14, '/images/car4.png', TRUE),
(15, '/images/car5.png', TRUE);

-- Insert premium offers
INSERT INTO offers (car_id, buyer_id, amount, message, status) VALUES
(1, 4, 82000.00, 'Absolutely love this BMW M4! Would you consider $82,000? I can arrange immediate payment and pickup.', 'pending'),
(2, 4, 70000.00, 'Beautiful Mercedes C-Class AMG! My offer is $70,000. Can we schedule a test drive this weekend?', 'accepted'),
(3, 8, 120000.00, 'Dream Porsche 911! Offering $120,000 for this manual transmission beauty. Cash buyer ready.', 'rejected'),
(4, 8, 92000.00, 'Interested in the RS6 Avant. My offer is $92,000. Can you provide maintenance records?', 'pending'),
(5, 9, 105000.00, 'Tesla Model S Plaid looks perfect! Offering $105,000. Is the full self-driving included?', 'pending'),
(7, 9, 280000.00, 'Ferrari 488 GTB is stunning! My offer is $280,000. Can we arrange a PPI inspection?', 'accepted'),
(8, 4, 290000.00, 'McLaren 720S is incredible! Offering $290,000. Is the warranty transferable?', 'pending'),
(9, 8, 180000.00, 'Bentley Continental GT is gorgeous! My offer is $180,000. Any recent service history?', 'pending'),
(10, 9, 340000.00, 'Rolls-Royce Ghost is magnificent! Offering $340,000. Can we schedule a viewing?', 'pending'),
(11, 12, 26500.00, 'Interested in the Toyota Camry. Offering $26,500. Can we arrange a test drive?', 'pending'),
(12, 12, 25000.00, 'Honda Civic looks great! My offer is $25,000. Is the warranty still valid?', 'accepted'),
(13, 14, 23000.00, 'Nissan Altima seems perfect for my needs. Offering $23,000.', 'pending');

-- Insert sample purchases
INSERT INTO purchases (car_id, buyer_id, seller_id, amount, transaction_id) VALUES
(2, 4, 2, 70000.00, 'YC_2024_001'),
(6, 9, 6, 245000.00, 'YC_2024_002'),
(7, 9, 7, 280000.00, 'YC_2024_003'),
(12, 12, 13, 25000.00, 'YC_2024_004');

-- Insert sample complaints
INSERT INTO complaints (user_id, subject, description, status, assigned_to) VALUES
(4, 'BMW M4 listing inquiry', 'The BMW M4 listing shows different wheel options in photos. Could you clarify which wheels are included?', 'pending', 5),
(4, 'Test drive scheduling', 'Trying to schedule test drive for Mercedes C-Class but seller availability is limited. Need assistance.', 'in_progress', 5),
(8, 'Payment processing', 'Completed purchase of Ferrari 488 GTB but payment confirmation is delayed. Transaction: YC_2024_003', 'resolved', 5),
(9, 'Vehicle inspection', 'Need help arranging pre-purchase inspection for Rolls-Royce Ghost. Looking for certified inspector.', 'pending', 5);

-- Insert comprehensive FAQs
INSERT INTO faqs (question, answer, created_by) VALUES
('How do I list my car for sale on Yasir Cars?', 'Login as a seller, go to your dashboard, and click "Add New Listing". Upload high-quality photos, provide detailed specifications, and set a competitive price. Our team reviews all listings within 24 hours.', 1),
('What is the process for buying a car?', 'Browse our collection, make an offer through our secure system, arrange a test drive, and complete the purchase with our escrow service for added security.', 1),
('Do you offer vehicle inspections?', 'Yes! We can connect you with certified automotive inspectors for pre-purchase inspections. This is highly recommended for luxury and exotic vehicles.', 1),
('How do I schedule a test drive?', 'Contact the seller directly through our messaging system or use the "Schedule Test Drive" button. For luxury vehicles, we recommend scheduling during business hours.', 1),
('What payment methods do you accept?', 'We accept bank transfers, certified checks, and for high-value transactions, we offer escrow services for maximum security and peace of mind.', 1),
('Is financing available?', 'Yes! We work with automotive lenders who specialize in vehicle financing. Contact our finance team for pre-approval and competitive rates.', 1),
('How do you verify car authenticity?', 'All listings undergo thorough verification including VIN checks, service history review, and authenticity confirmation for luxury brands.', 1),
('What about warranty and service?', 'Many vehicles come with remaining factory warranty. We can also connect you with authorized service centers and extended warranty providers.', 1),
('Can I trade in my current vehicle?', 'We accept trade-ins and can provide competitive valuations. Our team will assess your vehicle and provide a fair market offer.', 1),
('How do I contact Yasir Cars support?', 'You can reach us at +92 314 4107039, email info@yasircars.com, or visit our showroom at 253-M Block, Sabzazar, Lahore. We are here to help with all your automotive needs.', 1);

-- Update car statuses based on purchases
UPDATE cars SET status = 'sold' WHERE id IN (2, 6, 7, 12);

-- Create indexes for better performance
CREATE INDEX idx_cars_status ON cars(status);
CREATE INDEX idx_cars_make ON cars(make);
CREATE INDEX idx_cars_price ON cars(price);
CREATE INDEX idx_cars_seller ON cars(seller_id);
CREATE INDEX idx_offers_car ON offers(car_id);
CREATE INDEX idx_offers_buyer ON offers(buyer_id);
CREATE INDEX idx_offers_status ON offers(status);
CREATE INDEX idx_users_role ON users(role);
CREATE INDEX idx_users_email ON users(email);

-- Show success message
SELECT 'Yasir Cars database setup completed successfully!' as message;
SELECT COUNT(*) as total_cars FROM cars;
SELECT COUNT(*) as total_users FROM users;
SELECT COUNT(*) as total_offers FROM offers;
