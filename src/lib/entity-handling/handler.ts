import * as FrontEndTypes from "@/types/frontend/entities";
import * as BackEndTypes from "@/types/backend/entities";

export function mapBackendAccountToFrontend(backendAccount: BackEndTypes.BackendAccount): FrontEndTypes.Account {
    if (!backendAccount) {
        throw new Error('Account data is undefined');
    }

    return {
        id: backendAccount["_id"],
        userName: backendAccount["user-name"],
        email: backendAccount["email"],
        phoneNumber: backendAccount["phone-number"],
        address: backendAccount["address"],
        status: backendAccount["status"],
        avatar: backendAccount["avatar"],
        createdDate: new Date(backendAccount["created-date"]),
        updatedDate: new Date(backendAccount["updated-date"]),
        merchantId: backendAccount["merchant-id"],
        role: backendAccount["role"] || "CUSTOMER",
        password: backendAccount["password"],
    };
}

export function mapBackendChatSessionToFrontend(backendChatSession: BackEndTypes.BackendChatSession): FrontEndTypes.ChatSession {
    if (!backendChatSession) {
        throw new Error('ChatSession data is undefined');
    }

    return {
        id: backendChatSession["_id"],
        messages: backendChatSession.messages.map(mapBackendMessageToFrontend),
        createdDate: new Date(backendChatSession["created-date"]),
        updatedDate: new Date(backendChatSession["updated-date"]),
        customerId: backendChatSession["customer-id"],
        advisorId: backendChatSession["advisor-id"],
    };
}

export function mapBackendMessageToFrontend(backendMessage: BackEndTypes.BackendMessage): FrontEndTypes.Message {
    if (!backendMessage) {
        throw new Error('Message data is undefined');
    }

    return {
        id: backendMessage["_id"],
        sender: backendMessage.sender,
        message: backendMessage.message,
        timeStamp: new Date(backendMessage["time-stamp"]),
    };
}

export function mapBackendDesignToFrontend(backendDesign: BackEndTypes.BackendDesign): FrontEndTypes.APIDesign {
    if (!backendDesign) {
        throw new Error('Design data is undefined');
    }

    return {
        id: backendDesign["_id"],
        name: backendDesign.name,
        description: backendDesign.description,
        createdDate: new Date(backendDesign["created-date"]),
        updateDate: new Date(backendDesign["updated-date"]),
        status: backendDesign.status,
        type: backendDesign.type,
        floors: backendDesign.floors.map(mapBackendFloorToFrontend),
        accountId: backendDesign["account-id"],
        templateId: backendDesign["template-id"],
        styleId: backendDesign["style-id"],
    };
}

export function mapBackendFloorToFrontend(backendFloor: BackEndTypes.BackendFloor): FrontEndTypes.Floor {
    if (!backendFloor) {
        throw new Error('Floor data is undefined');
    }

    return {
        id: backendFloor["_id"],
        name: backendFloor.name,
        products: backendFloor.products.map(mapBackendDesignProductToFrontend),
        nonProducts: backendFloor["non-products"].map(mapBackendDesignProductToFrontend),
    };
}

export function mapBackendDesignProductToFrontend(backendDesignProduct: BackEndTypes.BackendDesignProduct): FrontEndTypes.DesignProduct {
    if (!backendDesignProduct) {
        throw new Error('DesignProduct data is undefined');
    }

    return {
        id: backendDesignProduct["_id"],
        _id: backendDesignProduct["_id"],
        type: backendDesignProduct.type,
        position: mapBackendDesignProductValueToFrontend(backendDesignProduct.position),
        scale: mapBackendDesignProductValueToFrontend(backendDesignProduct.scale),
        rotation: mapBackendDesignProductValueToFrontend(backendDesignProduct.rotation),
    };
}

export function mapBackendDesignProductValueToFrontend(backendValue: BackEndTypes.BackendDesignProductValue): FrontEndTypes.DesignProductValue {
    if (!backendValue) {
        throw new Error('DesignProductValue data is undefined');
    }

    return {
        x: backendValue.x,
        y: backendValue.y,
        z: backendValue.z,
    };
}

