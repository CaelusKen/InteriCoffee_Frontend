'use client'

import React, { useState, useEffect } from "react"
import { api } from "@/service/api"
import { ApiResponse, PaginatedResponse } from "@/types/api"
import { Template, Product } from "@/types/frontend/entities"
import { useQuery } from "@tanstack/react-query"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { ChevronLeft, ChevronRight } from 'lucide-react'

const fetchTemplates = async (page: number, pageSize: number): Promise<ApiResponse<PaginatedResponse<Template>>> => {
  return api.getPaginated<Template>("templates", { page, pageSize })
}

const SimulationSetupForm = () => {
  const [step, setStep] = useState(1)
  const [startOption, setStartOption] = useState("")
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null)
  const [sketchProductIds, setSketchProductIds] = useState<string[]>([])

  const router = useRouter()

  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(8)

  const templatesQuery = useQuery({
    queryKey: ["templates", page, pageSize],
    queryFn: () => fetchTemplates(page, pageSize),
    staleTime: 60 * 1000,
    refetchInterval: 60 * 1000,
  })

  const templates = templatesQuery.data?.data.items ?? []
  const totalPages = Math.ceil((templatesQuery.data?.data.items.length ?? 0) / pageSize)

  const handlePreviousPage = () => setPage((prev) => Math.max(prev - 1, 1))
  const handleNextPage = () => setPage((prev) => Math.min(prev + 1, totalPages))

  const handleStartOptionSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (startOption === "template") {
      setStep(2)
    } else if (startOption === "scratch") {
      router.push("/simulation")
    } else if (startOption === "load") {
      // Add logic to load existing design
      const designId = "your-design-id" // Replace with actual design ID
      router.push(`/simulation?designId=${designId}`)
    }
  }

  const handleTemplateSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (selectedTemplate) {
      router.push(`/simulation?templateId=${selectedTemplate}`)
    }
  }

  const checkAndStoreSketchProducts = (template: Template) => {
    if (template.styleId === "Sketch") {
      const productIds = template.products.map((product) => product.id)
      setSketchProductIds(productIds)
    } else {
      setSketchProductIds([])
    }
  }

  useEffect(() => {
    if (selectedTemplate) {
      const template = templates.find((t) => t.id === selectedTemplate)
      if (template) {
        checkAndStoreSketchProducts(template)
      }
    }
  }, [selectedTemplate, templates])

  return (
    <div className="w-full h-screen my-auto mx-auto p-4">
      {step === 1 && (
        <Card className="w-full max-w-md mx-auto">
          <CardHeader>
            <CardTitle>Start Your Project</CardTitle>
            <CardDescription>Choose how you want to begin your project</CardDescription>
          </CardHeader>
          <form onSubmit={handleStartOptionSubmit}>
            <CardContent>
              <RadioGroup value={startOption} onValueChange={setStartOption} className="space-y-4">
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="scratch" id="scratch" />
                  <Label htmlFor="scratch">Start from scratch</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="template" id="template" />
                  <Label htmlFor="template">Start from a template</Label>
                </div>
              </RadioGroup>
            </CardContent>
            <CardFooter>
              <Button type="submit" disabled={!startOption}>Continue</Button>
            </CardFooter>
          </form>
        </Card>
      )}

      {step === 2 && (
        <Card className="w-full max-w-4xl mx-auto">
          <CardHeader>
            <CardTitle>Choose a Template</CardTitle>
            <CardDescription>Select a template to start your project</CardDescription>
          </CardHeader>
          <form onSubmit={handleTemplateSubmit}>
            <CardContent>
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
                {templates.map((template) => (
                  <div
                    key={template.id}
                    className={`cursor-pointer border rounded-lg p-2 ${
                      selectedTemplate === template.id
                        ? "border-primary dark:border-primary"
                        : "border-gray-200 dark:border-gray-700"
                    }`}
                    onClick={() => setSelectedTemplate(template.id)}
                  >
                    <img
                      src={template.imageUrl}
                      alt={template.name}
                      className="w-full h-32 object-cover mb-2 rounded"
                    />
                    <p className="text-center text-sm font-medium dark:text-gray-200">{template.name}</p>
                  </div>
                ))}
              </div>
              <div className="flex justify-center items-center mt-4 space-x-2">
                <Button
                  variant="outline"
                  onClick={handlePreviousPage}
                  disabled={page === 1}
                  className="dark:bg-gray-800 dark:text-gray-200"
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <span className="dark:text-gray-200">
                  Page {page} of {totalPages}
                </span>
                <Button
                  variant="outline"
                  onClick={handleNextPage}
                  disabled={page === totalPages}
                  className="dark:bg-gray-800 dark:text-gray-200"
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline" onClick={() => setStep(1)} className="dark:bg-gray-800 dark:text-gray-200">
                Back
              </Button>
              <Button type="submit" disabled={!selectedTemplate}>
                Use Template
              </Button>
            </CardFooter>
          </form>
        </Card>
      )}
    </div>
  )
}

export default SimulationSetupForm