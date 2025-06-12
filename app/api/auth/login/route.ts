import { NextResponse } from "next/server"
import { login } from "@/lib/auth"

export async function POST(request: Request) {
  try {
    const { email, password, role } = await request.json()

    // Validate input
    if (!email || !password || !role) {
      return NextResponse.json({ message: "Missing required fields" }, { status: 400 })
    }

    // Login user
    const session = await login(email, password, role)

    return NextResponse.json({ message: "Login successful", user: session }, { status: 200 })
  } catch (error) {
    console.error("Login error:", error)

    return NextResponse.json({ message: error instanceof Error ? error.message : "Login failed" }, { status: 401 })
  }
}
