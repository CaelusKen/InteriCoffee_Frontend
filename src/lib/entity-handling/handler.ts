import { Account } from "@/types/entities";

interface BackendAccount {
    "_id": string;
    "user-name": string;
    "email": string;
    "phone-number": string;
    "address": string;
    "status": string;
    "avatar": string;
    "created-date": string;
    "updated-date": string;
    "merchant-id": string;
    "role-id": string | null;
}

// ... (define other fields based on backend response)

interface BackendPaginatedResponse {
    "page-no": number;
    "page-size": number;
    "list-size": number;
    "current-page-size": number;
    "list-size-after": number;
    "total-page": number;
    "order-by": {
        "sort-by": string | null;
        "is-ascending": boolean;
    };
    "filter": {
        "status": string | null;
        "role-id": string | null;
    };
    "keyword": string | null;
    "accounts"?: BackendAccount[];
}

export function mapBackendAccountToFrontend(backendAccount: BackendAccount): Account {
    if (!backendAccount) {
        throw new Error('Account data is undefined');
    }

    return {
        id: backendAccount["_id"],
        username: backendAccount["user-name"],
        email: backendAccount["email"],
        phoneNumber: backendAccount["phone-number"],
        address: backendAccount["address"],
        status: backendAccount["status"],
        avatar: backendAccount["avatar"],
        createdDate: new Date(backendAccount["created-date"]),
        updatedDate: new Date(backendAccount["updated-date"]),
        merchantId: backendAccount["merchant-id"] || null,
        roleId: backendAccount["role-id"] || ""
    };
}

export function mapBackendToFrontend<T>(backendData: any, entityType: string): T {
    if (!backendData) {
        throw new Error(`${entityType} data is undefined`);
    }

    const mappers: { [key: string]: (data: any) => any } = {
        account: mapBackendAccountToFrontend,
    };

    const mapper = mappers[entityType];
    if (!mapper) {
        throw new Error(`No mapper found for entity type: ${entityType}`);
    }

    return mapper(backendData) as T;
}

export function mapBackendListToFrontend<T>(backendResponse: any, entityType: string): {
    items: T[];
    totalCount: number;
    pageNumber: number;
    pageSize: number;
} {
    // Validate input
    if (!backendResponse) {
        console.error('Backend response:', backendResponse);
        throw new Error('Backend response is undefined');
    }

    // Get the correct array based on entity type
    const entityArrayKey = `${entityType}s`;
    const entityArray = backendResponse[entityArrayKey];

    // Validate entity array
    if (!entityArray) {
        console.error('Backend response structure:', backendResponse);
        throw new Error(`${entityArrayKey} not found in response`);
    }

    if (!Array.isArray(entityArray)) {
        console.error(`Expected array for ${entityArrayKey}, got:`, entityArray);
        throw new Error(`Invalid data structure for ${entityType}`);
    }

    // Map the data
    return {
        items: entityArray.map((item: any) => mapBackendToFrontend<T>(item, entityType)),
        totalCount: backendResponse["list-size"] || 0,
        pageNumber: backendResponse["page-no"] || 1,
        pageSize: backendResponse["page-size"] || 10
    };
}