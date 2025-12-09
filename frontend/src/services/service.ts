import axios from 'axios';
import { SalesResponse, SummaryStats, SearchParams, FilterOptions, SortOption, PaginationParams } from '@/types';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';

const apiClient = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

export interface SalesQueryParams {
    search?: string;
    page?: number;
    pageSize?: number;
    sortField?: string;
    sortDirection?: 'asc' | 'desc';
    filters?: FilterOptions;
}

export const salesApi = {
    getTransactions: async (params: SalesQueryParams): Promise<SalesResponse> => {
        const queryParams = new URLSearchParams();

        if (params.search) {
            queryParams.append('search', params.search);
        }

        if (params.page) {
            queryParams.append('page', params.page.toString());
        }

        if (params.pageSize) {
            queryParams.append('pageSize', params.pageSize.toString());
        }

        if (params.sortField) {
            queryParams.append('sortField', params.sortField);
        }

        if (params.sortDirection) {
            queryParams.append('sortDirection', params.sortDirection);
        }

        // Add filter parameters
        if (params.filters) {
            if (params.filters.customerRegion?.length) {
                params.filters.customerRegion.forEach(region => {
                    queryParams.append('customerRegion', region);
                });
            }

            if (params.filters.gender?.length) {
                params.filters.gender.forEach(g => {
                    queryParams.append('gender', g);
                });
            }

            if (params.filters.ageRange) {
                queryParams.append('ageMin', params.filters.ageRange.min.toString());
                queryParams.append('ageMax', params.filters.ageRange.max.toString());
            }

            if (params.filters.productCategory?.length) {
                params.filters.productCategory.forEach(cat => {
                    queryParams.append('productCategory', cat);
                });
            }

            if (params.filters.tags?.length) {
                params.filters.tags.forEach(tag => {
                    queryParams.append('tags', tag);
                });
            }

            if (params.filters.paymentMethod?.length) {
                params.filters.paymentMethod.forEach(method => {
                    queryParams.append('paymentMethod', method);
                });
            }

            if (params.filters.dateRange) {
                queryParams.append('dateStart', params.filters.dateRange.start);
                queryParams.append('dateEnd', params.filters.dateRange.end);
            }
        }

        const response = await apiClient.get(`/api/sales?${queryParams.toString()}`);
        return response.data;
    },

    getSummaryStats: async (params: SalesQueryParams): Promise<SummaryStats> => {
        const queryParams = new URLSearchParams();

        if (params.search) {
            queryParams.append('search', params.search);
        }

        if (params.filters) {
            if (params.filters.customerRegion?.length) {
                params.filters.customerRegion.forEach(region => {
                    queryParams.append('customerRegion', region);
                });
            }

            if (params.filters.gender?.length) {
                params.filters.gender.forEach(g => {
                    queryParams.append('gender', g);
                });
            }

            if (params.filters.ageRange) {
                queryParams.append('ageMin', params.filters.ageRange.min.toString());
                queryParams.append('ageMax', params.filters.ageRange.max.toString());
            }

            if (params.filters.productCategory?.length) {
                params.filters.productCategory.forEach(cat => {
                    queryParams.append('productCategory', cat);
                });
            }

            if (params.filters.tags?.length) {
                params.filters.tags.forEach(tag => {
                    queryParams.append('tags', tag);
                });
            }

            if (params.filters.paymentMethod?.length) {
                params.filters.paymentMethod.forEach(method => {
                    queryParams.append('paymentMethod', method);
                });
            }

            if (params.filters.dateRange) {
                queryParams.append('dateStart', params.filters.dateRange.start);
                queryParams.append('dateEnd', params.filters.dateRange.end);
            }
        }

        const response = await apiClient.get(`/api/sales/summary?${queryParams.toString()}`);
        return response.data;
    },

    getFilterOptions: async (): Promise<{
        regions: string[];
        genders: string[];
        categories: string[];
        tags: string[];
        paymentMethods: string[];
    }> => {
        const response = await apiClient.get('/api/filters/options');
        return response.data;
    },
};
