import mysql from "mysql2/promise"

// Create a connection pool with correct mysql2 options
const pool = mysql.createPool({
  host: process.env.DB_HOST || "localhost",
  port: Number.parseInt(process.env.DB_PORT || "3306"),
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD || "",
  database: process.env.DB_NAME || "car_selling_system",
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  // Remove invalid options that cause warnings
  charset: "utf8mb4",
  timezone: "+00:00",
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

    // More specific error messages
    if (error instanceof Error) {
      if (error.message.includes("ECONNREFUSED")) {
        throw new Error("Cannot connect to MySQL database. Please ensure MySQL is running on localhost:3306")
      }
      if (error.message.includes("ER_ACCESS_DENIED_ERROR")) {
        throw new Error("MySQL access denied. Please check your database credentials")
      }
      if (error.message.includes("ER_BAD_DB_ERROR")) {
        throw new Error(`Database '${process.env.DB_NAME}' does not exist. Please create it first`)
      }
    }

    throw new Error(`Database query failed: ${error instanceof Error ? error.message : "Unknown error"}`)
  } finally {
    if (connection) {
      connection.release()
    }
  }
}

// Test database connection
export async function testConnection() {
  try {
    const result = await executeQuery<any[]>("SELECT 1 as test")
    console.log("✅ Database connection successful")
    return true
  } catch (error) {
    console.error("❌ Database connection failed:", error)
    return false
  }
}

export default pool
