# 🚀 Quick Reference Guide

## Installation (5 Minutes)

```bash
# 1. Backend Setup
cd Backend
npm install
cp env.example .env
# Edit .env file

# 2. Start MongoDB
# Windows: net start MongoDB
# Mac/Linux: sudo systemctl start mongod

# 3. Start Backend
npm run server

# 4. Frontend Setup (new terminal)
cd Frontend/inventory_management_system
npm install
npm start
```

---

## Environment Variables (.env)

```env
MONGO_URI=mongodb://127.0.0.1:27017/IMS
PORT=3001
NODE_ENV=development
FRONTEND_URL=http://localhost:3000
```

---

## API Endpoints

| Method | Endpoint | Body | Response |
|--------|----------|------|----------|
| GET | `/health` | - | Health status |
| GET | `/products` | - | All products |
| GET | `/products/:id` | - | Single product |
| POST | `/insertproduct` | JSON | Create product |
| PUT | `/updateproduct/:id` | JSON | Update product |
| DELETE | `/deleteproduct/:id` | - | Delete product |

---

## Request/Response Examples

### Create Product
```bash
POST /insertproduct
{
  "ProductName": "Laptop",
  "ProductPrice": 999.99,
  "ProductBarcode": "ABC12345678"
}

Response:
{
  "success": true,
  "message": "Product added successfully",
  "data": { ... }
}
```

### Get Products
```bash
GET /products?page=1&limit=100

Response:
{
  "success": true,
  "count": 10,
  "total": 50,
  "page": 1,
  "pages": 5,
  "data": [ ... ]
}
```

---

## Validation Rules

| Field | Rules |
|-------|-------|
| ProductName | 2-100 chars, no HTML, alphanumeric + special chars |
| ProductPrice | Positive number, max 2 decimals, 0-999,999,999 |
| ProductBarcode | 8-13 alphanumeric chars, unique |

---

## Rate Limits

| Route Type | Limit |
|------------|-------|
| Read (GET) | 100 requests / 15 minutes |
| Write (POST/PUT/DELETE) | 50 requests / 15 minutes |

---

## Security Features

✅ NoSQL Injection Protection  
✅ XSS Protection  
✅ CORS Configuration  
✅ Rate Limiting  
✅ Input Validation  
✅ Security Headers  
✅ Error Handling  
✅ Request Size Limits  
✅ HPP Protection  

---

## Common Issues

### MongoDB Connection Error
```bash
# Start MongoDB
Windows: net start MongoDB
Mac/Linux: sudo systemctl start mongod
```

### Port Already in Use
```bash
# Change PORT in .env
PORT=3002
```

### CORS Error
```bash
# Check FRONTEND_URL in .env matches your frontend
FRONTEND_URL=http://localhost:3000
```

### Module Not Found
```bash
rm -rf node_modules package-lock.json
npm install
```

---

## Testing Security

### Test XSS Protection
```javascript
// Try submitting
ProductName: "<script>alert('xss')</script>"
// Should be sanitized
```

### Test Rate Limiting
```bash
# Make 101 requests in 15 minutes
# Should get 429 Too Many Requests
```

### Test Input Validation
```javascript
// Try invalid data
ProductPrice: -100  // Should fail
ProductBarcode: "123"  // Too short, should fail
```

---

## Production Checklist

- [ ] Set `NODE_ENV=production`
- [ ] Use strong database password
- [ ] Enable HTTPS
- [ ] Configure proper CORS origin
- [ ] Enable MongoDB authentication
- [ ] Set up logging
- [ ] Configure monitoring
- [ ] Set up backups
- [ ] Run `npm audit`
- [ ] Update dependencies

---

## Useful Commands

```bash
# Check for vulnerabilities
npm audit

# Fix vulnerabilities
npm audit fix

# Check outdated packages
npm outdated

# Update packages
npm update

# Run backend
npm run server

# Run frontend
npm start
```

---

## File Structure

```
Backend/
├── middleware/
│   ├── validators.js      # Input validation
│   ├── errorHandler.js    # Error handling
│   └── security.js        # Rate limiting
├── Models/
│   └── Products.js        # Schema with validation
├── Routes/
│   └── router.js          # API routes
├── .env                   # Environment variables
├── env.example            # Template
├── db.js                  # Database connection
└── index.js               # Server setup

Frontend/
└── src/
    └── components/
        ├── InsertProduct.js   # Create with validation
        ├── Products.js        # Read with XSS protection
        └── UpdateProduct.js   # Update with validation
```

---

## Documentation Files

- **README.md** - Project overview
- **SECURITY.md** - Security documentation
- **SETUP_INSTRUCTIONS.md** - Detailed setup
- **SECURITY_AUDIT_REPORT.md** - Audit findings
- **CHANGES_SUMMARY.md** - All changes made
- **QUICK_REFERENCE.md** - This file

---

## Support Resources

- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [Express Security](https://expressjs.com/en/advanced/best-practice-security.html)
- [MongoDB Security](https://docs.mongodb.com/manual/administration/security-checklist/)
- [Node.js Security](https://nodejs.org/en/docs/guides/security/)

---

**Last Updated**: 2026-05-24
