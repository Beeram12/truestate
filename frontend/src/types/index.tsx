export interface Customer {
    customerId: string;
    customerName: string;
    phoneNumber: string;
    gender: string;
    age: number;
    customerRegion: string;
    customerType: string;
}

export interface Product {
    productId: string;
    productName: string;
    brand: string;
    productCategory: string;
    tags: string[];
}

export interface SalesTransaction {
    transactionId: string;
    date: string;
    customerId: string;
    customerName: string;
    phoneNumber: string;
    gender: string;
    age: number;
    customerRegion: string;
    customerType: string;
    productId: string;
    productName: string;
    brand: string;
    productCategory: string;
    tags: string[];
    quantity: number;
    pricePerUnit: number;
    discountPercentage: number;
    totalAmount: number;
    finalAmount: number;
    paymentMethod: string;
    orderStatus: string;
    deliveryType: string;
    storeId: string;
    storeLocation: string;
    salespersonId: string;
    employeeName: string;
}

export interface FilterOptions {
    customerRegion?: string[];
    gender?: string[];
    ageRange?: { min: number; max: number };
    productCategory?: string[];
    tags?: string[];
    paymentMethod?: string[];
    dateRange?: { start: string; end: string };
}

export interface SortOption {
    field: 'date' | 'quantity' | 'customerName';
    direction: 'asc' | 'desc';
}

export interface PaginationParams {
    page: number;
    pageSize: number;
}

export interface SearchParams {
    query: string;
    filters: FilterOptions;
    sort: SortOption;
    pagination: PaginationParams;
}

export interface SalesResponse {
    transactions: SalesTransaction[];
    total: number;
    page: number;
    pageSize: number;
    totalPages: number;
}

export interface SummaryStats {
    totalUnitsSold: number;
    totalAmount: number;
    totalDiscount: number;
    totalTransactions: number;
}
