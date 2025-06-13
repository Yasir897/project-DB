// Fixed SQL queries for MariaDB with proper UNION ALL syntax
export const getRecentActivities = `
(
  SELECT 'new_user' as type, u.username as name, u.created_at as date, u.role as details, u.id as entity_id
  FROM users u
  ORDER BY u.created_at DESC
  LIMIT 5
)
UNION ALL
(
  SELECT 'new_car' as type, CONCAT(c.make, ' ', c.model) as name, c.created_at as date, u.username as details, c.id as entity_id
  FROM cars c
  JOIN users u ON c.seller_id = u.id
  ORDER BY c.created_at DESC
  LIMIT 5
)
UNION ALL
(
  SELECT 'new_offer' as type, CONCAT(c.make, ' ', c.model) as name, o.created_at as date, CONCAT('$', o.amount) as details, o.id as entity_id
  FROM offers o
  JOIN cars c ON o.car_id = c.id
  ORDER BY o.created_at DESC
  LIMIT 5
)
ORDER BY date DESC
LIMIT 10;
`

export const getTopSellers = `
SELECT 
  u.id,
  u.username,
  u.email,
  COUNT(c.id) as total_cars,
  COUNT(CASE WHEN c.status = 'sold' THEN 1 END) as cars_sold,
  COALESCE(SUM(p.amount), 0) as total_revenue
FROM users u
LEFT JOIN cars c ON u.id = c.seller_id
LEFT JOIN purchases p ON u.id = p.seller_id
WHERE u.role = 'seller'
GROUP BY u.id, u.username, u.email
ORDER BY total_revenue DESC, cars_sold DESC
LIMIT 5;
`

export const getPopularCars = `
SELECT 
  c.id,
  c.make,
  c.model,
  c.year,
  c.price,
  c.image_url,
  COUNT(o.id) as offer_count,
  MAX(o.amount) as highest_offer
FROM cars c
LEFT JOIN offers o ON c.id = o.car_id
WHERE c.status = 'available'
GROUP BY c.id, c.make, c.model, c.year, c.price, c.image_url
ORDER BY offer_count DESC, highest_offer DESC
LIMIT 6;
`
