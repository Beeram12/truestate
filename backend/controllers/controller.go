package controllers

import (
	"net/http"
	"strconv"
	"strings"

	model "github.com/Beeram12/truestate/backend/models"
	"github.com/Beeram12/truestate/backend/services"
	"github.com/gin-gonic/gin"
)

func parseTags(tagStr string) []string {
	if tagStr == "" {
		return []string{}
	}

	tags := strings.Split(tagStr, ",")
	result := make([]string, 0, len(tags))
	for _, tag := range tags {
		tag = strings.TrimSpace(tag)
		if tag != "" {
			result = append(result, tag)
		}
	}
	return result
}

type SalesController struct {
	service services.TransactionService
}

func NewSalesController(service services.TransactionService) *SalesController {
	return &SalesController{
		service: service,
	}
}

func (sc *SalesController) GetTransactions(c *gin.Context) {

	// Default parameters
	params := model.FilterParams{
		Page:  1,
		Limit: 10,
	}

	// Pagination parameters
	search := c.Query("search")
	if search != "" {
		params.Search = search
	}

	pageStr := c.Query("page")
	if pageStr != "" {
		if page, err := strconv.Atoi(pageStr); err == nil && page > 0 {
			params.Page = page
		}
	}

	limitStr := c.Query("pageSize")
	if limitStr != "" {
		if limit, err := strconv.Atoi(limitStr); err == nil && limit > 0 {
			params.Limit = limit
		}
	}

	// Sorting parameters
	sortField := c.Query("sortField")
	if sortField != "" {
		params.SortBy = sortField
	}

	sortDir := c.Query("sortDirection")
	if sortDir != "" {
		params.SortOrder = sortDir
	}

	// multi-select filters
	params.Region = c.QueryArray("region")
	params.Gender = c.Query("gender")
	params.Category = c.QueryArray("category")
	params.Tag = c.QueryArray("tag")
	params.PaymentMethod = c.QueryArray("payment_method")

	if ageMinStr := c.Query("min_age"); ageMinStr != "" {
		if ageMin, err := strconv.Atoi(ageMinStr); err == nil {
			params.MinAge = ageMin
		}
	}
	if ageMaxStr := c.Query("max_age"); ageMaxStr != "" {
		if ageMax, err := strconv.Atoi(ageMaxStr); err == nil {
			params.MaxAge = ageMax
		}
	}

	// date ranges
	if dateStart := c.Query("start_date"); dateStart != "" {
		params.StartDate = dateStart
	}
	if dateEnd := c.Query("end_date"); dateEnd != "" {
		params.EndDate = dateEnd
	}

	// fetch data
	response, err := sc.service.GetTransactions(params)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	transaction := make([]gin.H, len(response.Data))

	for i, t := range response.Data {
		transaction[i] = gin.H{
			"transaction_id":      t.TransactionID,
			"date":                t.Date,
			"customer_id":         t.Customer.ID,
			"customer_name":       t.Customer.Name,
			"phone":               t.Customer.Phone,
			"gender":              t.Customer.Gender,
			"age":                 t.Customer.Age,
			"region":              t.Customer.Region,
			"customer_type":       t.Customer.Type,
			"product_id":          t.Product.ID,
			"product_name":        t.Product.Name,
			"brand":               t.Product.Brand,
			"category":            t.Product.Category,
			"tags":                parseTags(t.Product.Tags),
			"quantity":            t.Sales.Quantity,
			"price_per_unit":      t.Sales.Price,
			"discount_percentage": t.Sales.Discount,
			"total_amount":        t.Sales.Total,
			"final_amount":        t.Sales.Final,
			"payment_method":      t.Logistics.PaymentMethod,
			"ordered_status":      t.Logistics.OrderStatus,
			"delivery_type":       t.Logistics.DeliveryType,
			"store_id":            t.Logistics.StoreID,
			"store_location":      t.Logistics.StoreLocation,
			"salesperson_id":      t.Logistics.SalesPersonID,
			"employee_name":       t.Logistics.EmployeeName,
		}
	}

	frontendResponse := gin.H{
		"transactions": transaction,
		"total":        response.Total,
		"page":         response.Page,
		"pageSize":     response.Limit,
		"totalPages":   response.TotalPages,
	}

	c.JSON(http.StatusOK, frontendResponse)
}

func (sc *SalesController) GetSummaryStats(c *gin.Context) {
	params := model.FilterParams{}

	if search := c.Query("search"); search != "" {
		params.Search = search
	}

	params.Region = c.QueryArray("region")
	params.Gender = c.Query("gender")
	params.Category = c.QueryArray("category")
	params.Tag = c.QueryArray("tag")
	params.PaymentMethod = c.QueryArray("payment_method")

	if ageMinStr := c.Query("min_age"); ageMinStr != "" {
		if ageMin, err := strconv.Atoi(ageMinStr); err == nil {
			params.MinAge = ageMin
		}
	}
	if ageMaxStr := c.Query("max_age"); ageMaxStr != "" {
		if ageMax, err := strconv.Atoi(ageMaxStr); err == nil {
			params.MaxAge = ageMax
		}
	}

	// date ranges
	if dateStart := c.Query("start_date"); dateStart != "" {
		params.StartDate = dateStart
	}
	if dateEnd := c.Query("end_date"); dateEnd != "" {
		params.EndDate = dateEnd
	}

	stats, err := sc.service.GetSummaryStats(params)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, stats)
}

func (sc *SalesController) GetFilterOptions(c *gin.Context) {
	options, err := sc.service.GetFilterOptions()
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"regions":         options.Regions,
		"genders":         options.Genders,
		"categories":      options.Categories,
		"tags":            options.Tags,
		"payment_methods": options.PaymentMethods,
	})
}