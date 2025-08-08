package main

import (
	"fmt"
	"log"
	"net/http"
	"os"

	"github.com/gorilla/mux"
	"github.com/rs/cors"
)

func main() {
	log.Println("🚀 Starting server...")
	
	// Get port from environment
	port := os.Getenv("PORT")
	if port == "" {
		port = "8080"
	}
	log.Printf("Using port: %s", port)

	router := mux.NewRouter()

	// Simple health check
	router.HandleFunc("/health", func(w http.ResponseWriter, r *http.Request) {
		log.Printf("Health check requested from: %s", r.RemoteAddr)
		w.WriteHeader(http.StatusOK)
		w.Write([]byte("✅ Server is running!"))
	}).Methods("GET")

	// Debug endpoint
	router.HandleFunc("/debug", func(w http.ResponseWriter, r *http.Request) {
		log.Printf("Debug endpoint requested from: %s", r.RemoteAddr)
		w.Header().Set("Content-Type", "text/plain")
		wd, _ := os.Getwd()
		fmt.Fprintf(w, "✅ Server is working!\n")
		fmt.Fprintf(w, "Working Directory: %s\n", wd)
		fmt.Fprintf(w, "PORT: %s\n", port)
		fmt.Fprintf(w, "All environment variables:\n")
		for _, env := range os.Environ() {
			fmt.Fprintf(w, "  %s\n", env)
		}
	}).Methods("GET")

	// Root handler
	router.HandleFunc("/", func(w http.ResponseWriter, r *http.Request) {
		log.Printf("Root path requested: %s from: %s", r.URL.Path, r.RemoteAddr)
		w.Header().Set("Content-Type", "text/html")
		fmt.Fprintf(w, `
		<h1>🎉 Server is running!</h1>
		<p>Available endpoints:</p>
		<ul>
			<li><a href="/health">/health</a></li>
			<li><a href="/debug">/debug</a></li>
		</ul>
		`)
	}).Methods("GET")

	// CORS
	c := cors.New(cors.Options{
		AllowedOrigins: []string{"*"},
		AllowedMethods: []string{"GET", "POST", "PUT", "DELETE", "OPTIONS"},
		AllowedHeaders: []string{"*"},
	})

	log.Printf("🌐 Server starting on port %s", port)
	log.Println("Available routes:")
	log.Println("  GET /")
	log.Println("  GET /health") 
	log.Println("  GET /debug")

	if err := http.ListenAndServe(":"+port, c.Handler(router)); err != nil {
		log.Fatalf("❌ Server failed to start: %v", err)
	}
}