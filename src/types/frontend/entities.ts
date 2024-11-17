//Entities
export interface Account {
    id:             string;
    userName:       string;
    password:       string;
    email:          string;
    phoneNumber:    string;
    address:        string;
    status:         string;
    avatar:         string;
    createdDate:    Date;
    updatedDate:    Date;
    merchantId:     Merchant["id"];
    role:           string;
}


export interface ChatSession {
    id:             string;
    messages:       Message[];
    createdDate:    Date;
    updatedDate:    Date;
    customerId:     Account["id"];
    advisorId:      Account["id"];
}

export interface Message {
    id:           string;
    sender:       string;
    message:      string;
    timeStamp:    Date;
}


export interface APIDesign {
    id:             string;
    name:           string;
    description:    string;
    createdDate:    Date;
    updateDate:     Date;
    status:         string;
    type:           string;
    floors:         Floor[];
    accountId:      Account["id"];
    templateId:     Template["id"];
    styleId:        Style["id"];
}

export interface Floor {
    id:             string;
    name:           string;
    products:       DesignProduct[];
    nonProducts:    DesignProduct[];
}

export interface DesignProduct {
    id:       string;
    _id:      string;
    type?:    string;
    position: DesignProductValue;
    scale:    DesignProductValue;
    rotation: DesignProductValue;
}

export interface DesignProductValue {
    x: number;
    y: number;
    z: number;
}


export interface Merchant {
    id:                string;
    name:              string;
    email:             string;
    address:           string;
    phoneNumber:       string;
    logoUrl:           string;
    description:       string;
    status:            string;
    merchantCode:      string;
    policyDocument:    string;
    website:           string;
    orderIncomes:      OrderIncome[];
}

export interface OrderIncome {
    orderId:    string;
    income:     number;
}


export interface Order {
    id:                 string;
    orderDate:          Date;
    status:             string;
    vat:                number;
    feeAmount:          number;
    totalAmount:        number;
    shippingAddress:    string;
    orderProducts:      OrderProduct[];
    systemIncome:       number;
    voucherId:          Voucher["id"];
    accountId:          Account["id"];
    updatedDate:        Date;
}

export interface OrderProduct {
    id:            string;
    name:          string;
    description:   string;
    price:         number;
    merchantId:    Merchant["id"];
}

export interface Product {
    id:                  string;
    categoryIds:         ProductCategory["id"][];
    name:                string;
    description:         string;
    images:              Images;
    sellingPrice:        number;
    discount:            number;
    truePrice:           number;
    quantity:            number;
    status:              string;
    dimensions:          string;
    materials:           string[];
    modelTextureUrl:     string;
    createdDate:         Date;
    updatedDate:         Date;
    campaignId:          SaleCampaign["id"];
    merchantId:          Merchant["id"];
}

export interface Images {
    thumbnail:       string;
    normalImages:    string[];
}

export interface ProductCategory {
    id:          string;
    name:        string;
    description: string;
}

export interface Review {
    id:           string;
    comment:      string;
    rating:       number;
    productId:    Product["id"];
    accountId:    Account["id"];
}

export interface SaleCampaign {
    id:                     string;
    name:                   string;
    description:            string;
    value:                  number;
    startDate:              Date;
    endDate:                Date;
    status:                 string;
    merchantId:             Merchant["id"];
    campaignProductIds:     Product["id"][];
}

export interface Style {
    id:          string;
    name:        string;
    description: string;
}

export interface Template {
    id:             string;
    name:           string;
    description:    string;
    createdDate:    Date;
    updatedDate:    Date;
    status:         string;
    type:           string;
    floors:         Floor[];
    categories:     string[];
    accountId:      Account["id"];
    merchantId:     Merchant["id"];
    styleId:        Style["id"];
    imageUrl:          string;
}

export interface Transaction {
    id:                 string;
    paymentMethod:      string;
    transactionDate:    Date;
    totalAmount:        number;
    currency:           string;
    status:             string;
    createdDate:        Date;
    updatedDate:        Date;
    accountId:          Account["id"];
    orderId:            Order["id"];
}

export interface Voucher {
    id:                    string;
    code:                  string;
    name:                  string;
    description:           string;
    discountPercentage:    number;
    status:                string;
    createdDate:           Date;
    updatedDate:           Date;
    startDate:             Date;
    endDate:               Date;
    maxUse:                number;
    minOrderValue:         number;
    userAccountIds:        Account["id"][];
    type:                  string;
}







