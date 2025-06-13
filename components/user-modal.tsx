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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { toast } from "@/hooks/use-toast"
import { Eye, Edit, Plus, Mail, Calendar, Car, ShoppingCart } from "lucide-react"

const formSchema = z.object({
  username: z.string().min(3, "Username must be at least 3 characters"),
  email: z.string().email("Invalid email address"),
  role: z.enum(["admin", "seller", "buyer", "support"]),
  password: z.string().min(6, "Password must be at least 6 characters").optional(),
})

interface UserModalProps {
  user?: any
  mode: "view" | "edit" | "create"
  children: React.ReactNode
}

export function UserModal({ user, mode, children }: UserModalProps) {
  const router = useRouter()
  const [isOpen, setIsOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: user?.username || "",
      email: user?.email || "",
      role: user?.role || "buyer",
      password: "",
    },
  })

  async function onSubmit(values: z.infer<typeof formSchema>) {
    if (mode === "view") return

    setIsSubmitting(true)

    try {
      const url = mode === "create" ? "/api/users" : `/api/users/${user.id}`
      const method = mode === "create" ? "POST" : "PUT"

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.message || `Failed to ${mode} user`)
      }

      toast({
        title: "Success",
        description: `User ${mode === "create" ? "created" : "updated"} successfully`,
      })

      setIsOpen(false)
      router.refresh()
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : `Failed to ${mode} user`,
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {mode === "view" ? (
              <Eye className="h-5 w-5" />
            ) : mode === "edit" ? (
              <Edit className="h-5 w-5" />
            ) : (
              <Plus className="h-5 w-5" />
            )}
            {mode === "view" ? "View User Details" : mode === "edit" ? "Edit User" : "Create New User"}
          </DialogTitle>
          <DialogDescription>
            {mode === "view"
              ? "View complete user information and statistics"
              : mode === "edit"
                ? "Update user information and role"
                : "Create a new user account"}
          </DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* User Stats (View Mode) */}
          {mode === "view" && user && (
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white text-xl font-bold">
                  {user.username.charAt(0).toUpperCase()}
                </div>
                <div>
                  <h3 className="text-xl font-bold">{user.username}</h3>
                  <Badge
                    className={
                      user.role === "admin"
                        ? "bg-purple-100 text-purple-800"
                        : user.role === "seller"
                          ? "bg-green-100 text-green-800"
                          : user.role === "buyer"
                            ? "bg-blue-100 text-blue-800"
                            : "bg-gray-100 text-gray-800"
                    }
                  >
                    {user.role}
                  </Badge>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="p-3 bg-blue-50 rounded-lg">
                  <div className="flex items-center gap-2 text-blue-600 mb-1">
                    <Car className="h-4 w-4" />
                    <span className="text-sm font-medium">Cars</span>
                  </div>
                  <div className="text-2xl font-bold text-blue-800">{user.car_count || 0}</div>
                </div>
                <div className="p-3 bg-green-50 rounded-lg">
                  <div className="flex items-center gap-2 text-green-600 mb-1">
                    <ShoppingCart className="h-4 w-4" />
                    <span className="text-sm font-medium">Offers</span>
                  </div>
                  <div className="text-2xl font-bold text-green-800">{user.offer_count || 0}</div>
                </div>
              </div>

              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4 text-gray-500" />
                  <span>{user.email}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-gray-500" />
                  <span>Joined {new Date(user.created_at).toLocaleDateString()}</span>
                </div>
                {user.total_revenue > 0 && (
                  <div className="flex items-center gap-2">
                    <span className="text-green-600 font-medium">Revenue: ${user.total_revenue.toLocaleString()}</span>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* User Form */}
          <div>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="username"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Username</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Enter username"
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
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input
                          type="email"
                          placeholder="Enter email"
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
                  name="role"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Role</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value} disabled={mode === "view"}>
                        <FormControl>
                          <SelectTrigger className="bg-white text-gray-900">
                            <SelectValue placeholder="Select role" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="admin">Admin</SelectItem>
                          <SelectItem value="seller">Seller</SelectItem>
                          <SelectItem value="buyer">Buyer</SelectItem>
                          <SelectItem value="support">Support</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {mode !== "view" && (
                  <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{mode === "create" ? "Password" : "New Password (optional)"}</FormLabel>
                        <FormControl>
                          <Input
                            type="password"
                            placeholder={mode === "create" ? "Enter password" : "Leave blank to keep current"}
                            {...field}
                            className="bg-white text-gray-900"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}

                {/* Action Buttons */}
                <div className="flex gap-3 pt-4">
                  {mode !== "view" && (
                    <Button type="submit" disabled={isSubmitting} className="flex-1">
                      {isSubmitting
                        ? mode === "create"
                          ? "Creating..."
                          : "Updating..."
                        : mode === "create"
                          ? "Create User"
                          : "Update User"}
                    </Button>
                  )}
                  <Button type="button" variant="outline" onClick={() => setIsOpen(false)} className="flex-1">
                    {mode === "view" ? "Close" : "Cancel"}
                  </Button>
                </div>
              </form>
            </Form>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
