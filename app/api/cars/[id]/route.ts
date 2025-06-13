import { type NextRequest, NextResponse } from "next/server"
import { executeQuery } from "@/lib/db"
import { getSession } from "@/lib/auth"

interface RouteParams {
  params: Promise<{ id: string }>
}

export async function PUT(request: NextRequest, { params }: RouteParams) {
  try {
    const session = await getSession()
    if (!session) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

    const { id } = await params
    const carId = Number.parseInt(id)

    if (isNaN(carId)) {
      return NextResponse.json({ message: "Invalid car ID" }, { status: 400 })
    }

    const body = await request.json()
    const { make, model, year, price, description, mileage, color, fuel_type, transmission } = body

    // Verify car ownership (sellers can only edit their own cars, admins can edit any)
    if (session.role === "seller") {
      const carCheck = await executeQuery<any[]>("SELECT seller_id FROM cars WHERE id = ?", [carId])

      if (carCheck.length === 0) {
        return NextResponse.json({ message: "Car not found" }, { status: 404 })
      }

      if (carCheck[0].seller_id !== session.id) {
        return NextResponse.json({ message: "You can only edit your own cars" }, { status: 403 })
      }
    }

    // Update the car
    await executeQuery(
      `UPDATE cars SET 
        make = ?, model = ?, year = ?, price = ?, description = ?, 
        mileage = ?, color = ?, fuel_type = ?, transmission = ?, 
        updated_at = CURRENT_TIMESTAMP
       WHERE id = ?`,
      [make, model, year, price, description, mileage, color, fuel_type, transmission, carId],
    )

    return NextResponse.json({ message: "Car updated successfully" })
  } catch (error) {
    console.error("Error updating car:", error)
    return NextResponse.json({ message: "Failed to update car" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: RouteParams) {
  try {
    const session = await getSession()
    if (!session) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

    const { id } = await params
    const carId = Number.parseInt(id)

    if (isNaN(carId)) {
      return NextResponse.json({ message: "Invalid car ID" }, { status: 400 })
    }

    // Verify car ownership (sellers can only delete their own cars, admins can delete any)
    if (session.role === "seller") {
      const carCheck = await executeQuery<any[]>("SELECT seller_id FROM cars WHERE id = ?", [carId])

      if (carCheck.length === 0) {
        return NextResponse.json({ message: "Car not found" }, { status: 404 })
      }

      if (carCheck[0].seller_id !== session.id) {
        return NextResponse.json({ message: "You can only delete your own cars" }, { status: 403 })
      }
    }

    // Delete the car (this will cascade delete related images and offers)
    await executeQuery("DELETE FROM cars WHERE id = ?", [carId])

    return NextResponse.json({ message: "Car deleted successfully" })
  } catch (error) {
    console.error("Error deleting car:", error)
    return NextResponse.json({ message: "Failed to delete car" }, { status: 500 })
  }
}
