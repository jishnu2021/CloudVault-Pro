package main

import (
    "log"
    "net/http"
    "os"
    "path/filepath"    
    "github.com/gorilla/mux"
    "github.com/gorilla/handlers"
    "github.com/jishnu21/pkg/routes"
    "github.com/jishnu21/pkg/controllers"
)

// spaHandler implements the http.Handler interface, so we can use it
// to respond to HTTP requests. The path to the static directory and
// path to the index file within that static directory are used to
// serve the SPA in the given static directory.
type spaHandler struct {
    staticPath string
    indexPath  string
}

// ServeHTTP inspects the URL path to locate a file within the static dir
// on the SPA handler. If a file is found, it will be served. If not, the
// file located at the index path on the SPA handler will be served. This
// is suitable behavior for serving an SPA (single page application).
func (h spaHandler) ServeHTTP(w http.ResponseWriter, r *http.Request) {
    // get the absolute path to prevent directory traversal
    path, err := filepath.Abs(r.URL.Path)
    if err != nil {
        // if we failed to get the absolute path respond with a 400 bad request
        // and stop
        http.Error(w, err.Error(), http.StatusBadRequest)
        return
    }

    // prepend the path with the path to the static directory
    path = filepath.Join(h.staticPath, path)

    // check whether a file exists at the given path
    _, err = os.Stat(path)
    if os.IsNotExist(err) {
        // file does not exist, serve index.html
        http.ServeFile(w, r, filepath.Join(h.staticPath, h.indexPath))
        return
    } else if err != nil {
        // if we got an error (that wasn't that the file doesn't exist) stating the
        // file, return a 500 internal server error and stop
        http.Error(w, err.Error(), http.StatusInternalServerError)
        return
    }

    // otherwise, use http.FileServer to serve the static dir
    http.FileServer(http.Dir(h.staticPath)).ServeHTTP(w, r)
}

func main() {
    razorpayKeyID := "rzp_test_1mUU1xAnklgEiv"         // Set this in your environment
    razorpayKeySecret := "OMlIMJXtfzohZlzFQbwJpn1D"   // Set this in your environment
    
    if razorpayKeyID == "" || razorpayKeySecret == "" {
        log.Fatal("Razorpay credentials not found in environment variables")
    }
    
    // Initialize Razorpay client
    controllers.InitRazorpay(razorpayKeyID, razorpayKeySecret)
    
    router := mux.NewRouter()
    
    // Register your API routes with /api prefix
    apiRouter := router.PathPrefix("/api").Subrouter()
    routes.UserRoutes(apiRouter)
    
    // Serve static files from the React build
    // Path relative to where main.go is executed (Serverside/cmd/main/)
    staticDir := "../../../ClientSide/dist"
    
    // Check if static directory exists
    if _, err := os.Stat(staticDir); os.IsNotExist(err) {
        log.Printf("Warning: Static directory %s does not exist", staticDir)
    }
    
    // Create SPA handler
    spa := spaHandler{staticPath: staticDir, indexPath: "index.html"}
    
    // Handle all other routes with the SPA handler
    router.PathPrefix("/").Handler(spa)
    
    // Configure CORS
    corsHandler := handlers.CORS(
        handlers.AllowedOrigins([]string{"*"}),
        handlers.AllowedMethods([]string{"GET", "POST", "PUT", "DELETE", "OPTIONS"}),
        handlers.AllowedHeaders([]string{"Content-Type", "Authorization"}),
        handlers.AllowCredentials(),
    )(router)
    
    port := os.Getenv("PORT")
    if port == "" {
        port = "8080" // fallback for local dev
    }
    
    log.Printf("Server starting on :%s\n", port)
    log.Printf("Serving static files from: %s\n", staticDir)
    log.Fatal(http.ListenAndServe(":"+port, corsHandler))
}