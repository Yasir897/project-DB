USE car_selling_system;

-- Update existing car images with new beautiful car photos
UPDATE car_images SET image_url = '/images/car1.png' WHERE car_id = 1 AND is_primary = TRUE;
UPDATE car_images SET image_url = '/images/car2.png' WHERE car_id = 2 AND is_primary = TRUE;
UPDATE car_images SET image_url = '/images/car3.png' WHERE car_id = 3 AND is_primary = TRUE;
UPDATE car_images SET image_url = '/images/car4.png' WHERE car_id = 4 AND is_primary = TRUE;
UPDATE car_images SET image_url = '/images/car5.png' WHERE car_id = 5 AND is_primary = TRUE;
UPDATE car_images SET image_url = '/images/car6.png' WHERE car_id = 6 AND is_primary = TRUE;
UPDATE car_images SET image_url = '/images/car7.png' WHERE car_id = 7 AND is_primary = TRUE;
UPDATE car_images SET image_url = '/images/car8.png' WHERE car_id = 8 AND is_primary = TRUE;
UPDATE car_images SET image_url = '/images/car9.png' WHERE car_id = 9 AND is_primary = TRUE;
UPDATE car_images SET image_url = '/images/car10.png' WHERE car_id = 10 AND is_primary = TRUE;

-- Add secondary images for cars
INSERT INTO car_images (car_id, image_url, is_primary) VALUES
(1, '/images/car7.png', FALSE),
(1, '/images/car8.png', FALSE),
(2, '/images/car9.png', FALSE),
(2, '/images/car10.png', FALSE),
(3, '/images/car1.png', FALSE),
(3, '/images/car2.png', FALSE),
(4, '/images/car3.png', FALSE),
(4, '/images/car4.png', FALSE),
(5, '/images/car5.png', FALSE),
(5, '/images/car6.png', FALSE);

-- Update cars table to have image_url column with fallback
UPDATE cars SET image_url = CONCAT('/images/car', ((id - 1) % 10) + 1, '.png') WHERE image_url IS NULL;
