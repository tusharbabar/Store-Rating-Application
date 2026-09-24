# Store Rating Web Application

A full-stack web application built according to the **FullStack Intern Coding Challenge** task specifications. The platform enables registered users to submit and modify store ratings (1 to 5 stars), provides store owners with analytics on customer reviews, and gives system administrators complete management capabilities.

---

## 🚀 Tech Stack

- **Frontend**: ReactJS, Vite, Lucide Icons, Custom CSS design system
- **Backend**: Node.js, Express.js (REST API), JWT Authentication, bcryptjs
- **Database**: MySQL (`mysql2/promise`)
- **Validation**: Strict validation rules matching PDF specifications

---

## ✨ Features & Role-Based Access Control

### 1. 🛡️ System Administrator (`ADMIN`)
- **Dashboard Overview**: Metrics displaying total users, total stores, and submitted ratings.
- **Store Management**: Create new store listings and optionally assign store owner accounts.
- **User Management**: Create new System Admins, Normal Users, or Store Owners.
- **Stores Directory**: Dynamic table showing Store Name, Email, Address, and Average Rating with real-time search & column sorting.
- **Users Directory**: Dynamic table showing User Name, Email, Address, Role, and Store Owner ratings with role filter dropdown.

### 2. 👤 Normal User (`USER`)
- **Authentication**: Registration page & unified login portal.
- **Store Directory**: Search stores by Name or Address.
- **Interactive Ratings**: 1-to-5 star rating widget enabling users to submit new ratings or modify existing ratings.
- **Password Updates**: Update account password at any time.

### 3. 🏪 Store Owner (`STORE_OWNER`)
- **Store Dashboard**: Live store metrics highlighting store average rating and total customer reviews.
- **Ratings Breakdown**: Customer reviews table showing user details, submitted ratings, and review timestamps.

---

## 🔒 Form Validations

Enforced on both frontend forms and backend API middleware:
- **Name**: 20 to 60 characters.
- **Address**: Maximum 400 characters.
- **Password**: 8–16 characters, containing at least one uppercase letter and one special character.
- **Email**: Standard email format validation.

---

## 📁 Directory Structure

```
Roxiler task/
├── backend/
├── migrations/
│   └── schema.sql              # MySQL DDL schema
├── src/
│   ├── config/
│   │   ├── db.js                # MySQL pool connection setup
│   │   └── seed.js             
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── ratingController.js
│   │   ├── storeController.js
│   │   └── userController.js
│   ├── middleware/
│   │   └── authMiddleware.js
│   ├── models/
│   │   ├── Rating.js
│   │   ├── Store.js
│   │   ├── User.js
│   │   └── index.js
│   ├── routes/
│   │   ├── adminRoutes.js
│   │   ├── authRoutes.js
│   │   ├── ratingRoutes.js
│   │   ├── storeOwnerRoutes.js
│   │   └── storeRoutes.js
│   ├── utils/
│   │   └── validators.js
│   ├── app.js
│   └── server.js
├── .env.example
└── package.json
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── DataTable.jsx
│   │   │   ├── PasswordModal.jsx
│   │   │   └── StarRating.jsx
│   │   ├── pages/
│   │   │   ├── AdminDashboard.jsx
│   │   │   ├── AuthPage.jsx
│   │   │   ├── NormalUserDashboard.jsx
│   │   │   └── StoreOwnerDashboard.jsx
│   │   ├── App.jsx
│   │   └── index.css
│   ├── index.html
│   ├── vite.config.js
│   └── package.json
└── README.md
```

---

## ⚙️ Local Setup & Installation

### Prerequisites
- Node.js (v18+)
- MySQL Server (v8.0+)

### 1. Database Setup
Create the MySQL database:
```sql
CREATE DATABASE store_ratings;
```

### 2. Backend Setup
Navigate to backend directory and install dependencies:
```bash
cd backend
npm install
```

Configure environment variables by creating `.env` in `backend/`:
```env
PORT=5000
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=your_mysql_password
DB_NAME=store_ratings
JWT_SECRET=SUPER_SECRET_STORE_RATING_KEY_12345
```

Seed initial dataset (sample admin, users, stores, and ratings):
```bash
npm run seed
```

Start backend API server:
```bash
npm run dev
```

### 3. Frontend Setup
In a new terminal tab, navigate to frontend directory and install dependencies:
```bash
cd frontend
npm install
npm run dev
```

Open **http://localhost:5173** in your browser.

---

## 🔑 Demo Test Accounts

| Role | Email | Password |
|---|---|---|
| **System Admin** | `admin@storerating.com` | `Admin@1234` |
| **Normal User** | `john.doe@example.com` | `User@12345` |
| **Store Owner** | `owner.tech@store.com` | `Owner@1234` |
