import { NextResponse } from "next/server"
import { executeQuery } from "@/lib/db"
import { getSession } from "@/lib/auth"

export async function POST(request: Request) {
  try {
    const session = await getSession()

    if (!session) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

    if (session.role !== "seller") {
      return NextResponse.json({ message: "Only sellers can create car listings" }, { status: 403 })
    }

    const { make, model, year, price, description, mileage, color, fuel_type, transmission } = await request.json()

    // Validate required fields
    if (!make || !model || !year || !price) {
      return NextResponse.json({ message: "Missing required fields" }, { status: 400 })
    }

    // Insert car listing
    const result = await executeQuery<any>(
      `INSERT INTO cars 
       (seller_id, make, model, year, price, description, mileage, color, fuel_type, transmission, status) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'available')`,
      [
        session.id,
        make,
        model,
        year,
        price,
        description || null,
        mileage || null,
        color || null,
        fuel_type || null,
        transmission || null,
      ],
    )

    const carId = result.insertId

    return NextResponse.json({ message: "Car listing created successfully", carId }, { status: 201 })
  } catch (error) {
    console.error("Car listing creation error:", error)

    return NextResponse.json(
      { message: error instanceof Error ? error.message : "Failed to create car listing" },
      { status: 500 },
    )
  }
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const make = searchParams.get("make")
    const minPrice = searchParams.get("minPrice")
    const maxPrice = searchParams.get("maxPrice")
    const sort = searchParams.get("sort") || "newest"

    // Build query
    let query = `
      SELECT c.*, u.username as seller_name, 
      (SELECT image_url FROM car_images WHERE car_id = c.id AND is_primary = TRUE LIMIT 1) as image_url 
      FROM cars c 
      JOIN users u ON c.seller_id = u.id 
      WHERE c.status = 'available'
    `

    const queryParams: any[] = []

    if (make) {
      query += ` AND c.make = ?`
      queryParams.push(make)
    }

    if (minPrice) {
      query += ` AND c.price >= ?`
      queryParams.push(Number.parseFloat(minPrice))
    }

    if (maxPrice) {
      query += ` AND c.price <= ?`
      queryParams.push(Number.parseFloat(maxPrice))
    }

    // Add sorting
    if (sort === "price_low") {
      query += ` ORDER BY c.price ASC`
    } else if (sort === "price_high") {
      query += ` ORDER BY c.price DESC`
    } else {
      query += ` ORDER BY c.created_at DESC`
    }

    const cars = await executeQuery<any[]>(query, queryParams)

    return NextResponse.json({ cars })
  } catch (error) {
    console.error("Car listing fetch error:", error)

    return NextResponse.json(
      { message: error instanceof Error ? error.message : "Failed to fetch car listings" },
      { status: 500 },
    )
  }
}
