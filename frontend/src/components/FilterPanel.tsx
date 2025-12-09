import React, { useState, useEffect } from 'react';
import { FilterOptions } from '@/types';
import { AGE_RANGES } from '@/utils/constants';

interface FilterPanelProps {
  filters: FilterOptions;
  onFiltersChange: (filters: FilterOptions) => void;
  filterOptions?: {
    regions: string[];
    genders: string[];
    categories: string[];
    tags: string[];
    paymentMethods: string[];
  };
}

const FilterPanel: React.FC<FilterPanelProps> = ({
  filters,
  onFiltersChange,
  filterOptions = {
    regions: [],
    genders: [],
    categories: [],
    tags: [],
    paymentMethods: [],
  },
}) => {
  const [localFilters, setLocalFilters] = useState<FilterOptions>(filters);
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    setLocalFilters(filters);
  }, [filters]);

  const handleMultiSelect = (
    key: keyof FilterOptions,
    value: string,
    isSelected: boolean
  ) => {
    const currentValues = (localFilters[key] as string[]) || [];
    const newValues = isSelected
      ? currentValues.filter((v) => v !== value)
      : [...currentValues, value];

    const updatedFilters = {
      ...localFilters,
      [key]: newValues.length > 0 ? newValues : undefined,
    };

    setLocalFilters(updatedFilters);
    onFiltersChange(updatedFilters);
  };

  const handleAgeRangeSelect = (min: number, max: number) => {
    const currentRange = localFilters.ageRange;
    const isSelected =
      currentRange?.min === min && currentRange?.max === max;

    const updatedFilters = {
      ...localFilters,
      ageRange: isSelected ? undefined : { min, max },
    };

    setLocalFilters(updatedFilters);
    onFiltersChange(updatedFilters);
  };

  const handleDateRangeChange = (start: string, end: string) => {
    const updatedFilters = {
      ...localFilters,
      dateRange: start && end ? { start, end } : undefined,
    };

    setLocalFilters(updatedFilters);
    onFiltersChange(updatedFilters);
  };

  const clearFilters = () => {
    const clearedFilters: FilterOptions = {};
    setLocalFilters(clearedFilters);
    onFiltersChange(clearedFilters);
  };

  const FilterDropdown = ({
    label,
    options,
    selectedValues,
    onToggle,
  }: {
    label: string;
    options: string[];
    selectedValues: string[];
    onToggle: (value: string, isSelected: boolean) => void;
  }) => {
    const [isOpen, setIsOpen] = useState(false);

    return (
      <div className="relative">
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="w-full px-3 py-2 text-left border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 bg-white flex items-center justify-between"
        >
          <span className={selectedValues.length > 0 ? 'text-gray-900' : 'text-gray-500'}>
            {selectedValues.length > 0 ? `${label} (${selectedValues.length})` : label}
          </span>
 
        </button>
        
        {isOpen && (
          <>
            <div
              className="fixed inset-0 z-10"
              onClick={() => setIsOpen(false)}
            ></div>
            <div className="absolute z-20 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-auto">
              {options.length === 0 ? (
                <div className="px-3 py-2 text-sm text-gray-500">No options available</div>
              ) : (
                options.map((option) => {
                  const isSelected = selectedValues.includes(option);
                  return (
                    <label
                      key={option}
                      className="flex items-center px-3 py-2 hover:bg-gray-50 cursor-pointer"
                    >
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => onToggle(option, isSelected)}
                        className="mr-2 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                      />
                      <span className="text-sm text-gray-900">{option}</span>
                    </label>
                  );
                })
              )}
            </div>
          </>
        )}
        
        {selectedValues.length > 0 && (
          <div className="mt-2 flex flex-wrap gap-2">
            {selectedValues.map((value) => (
              <span
                key={value}
                className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-primary-100 text-primary-800"
              >
                {value}
                <button
                  onClick={() => onToggle(value, true)}
                  className="ml-1 inline-flex items-center justify-center w-4 h-4 rounded-full hover:bg-primary-200"
                  type="button"
                >
                  ×
                </button>
              </span>
            ))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="mb-6">
      <div className="flex items-center gap-4 mb-4">
        <h3 className="text-lg font-semibold">Filters</h3>
        <button
          onClick={() => setShowFilters(!showFilters)}
          className="text-primary-600 hover:text-primary-800 font-medium"
        >
          {showFilters ? 'Hide Filters' : 'Show Filters'}
        </button>
      </div>

      {showFilters && (
        <div className="bg-gray-50 p-4 rounded-lg space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <FilterDropdown
              label="Customer Region"
              options={filterOptions.regions}
              selectedValues={localFilters.customerRegion || []}
              onToggle={(value, isSelected) =>
                handleMultiSelect('customerRegion', value, isSelected)
              }
            />

            <FilterDropdown
              label="Gender"
              options={filterOptions.genders}
              selectedValues={localFilters.gender || []}
              onToggle={(value, isSelected) =>
                handleMultiSelect('gender', value, isSelected)
              }
            />

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Age Range
              </label>
              <select
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                value={
                  localFilters.ageRange
                    ? `${localFilters.ageRange.min}-${localFilters.ageRange.max}`
                    : ''
                }
                onChange={(e) => {
                  if (e.target.value) {
                    const [min, max] = e.target.value.split('-').map(Number);
                    handleAgeRangeSelect(min, max);
                  } else {
                    const updatedFilters = { ...localFilters, ageRange: undefined };
                    setLocalFilters(updatedFilters);
                    onFiltersChange(updatedFilters);
                  }
                }}
              >
                <option value="">All Ages</option>
                {AGE_RANGES.map((range) => (
                  <option key={range.label} value={`${range.min}-${range.max}`}>
                    {range.label}
                  </option>
                ))}
              </select>
            </div>

            <FilterDropdown
              label="Product Category"
              options={filterOptions.categories}
              selectedValues={localFilters.productCategory || []}
              onToggle={(value, isSelected) =>
                handleMultiSelect('productCategory', value, isSelected)
              }
            />

            <FilterDropdown
              label="Tags"
              options={filterOptions.tags}
              selectedValues={localFilters.tags || []}
              onToggle={(value, isSelected) =>
                handleMultiSelect('tags', value, isSelected)
              }
            />

            <FilterDropdown
              label="Payment Method"
              options={filterOptions.paymentMethods}
              selectedValues={localFilters.paymentMethod || []}
              onToggle={(value, isSelected) =>
                handleMultiSelect('paymentMethod', value, isSelected)
              }
            />

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Date Range
              </label>
              <div className="flex gap-2">
                <input
                  type="date"
                  value={localFilters.dateRange?.start || ''}
                  onChange={(e) =>
                    handleDateRangeChange(
                      e.target.value,
                      localFilters.dateRange?.end || ''
                    )
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
                <input
                  type="date"
                  value={localFilters.dateRange?.end || ''}
                  onChange={(e) =>
                    handleDateRangeChange(
                      localFilters.dateRange?.start || '',
                      e.target.value
                    )
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>
            </div>
          </div>

          {(Object.keys(localFilters).length > 0 &&
            Object.values(localFilters).some((v) => v !== undefined)) && (
            <button
              onClick={clearFilters}
              className="px-4 py-2 text-sm font-medium text-red-600 hover:text-red-800 border border-red-300 rounded-lg hover:bg-red-50"
            >
              Clear All Filters
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default FilterPanel;

