export const PAGE_SIZE = 10;

export const SORT_OPTIONS = [
  { value: 'date-desc', label: 'Date (Newest First)', field: 'date', direction: 'desc' },
  { value: 'date-asc', label: 'Date (Oldest First)', field: 'date', direction: 'asc' },
  { value: 'quantity-desc', label: 'Quantity (High to Low)', field: 'quantity', direction: 'desc' },
  { value: 'quantity-asc', label: 'Quantity (Low to High)', field: 'quantity', direction: 'asc' },
  { value: 'customerName-asc', label: 'Customer Name (A-Z)', field: 'customerName', direction: 'asc' },
  { value: 'customerName-desc', label: 'Customer Name (Z-A)', field: 'customerName', direction: 'desc' },
] as const;

export const AGE_RANGES = [
  { label: '18-25', min: 18, max: 25 },
  { label: '26-35', min: 26, max: 35 },
  { label: '36-45', min: 36, max: 45 },
  { label: '46-55', min: 46, max: 55 },
  { label: '56+', min: 56, max: 150 },
];

