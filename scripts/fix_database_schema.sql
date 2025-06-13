USE car_selling_system;

-- Add missing columns to cars table
ALTER TABLE cars ADD COLUMN IF NOT EXISTS image_url VARCHAR(255) DEFAULT NULL;
ALTER TABLE cars ADD COLUMN IF NOT EXISTS views INT DEFAULT 0;

-- Update existing cars with sample image URLs
UPDATE cars SET image_url = CONCAT('/images/car', ((id - 1) % 6) + 1, '.png') WHERE image_url IS NULL;

-- Add some sample views data
UPDATE cars SET views = FLOOR(RAND() * 500) + 50 WHERE views = 0;

-- Ensure we have proper indexes for better performance
CREATE INDEX IF NOT EXISTS idx_cars_seller_id ON cars(seller_id);
CREATE INDEX IF NOT EXISTS idx_cars_status ON cars(status);
CREATE INDEX IF NOT EXISTS idx_offers_car_id ON offers(car_id);
CREATE INDEX IF NOT EXISTS idx_offers_buyer_id ON offers(buyer_id);
CREATE INDEX IF NOT EXISTS idx_car_images_car_id ON car_images(car_id);
