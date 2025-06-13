import { NextResponse } from "next/server"
import { login } from "@/lib/auth"

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { email, password, role } = body

    // Validate input
    if (!email || !password || !role) {
      return NextResponse.json({ message: "Missing required fields" }, { status: 400 })
    }

    // Validate role
    if (!["admin", "buyer", "seller", "support"].includes(role)) {
      return NextResponse.json({ message: "Invalid role" }, { status: 400 })
    }

    // Login user
    const session = await login(email, password, role)

    const response = NextResponse.json(
      {
        message: "Login successful",
        user: session,
        success: true,
      },
      { status: 200 },
    )

    return response
  } catch (error) {
    console.error("Login error:", error)

    return NextResponse.json(
      {
        message: error instanceof Error ? error.message : "Login failed",
        success: false,
      },
      { status: 401 },
    )
  }
}
