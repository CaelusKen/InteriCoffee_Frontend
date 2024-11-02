import { ApiResponse, PaginatedResponse } from "@/types/api";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

type QueryParams = Record<string, string | number | boolean | undefined>;

async function fetchAPI<T>(
  endpoint: string, 
  options: RequestInit = {}, 
  queryParams?: QueryParams
): Promise<ApiResponse<T>> {
  const defaultHeaders = {
    'Content-Type': 'application/json',
  };

  const url = new URL(`${API_URL}${endpoint}`);
  if (queryParams) {
    Object.entries(queryParams).forEach(([key, value]) => {
      if (value !== undefined) {
        url.searchParams.append(key, value.toString());
      }
    });
  }

  try {
    const res = await fetch(url.toString(), {
      ...options,
      headers: {
        ...defaultHeaders,
        ...options.headers,
      },
    });

    const responseData: ApiResponse<T> = await res.json();

    if (!res.ok) {
      throw new Error(`API error: ${responseData.status} ${responseData.message || res.statusText}`);
    }

    return responseData;
  } catch (error) {
    console.error('API request failed:', error);
    throw error;
  }
}

export const api = {
  get: <T>(endpoint: string, queryParams?: QueryParams) => 
    fetchAPI<T>(endpoint, { method: 'GET' }, queryParams),
  
  getById: <T>(endpoint: string, id: number | string) => 
    fetchAPI<T>(`${endpoint}/${id}`, { method: 'GET' }),
  
  post: <T>(endpoint: string, data: any, queryParams?: QueryParams) => 
    fetchAPI<T>(endpoint, { method: 'POST', body: JSON.stringify(data) }, queryParams),
  
  patch: <T>(endpoint: string, data: any, queryParams?: QueryParams) => 
    fetchAPI<T>(endpoint, { method: 'PATCH', body: JSON.stringify(data) }, queryParams),
  
  delete: <T>(endpoint: string, queryParams?: QueryParams) => 
    fetchAPI<T>(endpoint, { method: 'DELETE' }, queryParams),
  
  getPaginated: <T>(endpoint: string, queryParams?: QueryParams) => 
    fetchAPI<PaginatedResponse<T>>(endpoint, { method: 'GET' }, queryParams),
};