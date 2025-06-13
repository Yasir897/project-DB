import { type NextRequest, NextResponse } from "next/server"
import { executeQuery } from "@/lib/db"

export async function POST(request: NextRequest) {
  try {
    const { make, model, year, color } = await request.json()

    if (!make || !model || !year || !color) {
      return NextResponse.json({ message: "Missing required fields" }, { status: 400 })
    }

    await executeQuery("INSERT INTO cars (make, model, year, color) VALUES (?, ?, ?, ?)", [make, model, year, color])

    // Get the inserted car ID
    const result = await executeQuery<any>("SELECT LAST_INSERT_ID() as carId")

    return NextResponse.json({
      message: "Car listing created successfully",
      carId: result[0]?.carId,
    })
  } catch (error) {
    console.error("Error creating car listing:", error)
    return NextResponse.json({ message: "Error creating car listing" }, { status: 500 })
  }
}
