package services

import (
	"encoding/csv"
	"fmt"
	"log"
	"os"
	"strconv"
	"strings"

	model "github.com/Beeram12/truestate/backend/models"
	"gorm.io/driver/mysql"
	"gorm.io/gorm"
)

type SQLiteDB struct {
	DB *gorm.DB
}

var _TransactionService = &SQLiteDB{}

func NewDbInstance() *SQLiteDB {
	return &SQLiteDB{}
}

func (s *SQLiteDB) DatabaseInit() error {
	dsn := os.Getenv("DB_DSN")
	db, err := gorm.Open(mysql.Open(dsn), &gorm.Config{})
	if err != nil {
		return err
	}

	err = db.AutoMigrate(&model.Transaction{})
	if err != nil {
		return fmt.Errorf("failed to migrate database: %w", err)
	}
	s.DB = db
	return err
}

func (s *SQLiteDB) SeeData(filePath string) error {
	// check if data already exists in the database
	var count int64
	s.DB.Model(&model.Transaction{}).Count(&count)
	if count > 0 {
		log.Printf("Database already contains %d records, skipping import", count)
		return nil
	}

	// Open the file
	file, err := os.Open(filePath)
	if err != nil {
		return err
	}
	defer file.Close()

	data := csv.NewReader(file)
	_, _ = data.Read()

	rows, err := data.ReadAll()
	if err != nil {
		return err
	}

	var transactions []model.Transaction

	for _, row := range rows {
		age, _ := strconv.Atoi(row[6])
		quantity, _ := strconv.Atoi(row[14])
		price, _ := strconv.ParseFloat(row[15], 64)
		discount, _ := strconv.ParseFloat(row[16], 64)
		total, _ := strconv.ParseFloat(row[17], 64)
		final, _ := strconv.ParseFloat(row[18], 64)

		transac := model.Transaction{
			TransactionID: row[0],
			Date:          row[1],
			Customer: model.Customer{
				ID:     row[2],
				Name:   row[3],
				Phone:  row[4],
				Gender: row[5],
				Age:    age,
				Region: row[7],
				Type:   row[8],
			},
			Product: model.Product{
				ID:       row[9],
				Name:     row[10],
				Brand:    row[11],
				Category: row[12],
				Tags:     row[13],
			},
			Sales: model.SalesInfo{
				Quantity: quantity,
				Price:    price,
				Discount: discount,
				Total:    total,
				Final:    final,
			},
			Logistics: model.Logistics{
				PaymentMethod: row[19],
				OrderStatus:   row[20],
				DeliveryType:  row[21],
				StoreID:       row[22],
				StoreLocation: row[23],
				SalesPersonID: row[24],
				EmployeeName:  row[25],
			},
		}
		transactions = append(transactions, transac)
	}
	return s.DB.CreateInBatches(transactions, 100).Error
}

func (s *SQLiteDB) GetTransactions(p model.FilterParams) (*model.PaginatedResponse, error) {
	var transactions []model.Transaction

	var total int64

	query := s.DB.Model(&model.Transaction{})

	// Search filter also case insensitive
	if p.Search != "" {
		search := "%" + strings.ToLower(p.Search) + "%"
		query = query.Where("LOWER(customer_name) LIKE ? OR phone LIKE ?", search, search)
	}

	// Region Filters
	if len(p.Region) > 0 {
		query = query.Where("region IN ?", p.Region)
	}

	// Gender Filter
	if p.Gender != "" {
		query = query.Where("gender = ?", p.Gender)
	}

	// Cateogory filter
	if len(p.Category) > 0 {
		query = query.Where("category IN ?", p.Category)
	}

	// Age Range filter
	if p.MinAge > 0 {
		query = query.Where("age >= ?", p.MinAge)
	}
	if p.MaxAge > 0 {
		query = query.Where("age <= ?", p.MaxAge)
	}

	// Tags filter
	if len(p.Tag) > 0 {
		for _, tag := range p.Tag {
			query = query.Where("tags LIKE ?", "%"+tag+"%")
		}
	}

	// Payment filter
	if len(p.PaymentMethod) > 0 {
		query = query.Where("payment_method IN ?", p.PaymentMethod)
	}

	// Date range filter
	if p.StartDate != "" && p.EndDate != "" {
		query = query.Where("date BETWEEN ? AND ?", p.StartDate, p.EndDate)
	}

	// Total count
	query.Count(&total)

	// Sorting
	if p.SortBy != "" {
		sortOrder := "ASC"
		if p.SortOrder == "desc" {
			sortOrder = "DESC"
		}

		switch p.SortBy {
		case "date":
			query = query.Order("date" + sortOrder)
		case "quantity":
			query = query.Order("quantity" + sortOrder)
		case "customer_name":
			query = query.Order("customer_name" + sortOrder)
		default:
			query = query.Order("date DESC")
		}
	} else {
		query = query.Order("date DESC")
	}

	// Pagination

	if p.Limit <= 0 {
		p.Limit = 10
	}
	if p.Page <= 0 {
		p.Page = 1
	}

	offset := (p.Page - 1) * p.Limit
	query = query.Offset(offset).Limit(p.Limit)

	err := query.Find(&transactions).Error
	if err != nil {
		return nil, err
	}

	totalPages := int((total + int64(p.Limit) - 1) / int64(p.Limit))

	return &model.PaginatedResponse{
		Total:      int(total),
		Page:       p.Page,
		Limit:      p.Limit,
		TotalPages: totalPages,
		Data:       transactions,
	}, nil
}
