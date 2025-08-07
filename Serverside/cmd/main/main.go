package main

import (
	"log"
	"net/http"
	"os"
	"path/filepath"

	"github.com/gorilla/handlers"
	"github.com/gorilla/mux"
	"github.com/jishnu21/pkg/controllers"
	"github.com/jishnu21/pkg/routes"
)

type spaHandler struct {
	staticPath string
	indexPath  string
}

func (h spaHandler) ServeHTTP(w http.ResponseWriter, r *http.Request) {
	// Remove the leading slash from the request path
	requestPath := r.URL.Path

	// Build the file path relative to staticPath
	filePath := filepath.Join(h.staticPath, requestPath)

	// Check if the file exists
	info, err := os.Stat(filePath)
	if os.IsNotExist(err) || info.IsDir() {
		// If not found, serve index.html (SPA fallback)
		http.ServeFile(w, r, filepath.Join(h.staticPath, h.indexPath))
		return
	}

	// Otherwise, serve the actual file
	http.FileServer(http.Dir(h.staticPath)).ServeHTTP(w, r)
}

func main() {
	razorpayKeyID := "rzp_test_1mUU1xAnklgEiv"
	razorpayKeySecret := "OMlIMJXtfzohZlzFQbwJpn1D"

	if razorpayKeyID == "" || razorpayKeySecret == "" {
		log.Fatal("Razorpay credentials not found in environment variables")
	}

	controllers.InitRazorpay(razorpayKeyID, razorpayKeySecret)

	router := mux.NewRouter()

	// API routes under /api
	apiRouter := router.PathPrefix("/api").Subrouter()
	routes.UserRoutes(apiRouter)

	// Path to built frontend
	staticDir := "../../../ClientSide/dist"

	// SPA handler for all other routes
	spa := spaHandler{staticPath: staticDir, indexPath: "index.html"}
	router.PathPrefix("/").Handler(spa)

	// CORS config
	corsHandler := handlers.CORS(
		handlers.AllowedOrigins([]string{"*"}),
		handlers.AllowedMethods([]string{"GET", "POST", "PUT", "DELETE", "OPTIONS"}),
		handlers.AllowedHeaders([]string{"Content-Type", "Authorization"}),
	)(router)

	port := os.Getenv("PORT")
	if port == "" {
		port = "8080"
	}

	log.Printf("Server starting on :%s", port)
	log.Fatal(http.ListenAndServe(":"+port, corsHandler))
}
