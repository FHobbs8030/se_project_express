# WTWR — Backend (Express + MongoDB)

This repository contains the **backend API** for the WTWR (What To Wear) application.
The server is built with **Express** and **MongoDB** and provides authentication, user management,
and CRUD operations for clothing items.

---

## Live Project

Frontend (Production):
<https://fhobbs.twilightparadox.com>

Backend API (Production Base URL):
<https://api.fhobbs.twilightparadox.com>

Frontend Repository:
<https://github.com/FHobbs8030/se_project_react>

Backend Repository:
<https://github.com/FHobbs8030/se_project_express>

---

## Deployment

The backend API is deployed on a **Google Cloud Compute Engine** virtual machine and runs as a long-lived Node.js process.

- Hosted on a dedicated Debian VM
- Application listens internally on port **3001**
- Exposed publicly via **Nginx reverse proxy**
- Public API base path: `/api`
- Environment configured via `.env`
- Process managed with **PM2**

---

## Features

- JWT-based authentication (signup, signin, signout)
- Secure password hashing with bcrypt
- User profile management
- Clothing items CRUD with ownership enforcement
- Like / unlike functionality for items
- Input validation with Celebrate / Joi
- Centralized error handling with custom error classes
- Configurable CORS support
- Environment-based configuration
- Health check endpoint
- Crash test route for production resilience validation

---

## Tech Stack

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

## Project Structure

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

## Environment Variables

```ini
PORT=3001
MONGO_URI=<mongo_connection_string>
JWT_SECRET=<long_random_secret>
CORS_ORIGIN=https://fhobbs.twilightparadox.com
```

---

## Running the Server

```bash
npm run dev
# or
npm start
```

---

## Health Check

```http
GET /health
```

Response:

```json
{ "status": "ok" }
```

---

## Crash Test Route

```http
GET /crash-test
```

Used to verify PM2 automatic restart behavior in production.

---

## Production Notes

- Use Nginx as a reverse proxy
- Restrict CORS origins to the deployed frontend domain
- Use a process manager (PM2) for uptime
- Ensure environment secrets are not committed to version control

---

## License

MIT
