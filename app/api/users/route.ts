import { type NextRequest, NextResponse } from "next/server"
import { executeQuery } from "@/lib/db"
import { getSession } from "@/lib/auth"

export async function GET(request: NextRequest) {
  try {
    const session = await getSession()
    if (!session || session.role !== "admin") {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

    const users = await executeQuery<any[]>(`
      SELECT 
        u.id,
        u.username,
        u.email,
        u.role,
        u.created_at,
        u.updated_at,
        (SELECT COUNT(*) FROM cars WHERE seller_id = u.id) as car_count,
        (SELECT COUNT(*) FROM offers WHERE buyer_id = u.id) as offer_count,
        (SELECT COUNT(*) FROM purchases WHERE buyer_id = u.id) as purchase_count,
        (SELECT COALESCE(SUM(amount), 0) FROM purchases WHERE seller_id = u.id) as total_revenue
      FROM users u
      ORDER BY u.created_at DESC
    `)

    return NextResponse.json(users)
  } catch (error) {
    console.error("Error fetching users:", error)
    return NextResponse.json({ message: "Failed to fetch users" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getSession()
    if (!session || session.role !== "admin") {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const { username, email, role, password } = body

    // Check if user already exists
    const existingUser = await executeQuery<any[]>("SELECT id FROM users WHERE email = ? OR username = ?", [
      email,
      username,
    ])

    if (existingUser.length > 0) {
      return NextResponse.json({ message: "User with this email or username already exists" }, { status: 400 })
    }

    // Create new user
    await executeQuery(
      "INSERT INTO users (username, email, password, role, created_at, updated_at) VALUES (?, ?, ?, ?, NOW(), NOW())",
      [username, email, password, role],
    )

    return NextResponse.json({ message: "User created successfully" })
  } catch (error) {
    console.error("Error creating user:", error)
    return NextResponse.json({ message: "Failed to create user" }, { status: 500 })
  }
}
