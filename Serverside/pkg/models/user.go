// models/user.go - Updated with credit system
package models

import (
	"context"
	"fmt"
	"time"

	"github.com/cloudinary/cloudinary-go/v2"
	"github.com/cloudinary/cloudinary-go/v2/api/uploader"
	"github.com/jishnu21/pkg/config"
	"gorm.io/gorm"
)

var db *gorm.DB
var cld *cloudinary.Cloudinary

// Credit costs for different file operations
const (
	CREDIT_COST_PER_MB    = 0.1  // 0.1 credits per MB
	MIN_CREDIT_COST       = 0.5  // Minimum cost per file
	MAX_CREDIT_COST       = 5.0  // Maximum cost per file
)

type User struct {
	ID           uint          `json:"id" gorm:"primaryKey;autoIncrement"`
	Name         string        `json:"name" gorm:"not null"`
	Email        string        `json:"email" gorm:"not null;unique"`
	Password     string        `json:"password" gorm:"not null"`
	Phone        string        `json:"phone"`
	Bio          string        `json:"bio"`
	Image        string        `json:"image"`
	Credits      float64       `json:"credits" gorm:"default:5"`
	Transactions []Transaction `json:"transactions" gorm:"foreignKey:UserID;references:ID"`
	Files        []File        `json:"files" gorm:"foreignKey:UserID;references:ID"`
}

type File struct {
	ID            uint    `json:"id" gorm:"primaryKey;autoIncrement"`
	UserID        uint    `json:"user_id" gorm:"not null"`
	Name          string  `json:"name" gorm:"not null"`
	OriginalName  string  `json:"original_name" gorm:"not null"`
	LocalPath     string  `json:"local_path"`
	CloudinaryURL string  `json:"cloudinary_url" gorm:"not null"`
	PublicID      string  `json:"public_id" gorm:"not null"`
	Size          int64   `json:"size" gorm:"not null"`
	MimeType      string  `json:"mime_type"`
	CreditCost    float64 `json:"credit_cost" gorm:"not null"` // New field for credit tracking
	CreatedAt     int64   `json:"created_at"`
}

type Transaction struct {
	ID          uint    `json:"id" gorm:"primaryKey;autoIncrement"`
	UserID      uint    `json:"user_id" gorm:"not null"`
	Amount      float64 `json:"amount"`
	Type        string  `json:"type" gorm:"not null"` // 'upload', 'purchase', 'refund'
	Description string  `json:"description"`
	FileID      *uint   `json:"file_id,omitempty"` // Reference to file if transaction is for upload
	CreatedAt   int64   `json:"created_at"`
}

func init() {
	config.ConnectDB()
	db = config.GetDB()
	if db != nil {
		db.AutoMigrate(&User{}, &Transaction{}, &File{})
		initCloudinary()
	} else {
		panic("Database connection failed")
	}
}

func initCloudinary() {
	var err error
	// Initialize Cloudinary with your credentials
	cloudName := "dye6ufc6g"    // Set from env
	apiKey := "437421134947255"         // Set from env
	apiSecret := "m1pUIlEMJAldLgyJdabs-JFo22w"   // Set from env
	
	cld, err = cloudinary.NewFromParams(cloudName, apiKey, apiSecret)
	if err != nil {
		panic("Failed to initialize Cloudinary: " + err.Error())
	}
}

// User methods
func (u *User) Create() error {
	return db.Create(u).Error
}

func (u *User) UpdateProfile() error {
	return db.Model(u).Select("name", "email", "phone", "bio", "image").Updates(u).Error
}

func (u *User) Login() error {
	return db.Where("email = ? AND password = ?", u.Email, u.Password).First(u).Error
}

// Calculate credit cost based on file size
func CalculateCreditCost(fileSizeBytes int64) float64 {
	sizeInMB := float64(fileSizeBytes) / (1024 * 1024)
	cost := sizeInMB * CREDIT_COST_PER_MB
	
	// Apply minimum and maximum limits
	if cost < MIN_CREDIT_COST {
		cost = MIN_CREDIT_COST
	}
	if cost > MAX_CREDIT_COST {
		cost = MAX_CREDIT_COST
	}
	
	// Round to 2 decimal places
	return float64(int(cost*100)) / 100
}

// Check if user has enough credits for upload
func (u *User) HasEnoughCredits(requiredCredits float64) bool {
	return u.Credits >= requiredCredits
}

