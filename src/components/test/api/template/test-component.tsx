'use client'

import { useState } from "react"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { Template } from "@/types/frontend/entities"
import { ApiResponse, PaginatedResponse } from "@/types/api"
import { api } from "@/service/api"
import LoadingPage from "@/components/custom/loading/loading"

// API functions
const fetchTemplates = async (
  page = 1,
  pageSize = 10
): Promise<ApiResponse<PaginatedResponse<Template>>> => {
  return api.getPaginated<Template>("templates", { page, pageSize })
}

const fetchTemplateById = async (id: string): Promise<ApiResponse<Template>> => {
  return api.getById<Template>("templates", id)
}

const createTemplate = async (
  template: Omit<Template, "id" | "createdDate" | "updatedDate">
): Promise<ApiResponse<Template>> => {
  return api.post<Template>("templates", template)
}

const updateTemplate = async (
  template: Template
): Promise<ApiResponse<Template>> => {
  return api.patch<Template>(`templates/${template.id}`, template)
}

const deleteTemplate = async (id: string): Promise<ApiResponse<Template>> => {
  return api.delete<Template>(`templates/${id}`)
}

export default function TemplateManagement() {
  const [page, setPage] = useState(1)
  const [selectedTemplateId, setSelectedTemplateId] = useState<string | null>(null)
  const queryClient = useQueryClient()

  // Queries
  const templatesQuery = useQuery({
    queryKey: ["templates", page],
    queryFn: () => fetchTemplates(page),
  })

  const templates = templatesQuery.data?.data?.items ?? []
  const totalCount = templatesQuery.data?.data?.totalCount ?? 0
  const pageSize = templatesQuery.data?.data?.pageSize ?? 10

  const selectedTemplateQuery = useQuery({
    queryKey: ["template", selectedTemplateId],
    queryFn: () =>
      selectedTemplateId ? fetchTemplateById(selectedTemplateId) : null,
    enabled: !!selectedTemplateId,
  })

  // Mutations
  const createTemplateMutation = useMutation({
    mutationFn: createTemplate,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["templates"] })
    },
  })

  const updateTemplateMutation = useMutation({
    mutationFn: updateTemplate,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["templates"] })
      queryClient.invalidateQueries({
        queryKey: ["template", selectedTemplateId],
      })
    },
  })

  const deleteTemplateMutation = useMutation({
    mutationFn: deleteTemplate,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["templates"] })
      setSelectedTemplateId(null)
    },
  })

  // Event handlers
  const handleCreateTemplate = () => {
    const newTemplate = {
      name: "New Template",
      description: "A new template description",
      imageUrl: "https://example.com/template-image.jpg",
      status: "ACTIVE",
      type: "ROOM",
      floors: [
        {
          id: "123",
          name: "Ground Floor",
          products: [
            {
              id: "abc",
              _id: "a1b2c3",
              name: "Living Room", 
              position: {
                x: 2,
                y: 3,
                z: 4
              },
              scale: {
                x: 1,
                y: 1,
                z: 1
              },
              rotation: {
                x: 0,
                y: 0,
                z: 0,
              }
            },
          ],
          nonProducts: []
        },
      ],
      categories: ["A", "B", "C"],
      accountId: "abc",
      merchantId: "",
      styleId: "abc",
    }
    createTemplateMutation.mutate(newTemplate)
  }

  const handleUpdateTemplate = () => {
    if (selectedTemplateId && selectedTemplateQuery.data) {
      const updatedTemplate = {
        ...selectedTemplateQuery.data.data,
        name: `${selectedTemplateQuery.data.data.name} (Updated)`,
        description: `${selectedTemplateQuery.data.data.description} (Updated)`,
      }
      updateTemplateMutation.mutate(updatedTemplate)
    }
  }

  const handleDeleteTemplate = () => {
    if (selectedTemplateId) {
      deleteTemplateMutation.mutate(selectedTemplateId)
    }
  }

  if (templatesQuery.isLoading) return <LoadingPage />
  if (templatesQuery.isError) return <div>Error loading templates</div>

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Template Management</h1>

      {/* Template List */}
      <div className="mb-4">
        <h2 className="text-xl font-semibold mb-2">Templates</h2>
        {templates.length === 0 ? (
          <p>No templates found.</p>
        ) : (
          <ul className="space-y-2">
            {templates.map((template) => (
              <li
                key={template.id}
                className={`cursor-pointer ${
                  selectedTemplateId === template.id ? "font-bold" : ""
                }`}
                onClick={() => setSelectedTemplateId(template.id)}
              >
                {template.name} - {template.type} ({template.status})
              </li>
            ))}
          </ul>
        )}
        <div className="mt-2">
          <button
            onClick={() => setPage((old) => Math.max(old - 1, 1))}
            disabled={page === 1}
            className="mr-2 px-2 py-1 bg-gray-200 rounded"
          >
            Previous
          </button>
          <button
            onClick={() => setPage((old) => old + 1)}
            disabled={templates.length < pageSize}
            className="px-2 py-1 bg-gray-200 rounded"
          >
            Next
          </button>
        </div>
      </div>

      {/* Selected Template Details */}
      {selectedTemplateId && selectedTemplateQuery.data && (
        <div className="mb-4">
          <h2 className="text-xl font-semibold mb-2">Selected Template Details</h2>
          <div className="bg-black p-4 rounded-lg">
            <p><strong>ID:</strong> {selectedTemplateQuery.data.data.id}</p>
            <p><strong>Name:</strong> {selectedTemplateQuery.data.data.name}</p>
            <p><strong>Description:</strong> {selectedTemplateQuery.data.data.description}</p>
            <p><strong>Status:</strong> {selectedTemplateQuery.data.data.status}</p>
            <p><strong>Type:</strong> {selectedTemplateQuery.data.data.type}</p>
            <p><strong>Floors:</strong> {selectedTemplateQuery.data.data.floors.length}</p>
            <p><strong>Created Date:</strong> {new Date(selectedTemplateQuery.data.data.createdDate).toLocaleString()}</p>
            <p><strong>Updated Date:</strong> {new Date(selectedTemplateQuery.data.data.updatedDate).toLocaleString()}</p>
          </div>
        </div>
      )}

      {/* CRUD Operations */}
      <div className="space-x-2">
        <button
          onClick={handleCreateTemplate}
          className="px-4 py-2 bg-green-500 text-white rounded"
        >
          Create Template
        </button>
        <button
          onClick={handleUpdateTemplate}
          disabled={!selectedTemplateId}
          className="px-4 py-2 bg-blue-500 text-white rounded disabled:opacity-50"
        >
          Update Selected Template
        </button>
        <button
          onClick={handleDeleteTemplate}
          disabled={!selectedTemplateId}
          className="px-4 py-2 bg-red-500 text-white rounded disabled:opacity-50"
        >
          Delete Selected Template
        </button>
      </div>
    </div>
  )
}