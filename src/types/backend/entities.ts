export interface BackendAccount {
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

export interface BackendChatSession {
    _id:            string;
    messages:       BackendMessage[];
    "created-date": Date;
    "updated-date": Date;
    "customer-id":  string;
    "advisor-id":   string;
}

export interface BackendMessage { 
    _id:          string;
    sender:       string;
    message:      string;
    "time-stamp": Date;
}


export interface BackendDesign {
    _id:            string;
    name:           string;
    description:    string;
    "created-date": Date;
    "updated-date": Date;
    status:         string;
    type:           string;
    floors:         BackendFloor[];
    "account-id":   string;
    "template-id":  string;
    "style-id":     string;
}

export interface BackendFloor {
    _id:            string;
    name:           string;
    products:       BackendDesignProduct[];
    "non-products": BackendDesignProduct[];
}

export interface BackendDesignProduct {
    _id:      string;
    type?:    string;
    position: BackendDesignProductValue;
    scale:    BackendDesignProductValue;
    rotation: BackendDesignProductValue;
}

export interface BackendDesignProductValue {
    x: number;
    y: number;
    z: number;
}


export interface BackendMerchant {
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
    "order-incomes":   BackendOrderIncome[];
}

export interface BackendOrderIncome {
    "order-id": string;
    income:     number;
}


export interface BackendOrder {
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

export interface BackendProduct {
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

export interface BackendProductCategory {
    _id:         string;
    name:        string;
    description: string;
}

export interface BackendReview { 
    _id:          string;
    comment:      string;
    rating:       number;
    "product-id": string;
    "account-id": string;
}

export interface BackendSaleCampaign {
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

export interface BackendStyle {
    _id:         string;
    name:        string;
    description: string;
}

export interface BackendTemplate {
    _id:            string;
    name:           string;
    description:    string;
    "created-date": Date;
    "updated-date": Date;
    status:         string;
    type:           string;
    floors:         BackendFloor[];
    categories:     string[];
    "account-id":   string;
    "merchant-id":  string;
    "style-id":     string;
    image:          string;
    products: {
        "_id":      string;
        quantity:   number;
    }[]
}

export interface BackendTransaction {
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

export interface BackendVoucher {
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