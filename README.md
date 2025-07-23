# WTWR API

A RESTful API backend for the **WTWR (What to Wear?)** application, built using **Express.js** and **MongoDB**.

---

## 🚀 Features

- MongoDB/Mongoose models for users and clothing items
- RESTful API endpoints for CRUD operations
- Clean project structure: `models/`, `controllers/`, `routes/`
- Environment-based configuration via `.env`
- Robust error handling and appropriate HTTP status codes

---

## 🛠️ Getting Started

### 1. Install dependencies

```bash
npm install
2. Set up environment variables
Create a .env file in the root of the project and add:

env
Copy
Edit
PORT=3001
MONGO_URL=mongodb://127.0.0.1:27017/wtwr_db
3. Start the server
bash
Copy
Edit
npm start
The server will run at: http://localhost:3001

📁 Folder Structure
bash
Copy
Edit
se_project_express/
├── controllers/      # Business logic
├── models/           # Mongoose schemas and models
├── routes/           # API route handlers
├── utils/            # Utility functions/constants
├── middlewares/      # Optional custom middleware
├── .env              # Environment variables
├── app.js            # Application entry point
└── package.json      # Project metadata and dependencies
📄 License
This project is licensed under the ISC License.

© Fred Hobbs
