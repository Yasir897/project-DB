import { NextResponse } from "next/server"
import { executeQuery } from "@/lib/db"
import { getSession } from "@/lib/auth"

export async function POST(request: Request) {
  try {
    const session = await getSession()

    if (!session) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

    if (session.role !== "buyer") {
      return NextResponse.json({ message: "Only buyers can make offers" }, { status: 403 })
    }

    const { carId, buyerId, amount, message } = await request.json()

    // Validate input
    if (!carId || !buyerId || !amount) {
      return NextResponse.json({ message: "Missing required fields" }, { status: 400 })
    }

    // Verify buyer ID matches session user
    if (buyerId !== session.id) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 403 })
    }

    // Check if car exists and is available
    const cars = await executeQuery<any[]>("SELECT * FROM cars WHERE id = ? AND status = 'available'", [carId])

    if (cars.length === 0) {
      return NextResponse.json({ message: "Car not found or not available" }, { status: 404 })
    }

    // Check if user already has a pending offer for this car
    const existingOffers = await executeQuery<any[]>(
      "SELECT * FROM offers WHERE car_id = ? AND buyer_id = ? AND status = 'pending'",
      [carId, buyerId],
    )

    if (existingOffers.length > 0) {
      return NextResponse.json({ message: "You already have a pending offer for this car" }, { status: 400 })
    }

    // Create offer
    await executeQuery(
      "INSERT INTO offers (car_id, buyer_id, amount, message, status) VALUES (?, ?, ?, ?, 'pending')",
      [carId, buyerId, amount, message || null],
    )

    return NextResponse.json({ message: "Offer submitted successfully" }, { status: 201 })
  } catch (error) {
    console.error("Offer submission error:", error)

    return NextResponse.json(
      { message: error instanceof Error ? error.message : "Failed to submit offer" },
      { status: 500 },
    )
  }
}
