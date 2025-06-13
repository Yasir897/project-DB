import mysql from "mysql2/promise"

// Create a connection pool
const pool = mysql.createPool({
  host: process.env.DB_HOST || "localhost",
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD || "",
  database: process.env.DB_NAME || "car_selling_system",
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  acquireTimeout: 60000,
  timeout: 60000,
})

export async function executeQuery<T>(query: string, params: any[] = []): Promise<T> {
  let connection
  try {
    connection = await pool.getConnection()
    const [rows] = await connection.execute(query, params)
    return rows as T
  } catch (error) {
    console.error("Database query error:", error)
    console.error("Query:", query)
    console.error("Params:", params)
    throw new Error(`Database query failed: ${error instanceof Error ? error.message : "Unknown error"}`)
  } finally {
    if (connection) {
      connection.release()
    }
  }
}

export default pool
