import Link from "next/link"
import Image from "next/image"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Heart, Star } from "lucide-react"

interface Car {
  id: number
  make: string
  model: string
  year: number
  price: number
  image_url: string
  seller_name: string
  mileage?: number
  transmission?: string
}

interface FeaturedCarsProps {
  cars: Car[]
}

export function FeaturedCars({ cars }: FeaturedCarsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {cars.map((car, index) => (
        <Card key={car.id} className="overflow-hidden border-0 shadow-md rounded-xl">
          <div className="relative h-56">
            <Image
              src={car.image_url || `/images/car${(index % 6) + 1}.png`}
              alt={`${car.make} ${car.model}`}
              fill
              className="object-cover"
            />
            <div className="absolute top-4 right-4">
              <Button variant="ghost" size="icon" className="rounded-full bg-white/80 hover:bg-white">
                <Heart className="h-5 w-5 text-gray-600" />
              </Button>
            </div>
          </div>
          <div className="p-5">
            <div className="flex justify-between items-start mb-2">
              <h3 className="text-lg font-bold text-gray-900">
                {car.make} {car.model}
              </h3>
              <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20">
                ${car.price.toLocaleString()}
              </Badge>
            </div>
            <p className="text-sm text-gray-500 mb-3">
              {car.year} • {car.mileage?.toLocaleString() || "N/A"} miles • {car.transmission || "N/A"}
            </p>
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-1">
                <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                <span className="text-sm font-medium">4.8</span>
                <span className="text-xs text-gray-500">(24 reviews)</span>
              </div>
              <Button asChild variant="ghost" size="sm" className="text-primary hover:text-primary">
                <Link href={`/cars/${car.id}`}>View Details</Link>
              </Button>
            </div>
          </div>
        </Card>
      ))}
    </div>
  )
}