export function mapBackendMerchantToFrontend(backendMerchant: BackEndTypes.BackendMerchant): FrontEndTypes.Merchant {
    if (!backendMerchant) {
        throw new Error('Merchant data is undefined');
    }

    return {
        id: backendMerchant["_id"],
        name: backendMerchant.name,
        email: backendMerchant.email,
        address: backendMerchant.address,
        phoneNumber: backendMerchant["phone-number"],
        logoUrl: backendMerchant["logo-url"],
        description: backendMerchant.description,
        status: backendMerchant.status,
        merchantCode: backendMerchant["merchant-code"],
        policyDocument: backendMerchant["policy-document"],
        website: backendMerchant.website,
        orderIncomes: backendMerchant["order-incomes"].map(mapBackendOrderIncomeToFrontend),
    };
}

export function mapBackendOrderIncomeToFrontend(backendOrderIncome: BackEndTypes.BackendOrderIncome): FrontEndTypes.OrderIncome {
    if (!backendOrderIncome) {
        throw new Error('OrderIncome data is undefined');
    }

    return {
        orderId: backendOrderIncome["order-id"],
        income: backendOrderIncome.income,
    };
}

export function mapBackendOrderToFrontend(backendOrder: BackEndTypes.BackendOrder): FrontEndTypes.Order {
    if (!backendOrder) {
        throw new Error('Order data is undefined');
    }

    return {
        id: backendOrder["_id"],
        orderDate: new Date(backendOrder["order-date"]),
        status: backendOrder.status,
        vat: backendOrder.vat,
        feeAmount: backendOrder["fee-amount"],
        totalAmount: backendOrder["total-amount"],
        shippingAddress: backendOrder["shipping-address"],
        orderProducts: backendOrder["order-products"].map(mapBackendOrderProductToFrontend),
        systemIncome: backendOrder["system-income"],
        voucherId: backendOrder["voucher-id"],
        accountId: backendOrder["account-id"],
        updatedDate: new Date(backendOrder["updated-date"]),
    };
}

export function mapBackendOrderProductToFrontend(backendOrderProduct: BackEndTypes.OrderProduct): FrontEndTypes.OrderProduct {
    if (!backendOrderProduct) {
        throw new Error('OrderProduct data is undefined');
    }

    return {
        id: backendOrderProduct["_id"],
        name: backendOrderProduct.name,
        description: backendOrderProduct.description,
        price: backendOrderProduct.price,
        merchantId: backendOrderProduct["merchant-id"],
    };
}

export function mapBackendProductToFrontend(backendProduct: BackEndTypes.BackendProduct): FrontEndTypes.Product {
    if (!backendProduct) {
        throw new Error('Product data is undefined');
    }

    return {
        id: backendProduct["_id"],
        categoryIds: backendProduct["category-ids"],
        name: backendProduct.name,
        description: backendProduct.description,
        images: {
            thumbnail: backendProduct.images.thumbnail,
            normalImages: backendProduct.images["normal-images"],
        },
        sellingPrice: backendProduct["selling-price"],
        discount: backendProduct.discount,
        truePrice: backendProduct["true-price"],
        quantity: backendProduct.quantity,
        status: backendProduct.status,
        dimensions: backendProduct.dimensions,
        materials: backendProduct.materials,
        modelTextureUrl: backendProduct["model-texture-url"],
        createdDate: new Date(backendProduct["created-date"]),
        updatedDate: new Date(backendProduct["updated-date"]),
        campaignId: backendProduct["campaign-id"],
        merchantId: backendProduct["merchant-id"],
    };
}

export function mapBackendProductCategoryToFrontend(backendProductCategory: BackEndTypes.BackendProductCategory): FrontEndTypes.ProductCategory {
    if (!backendProductCategory) {
        throw new Error('ProductCategory data is undefined');
    }

    return {
        id: backendProductCategory["_id"],
        name: backendProductCategory.name,
        description: backendProductCategory.description,
    };
}

export function mapBackendReviewToFrontend(backendReview: BackEndTypes.BackendReview): FrontEndTypes.Review {
    if (!backendReview) {
        throw new Error('Review data is undefined');
    }

    return {
        id: backendReview["_id"],
        comment: backendReview.comment,
        rating: backendReview.rating,
        productId: backendReview["product-id"],
        accountId: backendReview["account-id"],
    };
}

