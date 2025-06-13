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
('admin', 'admin@yasircars.com', '12345678', 'admin'),
('yasir_ahmed', 'yasir@yasircars.com', '12345678', 'seller'),
('ahmad_seller', 'ahmad@example.com', '12345678', 'seller'),
('sara_buyer', 'sara@example.com', '12345678', 'buyer'),
('hassan_support', 'hassan@yasircars.com', '12345678', 'support'),
('fatima_seller', 'fatima@example.com', '12345678', 'seller'),
('ali_seller', 'ali@example.com', '12345678', 'seller'),
('zara_buyer', 'zara@example.com', '12345678', 'buyer'),
('usman_buyer', 'usman@example.com', '12345678', 'buyer'),
('maria_buyer', 'maria@example.com', '12345678', 'buyer');

-- Insert premium car listings with beautiful images
INSERT INTO cars (seller_id, make, model, year, price, description, mileage, color, fuel_type, transmission, status, image_url, views) VALUES
(2, 'BMW', 'M4 Competition', 2023, 85000.00, 'Stunning BMW M4 Competition with twin-turbo V6 engine. Carbon fiber accents, premium leather interior, and track-ready performance. Barely driven with full warranty.', 2500, 'Alpine White', 'Gasoline', 'Automatic', 'available', '/images/car1.png', 156),
(2, 'Mercedes-Benz', 'C-Class AMG', 2022, 72000.00, 'Elegant Mercedes-Benz C-Class AMG with handcrafted engine. Premium MBUX infotainment, panoramic sunroof, and advanced driver assistance. Showroom condition.', 8500, 'Obsidian Black', 'Gasoline', 'Automatic', 'available', '/images/car2.png', 203),
(3, 'Porsche', '911 Carrera', 2021, 125000.00, 'Iconic Porsche 911 Carrera with naturally aspirated flat-six engine. Sport Chrono package, premium leather, and exceptional build quality. A true drivers car.', 12000, 'Guards Red', 'Gasoline', 'Manual', 'available', '/images/car3.png', 89),
(3, 'Audi', 'RS6 Avant', 2023, 95000.00, 'Powerful Audi RS6 Avant wagon with twin-turbo V8. Quattro all-wheel drive, virtual cockpit, and incredible versatility. Perfect blend of performance and practicality.', 5200, 'Nardo Gray', 'Gasoline', 'Automatic', 'available', '/images/car4.png', 134),
(6, 'Tesla', 'Model S Plaid', 2022, 110000.00, 'Revolutionary Tesla Model S Plaid with tri-motor setup. Ludicrous acceleration, autopilot, and over-the-air updates. Zero emissions with incredible range.', 15000, 'Pearl White', 'Electric', 'Automatic', 'available', '/images/car5.png', 278),
(6, 'Lamborghini', 'Huracán EVO', 2021, 245000.00, 'Exotic Lamborghini Huracán EVO with naturally aspirated V10. Carbon fiber body, advanced aerodynamics, and track-focused engineering. Absolutely pristine.', 3800, 'Arancio Borealis', 'Gasoline', 'Automatic', 'sold', '/images/car6.png', 445),
(7, 'Ferrari', '488 GTB', 2020, 285000.00, 'Legendary Ferrari 488 GTB with twin-turbo V8 engine. Racing heritage, carbon fiber construction, and unmatched Italian craftsmanship. Collectors dream.', 6500, 'Rosso Corsa', 'Gasoline', 'Automatic', 'available', '/images/car7.png', 356),
(7, 'McLaren', '720S', 2021, 295000.00, 'Cutting-edge McLaren 720S with carbon fiber monocoque. Active aerodynamics, butterfly doors, and mind-bending performance. Engineering masterpiece.', 4200, 'Volcano Orange', 'Gasoline', 'Automatic', 'available', '/images/car8.png', 189),
(6, 'Bentley', 'Continental GT', 2022, 185000.00, 'Luxurious Bentley Continental GT with handcrafted interior. Twin-turbo W12 engine, diamond-quilted leather, and unparalleled refinement. Pure elegance.', 7800, 'Beluga Black', 'Gasoline', 'Automatic', 'available', '/images/car9.png', 167),
(7, 'Rolls-Royce', 'Ghost', 2023, 350000.00, 'Majestic Rolls-Royce Ghost with whisper-quiet cabin. Starlight headliner, lamb's wool carpets, and effortless power delivery. The pinnacle of luxury.', 1200, 'Arctic White', 'Gasoline', 'Automatic', 'available', '/images/car10.png', 234);

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
(4, '/images/car4.png', FALSE),
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
(10, '/images/car7.png', FALSE);

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
(10, 9, 340000.00, 'Rolls-Royce Ghost is magnificent! Offering $340,000. Can we schedule a viewing?', 'pending');

-- Insert sample purchases
INSERT INTO purchases (car_id, buyer_id, seller_id, amount, transaction_id) VALUES
(2, 4, 2, 70000.00, 'YC_2024_001'),
(6, 9, 6, 245000.00, 'YC_2024_002'),
(7, 9, 7, 280000.00, 'YC_2024_003');

-- Insert sample complaints
INSERT INTO complaints (user_id, subject, description, status, assigned_to) VALUES
(4, 'BMW M4 listing inquiry', 'The BMW M4 listing shows different wheel options in photos. Could you clarify which wheels are included?', 'pending', 5),
(4, 'Test drive scheduling', 'Trying to schedule test drive for Mercedes C-Class but seller availability is limited. Need assistance.', 'in_progress', 5),
(8, 'Payment processing', 'Completed purchase of Ferrari 488 GTB but payment confirmation is delayed. Transaction: YC_2024_003', 'resolved', 5),
(9, 'Vehicle inspection', 'Need help arranging pre-purchase inspection for Rolls-Royce Ghost. Looking for certified inspector.', 'pending', 5);

-- Insert comprehensive FAQs
INSERT INTO faqs (question, answer, created_by) VALUES
('How do I list my luxury car for sale?', 'Login as a seller, go to your dashboard, and click "Add New Listing". Upload high-quality photos, provide detailed specifications, and set a competitive price. Our team reviews luxury listings within 24 hours.', 1),
('What is the process for buying a premium vehicle?', 'Browse our premium collection, make an offer through our secure system, arrange a test drive, and complete the purchase with our escrow service for added security.', 1),
('Do you offer vehicle inspections?', 'Yes! We can connect you with certified automotive inspectors for pre-purchase inspections. This is highly recommended for luxury and exotic vehicles.', 1),
('How do I schedule a test drive?', 'Contact the seller directly through our messaging system or use the "Schedule Test Drive" button. For luxury vehicles, we recommend scheduling during business hours.', 1),
('What payment methods do you accept?', 'We accept bank transfers, certified checks, and for high-value transactions, we offer escrow services for maximum security and peace of mind.', 1),
('Is financing available for luxury cars?', 'Yes! We work with premium automotive lenders who specialize in luxury vehicle financing. Contact our finance team for pre-approval.', 1),
('How do you verify luxury car authenticity?', 'All luxury listings undergo thorough verification including VIN checks, service history review, and authenticity confirmation for exotic brands.', 1),
('What about warranty and service?', 'Many luxury vehicles come with remaining factory warranty. We can also connect you with authorized service centers and extended warranty providers.', 1),
('Can I trade in my current vehicle?', 'We accept trade-ins and can provide competitive valuations. Our team will assess your vehicle and provide a fair market offer.', 1),
('How do I contact Yasir Cars support?', 'You can reach us at +92 314 4107039, email info@yasircars.com, or visit our showroom at 253-M Block, Sabzazar, Lahore. We are here 24/7 for your luxury car needs.', 1);

-- Update car statuses based on purchases
UPDATE cars SET status = 'sold' WHERE id IN (2, 6, 7);
