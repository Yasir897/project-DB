import Link from "next/link"
import { Button } from "@/components/ui/button"

export function HeroSection() {
  return (
    <section className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-20">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl">
          <h1 className="text-5xl font-bold mb-6">Find Your Perfect Car at Yasir Cars</h1>
          <p className="text-xl mb-8">
            Browse thousands of quality vehicles from trusted sellers. Buy or sell with confidence on Pakistan's most
            trusted car marketplace.
          </p>
          <div className="flex flex-wrap gap-4">
            <Button size="lg" asChild className="bg-white text-blue-700 hover:bg-gray-100">
              <Link href="/cars">Browse Cars</Link>
            </Button>
            <Button size="lg" variant="outline" asChild className="border-white text-white hover:bg-white/10">
              <Link href="/register?role=seller">Sell Your Car</Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}
