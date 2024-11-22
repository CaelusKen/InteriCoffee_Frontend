"use client"

import { useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { useToast } from "@/hooks/use-toast"
import { ApiResponse } from "@/types/api"
import { Account } from "@/types/frontend/entities"
import { api } from "@/service/api"
import { useAccessToken } from "@/hooks/use-access-token"
import { useQuery } from "@tanstack/react-query"
import { useSession } from "next-auth/react"
import { mapBackendToFrontend } from "@/lib/entity-handling/handler"

const fetchAccountByEmail = (
  email: string,
  accessToken: string
): Promise<ApiResponse<Account>> => {
  return api.get(`accounts/${email}/info`, undefined, accessToken)
}

const formSchema = z.object({
  fullName: z.string().min(2, {
    message: "Full name must be at least 2 characters.",
  }),
  email: z.string().email({
    message: "Please enter a valid email address.",
  }),
  phoneNumber: z.string().min(10, {
    message: "Phone number must be at least 10 digits.",
  }),
  website: z.string().url({
    message: "Please enter a valid website URL.",
  }),
  businessLicense: z
    .any()
    .refine((file) => file instanceof File, "Please upload a file.")
    .refine((file) => file.size <= 5000000, "Max file size is 5MB.")
    .refine(
      (file) => ["application/pdf"].includes(file.type),
      "Only PDF files are allowed."
    ),
})

export default function MerchantRegistrationForm() {
  const { data: session } = useSession()
  const accessToken = useAccessToken()
  const { toast } = useToast()

  const accountQuery = useQuery({
    queryKey: ["accountByEmail", session?.user?.email],
    queryFn: () =>
      fetchAccountByEmail(session?.user?.email ?? "", accessToken ?? ""),
    enabled: !!session?.user?.email && !!accessToken,
  })

  const account = accountQuery.data?.data
    ? mapBackendToFrontend<Account>(accountQuery.data.data, "account")
    : undefined

  const [isSubmitting, setIsSubmitting] = useState(false)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      fullName: account?.userName ?? "",
      email: account?.email ?? "",
      phoneNumber: account?.phoneNumber ?? "",
      website: "",
      businessLicense: undefined,
    },
  })

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsSubmitting(true)
    try {
      // TODO: Replace with actual API call
      await new Promise((resolve) => setTimeout(resolve, 2000))
      console.log(values)
      toast({
        title: "Registration submitted",
        description: "Your merchant registration has been submitted for review.",
      })
    } catch (error) {
      console.error("Error submitting form:", error)
      toast({
        title: "Error",
        description: "There was an error submitting your registration. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <section className="p-10">
      <h1 className="my-4 text-4xl font-semibold">Merchant Registration</h1>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="w-full">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <FormField
              control={form.control}
              name="fullName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Full Name</FormLabel>
                  <FormControl>
                    <Input placeholder="John Doe" {...field} />
                  </FormControl>
                  <FormDescription>
                    Enter your full name as it appears on official documents.
                  </FormDescription>
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
                    <Input placeholder="john@example.com" {...field} />
                  </FormControl>
                  <FormDescription>
                    This email will be used for all communications.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="phoneNumber"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Phone Number</FormLabel>
                  <FormControl>
                    <Input placeholder="+1234567890" {...field} />
                  </FormControl>
                  <FormDescription>
                    Enter a valid phone number including country code.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="website"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Website</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="https://www.yourfurniturestore.com"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    Enter the full URL of your furniture store website.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="businessLicense"
              render={({ field: { onChange, value, ...field } }) => (
                <FormItem>
                  <FormLabel>Business License (Giấy phép kinh doanh)</FormLabel>
                  <FormControl>
                    <Input
                      type="file"
                      accept=".pdf"
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                        const file = e.target.files?.[0]
                        onChange(file)
                      }}
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    Upload your business license in PDF format (max 5MB).
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div className="mt-8">
            <Button
              type="submit"
              disabled={isSubmitting}
              className="w-full md:w-auto"
            >
              {isSubmitting ? "Submitting..." : "Submit Registration"}
            </Button>
          </div>
        </form>
      </Form>
    </section>
  )
}