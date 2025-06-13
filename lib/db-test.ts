import { testConnection } from "./db"

export async function checkDatabaseConnection() {
  console.log("🔍 Testing database connection...")

  const isConnected = await testConnection()

  if (!isConnected) {
    console.log("\n❌ Database connection failed!")
    console.log("Please check:")
    console.log("1. MySQL server is running")
    console.log("2. Database credentials are correct")
    console.log("3. Database 'car_selling_system' exists")
    console.log("4. Run: CREATE DATABASE car_selling_system;")
    return false
  }

  return true
}
