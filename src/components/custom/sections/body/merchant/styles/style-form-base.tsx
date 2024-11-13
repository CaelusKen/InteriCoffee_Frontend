'use client'

import React, { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Style } from "@/types/frontend/entities"
import { useToast } from "@/hooks/use-toast"
import { Button } from "@/components/ui/button"
import { Loader2 } from 'lucide-react'
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"

export interface StyleFormData {
    name: string
    description: string
  }
  
interface StyleFormBaseProps {
    initialData?: Style
    onSubmit: (formData: StyleFormData) => Promise<void>
    submitButtonText: string
}

export default function StyleFormBase({
    initialData,
    onSubmit,
    submitButtonText,
  }: StyleFormBaseProps) {
    const [formData, setFormData] = useState<StyleFormData>({
      name: "",
      description: "",
    })
    const { toast } = useToast()
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [isSuccess, setIsSuccess] = useState(false)
    const router = useRouter()
  
    useEffect(() => {
      if (initialData) {
        setFormData({
          name: initialData.name || "",
          description: initialData.description || "",
        })
      }
    }, [initialData])
  
    const handleChange = (
      e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
      const { name, value } = e.target
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }))
    }
  
    const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault()
      setIsSubmitting(true)
      try {
        await onSubmit(formData)
        setIsSuccess(true)
        toast({
          title: "Success!",
          description: "Style submitted successfully.",
        })
        setTimeout(() => {
          router.push("/merchant/styles")
        }, 2000)
      } catch (error) {
        console.error("Error submitting style:", error)
        toast({
          title: "Error",
          description:
            "An error occurred while submitting the product category. Please try again.",
          variant: "destructive",
        })
      } finally {
        setIsSubmitting(false)
      }
    }
  
    return (
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <Label htmlFor="name">Style Name</Label>
          <Input
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <Label htmlFor="description">Style Description</Label>
          <Textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            required
          />
        </div>
        <Button
          type="submit"
          disabled={isSubmitting || isSuccess}
          className="w-40"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Submitting...
            </>
          ) : isSuccess ? (
            "Redirecting..."
          ) : (
            submitButtonText
          )}
        </Button>
      </form>
    )
  }