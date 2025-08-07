package controllers

import (
	"encoding/json"
	"fmt"
	"io"
	"net/http"
	"os"
	"path/filepath"
	"strconv"
	"time"

	"github.com/gorilla/mux"
	"github.com/jishnu21/pkg/models"
)

const (
	MaxFileSize = 10 << 20 // 10MB
	UploadDir   = "./uploads"
)

func init() {
	// Create upload directory if it doesn't exist
	if _, err := os.Stat(UploadDir); os.IsNotExist(err) {
		os.MkdirAll(UploadDir, 0755)
	}
}

func UploadFiles(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")
	
	vars := mux.Vars(r)
	userID := vars["id"]
	Id, err := strconv.ParseInt(userID, 0, 0)
	if err != nil {
		http.Error(w, "Invalid user ID", http.StatusBadRequest)
		return
	}

	// Get user details
	userDetails, _ := models.GetUserByID(Id)
	if userDetails == nil {
		http.Error(w, "User not found", http.StatusNotFound)
		return
	}

	// Parse multipart form
	err = r.ParseMultipartForm(MaxFileSize)
	if err != nil {
		http.Error(w, "File too large", http.StatusBadRequest)
		return
	}

	file, fileHeader, err := r.FormFile("file")
	if err != nil {
		http.Error(w, "No file uploaded", http.StatusBadRequest)
		return
	}
	defer file.Close()

	// Validate file size
	if fileHeader.Size > MaxFileSize {
		http.Error(w, "File size too large (max 10MB)", http.StatusBadRequest)
		return
	}

	// Calculate credit cost
	creditCost := models.CalculateCreditCost(fileHeader.Size)

	// Check if user has enough credits
	if !userDetails.HasEnoughCredits(creditCost) {
		response := map[string]interface{}{
			"success":        false,
			"error":          "insufficient_credits",
			"message":        fmt.Sprintf("Insufficient credits. Required: %.2f, Available: %.2f", creditCost, userDetails.Credits),
			"required_credits": creditCost,
			"available_credits": userDetails.Credits,
		}
		w.WriteHeader(http.StatusPaymentRequired) // 402 Payment Required
		json.NewEncoder(w).Encode(response)
		return
	}

	// Create user-specific directory
	userDir := filepath.Join(UploadDir, fmt.Sprintf("user_%d", Id))
	if err := os.MkdirAll(userDir, 0755); err != nil {
		http.Error(w, "Failed to create user directory", http.StatusInternalServerError)
		return
	}

	// Generate unique filename
	timestamp := time.Now().Unix()
	filename := fmt.Sprintf("%d_%s", timestamp, fileHeader.Filename)
	localPath := filepath.Join(userDir, filename)

	// Save file locally
	dst, err := os.Create(localPath)
	if err != nil {
		http.Error(w, "Failed to create file", http.StatusInternalServerError)
		return
	}
	defer dst.Close()

	_, err = io.Copy(dst, file)
	if err != nil {
		os.Remove(localPath) // Clean up on error
		http.Error(w, "Failed to save file", http.StatusInternalServerError)
		return
	}

	// Create file record
	fileRecord := &models.File{
		UserID:       uint(Id),
		Name:         filename,
		OriginalName: fileHeader.Filename,
		LocalPath:    localPath,
		Size:         fileHeader.Size,
		MimeType:     fileHeader.Header.Get("Content-Type"),
		CreditCost:   creditCost,
	}

	// Upload to Cloudinary
	err = fileRecord.UploadToCloudinary(localPath)
	if err != nil {
		os.Remove(localPath) // Clean up local file
		http.Error(w, "Failed to upload to Cloudinary", http.StatusInternalServerError)
		return
	}

	// Save to database
	err = fileRecord.Create()
	if err != nil {
		os.Remove(localPath) // Clean up local file
		http.Error(w, "Failed to save file record", http.StatusInternalServerError)
		return
	}

	// Deduct credits from user account
	description := fmt.Sprintf("File upload: %s (%.2f MB)", fileHeader.Filename, float64(fileHeader.Size)/(1024*1024))
	err = userDetails.DeductCredits(creditCost, description, &fileRecord.ID)
	if err != nil {
		// If credit deduction fails, we should probably rollback the file upload
		// For now, we'll log the error and continue
		fmt.Printf("Failed to deduct credits: %v\n", err)
		http.Error(w, "Failed to process payment", http.StatusInternalServerError)
		return
	}

	response := map[string]interface{}{
		"success":           true,
		"message":           "File uploaded successfully",
		"file":              fileRecord,
		"credits_deducted":  creditCost,
		"remaining_credits": userDetails.Credits,
	}

	w.WriteHeader(http.StatusCreated)
	json.NewEncoder(w).Encode(response)
}

