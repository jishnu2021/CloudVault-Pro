package main

import (
    "log"
    "net/http"
    "github.com/gorilla/mux"
    "github.com/gorilla/handlers"
    "github.com/jishnu21/pkg/routes"
    "github.com/jishnu21/pkg/controllers"
    
)

func main() {

    razorpayKeyID := "rzp_test_1mUU1xAnklgEiv"         // Set this in your environment
	razorpayKeySecret := "OMlIMJXtfzohZlzFQbwJpn1D" // Set this in your environment
	
	if razorpayKeyID == "" || razorpayKeySecret == "" {
		log.Fatal("Razorpay credentials not found in environment variables")
	}
	
	// Initialize Razorpay client
	controllers.InitRazorpay(razorpayKeyID, razorpayKeySecret)

    router := mux.NewRouter()
    
    // Register your routes
    routes.UserRoutes(router)
    
    // Configure CORS
    corsHandler := handlers.CORS(
        handlers.AllowedOrigins([]string{"http://localhost:5173"}), // Your frontend URL
        handlers.AllowedMethods([]string{"GET", "POST", "PUT", "DELETE", "OPTIONS"}),
        handlers.AllowedHeaders([]string{"Content-Type", "Authorization"}),
        handlers.AllowCredentials(),
    )(router)
    
    log.Println("Server starting on :8080")
    log.Fatal(http.ListenAndServe(":8080", corsHandler))
}