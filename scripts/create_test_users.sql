-- Create test users for dashboard testing
-- Note: Using plain text passwords as per the current auth system

-- Insert test users (delete existing ones first to avoid duplicates)
DELETE FROM users WHERE email IN ('admin@test.com', 'buyer@test.com', 'seller@test.com', 'support@test.com');

INSERT INTO users (username, email, password, role, created_at) VALUES
('admin', 'admin@test.com', 'admin123', 'admin', NOW()),
('buyer', 'buyer@test.com', 'buyer123', 'buyer', NOW()),
('seller', 'seller@test.com', 'seller123', 'seller', NOW()),
('support', 'support@test.com', 'support123', 'support', NOW());

-- Add some test cars for the seller
INSERT INTO cars (seller_id, make, model, year, price, mileage, description, status, image_url, views, created_at) VALUES
((SELECT id FROM users WHERE email = 'seller@test.com'), 'Toyota', 'Camry', 2022, 28000, 15000, 'Excellent condition sedan', 'available', '/images/car1.png', 45, NOW()),
((SELECT id FROM users WHERE email = 'seller@test.com'), 'Honda', 'Civic', 2021, 22000, 20000, 'Reliable compact car', 'available', '/images/car2.png', 32, NOW()),
((SELECT id FROM users WHERE email = 'seller@test.com'), 'BMW', 'X3', 2023, 45000, 8000, 'Luxury SUV', 'sold', '/images/car3.png', 78, NOW());

-- Add some test offers for the buyer
INSERT INTO offers (buyer_id, car_id, amount, status, created_at) VALUES
((SELECT id FROM users WHERE email = 'buyer@test.com'), (SELECT id FROM cars WHERE make = 'Toyota' AND model = 'Camry' LIMIT 1), 25000, 'pending', NOW()),
((SELECT id FROM users WHERE email = 'buyer@test.com'), (SELECT id FROM cars WHERE make = 'Honda' AND model = 'Civic' LIMIT 1), 20000, 'accepted', NOW());

-- Add some test purchases
INSERT INTO purchases (buyer_id, seller_id, car_id, amount, created_at) VALUES
((SELECT id FROM users WHERE email = 'buyer@test.com'), (SELECT id FROM users WHERE email = 'seller@test.com'), (SELECT id FROM cars WHERE make = 'BMW' AND model = 'X3' LIMIT 1), 43000, NOW());

-- Create support tickets table if it doesn't exist
CREATE TABLE IF NOT EXISTS support_tickets (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  status ENUM('open', 'in_progress', 'resolved', 'closed') DEFAULT 'open',
  priority ENUM('low', 'medium', 'high', 'urgent') DEFAULT 'medium',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Add some test support tickets
INSERT INTO support_tickets (user_id, title, description, status, priority, created_at) VALUES
((SELECT id FROM users WHERE email = 'buyer@test.com'), 'Login Issues', 'Cannot access my account', 'open', 'high', NOW()),
((SELECT id FROM users WHERE email = 'seller@test.com'), 'Car Listing Problem', 'Images not uploading properly', 'in_progress', 'medium', NOW()),
((SELECT id FROM users WHERE email = 'buyer@test.com'), 'Payment Issue', 'Payment failed during purchase', 'resolved', 'high', DATE_SUB(NOW(), INTERVAL 1 DAY));
