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
import { Checkbox } from "@/components/ui/checkbox"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { storage } from "@/service/firebase"
import { ref, uploadBytes, getDownloadURL } from "firebase/storage"
import { Textarea } from "@/components/ui/textarea"

const fetchAccountByEmail = (
  email: string,
  accessToken: string
): Promise<ApiResponse<Account>> => {
  return api.get(`accounts/${email}/info`, undefined, accessToken)
}

const MAX_FILE_SIZE = 5000000
const ACCEPTED_IMAGE_TYPES = ["image/png"]
const ACCEPTED_PDF_TYPES = ["application/pdf"]

const formSchema = z.object({
  // Personal Information
  fullName: z.string().min(2, "Full name must be at least 2 characters"),
  phoneNumber: z.string().regex(/^\d{10}$/, "Phone number must be 10 digits"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  address: z.string().min(5, "Address must be at least 5 characters"),
  avatar: z
    .any()
    .refine((files) => files?.length == 1, "Image is required.")
    .refine((files) => files?.[0]?.size <= MAX_FILE_SIZE, `Max file size is 5MB.`)
    .refine(
      (files) => ACCEPTED_IMAGE_TYPES.includes(files?.[0]?.type),
      "Only .png files are accepted."
    ),

  // Business Information
  businessEmail: z.string().email("Invalid business email address"),
  businessDescription: z.string().min(10, "Business description must be at least 10 characters"),
  businessWebsite: z.string().url("Invalid website URL"),
  businessName: z.string().min(2, "Business name must be at least 2 characters"),
  logoUrl: z
    .any()
    .refine((files) => files?.length == 1, "Logo is required.")
    .refine((files) => files?.[0]?.size <= MAX_FILE_SIZE, `Max file size is 5MB.`)
    .refine(
      (files) => ACCEPTED_IMAGE_TYPES.includes(files?.[0]?.type),
      "Only .png files are accepted."
    ),
  businessLicense: z
    .any()
    .refine((files) => files?.length == 1, "Business license is required.")
    .refine((files) => files?.[0]?.size <= MAX_FILE_SIZE, `Max file size is 5MB.`)
    .refine(
      (files) => ACCEPTED_PDF_TYPES.includes(files?.[0]?.type),
      "Only .pdf files are accepted."
    ),

  // Terms Agreement
  agreeTerms: z.boolean().refine((value) => value === true, "You must agree to the terms"),
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
      fullName: account?.userName,
      phoneNumber: account?.phoneNumber,
      email: account?.email,
      password: "",
      address: account?.address,
      businessEmail: "",
      businessDescription: "",
      businessWebsite: "",
      businessName: "",
      agreeTerms: false,
    },
  })

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setIsSubmitting(true)
    try {
      // Upload business license to Firebase
      const businessfileName = `${values.fullName}-${new Date().toISOString()}-merchant-registration.pdf`
      const storageRef = ref(storage, `merchant-registration/${businessfileName}`)
      await uploadBytes(storageRef, values.businessLicense[0])
      const downloadURL = await getDownloadURL(storageRef)

      // Upload logo to Firebase
      const logoFileName = `${values.fullName}-${new Date().toISOString()}-merchant-logo.png`
      const logoStorageRef = ref(storage, `merchant-logos/${logoFileName}`)
      await uploadBytes(logoStorageRef, values.logoUrl[0])
      const logoDownloadURL = await getDownloadURL(logoStorageRef)

      const submitData = {
        email: values.email,
        address: values.address,
        "phone-number": values.phoneNumber,
        "merchant-name": values.businessName,
        "logo-url": logoDownloadURL,
        description: values.businessDescription,
        "policy-document": downloadURL,
        website: values.businessWebsite,
        status: "INACTIVE",
        "user-name": values.fullName,
        password: values.password,
        avatar: logoDownloadURL
      }

      const response = await api.post("auth/merchant/register", submitData, accessToken ?? "")
      
      if (response.data && response.status === 200) {
        toast({
          title: "Registration Submitted",
          description: "Your merchant registration has been submitted successfully.",
        })
        form.reset() // Reset the form after successful submission
      } else {
        throw new Error("Unexpected response from server")
      }
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
      <Card className="max-w-full mx-auto">
        <CardHeader>
          <CardTitle className="text-2xl font-bold">Merchant Registration</CardTitle>
          <CardDescription>Register as a merchant to start selling on our platform</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <div className="grid grid-cols-2 gap-10">
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Personal Information</h3>
                  <FormField
                    control={form.control}
                    name="fullName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Full Name</FormLabel>
                        <FormControl>
                          <Input placeholder="John Doe" {...field} />
                        </FormControl>
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
                          <Input placeholder="1234567890" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Password</FormLabel>
                        <FormControl>
                          <Input type="password" placeholder="Enter your password" {...field} />
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
                          <Input placeholder="john@example.com" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="address"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Address</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter your address" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
  
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Business Information</h3>
                  <div className="grid grid-cols-2 gap-8">
                    <FormField
                      control={form.control}
                      name="businessName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Business Name</FormLabel>
                          <FormControl>
                            <Input placeholder="Example Business LLC" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="businessEmail"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Business Email</FormLabel>
                          <FormControl>
                            <Input placeholder="business@example.com" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <FormField
                    control={form.control}
                    name="businessDescription"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Business Description</FormLabel>
                        <FormControl>
                          <Textarea {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="businessWebsite"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Business Website</FormLabel>
                        <FormControl>
                          <Input placeholder="https://www.example.com" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="businessLicense"
                    render={({ field: { onChange, value, ...field } }) => (
                      <FormItem>
                        <FormLabel>Business License (PDF)</FormLabel>
                        <FormControl>
                          <Input
                            type="file"
                            accept=".pdf"
                            onChange={(e) => onChange(e.target.files?.[0])}
                            {...field}
                          />
                        </FormControl>
                        <FormDescription>
                          Please upload your "Giấy Phép Kinh Doanh" in PDF format (max 5MB)
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="logoUrl"
                    render={({ field: { onChange, value, ...field } }) => (
                      <FormItem>
                        <FormLabel>Logo (PNG)</FormLabel>
                        <FormControl>
                          <Input
                            type="file"
                            accept=".png"
                            onChange={(e) => onChange(e.target.files?.[0])}
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                        <FormDescription>
                          Please upload your logo in PNG format (max 5MB)
                        </FormDescription>
                      </FormItem>
                      )}
                    />
                </div>
              </div>

              <FormField
                control={form.control}
                name="agreeTerms"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel>
                        I agree to the Terms of Service and Policies
                      </FormLabel>
                      <FormDescription>
                        By checking this box, you agree to our{" "}
                        <a href="#" className="text-primary underline">
                          Terms of Service
                        </a>{" "}
                        and{" "}
                        <a href="#" className="text-primary underline">
                          Privacy Policy
                        </a>
                        .
                      </FormDescription>
                    </div>
                  </FormItem>
                )}
              />

              <Button type="submit" className="w-full" disabled={isSubmitting}>
                {isSubmitting ? "Submitting..." : "Submit Registration"}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </section>
  )
}