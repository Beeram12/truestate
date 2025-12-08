package model

type FilterParams struct {
	Search        string   `form:"search"`
	Region        []string `form:"region"`
	Gender        string   `form:"gender"`
	MinAge        int      `form:"min_age"`
	MaxAge        int      `form:"max_age"`
	Category      []string `form:"category"`
	Tag           []string `form:"tag"`
	PaymentMethod []string `form:"payment_method"`
	StartDate     string   `form:"start_date"`
	EndDate       string   `form:"end_date"`
	SortBy        string   `form:"sort_by"`
	SortOrder     string   `form:"sort_order"`
	Page          int      `form:"page"`
	Limit         int      `form:"limit"`
}

type SummaryStats struct {
	TotalUnitsSold    int     `json:"total_units_sold"`
	TotalAmount       float64 `json:"total_amount"`
	TotalDiscount     float64 `json:"total_discount"`
	TotalTransactions int     `json:"total_transactions"`
}

type FilterOptions struct {
	Regions        []string `json:"regions"`
	Genders        []string `json:"genders"`
	Categories     []string `json:"categories"`
	Tags           []string `json:"tags"`
	PaymentMethods []string `json:"payment_methods"`
}