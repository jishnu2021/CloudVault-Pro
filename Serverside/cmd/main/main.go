package main

import (
	"fmt"
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
			log.Printf("Serving static file: %s", filePath)
			http.FileServer(http.Dir(h.staticPath)).ServeHTTP(w, r)
			return
		}
	}
	
	// For all other requests (or missing static files), serve index.html
	indexFilePath := filepath.Join(h.staticPath, h.indexPath)
	log.Printf("SPA Handler: Serving index.html from: %s", indexFilePath)
	
	// Check if index.html exists
	if _, err := os.Stat(indexFilePath); os.IsNotExist(err) {
		log.Printf("ERROR: index.html not found at: %s", indexFilePath)
		http.Error(w, "index.html not found", http.StatusInternalServerError)
		return
	}
	
	// Set proper content type for HTML
	w.Header().Set("Content-Type", "text/html; charset=utf-8")
	http.ServeFile(w, r, indexFilePath)
}

func main() {
	log.Println("🚀 Starting CloudVault Pro server...")
	
	if err := godotenv.Load(); err != nil {
		log.Println("No .env file found (this is normal in production)")
	}

	// Log current working directory and environment
	wd, _ := os.Getwd()
	log.Printf("Current working directory: %s", wd)
	log.Printf("SERVE_STATIC environment variable: '%s'", os.Getenv("SERVE_STATIC"))

	// Initialize Razorpay
	razorpayKeyID := os.Getenv("RAZORPAY_KEY_ID")
	razorpayKeySecret := os.Getenv("RAZORPAY_KEY_SECRET")
	if razorpayKeyID == "" || razorpayKeySecret == "" {
		log.Fatal("Razorpay credentials not found in environment variables")
	}
	controllers.InitRazorpay(razorpayKeyID, razorpayKeySecret)
	log.Println("✅ Razorpay initialized")

	router := mux.NewRouter()

	// Health check endpoint
	router.HandleFunc("/health", func(w http.ResponseWriter, r *http.Request) {
		log.Printf("Health check requested from: %s", r.RemoteAddr)
		w.WriteHeader(http.StatusOK)
		w.Write([]byte("✅ CloudVault Pro server is healthy"))
	}).Methods("GET")

	// Debug endpoint
	router.HandleFunc("/debug", func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Content-Type", "text/plain")
		wd, _ := os.Getwd()
		fmt.Fprintf(w, "✅ CloudVault Pro Debug Info\n")
		fmt.Fprintf(w, "Working Directory: %s\n", wd)
		fmt.Fprintf(w, "SERVE_STATIC: %s\n", os.Getenv("SERVE_STATIC"))
		fmt.Fprintf(w, "STATIC_DIR: %s\n", os.Getenv("STATIC_DIR"))
		
		// Check static directory from env var
		staticDirEnv := os.Getenv("STATIC_DIR")
		if staticDirEnv != "" {
			if info, err := os.Stat(staticDirEnv); err == nil {
				fmt.Fprintf(w, "\n✅ STATIC_DIR exists: %s (IsDir: %t)\n", staticDirEnv, info.IsDir())
				if info.IsDir() {
					files, _ := os.ReadDir(staticDirEnv)
					fmt.Fprintf(w, "Contents:\n")
					for _, file := range files {
						fmt.Fprintf(w, "  - %s\n", file.Name())
					}
				}
			} else {
				fmt.Fprintf(w, "\n❌ STATIC_DIR NOT found: %s\n", staticDirEnv)
			}
		}
		
		// Check other possible locations
		staticDirs := []string{
			"../../../ClientSide/dist",
			"../../ClientSide/dist", 
			"../ClientSide/dist",
			"ClientSide/dist",
			"dist",
		}
		
		for _, dir := range staticDirs {
			if info, err := os.Stat(dir); err == nil {
				fmt.Fprintf(w, "\n✅ Alternative directory exists: %s (IsDir: %t)\n", dir, info.IsDir())
			} else {
				fmt.Fprintf(w, "\n❌ Directory NOT found: %s\n", dir)
			}
		}
	}).Methods("GET")

	// Register API routes first (these take precedence over static serving)
	log.Println("🔗 Registering API routes...")
	routes.UserRoutes(router)
	log.Println("✅ API routes registered")

	// Static file serving for React app
	serveStatic := os.Getenv("SERVE_STATIC") == "true"
	log.Printf("Static file serving enabled: %t", serveStatic)

	if serveStatic {
		// Try STATIC_DIR environment variable first
		staticDir := os.Getenv("STATIC_DIR")
		if staticDir == "" {
			staticDir = "../../../ClientSide/dist"
		}
		
		log.Printf("Checking static directory: %s", staticDir)
		
		if _, err := os.Stat(staticDir); os.IsNotExist(err) {
			log.Printf("❌ Static directory does not exist: %s", staticDir)
			
			// Try alternative paths
			alternativePaths := []string{
				"../../ClientSide/dist",
				"../ClientSide/dist", 
				"ClientSide/dist",
				"dist",
			}
			
			found := false
			for _, altPath := range alternativePaths {
				if _, err := os.Stat(altPath); err == nil {
					staticDir = altPath
					log.Printf("✅ Found alternative static directory: %s", staticDir)
					found = true
					break
				}
			}
			
			if !found {
				log.Printf("❌ FATAL: No static directory found anywhere!")
				log.Printf("❌ React app will not be served!")
			}
		} else {
			log.Printf("✅ Static directory found: %s", staticDir)
		}
		
		// Final check and setup SPA handler
		if _, err := os.Stat(staticDir); err == nil {
			// Check if index.html exists
			indexPath := filepath.Join(staticDir, "index.html")
			if _, err := os.Stat(indexPath); os.IsNotExist(err) {
				log.Printf("❌ WARNING: index.html not found at: %s", indexPath)
			} else {
				log.Printf("✅ index.html found at: %s", indexPath)
			}
			
			// Create SPA handler
			spa := spaHandler{staticPath: staticDir, indexPath: "index.html"}
			
			// Important: This should be the LAST route as it catches all remaining paths
			router.PathPrefix("/").Handler(spa)
			log.Printf("✅ SPA handler registered - React app will be served from: %s", staticDir)
			log.Printf("✅ Routes like /dashboard will now work!")
		}
	} else {
		log.Println("❌ Static file serving disabled")
		// Fallback for unmatched routes
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

	// Get port
	port := os.Getenv("PORT")
	if port == "" {
		port = "8080"
	}

	log.Printf("🌐 Server starting on port %s", port)
	log.Printf("🔗 External URL: https://cloudvault-pro.onrender.com")
	log.Printf("📊 Dashboard will be available at: https://cloudvault-pro.onrender.com/dashboard")
	
	if err := http.ListenAndServe(":"+port, c.Handler(router)); err != nil {
		log.Fatalf("❌ Server failed to start: %v", err)
	}
}