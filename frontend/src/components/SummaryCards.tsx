import React from 'react';
import { SummaryStats } from '@/types';

interface SummaryCardsProps {
    stats: SummaryStats | null;
    loading?: boolean;
}

const SummaryCards: React.FC<SummaryCardsProps> = ({ stats, loading = false }) => {
    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR',
            maximumFractionDigits: 0,
        }).format(amount);
    };

    if (loading) {
        return (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                {[1, 2, 3].map((i) => (
                    <div
                        key={i}
                        className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 animate-pulse"
                    >
                        <div className="h-4 bg-gray-200 rounded w-1/2 mb-4"></div>
                        <div className="h-8 bg-gray-200 rounded w-1/3"></div>
                    </div>
                ))}
            </div>
        );
    }

    if (!stats) {
        return null;
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                <div className="flex items-center justify-between">
                    <div>
                        <p className="text-sm font-medium text-gray-600 mb-1">
                            Total Units Sold
                        </p>
                        <p className="text-2xl font-bold text-gray-900">
                            {stats.totalUnitsSold}
                        </p>
                    </div>
                </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                <div className="flex items-center justify-between">
                    <div>
                        <p className="text-sm font-medium text-gray-600 mb-1">
                            Total Amount
                        </p>
                        <p className="text-2xl font-bold text-gray-900">
                            {formatCurrency(stats.totalAmount)}
                        </p>
                        <p className="text-xs text-gray-500 mt-1">
                            ({stats.totalTransactions} transactions)
                        </p>
                    </div>

                </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                <div className="flex items-center justify-between">
                    <div>
                        <p className="text-sm font-medium text-gray-600 mb-1">
                            Total Discount
                        </p>
                        <p className="text-2xl font-bold text-gray-900">
                            {formatCurrency(stats.totalDiscount)}
                        </p>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default SummaryCards;

