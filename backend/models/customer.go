package model

type Customer struct {
	ID     string `json:"customer_id"`
	Name   string `json:"customer_name"`
	Phone  string `json:"phone"`
	Gender string `josn:"gender"`
	Age    int    `json:"age"`
	Region string `json:"region"`
	Type   string `json:"customer_type"`
}





