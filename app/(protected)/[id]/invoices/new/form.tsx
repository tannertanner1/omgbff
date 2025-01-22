"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { IconLoader } from "@tabler/icons-react"

import { invoiceSchema } from "./schema"
import { createInvoice } from "./actions"

export function InvoiceForm({ userId, customers }: { userId: string; customers: { id: string; name: string }[] }) {
  const router = useRouter()
  const [isPending, setPending] = useState(false)

  const form = useForm({
    resolver: zodResolver(invoiceSchema),
    defaultValues: {
      customerId: "",
      amount: "",
      description: "",
    },
  })

  async function onSubmit(data: { customerId: string; amount: string; description: string }) {
    setPending(true)
    try {
      const formData = new FormData()
      formData.append("customerId", data.customerId)
      formData.append("amount", data.amount)
      formData.append("description", data.description)
      const result = await createInvoice(userId, null, formData)
      if (result.success) {
        router.refresh()
        router.push(`/${userId}/invoices`)
      } else {
        // Handle error
        console.error(result.message)
      }
    } catch (error) {
      console.error("Failed to create invoice:", error)
    } finally {
      setPending(false)
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="customerId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Customer</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a customer" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {customers.map((customer) => (
                    <SelectItem key={customer.id} value={customer.id}>
                      {customer.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormDescription>Select the customer for this invoice</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="amount"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Amount</FormLabel>
              <FormControl>
                <Input type="number" step="0.01" placeholder="100.00" {...field} />
              </FormControl>
              <FormDescription>Enter the invoice amount in dollars</FormDescription>
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
                <Textarea placeholder="Invoice for services rendered" {...field} />
              </FormControl>
              <FormDescription>Provide a brief description of the invoice</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" className="w-full" disabled={isPending}>
          {isPending ? <IconLoader className="mr-2 h-4 w-4 animate-spin" /> : "Create Invoice"}
        </Button>
      </form>
    </Form>
  )
}

