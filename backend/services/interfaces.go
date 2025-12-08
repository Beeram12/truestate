package services

import models "github.com/Beeram12/truestate/backend/models"

type TransactionService interface {
	// Initialize and sets up the database
	DatabaseInit() error

	// import the data present in CSV into database
	SeeData(filePath string) error

	// Retrives the data based on filter,searc and sort criteria
	GetTransactions(filter models.FilterParams) (*models.PaginatedResponse, error)

	// Get summary statistics
	GetSummaryStats(filter models.FilterParams) (*models.SummaryStats, error)

	// Get filter options
	GetFilterOptions() (*models.FilterOptions, error)
}