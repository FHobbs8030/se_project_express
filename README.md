# WTWR — Backend (Express + MongoDB)

This repository contains the **backend API** for the WTWR (What To Wear) application.
The server is built with **Express** and **MongoDB** and provides authentication, user management,
and CRUD operations for clothing items.

---

## 🌐 Frontend Integration

This backend powers the WTWR frontend application.

Frontend Repository:  
[https://github.com/FHobbs8030/se_project_react](https://github.com/FHobbs8030/se_project_react)

Deployed Frontend:  
[https://eloquent-sfogliatella-dfc39f.netlify.app](https://eloquent-sfogliatella-dfc39f.netlify.app)

---

## 🚀 Features

- JWT-based authentication (signup, signin, signout)
- Secure password hashing with bcrypt
- User profile management
- Clothing items CRUD with ownership enforcement
- Like / unlike functionality for items
- Input validation with Celebrate / Joi
- Centralized error handling
- Configurable CORS support
- Environment-based configuration
- Health check endpoint

---

## 🧱 Tech Stack

- Node.js
- Express
- MongoDB + Mongoose
- Celebrate / Joi
- bcryptjs
- jsonwebtoken
- dotenv
- cors
- cookie-parser
- nodemon (development)

---

## 📁 Project Structure

```text
se_project_express/
├── controllers/
├── models/
├── routes/
├── middlewares/
├── utils/
├── app.js
├── package.json
└── README.md
```

---

## ⚙️ Setup

### Prerequisites

- Node.js v18+
- MongoDB (local or MongoDB Atlas)
- Postman

### Installation

```bash
git clone <repo-url>
cd se_project_express
npm install
```

---

## 🔐 Environment Variables

Create a `.env` file in the project root:

```ini
PORT=3001
MONGO_URL=mongodb://127.0.0.1:27017/wtwr
JWT_SECRET=supersecretjwt
CLIENT_ORIGIN=http://localhost:5175
```

---

## ▶️ Running the Server

```bash
npm run dev
# or
npm start
```

---

## 🩺 Health Check

```http
GET /health
```

```json
{ "status": "ok" }
```

---

## 📡 API Endpoints

### Authentication

- POST /signup
- POST /signin
- POST /signout

### Users (Auth required)

- GET /users/me
- GET /users/:userId
- PATCH /users/me

### Items (Auth required)

- GET /items
- POST /items
- PUT /items/:itemId/likes
- DELETE /items/:itemId/likes
- DELETE /items/:itemId

---

## 🧪 Testing

All Postman tests pass.

---

## 🚀 Deployment Status

This backend is currently intended to be run locally or on a private server.

The deployed frontend communicates with this API via the configured `VITE_API_BASE_URL`.

---

## 🔒 Production Notes

- Use HTTPS in production
- Store secrets securely
- Restrict CORS origins
