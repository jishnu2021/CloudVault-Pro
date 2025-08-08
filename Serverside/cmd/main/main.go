package main

import (
	"log"
	"net/http"
	"os"
	"path/filepath"
	"strings"

	"github.com/gorilla/mux"
	"github.com/joho/godotenv"
	"github.com/jishnu21/pkg/controllers"
	"github.com/jishnu21/pkg/routes"
	"github.com/rs/cors"
)

// spaHandler serves a Single Page Application.
type spaHandler struct {
	staticPath string
	indexPath  string
}

// ServeHTTP handles requests for static files and the index.html fallback.
func (h spaHandler) ServeHTTP(w http.ResponseWriter, r *http.Request) {
	requestPath := r.URL.Path

	// Serve static files with a file extension directly.
	if strings.Contains(requestPath, ".") {
		filePath := filepath.Join(h.staticPath, requestPath)
		if _, err := os.Stat(filePath); err == nil {
			http.FileServer(http.Dir(h.staticPath)).ServeHTTP(w, r)
			return
		}
	}

	// For all other requests, serve the index.html.
	http.ServeFile(w, r, filepath.Join(h.staticPath, h.indexPath))
}

func main() {
	// Load environment variables.
	if err := godotenv.Load(); err != nil {
		log.Println("No .env file found (normal in production).")
	}

	// Initialize Razorpay.
	razorpayKeyID := os.Getenv("RAZORPAY_KEY_ID")
	razorpayKeySecret := os.Getenv("RAZORPAY_KEY_SECRET")
	if razorpayKeyID == "" || razorpayKeySecret == "" {
		log.Fatal("Razorpay credentials not found.")
	}
	controllers.InitRazorpay(razorpayKeyID, razorpayKeySecret)

	router := mux.NewRouter()

	// Register API routes first.
	routes.UserRoutes(router)

	// Check if we should serve static files
	serveStatic := os.Getenv("SERVE_STATIC") == "true"
	if serveStatic {
		// Determine static file path.
		staticDir := os.Getenv("STATIC_DIR")
		if staticDir == "" {
			// Fallback for local development.
			staticDir = "../../../ClientSide/dist"
		}
		
		// Verify if the static directory exists.
		if _, err := os.Stat(staticDir); os.IsNotExist(err) {
			log.Printf("Warning: Static directory not found at: %s. Skipping static file serving.", staticDir)
		} else {
			// Register SPA handler for the React application.
			spa := spaHandler{staticPath: staticDir, indexPath: "index.html"}
			router.PathPrefix("/").Handler(spa)
			log.Printf("Serving static files from: %s", staticDir)
		}
	} else {
		log.Println("Static file serving disabled (API-only mode)")
	}

	// Set up CORS.
	c := cors.New(cors.Options{
		AllowedOrigins:   []string{"*"},
		AllowedMethods:   []string{"GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"},
		AllowedHeaders:   []string{"*"},
		AllowCredentials: true,
	})

	// Start the server.
	port := os.Getenv("PORT")
	if port == "" {
		port = "8080"
	}
	log.Printf("Server starting on port %s", port)
	if err := http.ListenAndServe(":"+port, c.Handler(router)); err != nil {
		log.Fatalf("Server failed to start: %v", err)
	}
}