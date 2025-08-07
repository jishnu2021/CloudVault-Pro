package config

import (
	"gorm.io/gorm"
	"gorm.io/driver/mysql"
)

var DB *gorm.DB

func ConnectDB() {
	dsn := "root:OqqvlUbxmyiwlYkzBfGmXocopsFjSbYf@tcp(trolley.proxy.rlwy.net:36587)/railway?charset=utf8mb4&parseTime=True&loc=Local"

	var err error
	DB, err = gorm.Open(mysql.Open(dsn), &gorm.Config{})
	if err != nil {
		panic("Failed to connect to database: " + err.Error())
	}
}

func GetDB() *gorm.DB {
	return DB
}
