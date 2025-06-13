"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Card, CardContent } from "@/components/ui/card"
import { useToast } from "@/hooks/use-toast"

interface MakeOfferFormProps {
  carId: number
  buyerId: number
  carPrice: number
}

export function MakeOfferForm({ carId, buyerId, carPrice }: MakeOfferFormProps) {
  const [amount, setAmount] = useState("")
  const [message, setMessage] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { toast } = useToast()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const response = await fetch("/api/offers", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          carId,
          buyerId,
          amount: Number.parseFloat(amount),
          message,
        }),
      })

      const data = await response.json()

      if (response.ok) {
        toast({
          title: "Offer Submitted!",
          description: "Your offer has been sent to the seller.",
          variant: "default",
        })
        setAmount("")
        setMessage("")
        // Refresh the page to show the new offer status
        window.location.reload()
      } else {
        toast({
          title: "Error",
          description: data.message || "Failed to submit offer",
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Something went wrong. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Card className="border-0 bg-gradient-to-r from-blue-50 to-purple-50">
      <CardContent className="p-4">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="amount" className="text-sm font-medium">
              Your Offer Amount
            </Label>
            <div className="relative mt-1">
              <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">$</span>
              <Input
                id="amount"
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder={carPrice.toString()}
                className="pl-8"
                min="1000"
                max={carPrice * 1.2}
                required
              />
            </div>
            <p className="text-xs text-gray-500 mt-1">Asking price: ${carPrice.toLocaleString()}</p>
          </div>

          <div>
            <Label htmlFor="message" className="text-sm font-medium">
              Message to Seller (Optional)
            </Label>
            <Textarea
              id="message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Tell the seller why you're interested..."
              className="mt-1 resize-none"
              rows={3}
            />
          </div>

          <Button
            type="submit"
            disabled={isSubmitting || !amount}
            className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
          >
            {isSubmitting ? "Submitting..." : "Make Offer"}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