// Get user's current credit balance
func GetCredits(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")
	
	vars := mux.Vars(r)
	userID := vars["id"]
	Id, err := strconv.ParseInt(userID, 0, 0)
	if err != nil {
		http.Error(w, "Invalid user ID", http.StatusBadRequest)
		return
	}

	userDetails, _ := models.GetUserByID(Id)
	if userDetails == nil {
		http.Error(w, "User not found", http.StatusNotFound)
		return
	}

	response := map[string]interface{}{
		"success": true,
		"credits": userDetails.Credits,
		"user_id": userDetails.ID,
	}

	json.NewEncoder(w).Encode(response)
}

// Add credits to user account (for admin or purchase system)
func AddCredits(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")
	
	vars := mux.Vars(r)
	userID := vars["id"]
	Id, err := strconv.ParseInt(userID, 0, 0)
	if err != nil {
		http.Error(w, "Invalid user ID", http.StatusBadRequest)
		return
	}

	var request struct {
		Amount      float64 `json:"amount"`
		Type        string  `json:"type"`        // 'purchase', 'bonus', 'refund'
		Description string  `json:"description"`
	}

	if err := json.NewDecoder(r.Body).Decode(&request); err != nil {
		http.Error(w, "Invalid request body", http.StatusBadRequest)
		return
	}

	if request.Amount <= 0 {
		http.Error(w, "Amount must be positive", http.StatusBadRequest)
		return
	}

	userDetails, _ := models.GetUserByID(Id)
	if userDetails == nil {
		http.Error(w, "User not found", http.StatusNotFound)
		return
	}

	err = userDetails.AddCredits(request.Amount, request.Type, request.Description)
	if err != nil {
		http.Error(w, "Failed to add credits", http.StatusInternalServerError)
		return
	}

	response := map[string]interface{}{
		"success":         true,
		"message":         "Credits added successfully",
		"credits_added":   request.Amount,
		"current_credits": userDetails.Credits,
	}

	json.NewEncoder(w).Encode(response)
}

// func GetTransactions(w http.ResponseWriter, r *http.Request) {
// 	w.Header().Set("Content-Type", "application/json")
	
// 	vars := mux.Vars(r)
// 	userID := vars["id"]
// 	Id, err := strconv.ParseInt(userID, 0, 0)
// 	if err != nil {
// 		http.Error(w, "Invalid user ID", http.StatusBadRequest)
// 		return
// 	}

// 	// Parse query parameters for pagination
// 	page, _ := strconv.Atoi(r.URL.Query().Get("page"))
// 	limit, _ := strconv.Atoi(r.URL.Query().Get("limit"))
	
// 	if page < 1 {
// 		page = 1
// 	}
// 	if limit < 1 || limit > 100 {
// 		limit = 10
// 	}
	
// 	offset := (page - 1) * limit

// 	transactions, total, err := models.GetTransactionsByUserID(Id, limit, offset)
// 	if err != nil {
// 		http.Error(w, "Failed to fetch transactions", http.StatusInternalServerError)
// 		return
// 	}

// 	response := map[string]interface{}{
// 		"success":      true,
// 		"transactions": transactions,
// 		"total":        total,
// 		"page":         page,
// 		"limit":        limit,
// 	}

// 	json.NewEncoder(w).Encode(response)
// }

