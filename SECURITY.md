# Security Implementation Guide

## 🔒 Security Features Implemented

This document outlines all security measures implemented in the Inventory Management System to protect against common web vulnerabilities.

---

## 1. NoSQL Injection Protection

### Backend Implementation:
- **express-mongo-sanitize**: Automatically removes `$` and `.` characters from user input to prevent NoSQL injection
- **Mongoose Strict Mode**: Enabled to prevent injection of arbitrary fields
- **Input Validation**: All inputs validated using express-validator before database queries
- **Parameterized Queries**: Using Mongoose ORM which automatically sanitizes queries

### Example Attack Prevented:
```javascript
// Malicious input attempt:
{ "ProductBarcode": { "$ne": null } }

// After sanitization:
{ "ProductBarcode": "_ne_null" }
```

---

## 2. Cross-Site Scripting (XSS) Protection

### Backend Implementation:
- **xss-clean**: Middleware that sanitizes user input to prevent XSS attacks
- **express-validator escape()**: Escapes HTML characters in input
- **Helmet CSP**: Content Security Policy headers prevent inline script execution

### Frontend Implementation:
- **DOMPurify**: Sanitizes all user inputs before sending to backend
- **Output Encoding**: All data displayed is sanitized before rendering
- **Input Validation**: Regex patterns prevent script injection in forms

### Example Attack Prevented:
```javascript
// Malicious input:
<script>alert('XSS')</script>

// After sanitization:
&lt;script&gt;alert('XSS')&lt;/script&gt;
```

---

## 3. Security Headers (Helmet)

### Implemented Headers:
- **X-Content-Type-Options**: Prevents MIME type sniffing
- **X-Frame-Options**: Prevents clickjacking attacks
- **X-XSS-Protection**: Enables browser XSS filter
- **Strict-Transport-Security**: Forces HTTPS connections
- **Content-Security-Policy**: Controls resource loading
- **X-DNS-Prefetch-Control**: Controls DNS prefetching

---

## 4. Rate Limiting

### Implementation:
- **General Rate Limit**: 100 requests per 15 minutes for all routes
- **Strict Rate Limit**: 50 requests per 15 minutes for write operations (POST, PUT, DELETE)
- **IP-based Tracking**: Prevents brute force and DoS attacks

### Protected Routes:
- `/insertproduct` - 50 req/15min
- `/updateproduct/:id` - 50 req/15min
- `/deleteproduct/:id` - 50 req/15min
- All other routes - 100 req/15min

---

## 5. CORS Configuration

### Secure CORS Setup:
- **Origin Whitelist**: Only specified frontend URL allowed
- **Credentials**: Enabled for cookie-based authentication
- **Methods**: Limited to GET, POST, PUT, DELETE
- **Headers**: Restricted to Content-Type and Authorization

```javascript
// Configuration
origin: process.env.FRONTEND_URL || 'http://localhost:3000'
```

---

## 6. Input Validation & Sanitization

### Validation Rules:

#### Product Name:
- Required field
- 2-100 characters
- Alphanumeric with limited special characters
- No HTML tags allowed
- Trimmed whitespace

#### Product Price:
- Required field
- Positive number (0-999,999,999)
- Maximum 2 decimal places
- Type coercion to float

#### Product Barcode:
- Required field
- 8-13 alphanumeric characters
- Unique constraint
- No special characters

---

## 7. HTTP Parameter Pollution (HPP) Protection

### Implementation:
- **hpp middleware**: Prevents parameter pollution attacks
- Protects against duplicate parameters in query strings

### Example Attack Prevented:
```
?id=123&id=456  // Only first parameter processed
```

---

## 8. Request Size Limiting

### Protection Against Payload Attacks:
- **Body Size Limit**: 10KB maximum
- **URL Encoded Limit**: 10KB maximum
- Prevents memory exhaustion attacks

---

## 9. Error Handling

