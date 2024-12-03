import { ApiResponse, PaginatedResponse } from "@/types/api";
import { mapBackendListToFrontend, mapBackendToFrontend } from "@/lib/entity-handling/handler";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

type QueryParams = Record<string, string | number | boolean | undefined>;

async function fetchAPI<T>(
  endpoint: string, 
  options: RequestInit = {}, 
  queryParams?: QueryParams,
  accessToken?: string
): Promise<ApiResponse<T>> {
  if (!API_URL) {
    throw new Error('API_URL is not defined');
  }

  const defaultHeaders: HeadersInit = {
    'Content-Type': 'application/json',
  };

  if (accessToken) {
    defaultHeaders['Authorization'] = `Bearer ${accessToken}`;
  }

  // Build URL with query parameters
  const url = new URL(`${API_URL}/${endpoint.replace(/^\//, '')}`);
  if (queryParams) {
    Object.entries(queryParams).forEach(([key, value]) => {
      if (value !== undefined) {
        // Convert camelCase to kebab-case
        const formattedKey = key.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase();
        url.searchParams.append(formattedKey, value.toString());
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

    const responseData = await res.json();

    if (!res.ok) {
      throw new Error(`API error: ${res.status} ${responseData.message || res.statusText}`);
    }

    return {
      data: responseData,
      status: res.status,
      message: responseData.message
    };
  } catch (error) {
    console.error('API request failed:', error);
    throw error;
  }
}

export const api = {
  get: async <T>(endpoint: string, queryParams?: QueryParams, accessToken?: string): Promise<ApiResponse<T>> => {
    try {
      const response = await fetchAPI<T>(endpoint, { method: 'GET' }, queryParams, accessToken);
      return response;
    } catch (error) {
      console.error('Error in get:', error);
      throw error;
    }
  },

  getPaginated: async <T>(endpoint: string, queryParams?: QueryParams, accessToken?: string): Promise<ApiResponse<PaginatedResponse<T>>> => {
    try {
      const formattedQueryParams = {
        'page-no': queryParams?.page,
        'page-size': queryParams?.pageSize,
      };

      const response = await fetchAPI<any>(endpoint, { method: 'GET' }, formattedQueryParams, accessToken);

      if (!response.data) {
        console.error('Response data is undefined:', response);
        throw new Error('API response data is undefined');
      }

      const entityType = endpoint.endsWith('s') ? endpoint.slice(0, -1) : endpoint;
      
      const mappedData = mapBackendListToFrontend<T>(response.data, entityType);

      return {
        data: mappedData,
        status: response.status,
        message: response.message
      };
    } catch (error) {
      console.error('Error in getPaginated:', error);
      return {
        data: {
          items: [],
          totalCount: 0,
          pageNumber: Number(queryParams?.page) || 1,
          pageSize: Number(queryParams?.pageSize) || 10
        },
        status: 500,
        message: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  },

  getById: async <T>(endpoint: string, id: string | number, accessToken?: string): Promise<ApiResponse<T>> => {
    try {
      const response = await fetchAPI<T>(`${endpoint}/${id}`, { method: 'GET' }, undefined, accessToken);
      const entityType = endpoint.endsWith('s') ? endpoint.slice(0, -1) : endpoint;
      response.data = mapBackendToFrontend<T>(response.data, entityType);
      return response;
    } catch (error) {
      console.error('Error in getById:', error);
      throw error;
    }
  },

  post: async <T>(endpoint: string, data: any, accessToken?: string): Promise<ApiResponse<T>> => {
    try {
      const response = await fetchAPI<T>(endpoint, {
        method: 'POST',
        body: JSON.stringify(data)
      }, undefined, accessToken);
      return response;
    } catch (error) {
      console.error('Error in post:', error);
      throw error;
    }
  },

  patch: async <T>(endpoint: string, data: any, options?: { onRequestStart?: (config: any) => void }, accessToken?: string): Promise<ApiResponse<T>> => {
    try {
      if (options?.onRequestStart) {
        options.onRequestStart({ data });
      }

      const response = await fetchAPI<T>(endpoint, {
        method: 'PATCH',
        body: JSON.stringify(data),
      }, undefined, accessToken);
      return response;
    } catch (error) {
      console.error('Error in patch:', error);
      throw error;
    }
  },

  delete: async <T>(endpoint: string, accessToken?: string): Promise<ApiResponse<T>> => {
    try {
      const response = await fetchAPI<T>(endpoint, { method: 'DELETE' }, undefined, accessToken);
      return response;
    } catch (error) {
      console.error('Error in delete:', error);
      throw error;
    }
  }
};