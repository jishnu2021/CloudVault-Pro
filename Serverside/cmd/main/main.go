package main

import (
	"log"
	"net/http"
	"os"
	"path/filepath"

	"github.com/gorilla/mux"
	"github.com/joho/godotenv"
	"github.com/jishnu21/pkg/controllers"
	"github.com/jishnu21/pkg/routes"
	"github.com/jishnu21/pkg/utils"
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
	// Load environment variables from .env file (for local development)
	if err := godotenv.Load(); err != nil {
		log.Println("No .env file found (this is normal in production)")
	}

	// Get Razorpay credentials from environment variables
	razorpayKeyID := os.Getenv("RAZORPAY_KEY_ID")
	razorpayKeySecret := os.Getenv("RAZORPAY_KEY_SECRET")

	// Check if credentials are provided
	if razorpayKeyID == "" || razorpayKeySecret == "" {
		log.Fatal("Razorpay credentials not found in environment variables. Please set RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET")
	}

	controllers.InitRazorpay(razorpayKeyID, razorpayKeySecret)

	router := mux.NewRouter()

	// Health check endpoint for Render
	router.HandleFunc("/health", func(w http.ResponseWriter, r *http.Request) {
		w.WriteHeader(http.StatusOK)
		w.Write([]byte("Backend is healthy"))
	}).Methods("GET")

	// API routes
	routes.UserRoutes(router)

	// Only serve static files if SERVE_STATIC is true and static directory exists
	serveStatic := os.Getenv("SERVE_STATIC") == "true"
	if serveStatic {
		staticDir := "../../../ClientSide/dist"
		
		// Check if static directory exists
		if _, err := os.Stat(staticDir); os.IsNotExist(err) {
			log.Printf("Warning: Static directory does not exist: %s (skipping static file serving)", staticDir)
		} else {
			// SPA handler for all other routes
			spa := spaHandler{staticPath: staticDir, indexPath: "index.html"}
			router.PathPrefix("/").Handler(spa)
			log.Printf("Static files served from: %s", staticDir)
		}
	} else {
		log.Println("Static file serving disabled (backend-only mode)")
	}

	// Apply our custom CORS middleware
	corsHandler := utils.CORSMiddleware(router)

	port := os.Getenv("PORT")
	if port == "" {
		port = "8080"
	}

	log.Printf("Server starting on port %s", port)
	log.Printf("Environment: %s", os.Getenv("ENVIRONMENT"))
	
	log.Printf("CORS middleware applied with appropriate headers")
	if err := http.ListenAndServe(":" + port, corsHandler); err != nil {
		log.Fatalf("Server failed to start: %v", err)
	}
}