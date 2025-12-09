'use client';

import React, { useState, useEffect } from 'react';
import SearchBar from '@/components/SearchBar';
import FilterPanel from '@/components/FilterPanel';
import SortDropdown from '@/components/SortDropdown';
import SummaryCards from '@/components/SummaryCards';
import DataTable from '@/components/DataTable';
import Pagination from '@/components/Pagination';
import { useSalesData } from '@/hooks/useSalesData';
import { FilterOptions, SortOption, PaginationParams } from '@/types';
import { PAGE_SIZE } from '@/utils/constants';
import { salesApi } from '@/services/api';

export default function Home() {
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [filters, setFilters] = useState<FilterOptions>({});
  const [sort, setSort] = useState<SortOption>({
    field: 'date',
    direction: 'desc',
  });
  const [pagination, setPagination] = useState<PaginationParams>({
    page: 1,
    pageSize: PAGE_SIZE,
  });
  const [filterOptions, setFilterOptions] = useState<{
    regions: string[];
    genders: string[];
    categories: string[];
    tags: string[];
    paymentMethods: string[];
  }>({
    regions: [],
    genders: [],
    categories: [],
    tags: [],
    paymentMethods: [],
  });

  const { transactions, summaryStats, loading, error, totalPages, currentPage, total, refresh } =
    useSalesData(searchQuery, filters, sort, pagination);

  useEffect(() => {
    const fetchFilterOptions = async () => {
      try {
        const options = await salesApi.getFilterOptions();
        setFilterOptions(options);
      } catch (err) {
        console.error('Failed to fetch filter options:', err);
      }
    };

    fetchFilterOptions();
  }, []);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    setPagination({ ...pagination, page: 1 });
  };

  const handleFiltersChange = (newFilters: FilterOptions) => {
    setFilters(newFilters);
    setPagination({ ...pagination, page: 1 });
  };

  const handleSortChange = (newSort: SortOption) => {
    setSort(newSort);
    setPagination({ ...pagination, page: 1 });
  };

  const handlePageChange = (page: number) => {
    setPagination({ ...pagination, page });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Sales Management System
          </h1>
          <p className="text-gray-600">
            Manage and analyze your sales transactions
          </p>
        </div>

        <div className="mb-6">
          <SearchBar onSearch={handleSearch} placeholder="Name, Phone no." />
        </div>

        <div className="mb-6 space-y-4">
          <FilterPanel
            filters={filters}
            onFiltersChange={handleFiltersChange}
            filterOptions={filterOptions}
          />
          <div className="flex items-center justify-between">
            <button
              onClick={refresh}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary-500 flex items-center gap-2"
              title="Refresh data"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                />
              </svg>
              <span>Refresh</span>
            </button>
            <SortDropdown sort={sort} onSortChange={handleSortChange} />
          </div>
        </div>

        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-lg">
            <p className="font-medium">Error: {error}</p>
          </div>
        )}

        <SummaryCards stats={summaryStats} loading={loading} />

        <div className="mb-4">
          <p className="text-sm text-gray-600">
            Showing {transactions.length} of {total} transactions
          </p>
        </div>

        <DataTable transactions={transactions} loading={loading} />

        {totalPages > 1 && (
          <div className="mt-6">
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
              loading={loading}
            />
          </div>
        )}
      </div>
    </div>
  );
}

