USE car_selling_system;

-- Insert more sample cars with detailed descriptions
INSERT INTO cars (seller_id, make, model, year, price, description, mileage, color, fuel_type, transmission, status) VALUES
(2, 'Toyota', 'Camry', 2020, 25000.00, 'Well maintained Toyota Camry with low mileage. Features include leather seats, navigation system, backup camera, and excellent fuel economy. Perfect for daily commuting.', 15000, 'Silver', 'Gasoline', 'Automatic', 'available'),
(2, 'Honda', 'Civic', 2019, 22000.00, 'Honda Civic in excellent condition with full service history. Sporty design, reliable engine, and great resale value. Ideal first car or city driving.', 20000, 'Blue', 'Gasoline', 'Automatic', 'available'),
(2, 'Ford', 'Mustang', 2018, 35000.00, 'Classic Ford Mustang with powerful V8 engine. Premium sound system, racing stripes, and performance exhaust. A true American muscle car experience.', 25000, 'Red', 'Gasoline', 'Manual', 'available'),
(2, 'Tesla', 'Model 3', 2021, 45000.00, 'Electric Tesla Model 3 with autopilot and full self-driving capability. Zero emissions, cutting-edge technology, and over-the-air updates.', 10000, 'White', 'Electric', 'Automatic', 'available'),
(2, 'BMW', 'X5', 2020, 55000.00, 'Luxury BMW X5 SUV with all premium features. Panoramic sunroof, heated seats, premium audio, and advanced safety systems. Perfect family vehicle.', 18000, 'Black', 'Diesel', 'Automatic', 'available'),
(2, 'Audi', 'A4', 2021, 38000.00, 'Sophisticated Audi A4 with quattro all-wheel drive. Premium interior, virtual cockpit, and exceptional build quality. Low mileage, single owner.', 12000, 'Gray', 'Gasoline', 'Automatic', 'available'),
(2, 'Mercedes', 'C-Class', 2019, 42000.00, 'Elegant Mercedes C-Class with luxury appointments. AMG styling package, premium leather, and advanced infotainment system.', 22000, 'Black', 'Gasoline', 'Automatic', 'sold'),
(2, 'Volkswagen', 'Golf', 2020, 24000.00, 'Reliable Volkswagen Golf with excellent fuel economy. Spacious interior, advanced safety features, and European engineering quality.', 16000, 'White', 'Gasoline', 'Manual', 'available');

-- Insert sample car images
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
(8, '/images/car3.png', FALSE);

-- Insert sample offers with various statuses
INSERT INTO offers (car_id, buyer_id, amount, message, status) VALUES
(1, 3, 23500.00, 'I am very interested in this Toyota Camry. Would you consider $23,500? I can arrange immediate payment.', 'pending'),
(2, 3, 21000.00, 'Great Honda Civic! I would like to make an offer of $21,000. Can we schedule a test drive?', 'accepted'),
(3, 3, 33000.00, 'Love this Mustang! Offering $33,000 for quick sale. Cash buyer, no financing needed.', 'rejected'),
(4, 3, 43000.00, 'Interested in the Tesla Model 3. My offer is $43,000. Can you provide charging history?', 'pending'),
(5, 3, 52000.00, 'BMW X5 looks perfect for my family. Offering $52,000. Is the warranty transferable?', 'pending'),
(6, 3, 36000.00, 'Beautiful Audi A4! Would you accept $36,000? I can close within a week.', 'accepted'),
(8, 3, 22500.00, 'Volkswagen Golf seems well maintained. My offer is $22,500. Any recent service records?', 'pending');

-- Insert sample purchases
INSERT INTO purchases (car_id, buyer_id, seller_id, amount, transaction_id) VALUES
(2, 3, 2, 21000.00, 'TXN_2024_001'),
(6, 3, 2, 36000.00, 'TXN_2024_002'),
(7, 3, 2, 42000.00, 'TXN_2024_003');

-- Insert sample complaints with detailed descriptions
INSERT INTO complaints (user_id, subject, description, status, assigned_to) VALUES
(3, 'Car listing discrepancy', 'The Toyota Camry listing shows different mileage in photos vs description. Photos show 16,000 miles but description says 15,000 miles.', 'pending', 4),
(3, 'Seller communication issue', 'Made an offer on BMW X5 three days ago but seller has not responded to messages or calls. Need assistance with contact.', 'in_progress', 4),
(2, 'Payment processing delay', 'Buyer paid for Honda Civic but payment is showing as pending in my account. Transaction ID: TXN_2024_001', 'resolved', 4),
(3, 'Test drive scheduling', 'Trying to schedule test drive for Tesla Model 3 but seller availability is very limited. Need help coordinating.', 'pending', 4);

-- Insert comprehensive FAQs
INSERT INTO faqs (question, answer, created_by) VALUES
('How do I list my car for sale?', 'Login as a seller, go to your dashboard, and click "Add New Listing". Fill in all car details, upload high-quality photos, and set a competitive price. Your listing will be reviewed and published within 24 hours.', 1),
('How do I make an offer on a car?', 'Browse available cars, select the one you are interested in, and click "Make Offer". Enter your offer amount and a message to the seller. The seller will be notified and can accept, reject, or counter your offer.', 1),
('What happens after my offer is accepted?', 'You will receive a notification and detailed instructions on how to proceed with the purchase. This includes payment options, inspection arrangements, and title transfer procedures.', 1),
('How do I schedule a test drive?', 'Contact the seller directly through our messaging system or use the "Schedule Test Drive" button on the car listing page. Coordinate a mutually convenient time and location.', 1),
('What payment methods are accepted?', 'We accept bank transfers, certified checks, and cash payments. For high-value transactions, we recommend using our escrow service for added security.', 1),
('How do I report a problem with a listing?', 'Use the "Report Issue" button on any listing or contact our support team directly. We investigate all reports within 24 hours and take appropriate action.', 1),
('Can I negotiate the price?', 'Yes! Most sellers are open to reasonable offers. Use our offer system to submit your best price and include a message explaining your offer.', 1),
('How do I transfer ownership?', 'After purchase completion, both parties must sign the title transfer documents. We provide a checklist and can connect you with local DMV services for assistance.', 1);

-- Update car statuses based on purchases
UPDATE cars SET status = 'sold' WHERE id IN (2, 6, 7);
