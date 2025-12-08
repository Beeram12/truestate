package model

type Transaction struct {
	TransactionID string    `json:"transaction_id" gorm:"primaryKey"`
	Date          string    `json:"date"`
	Customer      Customer  `json:"customer" gorm:"embedded;embeddedPrefix:customer_"`
	Product       Product   `json:"product" gorm:"embedded;embeddedPrefix:product_"`
	Sales         SalesInfo `json:"sales" gorm:"embedded;embeddedPrefix:sales_"`
	Logistics     Logistics `json:"logistics" gorm:"embedded;embeddedPrefix:logistics_"`
}
