"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { z } from "zod"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { toast } from "@/hooks/use-toast"
import { Eye, Edit, Trash2 } from "lucide-react"
import ClientImage from "./ClientImage"

const formSchema = z.object({
  make: z.string().min(1, "Make is required"),
  model: z.string().min(1, "Model is required"),
  year: z.coerce
    .number()
    .int()
    .min(1900)
    .max(new Date().getFullYear() + 1),
  price: z.coerce.number().positive("Price must be positive"),
  description: z.string().optional(),
  mileage: z.coerce.number().nonnegative("Mileage must be non-negative").optional(),
  color: z.string().optional(),
  fuel_type: z.string().optional(),
  transmission: z.string().optional(),
})

interface CarModalProps {
  car: any
  mode: "view" | "edit"
  children: React.ReactNode
}

export function CarModal({ car, mode, children }: CarModalProps) {
  const router = useRouter()
  const [isOpen, setIsOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      make: car.make || "",
      model: car.model || "",
      year: car.year || new Date().getFullYear(),
      price: car.price || 0,
      description: car.description || "",
      mileage: car.mileage || 0,
      color: car.color || "",
      fuel_type: car.fuel_type || "",
      transmission: car.transmission || "",
    },
  })

  async function onSubmit(values: z.infer<typeof formSchema>) {
    if (mode === "view") return

    setIsSubmitting(true)

    try {
      const response = await fetch(`/api/cars/${car.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.message || "Failed to update car")
      }

      toast({
        title: "Success",
        description: "Car updated successfully",
      })

      setIsOpen(false)
      router.refresh()
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to update car",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  async function handleDelete() {
    setIsDeleting(true)

    try {
      const response = await fetch(`/api/cars/${car.id}`, {
        method: "DELETE",
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.message || "Failed to delete car")
      }

      toast({
        title: "Success",
        description: "Car deleted successfully",
      })

      setIsOpen(false)
      router.refresh()
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to delete car",
        variant: "destructive",
      })
    } finally {
      setIsDeleting(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {mode === "view" ? <Eye className="h-5 w-5" /> : <Edit className="h-5 w-5" />}
            {mode === "view" ? "View Car Details" : "Edit Car Details"}
          </DialogTitle>
          <DialogDescription>
            {mode === "view" ? "View complete details of your car listing" : "Update your car listing information"}
          </DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Car Image */}
          <div className="space-y-4">
            <div className="relative h-64 rounded-lg overflow-hidden">
              <ClientImage
                src={car.image_url || `/images/car${(car.id % 6) + 1}.png`}
                alt={`${car.make} ${car.model}`}
                fill
                className="object-cover"
                fallbackSrc="/placeholder.svg?height=256&width=400"
              />
              <div className="absolute top-2 right-2">
                <Badge
                  className={`${
                    car.status === "available" ? "bg-green-500" : car.status === "sold" ? "bg-red-500" : "bg-yellow-500"
                  }`}
                >
                  {car.status.charAt(0).toUpperCase() + car.status.slice(1)}
                </Badge>
              </div>
            </div>

            {mode === "view" && (
              <div className="space-y-3">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="font-medium text-gray-500">Listed:</span>
                    <p>{new Date(car.created_at).toLocaleDateString()}</p>
                  </div>
                  <div>
                    <span className="font-medium text-gray-500">Offers:</span>
                    <p>{car.offer_count || 0} pending</p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Car Form */}
          <div>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="make"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Make</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="e.g. Toyota"
                            {...field}
                            disabled={mode === "view"}
                            className="bg-white text-gray-900"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="model"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Model</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="e.g. Camry"
                            {...field}
                            disabled={mode === "view"}
                            className="bg-white text-gray-900"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="year"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Year</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            {...field}
                            disabled={mode === "view"}
                            className="bg-white text-gray-900"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="price"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Price ($)</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            placeholder="0.00"
                            {...field}
                            disabled={mode === "view"}
                            className="bg-white text-gray-900"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <FormField
                    control={form.control}
                    name="mileage"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Mileage</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            {...field}
                            disabled={mode === "view"}
                            className="bg-white text-gray-900"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="color"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Color</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="e.g. Silver"
                            {...field}
                            disabled={mode === "view"}
                            className="bg-white text-gray-900"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="fuel_type"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Fuel Type</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value} disabled={mode === "view"}>
                          <FormControl>
                            <SelectTrigger className="bg-white text-gray-900">
                              <SelectValue placeholder="Select fuel type" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="Gasoline">Gasoline</SelectItem>
                            <SelectItem value="Diesel">Diesel</SelectItem>
                            <SelectItem value="Electric">Electric</SelectItem>
                            <SelectItem value="Hybrid">Hybrid</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="transmission"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Transmission</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value} disabled={mode === "view"}>
                        <FormControl>
                          <SelectTrigger className="bg-white text-gray-900">
                            <SelectValue placeholder="Select transmission type" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="Automatic">Automatic</SelectItem>
                          <SelectItem value="Manual">Manual</SelectItem>
                          <SelectItem value="Semi-Automatic">Semi-Automatic</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Provide details about the car's condition, features, etc."
                          className="min-h-24 bg-white text-gray-900"
                          {...field}
                          disabled={mode === "view"}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Action Buttons */}
                <div className="flex gap-3 pt-4">
                  {mode === "edit" && (
                    <>
                      <Button type="submit" disabled={isSubmitting} className="flex-1">
                        {isSubmitting ? "Updating..." : "Update Car"}
                      </Button>
                      <Button
                        type="button"
                        variant="destructive"
                        onClick={handleDelete}
                        disabled={isDeleting}
                        className="px-6"
                      >
                        {isDeleting ? "Deleting..." : <Trash2 className="h-4 w-4" />}
                      </Button>
                    </>
                  )}
                  {mode === "view" && (
                    <Button type="button" onClick={() => setIsOpen(false)} className="flex-1">
                      Close
                    </Button>
                  )}
                </div>
              </form>
            </Form>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
