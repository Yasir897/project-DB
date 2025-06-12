USE car_selling_system;

-- Insert sample users
INSERT INTO users (username, email, password, role) VALUES
('johnseller', 'john@example.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'seller'),
('marybuyer', 'mary@example.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'buyer'),
('stevesupp', 'steve@example.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'support');

-- Insert sample cars
INSERT INTO cars (seller_id, make, model, year, price, description, mileage, color, fuel_type, transmission, status) VALUES
(2, 'Toyota', 'Camry', 2020, 25000.00, 'Well maintained Toyota Camry with low mileage', 15000, 'Silver', 'Gasoline', 'Automatic', 'available'),
(2, 'Honda', 'Civic', 2019, 22000.00, 'Honda Civic in excellent condition', 20000, 'Blue', 'Gasoline', 'Automatic', 'available'),
(2, 'Ford', 'Mustang', 2018, 35000.00, 'Classic Ford Mustang with powerful engine', 25000, 'Red', 'Gasoline', 'Manual', 'available'),
(2, 'Tesla', 'Model 3', 2021, 45000.00, 'Electric Tesla Model 3 with autopilot', 10000, 'White', 'Electric', 'Automatic', 'available'),
(2, 'BMW', 'X5', 2020, 55000.00, 'Luxury BMW X5 SUV with all features', 18000, 'Black', 'Diesel', 'Automatic', 'available');

-- Insert sample car images
INSERT INTO car_images (car_id, image_url, is_primary) VALUES
(1, '/images/toyota-camry-1.jpg', TRUE),
(1, '/images/toyota-camry-2.jpg', FALSE),
(2, '/images/honda-civic-1.jpg', TRUE),
(3, '/images/ford-mustang-1.jpg', TRUE),
(4, '/images/tesla-model3-1.jpg', TRUE),
(5, '/images/bmw-x5-1.jpg', TRUE);

-- Insert sample offers
INSERT INTO offers (car_id, buyer_id, amount, message, status) VALUES
(1, 3, 23500.00, 'I am interested in this car. Can you lower the price?', 'pending'),
(2, 3, 21000.00, 'I would like to make an offer for this Honda Civic', 'pending');

-- Insert sample complaints
INSERT INTO complaints (user_id, subject, description, status, assigned_to) VALUES
(3, 'Issue with car listing', 'The car details do not match with the images provided', 'pending', 4),
(3, 'Seller not responding', 'I made an offer but the seller is not responding', 'in_progress', 4);

-- Insert sample FAQs
INSERT INTO faqs (question, answer, created_by) VALUES
('How do I list my car for sale?', 'Login as a seller, go to your dashboard, and click on "Add New Listing" button.', 1),
('How do I make an offer?', 'Browse available cars, select the one you are interested in, and click on "Make Offer" button.', 1),
('What happens after my offer is accepted?', 'You will receive a notification and instructions on how to proceed with the purchase.', 1);
