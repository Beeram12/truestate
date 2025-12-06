package model

type Product struct {
	ID       string `json:"product_id"`
	Name     string `json:"product_name"`
	Brand    string `json:"brand"`
	Category string `json:"category"`
	Tags     string `json:"tags"`
}
