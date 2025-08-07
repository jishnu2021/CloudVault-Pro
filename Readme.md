# CloudVault Pro 🚀

<div align="center">

![CloudVault Pro Logo](./assets/CloudVaultPro.png)

**A modern, secure file sharing platform with credit-based subscription system**




</div>

## 📋 Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Installation](#installation)
- [Configuration](#configuration)
- [API Documentation](#api-documentation)
- [Usage](#usage)
- [Payment Integration](#payment-integration)
- [Contributing](#contributing)
- [License](#license)

## 🌟 Overview

CloudVault Pro is a comprehensive file sharing platform that combines secure file management with a flexible credit-based subscription system. Users can upload, share, and manage files while purchasing credits through integrated payment solutions.

### Key Highlights

- 🔒 **Secure File Sharing** - Enterprise-grade security for your files
- 💳 **Credit System** - Flexible pay-as-you-use model
- 🚀 **Modern UI/UX** - Built with React and TypeScript
- 📱 **Responsive Design** - Works seamlessly across all devices
- 💰 **Payment Integration** - Razorpay integration for Indian market
- 📊 **Transaction Management** - Complete transaction history and analytics
- 👤 **User Management** - Comprehensive user profiles and authentication

## ✨ Features

### Core Features
- **File Upload & Management** - Drag-and-drop file uploads with progress tracking
- **Secure File Sharing** - Generate secure shareable links with expiration
- **User Authentication** - Complete login/registration system with profile management
- **Credit-Based System** - Users purchase credits to access premium features
- **Transaction History** - Detailed view of all purchases and credit usage

### Subscription Features
- **Multiple Plans** - 500 Credits (₹500) and 1000 Credits (₹1000) plans
- **Razorpay Integration** - Secure payment processing
- **Real-time Credit Updates** - Live credit balance updates
- **Purchase Verification** - Secure payment signature verification

### User Experience
- **Dark/Light Mode** - Automatic theme switching
- **Responsive Design** - Mobile-first approach with DaisyUI components
- **Real-time Updates** - Live notifications and status updates
- **Export Features** - CSV export for transaction history

## 🛠 Tech Stack

### Frontend
- **React 18** - Modern React with Hooks
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Utility-first CSS framework
- **DaisyUI** - Beautiful UI components
- **React Router** - Client-side routing

### Backend
- **Go (Golang)** - High-performance backend
- **Gorilla Mux** - HTTP router and URL matcher
- **GORM** - Go ORM for database operations
- **PostgreSQL/MySQL** - Relational database

### Payment & Services
- **Razorpay** - Payment gateway integration
- **HMAC Signature Verification** - Secure payment verification
- **File Storage** - Local/cloud file storage support

## 🚀 Installation

### Prerequisites
- Go 1.19 or higher
- Node.js 16 or higher
- PostgreSQL or MySQL database
- Razorpay account for payments

### Backend Setup

```bash
# Clone the repository
git clone https://github.com/yourusername/cloudvault-pro.git
cd cloudvault-pro

# Install Go dependencies
go mod init cloudvault-pro
go get github.com/gorilla/mux
go get github.com/razorpay/razorpay-go
go get gorm.io/gorm
go get gorm.io/driver/postgres

# Set environment variables
export RAZORPAY_KEY_ID="your_razorpay_key_id"
export RAZORPAY_KEY_SECRET="your_razorpay_key_secret"
export DATABASE_URL="your_database_connection_string"

# Run the backend server
go run main.go
```

### Frontend Setup

```bash
# Navigate to frontend directory
cd frontend

# Install dependencies
npm install

# Install additional dependencies
npm install react-router-dom @types/react @types/react-dom

# Start development server
npm start
```

### Database Setup

```sql
-- Create database
CREATE DATABASE cloudvault_pro;

-- The application will automatically create tables using GORM migrations
```

## ⚙️ Configuration

### Environment Variables

Create a `.env` file in the root directory:

```env
# Database
DATABASE_URL=postgresql://username:password@localhost:5432/cloudvault_pro

# Razorpay Configuration
RAZORPAY_KEY_ID=rzp_test_your_key_id
RAZORPAY_KEY_SECRET=your_key_secret

# Server Configuration
PORT=8080
FRONTEND_URL=http://localhost:5173

# File Upload Configuration
MAX_FILE_SIZE=50MB
UPLOAD_PATH=./uploads
```

### Razorpay Setup

1. Create a Razorpay account at [razorpay.com](https://razorpay.com)
2. Get your Key ID and Key Secret from the dashboard
3. Add them to your environment variables
4. Configure webhook endpoints for payment notifications

## 📚 API Documentation

### Authentication Endpoints

```http
POST /register
POST /login
PUT /user/{id}/profile
GET /user/{id}/credits
```

### Subscription Endpoints

```http
GET /subscription/plans
POST /user/{id}/subscription/create-order
POST /user/{id}/subscription/verify-payment
```

### Transaction Endpoints

```http
GET /user/{id}/transactions?limit=10&offset=0
```

### File Management Endpoints

```http
POST /upload
GET /files/{id}
DELETE /files/{id}
GET /user/{id}/files
```



## 🎯 Usage

### For Users

1. **Register/Login** - Create an account or sign in
2. **Purchase Credits** - Choose a subscription plan and pay securely
3. **Upload Files** - Drag and drop files to upload
4. **Share Files** - Generate secure sharing links
5. **Manage Account** - Update profile and view transaction history

### For Developers

1. **Extend Payment Plans** - Add new subscription tiers in `subscription.go`
2. **Customize UI** - Modify React components with Tailwind classes
3. **Add File Types** - Extend supported file formats
4. **Integrate APIs** - Add new third-party integrations

### Subscription Plans

| Plan | Credits | Price | Features |
|------|---------|-------|----------|
| Starter | 500 | ₹500 | Basic file sharing, 30-day storage |
| Pro | 1000 | ₹1000 | Advanced features, 90-day storage |

## 💳 Payment Integration

### Razorpay Integration Flow

1. **Create Order** - Backend creates Razorpay order
2. **Payment UI** - Frontend shows Razorpay checkout
3. **Verify Payment** - Backend verifies payment signature
4. **Add Credits** - Credits added to user account
5. **Transaction Record** - Complete audit trail maintained

### Security Features

- **HMAC Signature Verification** - All payments verified with HMAC-SHA256
- **Secure Token Handling** - JWT tokens for session management
- **SQL Injection Prevention** - Parameterized queries with GORM
- **XSS Protection** - Input sanitization and CSP headers

## 🤝 Contributing

We welcome contributions to CloudVault Pro! Here's how you can help:

### Getting Started

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Development Guidelines

- Follow Go best practices and gofmt standards
- Write TypeScript with proper type definitions
- Include tests for new features
- Update documentation for API changes
- Follow semantic commit messages

### Code Style

- **Backend**: Follow Go standard formatting with `gofmt`
- **Frontend**: Use Prettier and ESLint configurations
- **Database**: Use clear, descriptive column names
- **API**: RESTful design with consistent naming

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.



## 🎉 Acknowledgments

- **Razorpay** for excellent payment gateway services
- **DaisyUI** for beautiful UI components
- **Go Community** for amazing libraries and tools
- **React Team** for the incredible frontend framework

---

<div align="center">



</div>
