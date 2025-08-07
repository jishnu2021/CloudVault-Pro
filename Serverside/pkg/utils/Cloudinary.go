package utils
import (
	"fmt"
	"log"

	"github.com/cloudinary/cloudinary-go/v2"
	"github.com/joho/godotenv"
)

func main() {
	err := godotenv.Load()
	if err != nil {
		log.Fatalf("Error loading .env file: %v", err)
	}

	cld, err := cloudinary.New()
	if err != nil {
		log.Fatalf("Failed to initialize Cloudinary client: %v", err)
	}

	img, err := cld.Image("cld-sample-5")
	if err != nil {
		log.Fatalf("Failed to create image object: %v", err)
	}

	url, _ := img.String()
	fmt.Println("The url:", url)
}


