package utils

import (
	"log"
	"net/http"
	"os"
)

// CORSMiddleware creates a middleware that adds CORS headers to all responses
func CORSMiddleware(next http.Handler) http.Handler {
    return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
        environment := os.Getenv("ENVIRONMENT")

        // Default to * in dev
        allowedOrigins := []string{"*"}
        if environment == "production" {
            frontendURL := os.Getenv("FRONTEND_URL")
            if frontendURL != "" {
                allowedOrigins = []string{frontendURL}
                log.Printf("Using frontend URL from environment: %s", frontendURL)
            } else {
                allowedOrigins = []string{"https://cloudvault-b3bf.onrender.com"}
                log.Printf("Using default frontend URL: %s", allowedOrigins[0])
            }
        } else {
            allowedOrigins = []string{
                "http://localhost:3000", "http://localhost:5173", "http://localhost:5174",
                "http://127.0.0.1:3000", "http://127.0.0.1:5173", "http://127.0.0.1:5174",
            }
        }

        origin := r.Header.Get("Origin")
        allowed := false
        for _, allowedOrigin := range allowedOrigins {
            if allowedOrigin == "*" || allowedOrigin == origin {
                allowed = true
                break
            }
        }

        if allowed {
            if contains(allowedOrigins, "*") {
                w.Header().Set("Access-Control-Allow-Origin", "*")
            } else {
                w.Header().Set("Access-Control-Allow-Origin", origin)
            }
            w.Header().Set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS, PATCH")
            w.Header().Set("Access-Control-Allow-Headers", "Content-Type, Authorization, X-Requested-With, Accept, Origin, Access-Control-Request-Method, Access-Control-Request-Headers")
            w.Header().Set("Access-Control-Expose-Headers", "Content-Length, Access-Control-Allow-Origin, Access-Control-Allow-Headers, Content-Type")
            w.Header().Set("Access-Control-Max-Age", "86400")
            w.Header().Set("Access-Control-Allow-Credentials", "true")
        }

        // Preflight requests return early
        if r.Method == http.MethodOptions {
            w.WriteHeader(http.StatusOK)
            return
        }

        next.ServeHTTP(w, r)
    })
}

func contains(slice []string, val string) bool {
    for _, item := range slice {
        if item == val {
            return true
        }
    }
    return false
}
