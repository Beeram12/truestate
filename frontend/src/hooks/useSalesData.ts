import { useState, useEffect, useCallback } from 'react';
import { SalesTransaction, SummaryStats, FilterOptions, SortOption, PaginationParams } from '@/types';
import { salesApi, SalesQueryParams } from '@/services/api';
import { PAGE_SIZE } from '@/utils/constants';

interface UseSalesDataReturn {
    transactions: SalesTransaction[];
    summaryStats: SummaryStats | null;
    loading: boolean;
    error: string | null;
    totalPages: number;
    currentPage: number;
    total: number;
    refresh: () => void;
}

export const useSalesData = (
    searchQuery: string,
    filters: FilterOptions,
    sort: SortOption,
    pagination: PaginationParams
): UseSalesDataReturn => {
    const [transactions, setTransactions] = useState<SalesTransaction[]>([]);
    const [summaryStats, setSummaryStats] = useState<SummaryStats | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [totalPages, setTotalPages] = useState<number>(0);
    const [currentPage, setCurrentPage] = useState<number>(pagination.page);
    const [total, setTotal] = useState<number>(0);

    const fetchData = useCallback(async () => {
        setLoading(true);
        setError(null);

        try {
            const params: SalesQueryParams = {
                search: searchQuery || undefined,
                page: pagination.page,
                pageSize: pagination.pageSize,
                sortField: sort.field,
                sortDirection: sort.direction,
                filters: Object.keys(filters).length > 0 ? filters : undefined,
            };

            const [salesResponse, statsResponse] = await Promise.all([
                salesApi.getTransactions(params),
                salesApi.getSummaryStats(params),
            ]);

            setTransactions(salesResponse.transactions);
            setSummaryStats(statsResponse);
            setTotalPages(salesResponse.totalPages);
            setCurrentPage(salesResponse.page);
            setTotal(salesResponse.total);
        } catch (err: any) {
            setError(err.message || 'Failed to fetch sales data');
            console.error('Error fetching sales data:', err);
        } finally {
            setLoading(false);
        }
    }, [searchQuery, filters, sort, pagination]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    return {
        transactions,
        summaryStats,
        loading,
        error,
        totalPages,
        currentPage,
        total,
        refresh: fetchData,
    };
};
