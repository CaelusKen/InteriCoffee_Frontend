import { NextRequest, NextResponse } from "next/server";
import { api } from "@/service/api";
import { ApiResponse, PaginatedResponse } from "@/types/api";

export interface EntityHandlers<T> {
  getAll: (request: NextRequest) => Promise<NextResponse>;
  getById: (request: NextRequest, { params }: { params: { id: string } }) => Promise<NextResponse>;
  create: (request: NextRequest) => Promise<NextResponse>;
  update: (request: NextRequest, { params }: { params: { id: string } }) => Promise<NextResponse>;
  delete: (request: NextRequest, { params }: { params: { id: string } }) => Promise<NextResponse>;
}

/**
 * Create API Handlers for each entity, act as a template for the all entities
 * @param entityName - This will be the endpoint, representing the entity 
 * @returns 
 */
export function createEntityHandlers<T>(entityName: string): EntityHandlers<T> {
  return {
    /**
     * Get all items
     * @param request - number of pagees and how many items in each page (Pagination)
     * @returns The list of accounts (divided based on the pagination values)
     */
    async getAll(request: NextRequest) {
      const searchParams = request.nextUrl.searchParams;
      const page = searchParams.get('page') || '1';
      const pageSize = searchParams.get('pageSize') || '10';

      if (isNaN(parseInt(page)) || isNaN(parseInt(pageSize)) || parseInt(page) < 1 || parseInt(pageSize) < 1) {
        return NextResponse.json(
          { error: "Invalid page or pageSize parameters" },
          { status: 400 }
        );
      }

      try {
        const response: ApiResponse<PaginatedResponse<T>> = await api.getPaginated<T>(`${entityName}`, { page, pageSize });
        return NextResponse.json(response);
      } catch (error) {
        console.error(`Error fetching ${entityName}:`, error);
        return NextResponse.json(
          { error: `Failed to fetch ${entityName}` },
          { status: 500 }
        );
      }
    },

    /**
     * Get an item in the list by its id
     * @param id - the id of the entity
     * @returns the available data
     */
    async getById(request: NextRequest, { params }: { params: { id: string } }) {
      try {
        const response: ApiResponse<T> = await api.getById<T>(`${entityName}`, params.id);
        return NextResponse.json(response);
      } catch (error) {
        console.error(`Error fetching ${entityName}:`, error);
        return NextResponse.json(
          { error: `Failed to fetch ${entityName}` },
          { status: 500 }
        );
      }
    },

    /**
     * Create a data of the entity
     * @param request - The data of the entity
     * @returns Status of the action (200 success, 4xx error, 500 Internal Server Error)
     */
    async create(request: NextRequest) {
      try {
        const data = await request.json();
        const response: ApiResponse<T> = await api.post<T>(`${entityName}`, data);
        return NextResponse.json(response);
      } catch (error) {
        console.error(`Error creating ${entityName}:`, error);
        return NextResponse.json(
          { error: `Failed to create ${entityName}` },
          { status: 500 }
        );
      }
    },

    /**
     * Update the available data with new values
     * @param request - The requested data for update
     * @param id - The id of the data that will be update 
     * @returns Status of the action (200 success, 4xx error, 500 Internal Server Error), along with the updated data
     */
    async update(request: NextRequest, { params }: { params: { id: string } }) {
      try {
        const updates = await request.json();
        const response: ApiResponse<T> = await api.patch<T>(`${entityName}/${params.id}`, updates);
        return NextResponse.json(response);
      } catch (error) {
        console.error(`Error updating ${entityName}:`, error);
        return NextResponse.json(
          { error: `Failed to update ${entityName}` },
          { status: 500 }
        );
      }
    },

    /**
     * Delete the data from the system (permanently)
     * @param id - the id of the data that will be deleted 
     * @returns Status of the action (200 success, 4xx error, 500 Internal Server Error)
     */
    async delete(request: NextRequest, { params }: { params: { id: string } }) {
      try {
        const response: ApiResponse<T> = await api.delete<T>(`${entityName}/${params.id}`);
        return NextResponse.json(response);
      } catch (error) {
        console.error(`Error deleting ${entityName}:`, error);
        return NextResponse.json(
          { error: `Failed to delete ${entityName}` },
          { status: 500 }
        );
      }
    },
  };
}