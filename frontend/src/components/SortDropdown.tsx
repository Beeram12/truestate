import React from 'react';
import { SortOption } from '@/types';
import { SORT_OPTIONS } from '@/utils/constants';

interface SortDropdownProps {
    sort: SortOption;
    onSortChange: (sort: SortOption) => void;
}

const SortDropdown: React.FC<SortDropdownProps> = ({ sort, onSortChange }) => {
    const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const value = e.target.value;
        const option = SORT_OPTIONS.find((opt) => opt.value === value);
        if (option) {
            onSortChange({
                field: option.field as 'date' | 'quantity' | 'customerName',
                direction: option.direction as 'asc' | 'desc',
            });
        }
    };

    const currentValue = SORT_OPTIONS.find(
        (opt) => opt.field === sort.field && opt.direction === sort.direction
    )?.value || SORT_OPTIONS[0].value;

    return (
        <div className="flex items-center gap-2">
            <label className="text-sm font-medium text-gray-700">Sort by:</label>
            <select
                value={currentValue}
                onChange={handleChange}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 bg-white"
            >
                {SORT_OPTIONS.map((option) => (
                    <option key={option.value} value={option.value}>
                        {option.label}
                    </option>
                ))}
            </select>
        </div>
    );
};

export default SortDropdown;

