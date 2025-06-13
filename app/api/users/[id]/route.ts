import { type NextRequest, NextResponse } from "next/server"
import { executeQuery } from "@/lib/db"
import { getSession } from "@/lib/auth"

interface RouteParams {
  params: Promise<{ id: string }>
}

export async function PUT(request: NextRequest, { params }: RouteParams) {
  try {
    const session = await getSession()
    if (!session || session.role !== "admin") {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

    const { id } = await params
    const userId = Number.parseInt(id)

    if (isNaN(userId)) {
      return NextResponse.json({ message: "Invalid user ID" }, { status: 400 })
    }

    const body = await request.json()
    const { username, email, role, password } = body

    // Check if user exists
    const userCheck = await executeQuery<any[]>("SELECT id FROM users WHERE id = ?", [userId])

    if (userCheck.length === 0) {
      return NextResponse.json({ message: "User not found" }, { status: 404 })
    }

    // Update user
    if (password) {
      await executeQuery(
        "UPDATE users SET username = ?, email = ?, role = ?, password = ?, updated_at = NOW() WHERE id = ?",
        [username, email, role, password, userId],
      )
    } else {
      await executeQuery("UPDATE users SET username = ?, email = ?, role = ?, updated_at = NOW() WHERE id = ?", [
        username,
        email,
        role,
        userId,
      ])
    }

    return NextResponse.json({ message: "User updated successfully" })
  } catch (error) {
    console.error("Error updating user:", error)
    return NextResponse.json({ message: "Failed to update user" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: RouteParams) {
  try {
    const session = await getSession()
    if (!session || session.role !== "admin") {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

    const { id } = await params
    const userId = Number.parseInt(id)

    if (isNaN(userId)) {
      return NextResponse.json({ message: "Invalid user ID" }, { status: 400 })
    }

    // Check if user exists
    const userCheck = await executeQuery<any[]>("SELECT id FROM users WHERE id = ?", [userId])

    if (userCheck.length === 0) {
      return NextResponse.json({ message: "User not found" }, { status: 404 })
    }

    // Delete user (this will cascade delete related records)
    await executeQuery("DELETE FROM users WHERE id = ?", [userId])

    return NextResponse.json({ message: "User deleted successfully" })
  } catch (error) {
    console.error("Error deleting user:", error)
    return NextResponse.json({ message: "Failed to delete user" }, { status: 500 })
  }
}
