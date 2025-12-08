package routes

import (
	"github.com/Beeram12/truestate/backend/controllers"
	"github.com/Beeram12/truestate/backend/services"
	"github.com/gin-gonic/gin"
)

func SetupRoutes(service services.TransactionService) *gin.Engine {
	router := gin.Default()

	router.Use(func(c *gin.Context) {
		c.Writer.Header().Set("Access-Control-Allow-Origin", "*")
		c.Writer.Header().Set("Access-Control-Allow-Credentials", "true")
		c.Writer.Header().Set("Access-Control-Allow-Headers", "Content-Type, Content-Length, Accept-Encoding, X-CSRF-Token, Authorization, accept, origin, Cache-Control, X-Requested-With")
		c.Writer.Header().Set("Access-Control-Allow-Methods", "POST, OPTIONS, GET, PUT, DELETE")

		if c.Request.Method == "OPTIONS" {
			c.AbortWithStatus(204)
			return
		}

		c.Next()
	})

	salesController := controllers.NewSalesController(service)

	router.GET("/", func(c *gin.Context) {
		c.JSON(200, gin.H{
			"message": "Sales Management System API",
			"version": "1.0.0",
			"endpoints": gin.H{
				"GET /api/sales":           "Get paginated transactions with filters",
				"GET /api/sales/summary":   "Get summary statistics",
				"GET /api/filters/options": "Get available filter options",
			},
		})
	})

	api := router.Group("/api")
	{
		sales := api.Group("/sales")
		{
			sales.GET("", salesController.GetTransactions)
			sales.GET("/summary", salesController.GetSummaryStats)
		}
		api.GET("/filters/options", salesController.GetFilterOptions)
	}

	return router
}