// Deduct credits from user account
func (u *User) DeductCredits(amount float64, description string, fileID *uint) error {
	return db.Transaction(func(tx *gorm.DB) error {
		// Update user credits
		result := tx.Model(u).Update("credits", gorm.Expr("credits - ?", amount))
		if result.Error != nil {
			return result.Error
		}
		
		// Create transaction record
		transaction := Transaction{
			UserID:      u.ID,
			Amount:      -amount, // Negative for deduction
			Type:        "upload",
			Description: description,
			FileID:      fileID,
			CreatedAt:   time.Now().Unix(),
		}
		
		if err := tx.Create(&transaction).Error; err != nil {
			return err
		}
		
		// Update user's credits in memory
		u.Credits -= amount
		return nil
	})
}

// Add credits to user account (for purchases, bonuses, etc.)
func (u *User) AddCredits(amount float64, transactionType, description string) error {
	return db.Transaction(func(tx *gorm.DB) error {
		// Update user credits
		result := tx.Model(u).Update("credits", gorm.Expr("credits + ?", amount))
		if result.Error != nil {
			return result.Error
		}
		
		// Create transaction record
		transaction := Transaction{
			UserID:      u.ID,
			Amount:      amount, // Positive for addition
			Type:        transactionType,
			Description: description,
			CreatedAt:   time.Now().Unix(),
		}
		
		if err := tx.Create(&transaction).Error; err != nil {
			return err
		}
		
		// Update user's credits in memory
		u.Credits += amount
		return nil
	})
}

func GetUserByID(id int64) (*User, *gorm.DB) {
	var user User
	db := db.Where("id = ?", id).Find(&user)
	if db.RowsAffected == 0 {
		return nil, db
	}
	return &user, db
}

// File methods
func (f *File) Create() error {
	f.CreatedAt = time.Now().Unix()
	return db.Create(f).Error
}

func (f *File) UploadToCloudinary(localPath string) error {
	ctx := context.Background() // just like Start a background process to talk with Cloudinary.
	
	// Generate public ID
	publicID := fmt.Sprintf("uploads/%d_%s", time.Now().Unix(), f.Name)
	
	// Upload to Cloudinary
	uploadResult, err := cld.Upload.Upload(ctx, localPath, uploader.UploadParams{
		PublicID: publicID,
		Folder:   "user_uploads",
	})
	if err != nil {
		return err
	}
	
	f.CloudinaryURL = uploadResult.SecureURL
	f.PublicID = uploadResult.PublicID
	return nil
}

func GetFilesByUserID(userID int64, limit, offset int) ([]File, int64, error) {
	var files []File
	var total int64
	
	// Get total count
	db.Model(&File{}).Where("user_id = ?", userID).Count(&total)
	
	// Get files with pagination
	err := db.Where("user_id = ?", userID).
		Order("created_at DESC").
		Limit(limit).
		Offset(offset).
		Find(&files).Error
	
	return files, total, err
}

func GetFileByID(fileID, userID int64) (*File, error) {
	var file File
	err := db.Where("id = ? AND user_id = ?", fileID, userID).First(&file).Error
	if err != nil {
		return nil, err
	}
	return &file, nil
}

func (f *File) Delete() error {
	return db.Transaction(func(tx *gorm.DB) error {
		// Get user to refund credits
		var user User
		if err := tx.Where("id = ?", f.UserID).First(&user).Error; err != nil {
			return err
		}
		
		// Refund credits (optional - you can decide if you want to refund)
		refundAmount := f.CreditCost * 0.5 // Refund 50% of original cost
		if err := user.AddCredits(refundAmount, "refund", fmt.Sprintf("Partial refund for deleted file: %s", f.OriginalName)); err != nil {
			// Log error but don't fail the deletion
			fmt.Printf("Failed to refund credits: %v\n", err)
		}
		
		// Delete from Cloudinary
		ctx := context.Background()
		_, err := cld.Upload.Destroy(ctx, uploader.DestroyParams{
			PublicID: f.PublicID,
		})
		if err != nil {
			// Log error but don't fail the operation
			fmt.Printf("Failed to delete from Cloudinary: %v\n", err)
		}
		
		// Delete from database
		return tx.Delete(f).Error
	})
}

// Get user's transactions with pagination
func GetTransactionsByUserID(userID int64, limit, offset int) ([]Transaction, int64, error) {
	var transactions []Transaction
	var total int64
	
	// Get total count
	db.Model(&Transaction{}).Where("user_id = ?", userID).Count(&total)
	
	// Get transactions with pagination
	err := db.Where("user_id = ?", userID).
		Order("created_at DESC").
		Limit(limit).
		Offset(offset  ).
		Find(&transactions).Error
	
	return transactions, total, err
}