import { cookies } from "next/headers"
import bcrypt from "bcryptjs"
import { executeQuery } from "./db"

export interface User {
  id: number
  username: string
  email: string
  role: "admin" | "buyer" | "seller" | "support"
}

export async function getSession(): Promise<User | null> {
  try {
    const cookieStore = await cookies()
    const sessionCookie = cookieStore.get("user_session")

    if (!sessionCookie) {
      return null
    }

    const sessionData = JSON.parse(sessionCookie.value)

    // Verify session is still valid by checking user exists
    const users = await executeQuery<any[]>("SELECT id, username, email, role FROM users WHERE id = ? AND role = ?", [
      sessionData.id,
      sessionData.role,
    ])

    if (users.length === 0) {
      return null
    }

    return users[0] as User
  } catch (error) {
    console.error("Session error:", error)
    return null
  }
}

export async function requireAuth(requiredRole?: string): Promise<User> {
  const user = await getSession()

  if (!user) {
    throw new Error("Authentication required")
  }

  if (requiredRole && user.role !== requiredRole) {
    throw new Error("Insufficient permissions")
  }

  return user
}

export async function login(email: string, password: string, role: string): Promise<User> {
  const users = await executeQuery<any[]>("SELECT * FROM users WHERE email = ? AND role = ?", [email, role])

  if (users.length === 0) {
    throw new Error("Invalid credentials")
  }

  const user = users[0]
  const isValidPassword = await bcrypt.compare(password, user.password)

  if (!isValidPassword) {
    throw new Error("Invalid credentials")
  }

  const sessionData = {
    id: user.id,
    username: user.username,
    email: user.email,
    role: user.role,
  }

  // Set cookie with proper options
  const cookieStore = await cookies()
  cookieStore.set("user_session", JSON.stringify(sessionData), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 7, // 7 days
    path: "/",
  })

  return sessionData as User
}

export async function logout() {
  const cookieStore = await cookies()
  cookieStore.delete("user_session")
}
