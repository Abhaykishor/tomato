# Food Delivery Backend

This is the Node.js/Express backend for the Food Delivery Web App. It provides REST APIs for authentication, food, orders, categories, cart, and payments.

---

## 🚀 Features

- RESTful API for food, orders, users, cart, and categories
- Razorpay integration for secure online payments
- JWT-based authentication
- File uploads for food and category images (Multer)
- **Soft delete and restore for orders** (admin can undo deletes)
- Bulk delete and filter support (admin)
- Dynamic menu/category management with images
- Secure, production-ready structure

---

## 🛠️ Technologies Used
- Node.js
- Express.js
- MongoDB & Mongoose
- Multer (file uploads)
- Razorpay (payments)
- JWT (authentication)
- dotenv

---

## ⚡ Getting Started

### 1. Install dependencies
```bash
npm install
```

### 2. Setup environment variables (`.env`)
```
MONGODB_URI=your_mongodb_connection_string
RAZORPAY_KEY_ID=your_razorpay_key_id
RAZORPAY_KEY_SECRET=your_razorpay_key_secret
JWT_SECRET=your_jwt_secret
```

### 3. Start the backend
```bash
npm start
```

---

## 🌟 API Endpoints (examples)

- `/api/user/` - User registration, login, etc.
- `/api/food/` - Food CRUD, list, categories
- `/api/category/` - Category CRUD, list
- `/api/order/` - Place order, list orders, update status, delete/restore order
- `/api/cart/` - Cart management

---

## 🔒 Security & Notes
- Use strong secrets for JWT and Razorpay keys
- Do not expose sensitive keys in the frontend
- For production, set up HTTPS and environment-specific configs

---

## 📞 Support
For issues, open an issue on the main repository or contact the maintainer. 