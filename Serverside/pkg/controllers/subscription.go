// controllers/subscription.go
package controllers

import (
	"crypto/hmac"
	"crypto/sha256"
	"encoding/hex"
	"encoding/json"
	"fmt"
	"net/http"
	"strconv"

	"github.com/gorilla/mux"
	"github.com/jishnu21/pkg/models"
	"github.com/razorpay/razorpay-go"
)

// Razorpay client - Initialize this in your main function or init
var razorpayClient *razorpay.Client
var razorpayKeySecret string // Store the key secret for signature verification

// Subscription plans
var subscriptionPlans = map[string]struct {
	Credits float64
	Price   int // Price in paise (₹500 = 50000 paise)
	Name    string
}{
	"plan_500": {
		Credits: 500,
		Price:   50000, // ₹500 in paise
		Name:    "500 Credits Plan",
	},
	"plan_1000": {
		Credits: 1000,
		Price:   100000, // ₹1000 in paise
		Name:    "1000 Credits Plan",
	},
}

// Initialize Razorpay client
func InitRazorpay(keyID, keySecret string) {
	razorpayClient = razorpay.NewClient(keyID, keySecret)
	razorpayKeySecret = keySecret // Store for signature verification
}

// Custom signature verification function
func verifySignature(orderID, paymentID, signature string) bool {
	data := orderID + "|" + paymentID
	h := hmac.New(sha256.New, []byte(razorpayKeySecret))
	h.Write([]byte(data))
	expectedSignature := hex.EncodeToString(h.Sum(nil))
	return hmac.Equal([]byte(signature), []byte(expectedSignature))
}

// Request structures
type CreateOrderRequest struct {
	PlanType string `json:"plan_type"` // "plan_500" or "plan_1000"
}

type VerifyPaymentRequest struct {
	RazorpayOrderID   string `json:"razorpay_order_id"`
	RazorpayPaymentID string `json:"razorpay_payment_id"`
	RazorpaySignature string `json:"razorpay_signature"`
}

// Response structures
type CreateOrderResponse struct {
	OrderID     string  `json:"order_id"`
	Amount      int     `json:"amount"`
	Currency    string  `json:"currency"`
	Credits     float64 `json:"credits"`
	Description string  `json:"description"`
}

type VerifyPaymentResponse struct {
	Success       bool    `json:"success"`
	Message       string  `json:"message"`
	CreditsAdded  float64 `json:"credits_added,omitempty"`
	TotalCredits  float64 `json:"total_credits,omitempty"`
	TransactionID uint    `json:"transaction_id,omitempty"`
}

// CreateSubscriptionOrder creates a Razorpay order for subscription
func CreateSubscriptionOrder(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")
	
	// Get user ID from URL
	vars := mux.Vars(r)
	userID, err := strconv.ParseInt(vars["id"], 10, 64)
	if err != nil {
		w.WriteHeader(http.StatusBadRequest)
		json.NewEncoder(w).Encode(map[string]string{"error": "Invalid user ID"})
		return
	}

	// Get user to verify existence
	user, db := models.GetUserByID(userID)
	if db.Error != nil || user == nil {
		w.WriteHeader(http.StatusNotFound)
		json.NewEncoder(w).Encode(map[string]string{"error": "User not found"})
		return
	}

	// Parse request body
	var req CreateOrderRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		w.WriteHeader(http.StatusBadRequest)
		json.NewEncoder(w).Encode(map[string]string{"error": "Invalid request body"})
		return
	}

	// Validate plan type
	plan, exists := subscriptionPlans[req.PlanType]
	if !exists {
		w.WriteHeader(http.StatusBadRequest)
		json.NewEncoder(w).Encode(map[string]string{"error": "Invalid plan type"})
		return
	}

	// Create Razorpay order
	data := map[string]interface{}{
		"amount":   plan.Price, // Amount in paise
		"currency": "INR",
		"receipt":  fmt.Sprintf("receipt_%d_%s", userID, req.PlanType),
		"notes": map[string]interface{}{
			"user_id":   fmt.Sprintf("%d", userID),
			"plan_type": req.PlanType,
			"credits":   fmt.Sprintf("%.0f", plan.Credits),
		},
	}

	order, err := razorpayClient.Order.Create(data, nil)
	if err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		json.NewEncoder(w).Encode(map[string]string{"error": "Failed to create order"})
		return
	}

	response := CreateOrderResponse{
		OrderID:     order["id"].(string),
		Amount:      plan.Price,
		Currency:    "INR",
		Credits:     plan.Credits,
		Description: plan.Name,
	}

	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(response)
}

