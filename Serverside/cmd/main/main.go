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
	"github.com/rs/cors"
)

type spaHandler struct {
	staticPath string
	indexPath  string
}

func (h spaHandler) ServeHTTP(w http.ResponseWriter, r *http.Request) {
	requestPath := r.URL.Path
	filePath := filepath.Join(h.staticPath, requestPath)

	info, err := os.Stat(filePath)
	if os.IsNotExist(err) || info.IsDir() {
		http.ServeFile(w, r, filepath.Join(h.staticPath, h.indexPath))
		return
	}

	http.FileServer(http.Dir(h.staticPath)).ServeHTTP(w, r)
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

	router.HandleFunc("/health", func(w http.ResponseWriter, r *http.Request) {
		w.WriteHeader(http.StatusOK)
		w.Write([]byte("Backend is healthy"))
	}).Methods("GET")

	routes.UserRoutes(router)

	serveStatic := os.Getenv("SERVE_STATIC") == "true"
	if serveStatic {
		staticDir := "../../../ClientSide/dist"
		if _, err := os.Stat(staticDir); os.IsNotExist(err) {
			log.Printf("Warning: Static directory does not exist: %s", staticDir)
		} else {
			spa := spaHandler{staticPath: staticDir, indexPath: "index.html"}
			router.PathPrefix("/").Handler(spa)
			log.Printf("Static files served from: %s", staticDir)
		}
	} else {
		log.Println("Static file serving disabled (backend-only mode)")
	}

	// Allow all origins, all methods, all headers
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
	if err := http.ListenAndServe(":"+port, c.Handler(router)); err != nil {
		log.Fatalf("Server failed to start: %v", err)
	}
}
