# Food Delivery Web App

A full-stack food delivery platform with admin and customer panels, built with the MERN stack and Razorpay integration for payments.

---

## 🚀 Features

- **User Panel (Frontend):**
  - Browse and search food items by name or category
  - Add/remove items to cart
  - Place orders with Razorpay (online) or Cash on Delivery
  - View order history with a premium, interactive My Orders page
  - Track order status with a visual stepper (Placed → Preparing → On the way → Delivered/Cancelled)
  - Download invoice, reorder, and cancel orders
  - Responsive, modern UI with glassmorphism and premium design

- **Admin Panel:**
  - Add, edit, and list food items
  - **Dynamic menu/category management:** Add, edit, delete, and reorder menu categories with images
  - View, filter, and manage all orders
  - **Delete/undo orders:** Soft delete with undo option for safety
  - **Bulk delete and filter:** Select and delete multiple orders, filter by status/date
  - Dashboard for quick management

- **Authentication:**
  - User login/signup
  - JWT-based session management

- **Payment:**
  - Razorpay integration for secure online payments
  - Cash on Delivery option

- **UI/UX:**
  - Premium, glassmorphism-inspired design
  - Order cards with parcel box effect and badges
  - Multi-line, readable address formatting
  - Modern status tracker and modals
  - Undo/restore for admin deletes
  - Bulk actions and advanced filtering (admin)

---

## 🛠️ Technologies Used

- **Frontend:** React, React Router, Context API, Axios, CSS Modules
- **Backend:** Node.js, Express.js, MongoDB, Mongoose
- **Payments:** Razorpay
- **Authentication:** JWT
- **File Uploads:** Multer
- **Other:** Vite (for frontend and admin dev server)

---

## 📦 Project Structure

```
food-del/
  backend/      # Node.js/Express/MongoDB API
  frontend/     # Customer-facing React app
  admin/        # Admin dashboard React app
```

---

## ⚡ Getting Started

### 1. Clone the repository
```bash
git clone <your-repo-url>
cd food-del
```

### 2. Setup Environment Variables

#### Backend (`backend/.env`):
```
MONGODB_URI=your_mongodb_connection_string
RAZORPAY_KEY_ID=your_razorpay_key_id
RAZORPAY_KEY_SECRET=your_razorpay_key_secret
JWT_SECRET=your_jwt_secret
```

> **Note:** Never commit your `.env` files to version control.

### 3. Install Dependencies

#### Backend
```bash
cd backend
npm install
```

#### Frontend
```bash
cd ../frontend
npm install
```

#### Admin
```bash
cd ../admin
npm install
```

### 4. Run the Applications

#### Start Backend
```bash
cd backend
npm start
```

#### Start Frontend
```bash
cd ../frontend
npm run dev
```

#### Start Admin Panel
```bash
cd ../admin
npm run dev
```

---

## 🌟 Usage

- Visit the frontend (customer) app at `http://localhost:5173`
- Visit the admin panel at `http://localhost:5174` (or as configured)
- Register/login as a user to place orders
- Use the admin panel to manage food items, categories, and orders

---

## 🔒 Security & Notes
- Use strong secrets for JWT and Razorpay keys
- Do not expose sensitive keys in the frontend
- For production, set up HTTPS and environment-specific configs

---

## 📞 Support
For issues, open an issue on the repository or contact the maintainer.

---

## 📝 License
This project is for educational/demo purposes. Commercial use may require additional compliance (PCI, etc.) for payments.
