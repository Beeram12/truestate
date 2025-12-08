package model

type SalesInfo struct {
	Quantity int     `json:"quantity"`
	Price    float64 `json:"price_per_unit"`
	Discount float64 `json:"discount_percentage"`
	Total    float64 `json:"total_amount"`
	Final    float64 `json:"final_amount"`
}