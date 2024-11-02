import { Floor } from "./room-editor";

//Entities
export interface Account {
    id: string;
    username: string;
    email: string;
    phoneNumber: string;
    address: string;
    status: string;
    avatar: string;
    createdDate: Date;
    updatedDate: Date;
    merchantId: string | null;
    roleId: "Customer" | "Consultant" | "Merchant" | "Manager";

}

export interface ChatSession {
    id: string;
    messages: {
        sender: string;
        message: string;
        timeStamp: Date;
    }[],
    createdDate: Date;
    updatedDate: Date;
    customerId: Account['id'];
    adviser: Account['id'];
}

//Design entity in API (not to be confused with the design type in the Simulator)
export interface ApiDesign {
    id: string;
    name: string;
    description: string;
    createdDate: Date;
    updatedDate: Date;
    status: string;
    type: "Template" | "Design";
    floors: Floor[]
}

export interface Merchant {
    id: string;
    name: string;
    email: string;
    address: string;
    phoneNumber: string;
    logoUrl: string;
    description: string;
    status: string;
    merchantCode: string;
    policyDocument: string;
    website?: string; //If the merchant has the website, add this in.
    orderIncome: {
        orderId: Order['id'];
        income: number;
    }[]
}

export interface Order {
    id: string;
    orderDate: Date;
    status: string;
    vat: number;
    feeAmount: number;
    totalAmount: number;
    shippingAddress: string;
    orderProducts: {
        id: string;
        name: string;
        description: string;
        price: number;
        merchantId: Merchant['id']
    }[],
    systemIncome: number;
    voucherId?: string;
    accountId: Account['id'];
    updatedDate: Date;
}

export interface Product {
    id: string;
    categoryId: ProductCategory['id'][];
    name: string;
    description: string;
    images: {
        thumbnail: string; //url of the thumbnail
        normalImages: string[]; //a list of url of the normal images
    }[];
    sellingPrice: number;//the price of the product after apply the discount
    discount: number;
    truePrice: number; //the original price of the product
    quantity: number;
    status: string;
    dimensions: string;
    materials: string[];
    modelTextureUrl: string;
    createdDate: Date;
    updatedDate: Date;
    campaignId: SaleCampaign['id'];
    merchantId: Merchant['id'];
}

export interface ProductCategory {
    id: string;
    name: string;
    description: string;
}

export interface Review {
    id: string;
    comment: string;
    rating: number;
    productId: Product['id'];
    accountId: Account['id'];
}

export interface SaleCampaign {
    id: string;
    name: string;
    description: string;
    value: number;
    startDate: Date;
    endDate: Date;
    status: string;
    merchantId: Merchant['id'];
    campaignProductIds: Product['id'][];
}

export interface Style {
    id: string;
    name: string;
    description: string;
}

export interface Template {
    id: string;
    name: string;
    description: string;
    createdDate: Date;
    updatedate: Date;
    status: string;
    type: "Template" | "Design";
    floors: Floor[];
    categories: string[];
    accountId: Account['id']
    merchantId: Merchant['id']
    styleId: Style['id']
}

export interface Transaction {
    id: string;
    paymentMethod: string;
    transactionDate: Date;
    totalAmount: number;
    currency: string;
    status: string;
    createdDate: Date;
    updateDate: Date;
    accountId: Account['id']
    orderId: Order['id']
}

export interface Voucher {
    id: string;
    code: string;
    name: string;
    description: string;
    discountPercentage: number;
    status: string;
    createdDate: Date;
    updatedDate: Date;
    startDate: Date;
    endDate: Date;
    maxUse: number;
    minOrderValue: number;
    userAccoutIds: Account['id'][];
    type: string;
}


