package model

type PaginatedResponse struct {
	Total      int           `json:"total_count"`
	Page       int           `json:"page"`
	Limit      int           `json:"limit"`
	TotalPages int           `json:"total_pages"`
	Data       []Transaction `json:"data"`
}