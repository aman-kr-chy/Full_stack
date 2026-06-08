# TDC Matchmaker - Full Stack Setup

## 📋 Project Structure

```
Full-Stack/
├── Project/              # React Frontend (Vite)
│   ├── src/
│   ├── package.json
│   └── ...
└── backend/              # Node.js/Express Backend
    ├── models/User.js    # MongoDB User Schema
    ├── routes/auth.js    # Authentication API
    ├── config/db.js      # Database Connection
    ├── server.js         # Main Server
    ├── .env             # Environment Config
    └── package.json
```

## 🚀 Setup Instructions

### 1️⃣ Install MongoDB (Local)

**Windows:**
- Download from: https://www.mongodb.com/try/download/community
- Install and run MongoDB service

**Or use MongoDB Atlas (Cloud):**
- Create free account at https://www.mongodb.com/cloud/atlas
- Get connection string and update `.env`

### 2️⃣ Start Backend Server

```bash
cd backend
npm run dev
```

Server runs on: `http://localhost:5000`

### 3️⃣ Start Frontend (New Terminal)

```bash
cd Project
npm run dev
```

Frontend runs on: `http://localhost:5173`

---

## 💾 How Credentials Are Stored

### Before (LocalStorage)
```
Browser LocalStorage:
- tdc_username (plain text - NOT SECURE)
- tdc_password (plain text - NOT SECURE)
```

### Now (MongoDB - SECURE)
```
MongoDB Database:
┌─────────────────────────────┐
│ Users Collection            │
├─────────────────────────────┤
│ _id: ObjectId               │
│ username: "matchmaker"      │
│ password: "$2a$10..." (HASHED with bcrypt)
│ matchmakerName: "Matchmaker"│
│ createdAt: timestamp        │
│ updatedAt: timestamp        │
└─────────────────────────────┘
```

---

## 🔐 Security Features

✅ **Passwords are hashed** using bcryptjs (salted)
✅ **JWT tokens** for session management
✅ **CORS enabled** for frontend communication
✅ **MongoDB** stores credentials securely
✅ **Environment variables** for sensitive config

---

## 📡 API Endpoints

### Login / Register
```
POST http://localhost:5000/api/auth/login
Content-Type: application/json

Request:
{
  "username": "matchmaker",
  "password": "tdc2026"
}

Response:
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "user": {
    "id": "67xxx",
    "username": "matchmaker",
    "matchmakerName": "Matchmaker"
  }
}
```

### Get Profile
```
GET http://localhost:5000/api/auth/profile
Authorization: Bearer <token>

Response:
{
  "user": {
    "id": "67xxx",
    "username": "matchmaker",
    "matchmakerName": "Matchmaker"
  }
}
```

---

## 🛠️ Troubleshooting

| Issue | Solution |
|-------|----------|
| "Cannot connect to MongoDB" | Ensure MongoDB is running (`mongod`) |
| "CORS error" | Check backend is running on port 5000 |
| "Login fails" | Clear localStorage and try again |
| "Port 5000 in use" | Change PORT in .env file |

---

## 📁 .env Configuration

```env
MONGO_URI=mongodb://localhost:27017/tdc_matchmaker
JWT_SECRET=your_jwt_secret_key_change_this_in_production
PORT=5000
NODE_ENV=development
```

---

## ✨ Features

✅ User registration (auto-creates on first login)
✅ User login with password validation
✅ JWT token-based authentication
✅ Password hashing with bcryptjs
✅ Dark/Light theme toggle
✅ Matchmaker dashboard
✅ Client management

---

**Happy Matchmaking! 💕**
