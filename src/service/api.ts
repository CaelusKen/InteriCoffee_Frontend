import { ApiResponse, PaginatedResponse } from "@/types/api";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

async function fetchAPI<T>(endpoint: string, options: RequestInit = {}): Promise<ApiResponse<T>> {
  const defaultHeaders = {
    'Content-Type': 'application/json',
  };

  const res = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers: {
      ...defaultHeaders,
      ...options.headers,
    },
  });

  if (!res.ok) {
    throw new Error(`API error: ${res.status} ${res.statusText}`);
  }

  return res.json();
}

export const api = {
  get: <T>(endpoint: string) => fetchAPI<T>(endpoint),
  post: <T>(endpoint: string, data: any) => fetchAPI<T>(endpoint, { method: 'POST', body: JSON.stringify(data) }),
  put: <T>(endpoint: string, data: any) => fetchAPI<T>(endpoint, { method: 'PUT', body: JSON.stringify(data) }),
  delete: <T>(endpoint: string) => fetchAPI<T>(endpoint, { method: 'DELETE' }),
  getPaginated: <T>(endpoint: string) => fetchAPI<PaginatedResponse<T>>(endpoint),
};