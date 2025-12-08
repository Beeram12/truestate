package model

type Logistics struct {
	PaymentMethod string `json:"payment_method"`
	OrderStatus   string `json:"ordered_status"`
	DeliveryType  string `json:"delivery_type"`
	StoreID       string `json:"store_id"`
	StoreLocation string `json:"store_location"`
	SalesPersonID string `json:"salesperson_id"`
	EmployeeName  string `json:"employee_name"`
}