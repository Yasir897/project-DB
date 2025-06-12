"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { z } from "zod"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "@/hooks/use-toast"

const formSchema = z.object({
  amount: z.coerce.number().positive("Amount must be positive"),
  message: z.string().optional(),
})

interface MakeOfferFormProps {
  carId: number
  buyerId: number
  carPrice: number
}

export function MakeOfferForm({ carId, buyerId, carPrice }: MakeOfferFormProps) {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      amount: carPrice,
      message: "",
    },
  })

  async function onSubmit(values: z.infer<typeof formSchema>) {
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
          amount: values.amount,
          message: values.message,
        }),
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.message || "Failed to submit offer")
      }

      toast({
        title: "Offer submitted",
        description: "Your offer has been sent to the seller.",
      })

      router.refresh()
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to submit offer",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <h3 className="font-bold mb-2">Make an Offer</h3>

        <FormField
          control={form.control}
          name="amount"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Your Offer ($)</FormLabel>
              <FormControl>
                <Input type="number" {...field} className="bg-white" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="message"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Message (Optional)</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Include any additional information for the seller"
                  className="bg-white resize-none h-24"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" disabled={isSubmitting} className="w-full">
          {isSubmitting ? "Submitting..." : "Submit Offer"}
        </Button>
      </form>
    </Form>
  )
}
