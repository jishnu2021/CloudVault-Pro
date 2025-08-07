package routes

import (
	"github.com/gorilla/mux"
	"github.com/jishnu21/pkg/controllers"
)


var UserRoutes = func(router *mux.Router) {
	router.HandleFunc("/register", controllers.UserRegistration).Methods("POST")
	router.HandleFunc("/login", controllers.UserLogin).Methods("POST")
	router.HandleFunc("/user/{id}/profile", controllers.ChangeDetails).Methods("PUT")
	router.HandleFunc("/user/{id}/files", controllers.GetAllFiles).Methods("GET")
	router.HandleFunc("/user/{id}/upload", controllers.UploadFiles).Methods("POST")
	router.HandleFunc("/user/{id}/files/{fileId}", controllers.DeleteFile).Methods("DELETE")
	router.HandleFunc("/user/{id}/transactions", controllers.GetTransactions).Methods("GET")


	router.HandleFunc("/subscription/plans", controllers.GetSubscriptionPlans).Methods("GET")
	router.HandleFunc("/user/{id}/credits", controllers.GetUserCredits).Methods("GET")
	router.HandleFunc("/user/{id}/subscription/create-order", controllers.CreateSubscriptionOrder).Methods("POST")
	router.HandleFunc("/user/{id}/subscription/verify-payment", controllers.VerifySubscriptionPayment).Methods("POST")
}