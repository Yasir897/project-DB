-- Insert sample users (if not exists)
INSERT IGNORE INTO users (username, email, password, role) VALUES
('admin', 'admin@csbs.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'admin'),
('john_buyer', 'john@example.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'buyer'),
('jane_seller', 'jane@example.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'seller'),
('mike_buyer', 'mike@example.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'buyer'),
('sarah_seller', 'sarah@example.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'seller');

-- Insert sample cars (if not exists)
INSERT IGNORE INTO cars (make, model, year, price, mileage, color, transmission, fuel_type, description, seller_id, status) VALUES
('Toyota', 'Camry', 2020, 25000, 35000, 'Silver', 'Automatic', 'Gasoline', 'Well-maintained Toyota Camry with excellent fuel economy.', 3, 'available'),
('Honda', 'Civic', 2019, 22000, 28000, 'Blue', 'Manual', 'Gasoline', 'Sporty Honda Civic in excellent condition.', 3, 'available'),
('Ford', 'Mustang', 2021, 35000, 15000, 'Red', 'Automatic', 'Gasoline', 'Powerful Ford Mustang with low mileage.', 5, 'available'),
('Tesla', 'Model 3', 2022, 45000, 8000, 'White', 'Automatic', 'Electric', 'Nearly new Tesla Model 3 with autopilot.', 5, 'available'),
('BMW', '3 Series', 2020, 38000, 22000, 'Black', 'Automatic', 'Gasoline', 'Luxury BMW 3 Series with premium features.', 3, 'available'),
('Audi', 'A4', 2019, 32000, 30000, 'Gray', 'Automatic', 'Gasoline', 'Elegant Audi A4 with leather interior.', 5, 'sold');

-- Insert car images
INSERT IGNORE INTO car_images (car_id, image_url, is_primary) VALUES
(1, '/images/car1.png', TRUE),
(1, '/images/car2.png', FALSE),
(2, '/images/car2.png', TRUE),
(2, '/images/car3.png', FALSE),
(3, '/images/car3.png', TRUE),
(3, '/images/car4.png', FALSE),
(4, '/images/car4.png', TRUE),
(4, '/images/car5.png', FALSE),
(5, '/images/car5.png', TRUE),
(5, '/images/car6.png', FALSE),
(6, '/images/car6.png', TRUE);

-- Insert sample offers for buyers
INSERT IGNORE INTO offers (car_id, buyer_id, amount, status, message, created_at) VALUES
(1, 2, 23000, 'pending', 'I am very interested in this car. Would you consider this offer?', NOW() - INTERVAL 2 DAY),
(2, 2, 20000, 'accepted', 'This is my best offer for the Honda Civic.', NOW() - INTERVAL 5 DAY),
(3, 4, 32000, 'rejected', 'I love this Mustang! Hope we can make a deal.', NOW() - INTERVAL 3 DAY),
(4, 2, 42000, 'pending', 'Very interested in the Tesla. Can we negotiate?', NOW() - INTERVAL 1 DAY),
(5, 4, 35000, 'accepted', 'The BMW looks perfect for me.', NOW() - INTERVAL 7 DAY),
(1, 4, 24000, 'pending', 'Counter offer for the Toyota Camry.', NOW() - INTERVAL 1 DAY);

-- Insert sample purchases
INSERT IGNORE INTO purchases (car_id, buyer_id, seller_id, amount, purchase_date, status) VALUES
(2, 2, 3, 20000, NOW() - INTERVAL 4 DAY, 'completed'),
(5, 4, 3, 35000, NOW() - INTERVAL 6 DAY, 'completed');

-- Update car status for purchased cars
UPDATE cars SET status = 'sold' WHERE id IN (2, 5);
