import { NextResponse } from "next/server"
import { register } from "@/lib/auth"

export async function POST(request: Request) {
  try {
    const { username, email, password, role } = await request.json()

    // Validate input
    if (!username || !email || !password || !role) {
      return NextResponse.json({ message: "Missing required fields" }, { status: 400 })
    }

    // Check if role is valid
    if (!["admin", "seller", "buyer", "support"].includes(role)) {
      return NextResponse.json({ message: "Invalid role" }, { status: 400 })
    }

    // Register user
    await register(username, email, password, role)

    return NextResponse.json({ message: "User registered successfully" }, { status: 201 })
  } catch (error) {
    console.error("Registration error:", error)

    return NextResponse.json(
      { message: error instanceof Error ? error.message : "Registration failed" },
      { status: 500 },
    )
  }
}
