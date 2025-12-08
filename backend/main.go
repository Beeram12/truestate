package main

import (
	"log"
	"os"

	"github.com/Beeram12/truestate/backend/routes"
	"github.com/Beeram12/truestate/backend/services"
	"github.com/joho/godotenv"
)

func main() {
	if err := godotenv.Load(); err != nil {
		log.Println("Note: No .env file found (using system environment variables)")
	}

	service := services.NewDbInstance()

	log.Println("Connecting to MySQL...")
	if err := service.DatabaseInit(); err != nil {
		log.Fatalf("CRITICAL ERROR: Failed to connect or migrate: %v", err)
	}
	log.Println("✅ Success: Connected and Table 'transactions' created!")

	log.Println("Checking for existing data...")
	if err := service.SeeData("Project_Data.csv"); err != nil {
		log.Printf("⚠️ Data seeding skipped or failed: %v", err)
	} else {
		log.Println("✅ Database is ready with data!")
	}

	router := routes.SetupRoutes(service)

	port := os.Getenv("PORT")
	if port == "" {
		port = "8080"
	}

	log.Printf("🚀 Starting server on port %s...", port)
	log.Printf("📡 API endpoints available at: http://localhost:%s/api", port)
	log.Printf("   - GET /api/sales - Get transactions")
	log.Printf("   - GET /api/sales/summary - Get summary stats")
	log.Printf("   - GET /api/filters/options - Get filter options")

	if err := router.Run(":" + port); err != nil {
		log.Fatalf("Failed to start server: %v", err)
	}
}
