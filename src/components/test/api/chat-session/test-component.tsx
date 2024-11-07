'use client'

import { useState } from "react"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { ChatSession } from "@/types/frontend/entities"
import { ApiResponse, PaginatedResponse } from "@/types/api"
import { api } from "@/service/api"
import LoadingPage from "@/components/custom/loading/loading"

// API functions
const fetchChatSessions = async (
  page = 1,
  pageSize = 10
): Promise<ApiResponse<PaginatedResponse<ChatSession>>> => {
  return api.getPaginated<ChatSession>("chat-sessions", { page, pageSize })
}

const fetchChatSessionById = async (id: string): Promise<ApiResponse<ChatSession>> => {
  return api.getById<ChatSession>("chat-sessions", id)
}

const createChatSession = async (
  chatSession: Omit<ChatSession, "id" | "createdDate" | "updatedDate" | "messages">
): Promise<ApiResponse<ChatSession>> => {
  return api.post<ChatSession>("chat-sessions", chatSession)
}

const updateChatSession = async (
  chatSession: ChatSession
): Promise<ApiResponse<ChatSession>> => {
  return api.patch<ChatSession>(`chat-sessions/${chatSession.id}`, chatSession)
}

const deleteChatSession = async (id: string): Promise<ApiResponse<ChatSession>> => {
  return api.delete<ChatSession>(`chat-sessions/${id}`)
}

export default function ChatSessionManagement() {
  const [page, setPage] = useState(1)
  const [selectedChatSessionId, setSelectedChatSessionId] = useState<string | null>(null)
  const queryClient = useQueryClient()

  // Queries
  const chatSessionsQuery = useQuery({
    queryKey: ["chatSessions", page],
    queryFn: () => fetchChatSessions(page),
  })

  const chatSessions = chatSessionsQuery.data?.data?.items ?? []
  const totalCount = chatSessionsQuery.data?.data?.totalCount ?? 0
  const pageSize = chatSessionsQuery.data?.data?.pageSize ?? 10

  const selectedChatSessionQuery = useQuery({
    queryKey: ["chatSession", selectedChatSessionId],
    queryFn: () =>
      selectedChatSessionId ? fetchChatSessionById(selectedChatSessionId) : null,
    enabled: !!selectedChatSessionId,
  })

  // Mutations
  const createChatSessionMutation = useMutation({
    mutationFn: createChatSession,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["chatSessions"] })
    },
  })

  const updateChatSessionMutation = useMutation({
    mutationFn: updateChatSession,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["chatSessions"] })
      queryClient.invalidateQueries({
        queryKey: ["chatSession", selectedChatSessionId],
      })
    },
  })

  const deleteChatSessionMutation = useMutation({
    mutationFn: deleteChatSession,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["chatSessions"] })
      setSelectedChatSessionId(null)
    },
  })

  // Event handlers
  const handleCreateChatSession = () => {
    const newChatSession = {
      customerId: "customer123",
      advisorId: "advisor456",
    }
    createChatSessionMutation.mutate(newChatSession)
  }

  const handleUpdateChatSession = () => {
    if (selectedChatSessionId && selectedChatSessionQuery.data) {
      const updatedChatSession = {
        ...selectedChatSessionQuery.data.data,
        // Add any updates here
      }
      updateChatSessionMutation.mutate(updatedChatSession)
    }
  }

  const handleDeleteChatSession = () => {
    if (selectedChatSessionId) {
      deleteChatSessionMutation.mutate(selectedChatSessionId)
    }
  }

  if (chatSessionsQuery.isLoading) return <LoadingPage />
  if (chatSessionsQuery.isError) return <div>Error loading chat sessions</div>

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Chat Session Management</h1>

      {/* Chat Session List */}
      <div className="mb-4">
        <h2 className="text-xl font-semibold mb-2">Chat Sessions</h2>
        {chatSessions.length === 0 ? (
          <p>No chat sessions found.</p>
        ) : (
          <ul className="space-y-2">
            {chatSessions.map((chatSession) => (
              <li
                key={chatSession.id}
                className={`cursor-pointer ${
                  selectedChatSessionId === chatSession.id ? "font-bold" : ""
                }`}
                onClick={() => setSelectedChatSessionId(chatSession.id)}
              >
                Session {chatSession.id} (Customer: {chatSession.customerId}, Advisor: {chatSession.advisorId})
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
            disabled={chatSessions.length < pageSize}
            className="px-2 py-1 bg-gray-200 rounded"
          >
            Next
          </button>
        </div>
      </div>

      {/* Selected Chat Session Details */}
      {selectedChatSessionId && selectedChatSessionQuery.data && (
        <div className="mb-4">
          <h2 className="text-xl font-semibold mb-2">Selected Chat Session Details</h2>
          <div className="bg-black p-4 rounded-lg">
            <p><strong>ID:</strong> {selectedChatSessionQuery.data.data.id}</p>
            <p><strong>Customer ID:</strong> {selectedChatSessionQuery.data.data.customerId}</p>
            <p><strong>Advisor ID:</strong> {selectedChatSessionQuery.data.data.advisorId}</p>
            <p><strong>Created Date:</strong> {selectedChatSessionQuery.data.data.createdDate.toLocaleString()}</p>
            <p><strong>Updated Date:</strong> {selectedChatSessionQuery.data.data.updatedDate.toLocaleString()}</p>
            <p><strong>Messages:</strong> {selectedChatSessionQuery.data.data.messages.length}</p>
          </div>
        </div>
      )}

      {/* CRUD Operations */}
      <div className="space-x-2">
        <button
          onClick={handleCreateChatSession}
          className="px-4 py-2 bg-green-500 text-white rounded"
        >
          Create Chat Session
        </button>
        <button
          onClick={handleUpdateChatSession}
          disabled={!selectedChatSessionId}
          className="px-4 py-2 bg-blue-500 text-white rounded disabled:opacity-50"
        >
          Update Selected Chat Session
        </button>
        <button
          onClick={handleDeleteChatSession}
          disabled={!selectedChatSessionId}
          className="px-4 py-2 bg-red-500 text-white rounded disabled:opacity-50"
        >
          Delete Selected Chat Session
        </button>
      </div>
    </div>
  )
}