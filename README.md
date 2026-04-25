# SnapKart 🛒

SnapKart is a full-stack e-commerce web application built using the MERN stack. It provides a complete shopping experience including product browsing, cart management, wishlist, and order processing.

---

## 🚀 Live Demo

https://snapkart-frontend.onrender.com/

---

## ✨ Features

- Product listing and detailed view
- Add to cart and wishlist functionality
- User authentication and authorization
- Checkout and order placement
- Admin dashboard for managing products and orders

---

## 🛠️ Tech Stack

### Frontend
- React.js
- Axios
- CSS (Responsive Design)

### Backend
- Node.js
- Express.js

### Database
- MongoDB

### Other
- JWT Authentication
- Razorpay (Payment Integration)

---

## 📱 Responsive Design

- Mobile-friendly UI
- Works across different screen sizes

---

## 📂 Project Structure

```
ecommerce-app-mern/
│
├── backend/
│   ├── data/               # Sample/seed data
│   ├── models/             # Database schemas (User, Product, Order)
│   ├── routes/             # API routes
│   ├── server.js           # Backend entry point
│   ├── seeder.js           # Seed database script
│   ├── checkAdmin.js       # Admin utility
│   ├── makeAdmin.js        # Admin setup script
│   ├── package.json
│   └── .env.example
│
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── components/     # Reusable UI (Navbar, Footer, ProductCard)
│   │   ├── config/         # Config files (API setup etc.)
│   │   ├── context/        # Auth, Cart, Wishlist state
│   │   ├── pages/          # All pages (Home, Cart, Login, Admin, etc.)
│   │   ├── styles/         # CSS and responsive styles
│   │   ├── App.js
│   │   └── index.js
│   ├── package.json
│   └── .env.example
│
├── .gitignore
└── README.md
```
---

## ⚙️ Setup

### 1. Clone the repository

```bash
git clone https://github.com/SoudaHimavamsi/ecommerce-app-mern.git
cd ecommerce-app-mern
```

---

### 2. Install dependencies

```bash
# frontend
cd frontend
npm install

# backend
cd ../backend
npm install
```

---

### 3. Setup environment variables

Create `.env` files in both frontend and backend using the provided `.env.example` files.

---

### 4. Run the application

```bash
# start backend
cd backend
npm run dev

# start frontend
cd ../frontend
npm start
```

---

## 🔐 Environment Variables

Make sure to configure:

### Frontend
```
REACT_APP_API_URL=your_backend_url
```

### Backend
```
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
RAZORPAY_KEY_ID=your_razorpay_key
RAZORPAY_KEY_SECRET=your_razorpay_secret
```

---

## 👨‍💻 Author

Souda Himavamsi
