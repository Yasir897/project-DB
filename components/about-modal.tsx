"use client"

import type React from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Car, Award, Users, Shield, Clock, Star } from "lucide-react"

interface AboutModalProps {
  children: React.ReactNode
}

export function AboutModal({ children }: AboutModalProps) {
  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            About Yasir Cars
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Hero Section */}
          <div className="bg-gradient-to-br from-blue-50 to-purple-50 p-6 rounded-xl">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Welcome to Yasir Cars</h2>
            <p className="text-gray-700 leading-relaxed">
              Founded in 2020, Yasir Cars has become Pakistan's most trusted platform for buying and selling quality
              vehicles. We connect verified dealers and private sellers with genuine buyers, ensuring a transparent and
              secure car trading experience.
            </p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <Car className="h-8 w-8 text-blue-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-blue-600">50K+</div>
              <div className="text-sm text-gray-600">Cars Sold</div>
            </div>
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <Users className="h-8 w-8 text-green-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-green-600">25K+</div>
              <div className="text-sm text-gray-600">Happy Customers</div>
            </div>
            <div className="text-center p-4 bg-purple-50 rounded-lg">
              <Shield className="h-8 w-8 text-purple-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-purple-600">1000+</div>
              <div className="text-sm text-gray-600">Verified Dealers</div>
            </div>
            <div className="text-center p-4 bg-orange-50 rounded-lg">
              <Award className="h-8 w-8 text-orange-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-orange-600">4.9</div>
              <div className="text-sm text-gray-600">Rating</div>
            </div>
          </div>

          {/* Our Story */}
          <div>
            <h3 className="text-xl font-bold mb-3">Our Story</h3>
            <p className="text-gray-700 leading-relaxed mb-4">
              Started by Yasir Ahmed in Lahore, Pakistan, our mission was simple: make car buying and selling
              transparent, secure, and hassle-free. What began as a small local business has now grown into Pakistan's
              leading automotive marketplace.
            </p>
            <p className="text-gray-700 leading-relaxed">
              We believe every customer deserves the best car buying experience, which is why we verify every listing,
              provide comprehensive vehicle history reports, and offer 24/7 customer support.
            </p>
          </div>

          {/* Services */}
          <div>
            <h3 className="text-xl font-bold mb-3">Our Services</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                <Shield className="h-6 w-6 text-blue-600 mt-1" />
                <div>
                  <h4 className="font-semibold">Verified Listings</h4>
                  <p className="text-sm text-gray-600">Every car is inspected and verified before listing</p>
                </div>
              </div>
              <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                <Clock className="h-6 w-6 text-green-600 mt-1" />
                <div>
                  <h4 className="font-semibold">24/7 Support</h4>
                  <p className="text-sm text-gray-600">Round-the-clock customer assistance</p>
                </div>
              </div>
              <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                <Star className="h-6 w-6 text-purple-600 mt-1" />
                <div>
                  <h4 className="font-semibold">Quality Guarantee</h4>
                  <p className="text-sm text-gray-600">Comprehensive vehicle history reports</p>
                </div>
              </div>
              <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                <Users className="h-6 w-6 text-orange-600 mt-1" />
                <div>
                  <h4 className="font-semibold">Trusted Community</h4>
                  <p className="text-sm text-gray-600">Verified dealers and genuine buyers</p>
                </div>
              </div>
            </div>
          </div>

          {/* Awards */}
          <div>
            <h3 className="text-xl font-bold mb-3">Awards & Recognition</h3>
            <div className="flex flex-wrap gap-2">
              <Badge className="bg-blue-100 text-blue-800">Best Car Marketplace 2023</Badge>
              <Badge className="bg-green-100 text-green-800">Customer Choice Award</Badge>
              <Badge className="bg-purple-100 text-purple-800">Most Trusted Platform</Badge>
              <Badge className="bg-orange-100 text-orange-800">Innovation in Auto Tech</Badge>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
