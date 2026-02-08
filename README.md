# WTWR — Backend (Express + MongoDB)

This repository contains the **backend API** for the WTWR (What To Wear) application.
The server is built with **Express** and **MongoDB** and provides authentication, user management,
and CRUD operations for clothing items.

---

## 🌐 Frontend Integration

This backend powers the WTWR frontend application deployed on Google Cloud.

Frontend Repository:  
<https://github.com/FHobbs8030/se_project_react>

Deployed Frontend:  
<http://34.42.205.0>

Backend API (deployed):  
<http://34.42.205.0/api>

Backend Repository:  
[https://github.com/FHobbs8030/se_project_express](https://github.com/FHobbs8030/se_project_express)

---

## 🚀 Deployment

The backend API is deployed on a **Google Cloud Compute Engine** virtual machine and runs as a long-lived Node.js process.

- Hosted on a dedicated VM (Debian)
- Internally runs on port **3001**
- Exposed publicly via **Nginx reverse proxy** at `/api`
- Frontend communicates with the backend through `/api`
- Environment configured via `.env`
- Process managed with **PM2**

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
- PM2 (production process management)
- Nginx
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

## 🔐 Environment Variables

```ini
PORT=3001
MONGO_URI=<mongo_connection_string>
JWT_SECRET=<long_random_secret>
CORS_ORIGIN=http://34.42.205.0
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

## 📄 Production Notes

- Use a reverse proxy (Nginx) in production
- Restrict CORS origins to the deployed frontend
- Use a process manager (PM2) for uptime