// VerifySubscriptionPayment verifies the payment and adds credits to user account
func VerifySubscriptionPayment(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")
	
	// Get user ID from URL
	vars := mux.Vars(r)
	userID, err := strconv.ParseInt(vars["id"], 10, 64)
	if err != nil {
		w.WriteHeader(http.StatusBadRequest)
		json.NewEncoder(w).Encode(VerifyPaymentResponse{
			Success: false,
			Message: "Invalid user ID",
		})
		return
	}

	// Get user
	user, db := models.GetUserByID(userID)
	if db.Error != nil || user == nil {
		w.WriteHeader(http.StatusNotFound)
		json.NewEncoder(w).Encode(VerifyPaymentResponse{
			Success: false,
			Message: "User not found",
		})
		return
	}

	// Parse request body
	var req VerifyPaymentRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		w.WriteHeader(http.StatusBadRequest)
		json.NewEncoder(w).Encode(VerifyPaymentResponse{
			Success: false,
			Message: "Invalid request body",
		})
		return
	}

	// Verify payment signature using custom function
	if !verifySignature(req.RazorpayOrderID, req.RazorpayPaymentID, req.RazorpaySignature) {
		w.WriteHeader(http.StatusBadRequest)
		json.NewEncoder(w).Encode(VerifyPaymentResponse{
			Success: false,
			Message: "Invalid payment signature",
		})
		return
	}

	// Fetch order details from Razorpay to get plan information
	order, err := razorpayClient.Order.Fetch(req.RazorpayOrderID, nil, nil)
	if err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		json.NewEncoder(w).Encode(VerifyPaymentResponse{
			Success: false,
			Message: "Failed to fetch order details",
		})
		return
	}

	// Extract plan type from order notes
	notes := order["notes"].(map[string]interface{})
	planType := notes["plan_type"].(string)
	
	// Get plan details
	plan, exists := subscriptionPlans[planType]
	if !exists {
		w.WriteHeader(http.StatusBadRequest)
		json.NewEncoder(w).Encode(VerifyPaymentResponse{
			Success: false,
			Message: "Invalid plan type in order",
		})
		return
	}

	// Add credits to user account
	description := fmt.Sprintf("Credits purchased - %s (Payment ID: %s)", plan.Name, req.RazorpayPaymentID)
	err = user.AddCredits(plan.Credits, "purchase", description)
	if err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		json.NewEncoder(w).Encode(VerifyPaymentResponse{
			Success: false,
			Message: "Failed to add credits to account",
		})
		return
	}

	// Get the latest transaction ID for reference
	transactions, _, _ := models.GetTransactionsByUserID(userID, 1, 0)
	var transactionID uint
	if len(transactions) > 0 {
		transactionID = transactions[0].ID
	}

	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(VerifyPaymentResponse{
		Success:       true,
		Message:       "Payment verified and credits added successfully",
		CreditsAdded:  plan.Credits,
		TotalCredits:  user.Credits,
		TransactionID: transactionID,
	})
}

// GetSubscriptionPlans returns available subscription plans
func GetSubscriptionPlans(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")
	
	type PlanResponse struct {
		ID          string  `json:"id"`
		Name        string  `json:"name"`
		Credits     float64 `json:"credits"`
		Price       int     `json:"price"`        // Price in paise
		PriceRupees float64 `json:"price_rupees"` // Price in rupees for display
	}

	var plans []PlanResponse
	for id, plan := range subscriptionPlans {
		plans = append(plans, PlanResponse{
			ID:          id,
			Name:        plan.Name,
			Credits:     plan.Credits,
			Price:       plan.Price,
			PriceRupees: float64(plan.Price) / 100, // Convert paise to rupees
		})
	}

	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(map[string]interface{}{
		"plans": plans,
	})
}

// GetUserCredits returns user's current credit balance
func GetUserCredits(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")
	
	// Get user ID from URL
	vars := mux.Vars(r)
	userID, err := strconv.ParseInt(vars["id"], 10, 64)
	if err != nil {
		w.WriteHeader(http.StatusBadRequest)
		json.NewEncoder(w).Encode(map[string]string{"error": "Invalid user ID"})
		return
	}

	// Get user
	user, db := models.GetUserByID(userID)
	if db.Error != nil || user == nil {
		w.WriteHeader(http.StatusNotFound)
		json.NewEncoder(w).Encode(map[string]string{"error": "User not found"})
		return
	}

	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(map[string]interface{}{
		"user_id": user.ID,
		"credits": user.Credits,
	})
}

// Add this function to your controllers/subscription.go file

// GetTransactions returns user's transaction history
func GetTransactions(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")
	
	// Get user ID from URL
	vars := mux.Vars(r)
	userID, err := strconv.ParseInt(vars["id"], 10, 64)
	if err != nil {
		w.WriteHeader(http.StatusBadRequest)
		json.NewEncoder(w).Encode(map[string]string{"error": "Invalid user ID"})
		return
	}

	// Get user to verify existence
	user, db := models.GetUserByID(userID)
	if db.Error != nil || user == nil {
		w.WriteHeader(http.StatusNotFound)
		json.NewEncoder(w).Encode(map[string]string{"error": "User not found"})
		return
	}

	// Parse query parameters for pagination
	limitStr := r.URL.Query().Get("limit")
	offsetStr := r.URL.Query().Get("offset")
	
	limit := 10 // default limit
	offset := 0 // default offset
	
	if limitStr != "" {
		if parsedLimit, err := strconv.Atoi(limitStr); err == nil && parsedLimit > 0 {
			limit = parsedLimit
		}
	}
	
	if offsetStr != "" {
		if parsedOffset, err := strconv.Atoi(offsetStr); err == nil && parsedOffset >= 0 {
			offset = parsedOffset
		}
	}

	// Get transactions from database
	transactions, total, err := models.GetTransactionsByUserID(userID, limit, offset)
	if err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		json.NewEncoder(w).Encode(map[string]string{"error": "Failed to fetch transactions"})
		return
	}

	// Transform transactions for response
	type TransactionResponse struct {
		ID          uint    `json:"id"`
		Date        string  `json:"date"`
		Type        string  `json:"type"`
		Amount      float64 `json:"amount"`
		Credits     float64 `json:"credits"`
		Description string  `json:"description"`
		Status      string  `json:"status"`
	}

	var responseTransactions []TransactionResponse
	for _, transaction := range transactions {
		responseTransactions = append(responseTransactions, TransactionResponse{
			ID:          transaction.ID,
			Type:        transaction.Type,
			Amount:      transaction.Amount,
			Description: transaction.Description,
			Status:      "completed", // Assuming all fetched transactions are completed
		})
	}

	response := map[string]interface{}{
		"transactions": responseTransactions,
		"total":        total,
		"limit":        limit,
		"offset":       offset,
		"user_id":      userID,
		"current_credits": user.Credits,
	}

	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(response)
}