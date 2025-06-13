import { NextResponse } from "next/server"
import { register } from "@/lib/auth"

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { username, email, password, role } = body

    // Validate input
    if (!username || !email || !password || !role) {
      return NextResponse.json({ message: "Missing required fields" }, { status: 400 })
    }

    // Validate username length
    if (username.length < 3) {
      return NextResponse.json({ message: "Username must be at least 3 characters" }, { status: 400 })
    }

    // Validate password length
    if (password.length < 8) {
      return NextResponse.json({ message: "Password must be at least 8 characters" }, { status: 400 })
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json({ message: "Invalid email format" }, { status: 400 })
    }

    // Check if role is valid
    if (!["buyer", "seller", "support"].includes(role)) {
      return NextResponse.json({ message: "Invalid role" }, { status: 400 })
    }

    // Register user
    await register(username, email, password, role)

    return NextResponse.json(
      {
        message: "User registered successfully",
        success: true,
      },
      { status: 201 },
    )
  } catch (error) {
    console.error("Registration error:", error)

    return NextResponse.json(
      {
        message: error instanceof Error ? error.message : "Registration failed",
        success: false,
      },
      { status: 500 },
    )
  }
}
