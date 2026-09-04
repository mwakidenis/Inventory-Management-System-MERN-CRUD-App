# Secure Inventory Management System - MERN CRUD App

A production-ready MERN stack application with comprehensive security features that lets users manage product inventory with full CRUD operations (Create, Read, Update, Delete).

## Security Features

This application implements enterprise-level security to protect against common web vulnerabilities:

### Protection Against:
- SQL/NoSQL Injection - Input sanitization and parameterized queries
- Cross-Site Scripting (XSS) - Input/output sanitization with DOMPurify
- Cross-Site Request Forgery (CSRF) - CORS configuration
- Denial of Service (DoS) - Rate limiting on all endpoints
- HTTP Parameter Pollution - HPP middleware
- Clickjacking - Security headers with Helmet
- Information Leakage - Secure error handling
- Brute Force Attacks - Strict rate limiting on write operations

### Security Implementations:
- Helmet - Security HTTP headers
- Rate Limiting - 100 req/15min (general), 50 req/15min (write ops)
- Input Validation - express-validator with strict rules
- NoSQL Injection Protection - express-mongo-sanitize
- XSS Protection - xss-clean + DOMPurify
- CORS Configuration - Whitelist-based origin control
- Request Size Limits - 10KB payload limit
- Environment Variables - Secure credential management
- Error Handling - No sensitive data exposure
- Schema Validation - Mongoose strict mode
- HPP Protection - Prevents parameter pollution

Read Full Security Documentation: ./SECURITY.md

---

## Quick Start

### Prerequisites
- Node.js (v14+)
- MongoDB (v4.4+)
- npm or yarn

### Installation

#### 1. Clone and Install Dependencies
```bash
git clone <repository-url>
cd Inventory-Management-System-MERN-CRUD-App
```

#### 2. Backend Setup
```bash
cd Backend
npm install
cp env.example .env
# Edit .env with your configuration
```

#### 3. Configure Environment Variables
Edit Backend/.env:
```env
MONGO_URI=mongodb://127.0.0.1:27017/IMS
PORT=3001
NODE_ENV=development
FRONTEND_URL=http://localhost:3000
```

#### 4. Setup MongoDB
In MongoDB Compass or CLI:
- Create Database: IMS
- Collection Name: products (auto-created)

#### 5. Start Backend Server
```bash
cd Backend
npm run server
```
Server runs on http://localhost:3001

#### 6. Start Frontend
```bash
cd Frontend/inventory_management_system
npm install
npm start
```
Frontend runs on http://localhost:3000

Detailed Setup Instructions: ./SETUP_INSTRUCTIONS.md

---

## Features

### Core Functionality
- Create - Add new products with validation
- Read - View all products with pagination
- Update - Edit existing product details
- Delete - Remove products with confirmation

### Data Validation
- Product Name: 2-100 characters, no HTML tags
- Product Price: Positive number, max 2 decimals
- Product Barcode: 8-13 alphanumeric characters, unique

### User Experience
- Real-time form validation
- Loading states and error messages
- Confirmation dialogs for destructive actions
- Responsive design
- Clean, intuitive interface

---

## Tech Stack

### Backend
- Node.js - Runtime environment
- Express.js - Web framework
- MongoDB - Database
- Mongoose - ODM

### Security Packages
- helmet - Security headers
- express-rate-limit - Rate limiting
- express-mongo-sanitize - NoSQL injection protection
- xss-clean - XSS protection
- express-validator - Input validation
- hpp - HTTP parameter pollution protection
- dotenv - Environment management

### Frontend
- React - UI library
- React Router - Navigation
- DOMPurify - XSS protection
- Bootstrap - Styling

---

## API Endpoints

### Base URL: http://localhost:3001

| Method | Endpoint | Description | Rate Limit |
|--------|----------|-------------|------------|
| GET | /health | Health check | 100/15min |
| GET | /products | Get all products (paginated) | 100/15min |
| GET | /products/:id | Get single product | 100/15min |
| POST | /insertproduct | Create new product | 50/15min |
| PUT | /updateproduct/:id | Update product | 50/15min |
| DELETE | /deleteproduct/:id | Delete product | 50/15min |

### Example Request
```bash
curl -X POST http://localhost:3001/insertproduct \
  -H "Content-Type: application/json" \
  -d '{
    "ProductName": "Laptop",
    "ProductPrice": 999.99,
    "ProductBarcode": "ABC12345678"
  }'
```

---

## Security Best Practices

### For Development
- Use .env for sensitive data
- Never commit .env to version control
- Run npm audit regularly
- Keep dependencies updated

### For Production
- Set NODE_ENV=production
- Enable HTTPS/SSL
- Use strong database passwords
- Configure MongoDB authentication
- Set up proper CORS origins
- Enable database backups
- Implement logging and monitoring
- Use process manager (PM2)
- Configure firewall rules
- Regular security audits

---

## Testing Security

### Test Input Validation
Try submitting invalid data:
```javascript
// Should be rejected
ProductName: "<script>alert('xss')</script>"
ProductPrice: -100
ProductBarcode: "123" // Too short
```

### Test Rate Limiting
Make 101 requests in 15 minutes - should get rate limited.

### Test NoSQL Injection
Try malicious payloads:
```json
{
  "ProductBarcode": { "$ne": null }
}
```
Should be automatically sanitized.

---

## Project Structure

```
Inventory-Management-System-MERN-CRUD-App/
├── Backend/
│   ├── Models/
│   │   └── Products.js          # Mongoose schema with validation
│   ├── Routes/
│   │   └── router.js            # API routes with security
│   ├── middleware/
│   │   ├── validators.js        # Input validation rules
│   │   ├── errorHandler.js      # Error handling
│   │   └── security.js          # Rate limiting config
│   ├── db.js                    # Database connection
│   ├── index.js                 # Server setup with security
│   ├── env.example              # Environment template
│   ├── .gitignore               # Git ignore rules
│   └── package.json             # Dependencies
├── Frontend/
│   └── inventory_management_system/
│       ├── src/
│       │   ├── components/
│       │   │   ├── InsertProduct.js   # Create with validation
│       │   │   ├── Products.js        # Read with XSS protection
│       │   │   ├── UpdateProduct.js   # Update with validation
│       │   │   ├── Navbar.js
│       │   │   ├── Home.js
│       │   │   └── About.js
│       │   ├── App.js
│       │   └── index.js
│       └── package.json
├── SECURITY.md                  # Security documentation
├── SETUP_INSTRUCTIONS.md        # Setup guide
└── README.md                    # This file
```

---

## Troubleshooting

### MongoDB Connection Error
```
Error: connect ECONNREFUSED 127.0.0.1:27017
```
Solution: Start MongoDB service
```bash
# Windows
net start MongoDB

# macOS/Linux
sudo systemctl start mongod
```

### Port Already in Use
```
Error: listen EADDRINUSE :::3001
```
Solution: Kill process or change port in .env

### CORS Errors
Solution: Verify FRONTEND_URL in .env matches your frontend URL

### Module Not Found
Solution: Reinstall dependencies
```bash
rm -rf node_modules package-lock.json
npm install
```