### Secure Error Responses:
- **Production Mode**: Generic error messages (no stack traces)
- **Development Mode**: Detailed errors for debugging
- **Validation Errors**: Structured error responses
- **No Information Leakage**: Database errors sanitized

### Error Response Format:
```json
{
  "success": false,
  "message": "Validation failed",
  "errors": [
    {
      "field": "ProductName",
      "message": "Product name is required"
    }
  ]
}
```

---

## 10. Environment Variables

### Sensitive Data Protection:
- Database credentials in `.env` file
- `.env` added to `.gitignore`
- `env.example` provided for reference
- No hardcoded secrets in code

### Required Environment Variables:
```env
MONGO_URI=mongodb://127.0.0.1:27017/IMS
PORT=3001
NODE_ENV=development
FRONTEND_URL=http://localhost:3000
```

---

## 11. Database Security

### MongoDB Security:
- **Strict Query Mode**: Prevents arbitrary field injection
- **Schema Validation**: Mongoose schema enforces data types
- **Unique Constraints**: Prevents duplicate entries
- **Indexes**: Optimized queries prevent timing attacks
- **Timestamps**: Automatic createdAt/updatedAt tracking

---

## 12. Frontend Security

### Client-Side Protection:
- **Input Sanitization**: DOMPurify cleans all inputs
- **Output Encoding**: Prevents XSS in rendered content
- **Client-Side Validation**: Immediate feedback, reduces server load
- **Confirmation Dialogs**: Prevents accidental deletions
- **Length Limits**: Enforced on all input fields

---

## 13. Additional Security Measures

### Implemented:
- ✅ Graceful shutdown handling
- ✅ Health check endpoint
- ✅ Structured logging (sanitized)
- ✅ 404 handler for unknown routes
- ✅ Mongoose connection error handling
- ✅ Pagination to prevent data exposure
- ✅ Lean queries for performance

### Recommended for Production:
- 🔲 HTTPS/TLS encryption
- 🔲 Authentication & Authorization (JWT)
- 🔲 Session management
- 🔲 CSRF protection
- 🔲 API versioning
- 🔲 Logging & monitoring (Winston, Morgan)
- 🔲 Database backups
- 🔲 Security audits (npm audit)
- 🔲 Dependency updates
- 🔲 Web Application Firewall (WAF)

---

## Installation & Setup

### Backend:
```bash
cd Backend
npm install
cp env.example .env
# Edit .env with your configuration
npm run server
```

### Frontend:
```bash
cd Frontend/inventory_management_system
npm install
npm start
```

---

## Security Testing

### Test for Vulnerabilities:
```bash
# Check for known vulnerabilities
npm audit

# Fix vulnerabilities
npm audit fix

# Check outdated packages
npm outdated
```

---

## Security Checklist

### Before Deployment:
- [ ] Change all default credentials
- [ ] Set NODE_ENV=production
- [ ] Enable HTTPS
- [ ] Configure firewall rules
- [ ] Set up monitoring & alerts
- [ ] Review and update CORS origins
- [ ] Enable database authentication
- [ ] Set up automated backups
- [ ] Configure rate limits for production traffic
- [ ] Review and test all error messages
- [ ] Implement authentication if needed
- [ ] Set up logging infrastructure
- [ ] Perform security audit
- [ ] Update all dependencies

---

## Vulnerability Response

### If a Security Issue is Found:
1. **Do not** disclose publicly immediately
2. Document the vulnerability
3. Develop and test a fix
4. Deploy the fix
5. Notify affected users if necessary
6. Update this documentation

---

## Security Resources

- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [Node.js Security Best Practices](https://nodejs.org/en/docs/guides/security/)
- [Express Security Best Practices](https://expressjs.com/en/advanced/best-practice-security.html)
- [MongoDB Security Checklist](https://docs.mongodb.com/manual/administration/security-checklist/)

---

## Contact

For security concerns or to report vulnerabilities, please contact the development team.

**Last Updated**: 2026-05-24
