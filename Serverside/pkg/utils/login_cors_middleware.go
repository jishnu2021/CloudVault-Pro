package utils

import (
	"log"
	"net/http"
	"os"
)

// LoginCORSMiddleware creates a middleware specifically for the login endpoint
// to ensure proper handling of preflight requests
func LoginCORSMiddleware(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		// Get allowed origins
		allowedOrigins := []string{"*"}
		environment := os.Getenv("ENVIRONMENT")
		
		if environment == "production" {
			// Get frontend URL from environment variable
			frontendURL := os.Getenv("FRONTEND_URL")
			if frontendURL != "" {
				allowedOrigins = []string{frontendURL}
				log.Printf("Login endpoint using frontend URL from environment: %s", frontendURL)
			} else {
				// Default production origins
				allowedOrigins = []string{
					"https://cloudvault-b3bf.onrender.com",
				}
				log.Printf("Login endpoint using default frontend URL: %s", allowedOrigins[0])
			}
		} else {
			// Development mode - allow localhost
			allowedOrigins = []string{
				"http://localhost:3000",
				"http://localhost:5173", 
				"http://localhost:5174",
				"http://127.0.0.1:3000",
				"http://127.0.0.1:5173",
				"http://127.0.0.1:5174",
			}
		}

		// Get the Origin header from the request
		origin := r.Header.Get("Origin")
		log.Printf("Login endpoint received request from origin: %s", origin)
		
		// Check if the origin is allowed
		allowed := false
		for _, allowedOrigin := range allowedOrigins {
			if allowedOrigin == "*" || allowedOrigin == origin {
				allowed = true
				break
			}
		}

		// If the origin is allowed, set the CORS headers
		if allowed {
			w.Header().Set("Access-Control-Allow-Origin", origin)
			w.Header().Set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS, PATCH")
			w.Header().Set("Access-Control-Allow-Headers", "Content-Type, Authorization, X-Requested-With, Accept, Origin, Access-Control-Request-Method, Access-Control-Request-Headers")
			w.Header().Set("Access-Control-Expose-Headers", "Content-Length, Access-Control-Allow-Origin, Access-Control-Allow-Headers, Content-Type")
			w.Header().Set("Access-Control-Max-Age", "86400")
			w.Header().Set("Access-Control-Allow-Credentials", "true")
			log.Printf("Login endpoint CORS headers set for origin: %s", origin)
		} else {
			log.Printf("Login endpoint origin not allowed: %s", origin)
		}

		// Handle preflight requests
		if r.Method == "OPTIONS" {
			log.Printf("Login endpoint handling OPTIONS preflight request")
			w.WriteHeader(http.StatusOK)
			return
		}

		// Call the next handler
		next.ServeHTTP(w, r)
	})
}