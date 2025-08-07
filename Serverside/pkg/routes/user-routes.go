package routes

import (
	"github.com/gorilla/mux"
	"github.com/jishnu21/pkg/controllers"
)


var UserRoutes = func(router *mux.Router) {
	router.HandleFunc("api/register", controllers.UserRegistration).Methods("POST")
	router.HandleFunc("api/login", controllers.UserLogin).Methods("POST")
	router.HandleFunc("api/user/{id}/profile", controllers.ChangeDetails).Methods("PUT")
	router.HandleFunc("api/user/{id}/files", controllers.GetAllFiles).Methods("GET")
	router.HandleFunc("api/user/{id}/upload", controllers.UploadFiles).Methods("POST")
	router.HandleFunc("api/user/{id}/files/{fileId}", controllers.DeleteFile).Methods("DELETE")
	router.HandleFunc("api/user/{id}/transactions", controllers.GetTransactions).Methods("GET")


	router.HandleFunc("api/subscription/plans", controllers.GetSubscriptionPlans).Methods("GET")
	router.HandleFunc("api/user/{id}/credits", controllers.GetUserCredits).Methods("GET")
	router.HandleFunc("api/user/{id}/subscription/create-order", controllers.CreateSubscriptionOrder).Methods("POST")
	router.HandleFunc("api/user/{id}/subscription/verify-payment", controllers.VerifySubscriptionPayment).Methods("POST")
}