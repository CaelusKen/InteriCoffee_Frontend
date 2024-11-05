//Entities
export interface Account {
    _id:            string;
    "user-name":    string;
    password:       string;
    email:          string;
    "phone-number": string;
    address:        string;
    status:         string;
    avatar:         string;
    "created-date": Date;
    "updated-date": Date;
    "merchant-id":  string;
    role:           string;
}


export interface ChatSession {
    _id:            string;
    messages:       Message[];
    "created-date": Date;
    "updated-date": Date;
    "customer-id":  string;
    "advisor-id":   string;
}

export interface Message {
    _id:          string;
    sender:       string;
    message:      string;
    "time-stamp": Date;
}


export interface APIDesign {
    _id:            string;
    name:           string;
    description:    string;
    "created-date": Date;
    "updated-date": Date;
    status:         string;
    type:           string;
    floors:         Floor[];
    "account-id":   string;
    "template-id":  string;
    "style-id":     string;
}

export interface Floor {
    _id:            string;
    name:           string;
    products:       DesignProduct[];
    "non-products": DesignProduct[];
}

export interface DesignProduct {
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
    _id:               string;
    name:              string;
    email:             string;
    address:           string;
    "phone-number":    string;
    "logo-url":        string;
    description:       string;
    status:            string;
    "merchant-code":   string;
    "policy-document": string;
    website:           string;
    "order-incomes":   OrderIncome[];
}

export interface OrderIncome {
    "order-id": string;
    income:     number;
}


export interface Order {
    _id:                string;
    "order-date":       Date;
    status:             string;
    vat:                number;
    "fee-amount":       number;
    "total-amount":     number;
    "shipping-address": string;
    "order-products":   OrderProduct[];
    "system-income":    number;
    "voucher-id":       string;
    "account-id":       string;
    "updated-date":     Date;
}

export interface OrderProduct {
    _id:           string;
    name:          string;
    description:   string;
    price:         number;
    "merchant-id": string;
}

export interface Product {
    _id:                 string;
    "category-ids":      string[];
    name:                string;
    description:         string;
    images:              Images;
    "selling-price":     number;
    discount:            number;
    "true-price":        number;
    quantity:            number;
    status:              string;
    dimensions:          string;
    materials:           string[];
    "model-texture-url": string;
    "created-date":      Date;
    "updated-date":      Date;
    "campaign-id":       string;
    "merchant-id":       string;
}

export interface Images {
    thumbnail:       string;
    "normal-images": string[];
}

export interface ProductCategory {
    _id:         string;
    name:        string;
    description: string;
}

export interface Review {
    _id:          string;
    comment:      string;
    rating:       number;
    "product-id": string;
    "account-id": string;
}

export interface SaleCampaign {
    _id:                    string;
    name:                   string;
    description:            string;
    value:                  number;
    "start-date":           Date;
    "end-date":             Date;
    status:                 string;
    "merchant-id":          string;
    "campaign-product-ids": string[];
}

export interface Style {
    _id:         string;
    name:        string;
    description: string;
}

export interface Template {
    _id:            string;
    name:           string;
    description:    string;
    "created-date": Date;
    "updated-date": Date;
    status:         string;
    type:           string;
    floors:         Floor[];
    categories:     string[];
    "account-id":   string;
    "merchant-id":  string;
    "style-id":     string;
}

export interface Transaction {
    _id:                string;
    "payment-method":   string;
    "transaction-date": Date;
    "total-amount":     number;
    currency:           string;
    status:             string;
    "created-date":     Date;
    "updated-date":     Date;
    "account-id":       string;
    "order-id":         string;
}

export interface Voucher {
    _id:                   string;
    code:                  string;
    name:                  string;
    description:           string;
    "discount-percentage": number;
    status:                string;
    "created-date":        Date;
    "updated-date":        Date;
    "start-date":          Date;
    "end-date":            Date;
    "max-use":             number;
    "min-order-value":     number;
    "used-account-ids":    string[];
    type:                  string;
}







