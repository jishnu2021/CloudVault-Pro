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

type spaHandler struct {
	staticPath string
	indexPath  string
}

func (h spaHandler) ServeHTTP(w http.ResponseWriter, r *http.Request) {
	requestPath := r.URL.Path
	
	// Log the request for debugging
	log.Printf("SPA Handler: Serving request for path: %s", requestPath)
	
	// Check if path has file extension (likely a static asset)
	if strings.Contains(requestPath, ".") {
		filePath := filepath.Join(h.staticPath, requestPath)
		if _, err := os.Stat(filePath); err == nil {
			// File exists, serve it
			http.FileServer(http.Dir(h.staticPath)).ServeHTTP(w, r)
			return
		}
	}
	
	// For all other requests (or missing static files), serve index.html
	indexFilePath := filepath.Join(h.staticPath, h.indexPath)
	log.Printf("SPA Handler: Serving index.html from: %s", indexFilePath)
	
	// Check if index.html exists
	if _, err := os.Stat(indexFilePath); os.IsNotExist(err) {
		log.Printf("Error: index.html not found at: %s", indexFilePath)
		http.Error(w, "index.html not found", http.StatusInternalServerError)
		return
	}
	
	// Set proper content type for HTML
	w.Header().Set("Content-Type", "text/html; charset=utf-8")
	http.ServeFile(w, r, indexFilePath)
}

func main() {
	if err := godotenv.Load(); err != nil {
		log.Println("No .env file found (this is normal in production)")
	}

	razorpayKeyID := os.Getenv("RAZORPAY_KEY_ID")
	razorpayKeySecret := os.Getenv("RAZORPAY_KEY_SECRET")
	if razorpayKeyID == "" || razorpayKeySecret == "" {
		log.Fatal("Razorpay credentials not found in environment variables")
	}
	controllers.InitRazorpay(razorpayKeyID, razorpayKeySecret)

	router := mux.NewRouter()

	// Health check endpoint
	router.HandleFunc("/health", func(w http.ResponseWriter, r *http.Request) {
		w.WriteHeader(http.StatusOK)
		w.Write([]byte("Backend is healthy"))
	}).Methods("GET")

	// Register API routes first (these take precedence)
	routes.UserRoutes(router)

	// Static file serving
	serveStatic := os.Getenv("SERVE_STATIC") == "true"
	log.Printf("SERVE_STATIC environment variable: %s", os.Getenv("SERVE_STATIC"))
	log.Printf("Static file serving enabled: %t", serveStatic)

	if serveStatic {
		staticDir := "../../../ClientSide/dist"
		absStaticDir, _ := filepath.Abs(staticDir)
		log.Printf("Checking static directory: %s (absolute: %s)", staticDir, absStaticDir)
		
		if _, err := os.Stat(staticDir); os.IsNotExist(err) {
			log.Printf("Error: Static directory does not exist: %s", staticDir)
			log.Printf("Current working directory: %s", getCurrentDir())
			listDirectoryContents("../../../")
		} else {
			log.Printf("Static directory found: %s", staticDir)
			
			// Check if index.html exists
			indexPath := filepath.Join(staticDir, "index.html")
			if _, err := os.Stat(indexPath); os.IsNotExist(err) {
				log.Printf("Warning: index.html not found at: %s", indexPath)
			} else {
				log.Printf("index.html found at: %s", indexPath)
			}
			
			// Create SPA handler
			spa := spaHandler{staticPath: staticDir, indexPath: "index.html"}
			
			// Important: This should be the LAST route as it catches all remaining paths
			router.PathPrefix("/").Handler(spa)
			log.Printf("SPA handler registered for static files from: %s", staticDir)
		}
	} else {
		log.Println("Static file serving disabled (backend-only mode)")
		
		// Fallback route for when static serving is disabled
		router.PathPrefix("/").HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
			http.Error(w, "Static file serving is disabled", http.StatusNotFound)
		})
	}

	// CORS configuration
	c := cors.New(cors.Options{
		AllowedOrigins:   []string{"*"},
		AllowedMethods:   []string{"GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"},
		AllowedHeaders:   []string{"*"},
		AllowCredentials: true,
	})

	port := os.Getenv("PORT")
	if port == "" {
		port = "8080"
	}

	log.Printf("Server starting on port %s", port)
	log.Printf("Routes registered:")
	router.Walk(func(route *mux.Route, router *mux.Router, ancestors []*mux.Route) error {
		pathTemplate, err := route.GetPathTemplate()
		if err == nil {
			methods, _ := route.GetMethods()
			log.Printf("  %s %s", strings.Join(methods, ","), pathTemplate)
		}
		return nil
	})

	if err := http.ListenAndServe(":"+port, c.Handler(router)); err != nil {
		log.Fatalf("Server failed to start: %v", err)
	}
}

// Helper functions for debugging
func getCurrentDir() string {
	if wd, err := os.Getwd(); err == nil {
		return wd
	}
	return "unknown"
}

func listDirectoryContents(dir string) {
	log.Printf("Listing contents of directory: %s", dir)
	if entries, err := os.ReadDir(dir); err == nil {
		for _, entry := range entries {
			if entry.IsDir() {
				log.Printf("  [DIR]  %s", entry.Name())
			} else {
				log.Printf("  [FILE] %s", entry.Name())
			}
		}
	} else {
		log.Printf("  Error reading directory: %v", err)
	}
}