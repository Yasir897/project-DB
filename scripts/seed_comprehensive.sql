USE car_selling_system;

-- Clear existing data
DELETE FROM purchases;
DELETE FROM offers;
DELETE FROM car_images;
DELETE FROM cars;
DELETE FROM complaints;
DELETE FROM faqs;
DELETE FROM users;

-- Reset auto increment
ALTER TABLE users AUTO_INCREMENT = 1;
ALTER TABLE cars AUTO_INCREMENT = 1;
ALTER TABLE offers AUTO_INCREMENT = 1;
ALTER TABLE purchases AUTO_INCREMENT = 1;
ALTER TABLE complaints AUTO_INCREMENT = 1;
ALTER TABLE faqs AUTO_INCREMENT = 1;
ALTER TABLE car_images AUTO_INCREMENT = 1;

-- Insert users with plain text passwords
INSERT INTO users (username, email, password, role) VALUES
('admin', 'admin123@gmail.com', '12345678', 'admin'),
('johnseller', 'john@example.com', '12345678', 'seller'),
('marybuyer', 'mary@example.com', '12345678', 'buyer'),
('stevesupp', 'steve@example.com', '12345678', 'support'),
('sarahseller', 'sarah@example.com', '12345678', 'seller'),
('mikeseller', 'mike@example.com', '12345678', 'seller'),
('lisabuyer', 'lisa@example.com', '12345678', 'buyer'),
('tombuyer', 'tom@example.com', '12345678', 'buyer');

-- Insert comprehensive car listings
INSERT INTO cars (seller_id, make, model, year, price, description, mileage, color, fuel_type, transmission, status) VALUES
(2, 'Toyota', 'Camry', 2020, 25000.00, 'Well maintained Toyota Camry with low mileage. Features include leather seats, navigation system, backup camera, and excellent fuel economy. Perfect for daily commuting.', 15000, 'Silver', 'Gasoline', 'Automatic', 'available'),
(2, 'Honda', 'Civic', 2019, 22000.00, 'Honda Civic in excellent condition with full service history. Sporty design, reliable engine, and great resale value. Ideal first car or city driving.', 20000, 'Blue', 'Gasoline', 'Automatic', 'available'),
(2, 'Ford', 'Mustang', 2018, 35000.00, 'Classic Ford Mustang with powerful V8 engine. Premium sound system, racing stripes, and performance exhaust. A true American muscle car experience.', 25000, 'Red', 'Gasoline', 'Manual', 'available'),
(2, 'Tesla', 'Model 3', 2021, 45000.00, 'Electric Tesla Model 3 with autopilot and full self-driving capability. Zero emissions, cutting-edge technology, and over-the-air updates.', 10000, 'White', 'Electric', 'Automatic', 'available'),
(5, 'BMW', 'X5', 2020, 55000.00, 'Luxury BMW X5 SUV with all premium features. Panoramic sunroof, heated seats, premium audio, and advanced safety systems. Perfect family vehicle.', 18000, 'Black', 'Diesel', 'Automatic', 'available'),
(5, 'Audi', 'A4', 2021, 38000.00, 'Sophisticated Audi A4 with quattro all-wheel drive. Premium interior, virtual cockpit, and exceptional build quality. Low mileage, single owner.', 12000, 'Gray', 'Gasoline', 'Automatic', 'available'),
(6, 'Mercedes', 'C-Class', 2019, 42000.00, 'Elegant Mercedes C-Class with luxury appointments. AMG styling package, premium leather, and advanced infotainment system.', 22000, 'Black', 'Gasoline', 'Automatic', 'sold'),
(6, 'Volkswagen', 'Golf', 2020, 24000.00, 'Reliable Volkswagen Golf with excellent fuel economy. Spacious interior, advanced safety features, and European engineering quality.', 16000, 'White', 'Gasoline', 'Manual', 'available'),
(5, 'Nissan', 'Altima', 2021, 26000.00, 'Modern Nissan Altima with advanced safety features. Comfortable ride, spacious interior, and excellent warranty coverage.', 14000, 'Silver', 'Gasoline', 'Automatic', 'available'),
(6, 'Hyundai', 'Elantra', 2022, 23000.00, 'Brand new Hyundai Elantra with full warranty. Latest technology, excellent fuel economy, and modern design.', 5000, 'Blue', 'Gasoline', 'Automatic', 'available');

-- Insert car images
INSERT INTO car_images (car_id, image_url, is_primary) VALUES
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
(6, '/images/car6.png', TRUE),
(6, '/images/car1.png', FALSE),
(7, '/images/car1.png', TRUE),
(7, '/images/car2.png', FALSE),
(8, '/images/car2.png', TRUE),
(8, '/images/car3.png', FALSE),
(9, '/images/car3.png', TRUE),
(9, '/images/car4.png', FALSE),
(10, '/images/car4.png', TRUE),
(10, '/images/car5.png', FALSE);