// Calculate upload cost (for frontend to show before upload)
func CalculateUploadCost(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")

	var request struct {
		FileSize int64 `json:"file_size"`
	}

	if err := json.NewDecoder(r.Body).Decode(&request); err != nil {
		http.Error(w, "Invalid request body", http.StatusBadRequest)
		return
	}

	cost := models.CalculateCreditCost(request.FileSize)

	response := map[string]interface{}{
		"success":     true,
		"credit_cost": cost,
		"file_size":   request.FileSize,
	}

	json.NewEncoder(w).Encode(response)
}

func ChangeDetails(w http.ResponseWriter, r *http.Request) {
	updateUser := &models.User{}
	if err := json.NewDecoder(r.Body).Decode(updateUser); err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}
	vars := mux.Vars(r)
	userID := vars["id"]
	Id, err := strconv.ParseInt(userID, 0, 0)
	if err != nil {
		http.Error(w, "Invalid user ID", http.StatusBadRequest)
		return
	}
	userDetails, db := models.GetUserByID(Id)
	if userDetails == nil {
		http.Error(w, "User not found", http.StatusNotFound)
		return
	}

	if updateUser.Name != "" {
		userDetails.Name = updateUser.Name
	}
	if updateUser.Email != "" {
		userDetails.Email = updateUser.Email
	}
	if updateUser.Phone != "" {
		userDetails.Phone = updateUser.Phone
	}
	if updateUser.Bio != "" {
		userDetails.Bio = updateUser.Bio
	}
	if updateUser.Image != "" {
		userDetails.Image = updateUser.Image
	}

	db.Save(&userDetails)
	res, _ := json.Marshal(userDetails)
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusOK)
	w.Write(res)
}

func GetAllFiles(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")
	
	vars := mux.Vars(r)
	userID := vars["id"]
	Id, err := strconv.ParseInt(userID, 0, 0)
	if err != nil {
		http.Error(w, "Invalid user ID", http.StatusBadRequest)
		return
	}

	// Parse query parameters for pagination
	page, _ := strconv.Atoi(r.URL.Query().Get("page"))
	limit, _ := strconv.Atoi(r.URL.Query().Get("limit"))
	
	if page < 1 {
		page = 1
	}
	if limit < 1 || limit > 100 {
		limit = 10
	}
	
	offset := (page - 1) * limit

	files, total, err := models.GetFilesByUserID(Id, limit, offset)
	if err != nil {
		http.Error(w, "Failed to fetch files", http.StatusInternalServerError)
		return
	}

	response := map[string]interface{}{
		"success": true,
		"files":   files,
		"total":   total,
		"page":    page,
		"limit":   limit,
	}

	json.NewEncoder(w).Encode(response)
}


func DeleteFile(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")
	
	vars := mux.Vars(r)
	userID := vars["id"]
	fileID := vars["fileId"]
	
	userId, err := strconv.ParseInt(userID, 0, 0)
	if err != nil {
		http.Error(w, "Invalid user ID", http.StatusBadRequest)
		return
	}
	
	fileId, err := strconv.ParseInt(fileID, 0, 0)
	if err != nil {
		http.Error(w, "Invalid file ID", http.StatusBadRequest)
		return
	}

	// Get file record
	fileRecord, err := models.GetFileByID(fileId, userId)
	if err != nil {
		http.Error(w, "File not found", http.StatusNotFound)
		return
	}

	// Delete local file
	if fileRecord.LocalPath != "" {
		os.Remove(fileRecord.LocalPath)
	}

	// Delete file record (this will also delete from Cloudinary)
	err = fileRecord.Delete()
	if err != nil {
		http.Error(w, "Failed to delete file", http.StatusInternalServerError)
		return
	}

	response := map[string]interface{}{
		"success": true,
		"message": "File deleted successfully",
	}

	json.NewEncoder(w).Encode(response)
}



func UserRegistration(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-type", "application/json")
	var user models.User
	if err := json.NewDecoder(r.Body).Decode(&user); err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}
	if err := user.Create(); err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
	res, _ := json.Marshal(user)
	w.WriteHeader(http.StatusCreated)
	w.Write(res)
}

func UserLogin(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-type", "application/json")
	var user models.User
	if err := json.NewDecoder(r.Body).Decode(&user); err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}
	if err := user.Login(); err != nil {
		http.Error(w, err.Error(), http.StatusUnauthorized)
		return
	}
	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(user)
}