export function mapBackendSaleCampaignToFrontend(backendSaleCampaign: BackEndTypes.BackendSaleCampaign): FrontEndTypes.SaleCampaign {
    if (!backendSaleCampaign) {
        throw new Error('SaleCampaign data is undefined');
    }

    return {
        id: backendSaleCampaign["_id"],
        name: backendSaleCampaign.name,
        description: backendSaleCampaign.description,
        value: backendSaleCampaign.value,
        startDate: new Date(backendSaleCampaign["start-date"]),
        endDate: new Date(backendSaleCampaign["end-date"]),
        status: backendSaleCampaign.status,
        merchantId: backendSaleCampaign["merchant-id"],
        campaignProductIds: backendSaleCampaign["campaign-product-ids"],
    };
}

export function mapBackendStyleToFrontend(backendStyle: BackEndTypes.BackendStyle): FrontEndTypes.Style {
    if (!backendStyle) {
        throw new Error('Style data is undefined');
    }

    return {
        id: backendStyle["_id"],
        name: backendStyle.name,
        description: backendStyle.description,
    };
}

export function mapBackendTemplateToFrontend(backendTemplate: BackEndTypes.BackendTemplate): FrontEndTypes.Template {
    if (!backendTemplate) {
        throw new Error('Template data is undefined');
    }

    return {
        id: backendTemplate["_id"],
        name: backendTemplate.name,
        description: backendTemplate.description,
        updatedDate: new Date(backendTemplate["updated-date"]),
        status: backendTemplate.status,
        type: backendTemplate.type,
        floors: backendTemplate.floors.map(mapBackendFloorToFrontend),
        categories: backendTemplate.categories,
        createdDate: backendTemplate["created-date"],
        accountId: backendTemplate["account-id"],
        merchantId: backendTemplate["merchant-id"],
        styleId: backendTemplate["style-id"],
    };
}

export function mapBackendTransactionToFrontend(backendTransaction: BackEndTypes.BackendTransaction): FrontEndTypes.Transaction {
    if (!backendTransaction) {
        throw new Error('Transaction data is undefined');
    }

    return {
        id: backendTransaction["_id"],
        paymentMethod: backendTransaction["payment-method"],
        transactionDate: new Date(backendTransaction["transaction-date"]),
        totalAmount: backendTransaction["total-amount"],
        currency: backendTransaction.currency,
        status: backendTransaction.status,
        createdDate: new Date(backendTransaction["created-date"]),
        updatedDate: new Date(backendTransaction["updated-date"]),
        accountId: backendTransaction["account-id"],
        orderId: backendTransaction["order-id"],
    };
}

export function mapBackendVoucherToFrontend(backendVoucher: BackEndTypes.BackendVoucher): FrontEndTypes.Voucher {
    if (!backendVoucher) {
        throw new Error('Voucher data is undefined');
    }

    return {
        id: backendVoucher["_id"],
        code: backendVoucher.code,
        name: backendVoucher.name,
        description: backendVoucher.description,
        discountPercentage: backendVoucher["discount-percentage"],
        status: backendVoucher.status,
        createdDate: new Date(backendVoucher["created-date"]),
        updatedDate: new Date(backendVoucher["updated-date"]),
        startDate: new Date(backendVoucher["start-date"]),
        endDate: new Date(backendVoucher["end-date"]),
        maxUse: backendVoucher["max-use"],
        minOrderValue: backendVoucher["min-order-value"],
        userAccountIds: backendVoucher["used-account-ids"],
        type: backendVoucher.type,
    };
}

export function mapBackendToFrontend<T>(backendData: any, entityType: string): T {
    if (!backendData) {
        throw new Error(`${entityType} data is undefined`);
    }

    const mappers: { [key: string]: (data: any) => any } = {
        account: mapBackendAccountToFrontend,
        chatSession: mapBackendChatSessionToFrontend,
        design: mapBackendDesignToFrontend,
        merchant: mapBackendMerchantToFrontend,
        order: mapBackendOrderToFrontend,
        product: mapBackendProductToFrontend,
        productCategory: mapBackendProductCategoryToFrontend,
        review: mapBackendReviewToFrontend,
        saleCampaign: mapBackendSaleCampaignToFrontend,
        style: mapBackendStyleToFrontend,
        template: mapBackendTemplateToFrontend,
        transaction: mapBackendTransactionToFrontend,
        voucher: mapBackendVoucherToFrontend,
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