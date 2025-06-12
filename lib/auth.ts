import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import { executeQuery } from "./db"
import bcrypt from "bcrypt"

export type User = {
  id: number
  username: string
  email: string
  role: "admin" | "seller" | "buyer" | "support"
}

export async function register(username: string, email: string, password: string, role: string) {
  // Check if user already exists
  const existingUser = await executeQuery<any[]>("SELECT * FROM users WHERE email = ?", [email])

  if (existingUser.length > 0) {
    throw new Error("User with this email already exists")
  }

  // Hash password
  const hashedPassword = await bcrypt.hash(password, 10)

  // Insert new user
  const result = await executeQuery<any>("INSERT INTO users (username, email, password, role) VALUES (?, ?, ?, ?)", [
    username,
    email,
    hashedPassword,
    role,
  ])

  return result
}

export async function login(email: string, password: string, role: string) {
  // Find user by email and role
  const users = await executeQuery<any[]>("SELECT * FROM users WHERE email = ? AND role = ?", [email, role])

  if (users.length === 0) {
    throw new Error("Invalid credentials")
  }

  const user = users[0]

  // Verify password
  const isPasswordValid = await bcrypt.compare(password, user.password)
  if (!isPasswordValid) {
    throw new Error("Invalid credentials")
  }

  // Set session cookie
  const session = {
    id: user.id,
    username: user.username,
    email: user.email,
    role: user.role,
  }

  cookies().set("user_session", JSON.stringify(session), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    maxAge: 60 * 60 * 24 * 7, // 1 week
    path: "/",
  })

  return session
}

export async function logout() {
  cookies().delete("user_session")
}

export async function getSession(): Promise<User | null> {
  const session = cookies().get("user_session")?.value

  if (!session) {
    return null
  }

  try {
    return JSON.parse(session) as User
  } catch (error) {
    return null
  }
}

export async function requireAuth(requiredRole?: string | string[]) {
  const session = await getSession()

  if (!session) {
    redirect("/login")
  }

  if (requiredRole) {
    const roles = Array.isArray(requiredRole) ? requiredRole : [requiredRole]
    if (!roles.includes(session.role)) {
      redirect("/unauthorized")
    }
  }

  return session
}
