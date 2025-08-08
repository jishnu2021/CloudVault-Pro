package routes

import (
	"github.com/gorilla/mux"
	"github.com/jishnu21/pkg/controllers"
	"github.com/jishnu21/pkg/utils"
	"net/http"
)

var UserRoutes = func(router *mux.Router) {
	router.HandleFunc("/register", controllers.UserRegistration).Methods("POST", "OPTIONS")
	
	// Apply special CORS middleware specifically for the login endpoint
	loginHandler := http.HandlerFunc(controllers.UserLogin)
	router.Handle("/login", utils.LoginCORSMiddleware(loginHandler)).Methods("POST", "OPTIONS")
	router.HandleFunc("/user/{id}/profile", controllers.ChangeDetails).Methods("PUT", "OPTIONS")
	router.HandleFunc("/user/{id}/files", controllers.GetAllFiles).Methods("GET", "OPTIONS")
	router.HandleFunc("/user/{id}/upload", controllers.UploadFiles).Methods("POST", "OPTIONS")
	router.HandleFunc("/user/{id}/files/{fileId}", controllers.DeleteFile).Methods("DELETE", "OPTIONS")
	router.HandleFunc("/user/{id}/transactions", controllers.GetTransactions).Methods("GET", "OPTIONS")

	router.HandleFunc("/subscription/plans", controllers.GetSubscriptionPlans).Methods("GET", "OPTIONS")
	router.HandleFunc("/user/{id}/credits", controllers.GetUserCredits).Methods("GET", "OPTIONS")
	router.HandleFunc("/user/{id}/subscription/create-order", controllers.CreateSubscriptionOrder).Methods("POST", "OPTIONS")
	router.HandleFunc("/user/{id}/subscription/verify-payment", controllers.VerifySubscriptionPayment).Methods("POST", "OPTIONS")
}
