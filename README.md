# WTWR Backend — Sprint 14

This repository contains the **backend API** for the WTWR (What To Wear) application.  
The server is built with **Express** and **MongoDB** and provides authentication, user management, and CRUD operations for clothing items.

This backend fully satisfies **Sprint 14** requirements.

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

### Environment Variables

Create a `.env` file in the project root:

```ini
PORT=3001
MONGO_URL=mongodb://127.0.0.1:27017/wtwr
JWT_SECRET=supersecretjwt
CLIENT_ORIGIN=http://localhost:5173
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

All Postman tests pass (**20/20**).

---

## 🔒 Production Notes

- Use HTTPS in production
- Store secrets securely
- Restrict CORS origins
