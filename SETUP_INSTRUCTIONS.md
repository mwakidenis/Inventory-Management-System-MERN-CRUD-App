# 🚀 Setup Instructions - Secure Inventory Management System

## Prerequisites

Before you begin, ensure you have the following installed:
- **Node.js** (v14 or higher)
- **MongoDB** (v4.4 or higher)
- **npm** or **yarn**

---

## 📦 Installation Steps

### 1. Clone the Repository
```bash
git clone <repository-url>
cd Inventory-Management-System-MERN-CRUD-App
```

### 2. Backend Setup

#### Navigate to Backend Directory
```bash
cd Backend
```

#### Install Dependencies
```bash
npm install
```

This will install all security packages including:
- `helmet` - Security headers
- `express-rate-limit` - Rate limiting
- `express-mongo-sanitize` - NoSQL injection protection
- `xss-clean` - XSS protection
- `express-validator` - Input validation
- `hpp` - HTTP parameter pollution protection
- `dotenv` - Environment variable management

#### Configure Environment Variables
```bash
cp env.example .env
```

Edit the `.env` file with your configuration:
```env
# Database Configuration
MONGO_URI=mongodb://127.0.0.1:27017/IMS

# Server Configuration
PORT=3001
NODE_ENV=development

# CORS Configuration
FRONTEND_URL=http://localhost:3000

# Rate Limiting (optional - defaults provided)
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
```

#### Start MongoDB
Make sure MongoDB is running on your system:
```bash
# Windows
net start MongoDB

# macOS/Linux
sudo systemctl start mongod
# or
mongod
```

#### Start Backend Server
```bash
npm run server
```

The backend should now be running on `http://localhost:3001`

---

### 3. Frontend Setup

#### Navigate to Frontend Directory
```bash
cd ../Frontend/inventory_management_system
```

#### Install Dependencies
```bash
npm install
```

This will install:
- `dompurify` - XSS protection for React
- All React dependencies

#### Start Frontend Application
```bash
npm start
```

The frontend should now be running on `http://localhost:3000`

---

## 🔒 Security Configuration

### Important Security Notes:

1. **Never commit `.env` file** - It's already in `.gitignore`
2. **Change default values** in production
3. **Use strong database passwords** in production
4. **Enable MongoDB authentication** in production
5. **Use HTTPS** in production

### Production Deployment Checklist:

- [ ] Set `NODE_ENV=production` in `.env`
- [ ] Use strong, unique database credentials
- [ ] Configure proper CORS origins (not `*`)
- [ ] Enable HTTPS/SSL certificates
- [ ] Set up MongoDB authentication
- [ ] Configure firewall rules
- [ ] Set appropriate rate limits
- [ ] Enable database backups
- [ ] Set up monitoring and logging
- [ ] Run security audit: `npm audit`
- [ ] Update all dependencies
- [ ] Review error messages (no sensitive data)

---

## 🧪 Testing the Application

### Test Security Features:

#### 1. Test Rate Limiting
Try making more than 100 requests in 15 minutes - you should get rate limited.

#### 2. Test Input Validation
Try submitting:
- Empty fields
- Product name with HTML tags: `<script>alert('xss')</script>`
- Negative prices
- Invalid barcode formats

All should be rejected with appropriate error messages.

#### 3. Test NoSQL Injection
Try sending malicious payloads like:
```json
{
  "ProductBarcode": { "$ne": null }
}
```
Should be sanitized automatically.

---

## 📊 API Endpoints

### Base URL: `http://localhost:3001`

#### Health Check
```
GET /health
```

#### Get All Products (with pagination)
```
GET /products?page=1&limit=100
```

#### Get Single Product
```
GET /products/:id
```

#### Create Product
```
POST /insertproduct
Content-Type: application/json

{
  "ProductName": "Product Name",
  "ProductPrice": 99.99,
  "ProductBarcode": "ABC12345678"
}
```

#### Update Product
```
PUT /updateproduct/:id
Content-Type: application/json

{
  "ProductName": "Updated Name",
  "ProductPrice": 149.99,
  "ProductBarcode": "ABC12345678"
}
```

#### Delete Product
```
DELETE /deleteproduct/:id
```

---

## 🐛 Troubleshooting

### MongoDB Connection Issues
```
Error: connect ECONNREFUSED 127.0.0.1:27017
```
**Solution**: Make sure MongoDB is running
```bash
# Check MongoDB status
# Windows
sc query MongoDB

# macOS/Linux
sudo systemctl status mongod
```

### Port Already in Use
```
Error: listen EADDRINUSE: address already in use :::3001
```
**Solution**: Kill the process using the port
```bash
# Windows
netstat -ano | findstr :3001
taskkill /PID <PID> /F

# macOS/Linux
lsof -ti:3001 | xargs kill -9
```

### CORS Errors
```
Access to fetch at 'http://localhost:3001' from origin 'http://localhost:3000' has been blocked by CORS policy
```
**Solution**: Check `FRONTEND_URL` in `.env` matches your frontend URL

### Module Not Found
```
Error: Cannot find module 'helmet'
```
**Solution**: Reinstall dependencies
```bash
rm -rf node_modules package-lock.json
npm install
```

---

## 📚 Additional Resources

- [Security Documentation](./SECURITY.md) - Detailed security implementation
- [MongoDB Documentation](https://docs.mongodb.com/)
- [Express.js Security Best Practices](https://expressjs.com/en/advanced/best-practice-security.html)
- [OWASP Top 10](https://owasp.org/www-project-top-ten/)

---

## 🔄 Updating Dependencies

### Check for Updates
```bash
npm outdated
```

### Update Dependencies
```bash
npm update
```

### Security Audit
```bash
npm audit
npm audit fix
```

---

## 💡 Development Tips

### Running in Development Mode
- Backend auto-restarts with `nodemon`
- Frontend hot-reloads with React dev server
- Detailed error messages enabled
- CORS configured for localhost

### Running in Production Mode
1. Set `NODE_ENV=production` in `.env`
2. Build frontend: `npm run build`
3. Use process manager like PM2
4. Enable HTTPS
5. Configure reverse proxy (nginx)

---

## 📞 Support

For issues or questions:
1. Check the [SECURITY.md](./SECURITY.md) documentation
2. Review error logs in console
3. Check MongoDB logs
4. Verify environment variables

---

**Last Updated**: 2026-05-24
