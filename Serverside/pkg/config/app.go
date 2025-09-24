package config

import (
	"log"
	"os"

	"gorm.io/driver/postgres"
	"gorm.io/gorm"
)

var DB *gorm.DB

func ConnectDB() {
	// Use the Internal Database URL from Render
	// Example: postgresql://user:password@host:5432/dbname
	dsn := "postgresql://clouddatabase_1moh_user:WEGp588jC2UEK6RFi5mo5mZ7mjx5Kl0g@dpg-d39qc93e5dus73bm99c0-a/clouddatabase_1moh"

	var err error
	DB, err = gorm.Open(postgres.Open(dsn), &gorm.Config{})
	if err != nil {
		log.Fatal("❌ Failed to connect to database:", err)
	}

	log.Println("✅ Database connected successfully")
}

func GetDB() *gorm.DB {
	return DB
}