-- Insert sample offers
INSERT INTO offers (car_id, buyer_id, amount, message, status) VALUES
(1, 3, 23500.00, 'I am very interested in this Toyota Camry. Would you consider $23,500? I can arrange immediate payment.', 'pending'),
(2, 3, 21000.00, 'Great Honda Civic! I would like to make an offer of $21,000. Can we schedule a test drive?', 'accepted'),
(3, 7, 33000.00, 'Love this Mustang! Offering $33,000 for quick sale. Cash buyer, no financing needed.', 'rejected'),
(4, 7, 43000.00, 'Interested in the Tesla Model 3. My offer is $43,000. Can you provide charging history?', 'pending'),
(5, 8, 52000.00, 'BMW X5 looks perfect for my family. Offering $52,000. Is the warranty transferable?', 'pending'),
(6, 8, 36000.00, 'Beautiful Audi A4! Would you accept $36,000? I can close within a week.', 'accepted'),
(8, 3, 22500.00, 'Volkswagen Golf seems well maintained. My offer is $22,500. Any recent service records?', 'pending'),
(9, 7, 24500.00, 'Interested in the Nissan Altima. Offering $24,500. Can we arrange a test drive?', 'pending'),
(10, 8, 22000.00, 'Hyundai Elantra looks great! My offer is $22,000. Is the warranty still valid?', 'pending');

-- Insert sample purchases
INSERT INTO purchases (car_id, buyer_id, seller_id, amount, transaction_id) VALUES
(2, 3, 2, 21000.00, 'TXN_2024_001'),
(6, 8, 5, 36000.00, 'TXN_2024_002'),
(7, 3, 6, 42000.00, 'TXN_2024_003');

-- Insert sample complaints
INSERT INTO complaints (user_id, subject, description, status, assigned_to) VALUES
(3, 'Car listing discrepancy', 'The Toyota Camry listing shows different mileage in photos vs description. Photos show 16,000 miles but description says 15,000 miles.', 'pending', 4),
(3, 'Seller communication issue', 'Made an offer on BMW X5 three days ago but seller has not responded to messages or calls. Need assistance with contact.', 'in_progress', 4),
(2, 'Payment processing delay', 'Buyer paid for Honda Civic but payment is showing as pending in my account. Transaction ID: TXN_2024_001', 'resolved', 4),
(7, 'Test drive scheduling', 'Trying to schedule test drive for Tesla Model 3 but seller availability is very limited. Need help coordinating.', 'pending', 4);

-- Insert comprehensive FAQs
INSERT INTO faqs (question, answer, created_by) VALUES
('How do I list my car for sale?', 'Login as a seller, go to your dashboard, and click "Add New Listing". Fill in all car details, upload high-quality photos, and set a competitive price. Your listing will be reviewed and published within 24 hours.', 1),
('How do I make an offer on a car?', 'Browse available cars, select the one you are interested in, and click "Make Offer". Enter your offer amount and a message to the seller. The seller will be notified and can accept, reject, or counter your offer.', 1),
('What happens after my offer is accepted?', 'You will receive a notification and detailed instructions on how to proceed with the purchase. This includes payment options, inspection arrangements, and title transfer procedures.', 1),
('How do I schedule a test drive?', 'Contact the seller directly through our messaging system or use the "Schedule Test Drive" button on the car listing page. Coordinate a mutually convenient time and location.', 1),
('What payment methods are accepted?', 'We accept bank transfers, certified checks, and cash payments. For high-value transactions, we recommend using our escrow service for added security.', 1),
('How do I report a problem with a listing?', 'Use the "Report Issue" button on any listing or contact our support team directly. We investigate all reports within 24 hours and take appropriate action.', 1),
('Can I negotiate the price?', 'Yes! Most sellers are open to reasonable offers. Use our offer system to submit your best price and include a message explaining your offer.', 1),
('How do I transfer ownership?', 'After purchase completion, both parties must sign the title transfer documents. We provide a checklist and can connect you with local DMV services for assistance.', 1),
('What if I have issues with a purchased car?', 'Contact our support team immediately. While we facilitate the sale, any post-purchase issues should be resolved between buyer and seller. We can provide mediation if needed.', 1),
('How do I delete my listing?', 'Go to your seller dashboard, find your listing, and click the delete button. Note that listings with pending offers cannot be deleted until offers are resolved.', 1);

-- Update car statuses based on purchases
UPDATE cars SET status = 'sold' WHERE id IN (2, 6, 7);
