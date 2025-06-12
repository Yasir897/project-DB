import Link from "next/link"
import Image from "next/image"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

interface Car {
  id: number
  make: string
  model: string
  year: number
  price: number
  image_url: string
  seller_name: string
}

interface FeaturedCarsProps {
  cars: Car[]
}

export function FeaturedCars({ cars }: FeaturedCarsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {cars.map((car) => (
        <Card key={car.id} className="overflow-hidden">
          <div className="relative h-48">
            <Image
              src={car.image_url || `/placeholder.svg?height=400&width=600`}
              alt={`${car.make} ${car.model}`}
              fill
              className="object-cover"
            />
          </div>
          <CardContent className="p-4">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-lg font-bold">
                  {car.make} {car.model}
                </h3>
                <p className="text-sm text-muted-foreground">{car.year}</p>
              </div>
              <Badge variant="secondary">${car.price.toLocaleString()}</Badge>
            </div>
            <p className="text-sm mt-2">Seller: {car.seller_name}</p>
          </CardContent>
          <CardFooter className="p-4 pt-0">
            <Link href={`/cars/${car.id}`} className="text-primary hover:underline text-sm font-medium">
              View Details
            </Link>
          </CardFooter>
        </Card>
      ))}
    </div>
  )
}
