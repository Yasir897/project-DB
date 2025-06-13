"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/hooks/use-toast"

interface MakeOfferFormProps {
  carId: number
  buyerId: number
  carPrice: number
}

export function MakeOfferForm({ carId, buyerId, carPrice }: MakeOfferFormProps) {
  const [amount, setAmount] = useState("")
  const [message, setMessage] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()
  const { toast } = useToast()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

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

      if (!response.ok) {
        throw new Error(data.message || "Failed to submit offer")
      }

      toast({
        title: "Offer Submitted Successfully!",
        description: `Your offer of $${Number.parseFloat(amount).toLocaleString()} has been sent to the seller.`,
        variant: "default",
      })

      // Reset form
      setAmount("")
      setMessage("")

      // Refresh the page to show the new offer status
      router.refresh()
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to submit offer",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card className="border-0 shadow-lg">
      <CardHeader>
        <CardTitle className="text-lg font-bold">Make an Offer</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="amount">Offer Amount ($)</Label>
            <Input
              id="amount"
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder={`Max: ${carPrice.toLocaleString()}`}
              min="1"
              max={carPrice}
              required
              className="mt-1"
            />
            <p className="text-xs text-gray-500 mt-1">Listed price: ${carPrice.toLocaleString()}</p>
          </div>

          <div>
            <Label htmlFor="message">Message to Seller (Optional)</Label>
            <Textarea
              id="message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Add a personal message to increase your chances..."
              rows={3}
              className="mt-1"
            />
          </div>

          <Button
            type="submit"
            disabled={isLoading || !amount}
            className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
          >
            {isLoading ? "Submitting..." : "Submit Offer"}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
