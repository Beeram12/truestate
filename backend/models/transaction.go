package model

type Transaction struct {
	TransactionID string    `json:"transaction_id"`
	Date          string    `json:"date"`
	Customer      Customer  `json:"customer"`
	Product       Product   `json:"product"`
	Sales         SalesInfo `json:"sales"`
	Logistics     Logistics `json:"logistics"`
}
