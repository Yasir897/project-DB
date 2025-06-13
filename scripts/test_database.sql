USE car_selling_system;

-- Test queries to verify data
SELECT 'Database Test Results' as test_name;

SELECT 'Total Cars:' as metric, COUNT(*) as count FROM cars;
SELECT 'Available Cars:' as metric, COUNT(*) as count FROM cars WHERE status = 'available';
SELECT 'Total Users:' as metric, COUNT(*) as count FROM users;
SELECT 'Total Offers:' as metric, COUNT(*) as count FROM offers;

-- Show sample cars
SELECT 'Sample Cars:' as section;
SELECT id, make, model, year, price, status, image_url FROM cars LIMIT 5;

-- Show sample users
SELECT 'Sample Users:' as section;
SELECT id, username, email, role FROM users LIMIT 5;
