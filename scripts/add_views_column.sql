-- Add views column to cars table if it doesn't exist
ALTER TABLE cars ADD COLUMN IF NOT EXISTS views INT DEFAULT 0;

-- Update existing cars with random view counts
UPDATE cars SET views = FLOOR(RAND() * 100) + 10 WHERE views = 0;
