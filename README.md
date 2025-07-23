# WTWR API

A RESTful API backend for the WTWR (What to Wear?) application, built with Express.js and MongoDB.

## Features

- **MongoDB/Mongoose models** for `User` and `ClothingItem`
- **REST API** endpoints for managing users and clothing items
- **Clean project structure** with separate folders for models, controllers, and routes
- **Robust error handling** and consistent HTTP status codes
- **Environment configuration** using `.env` variables

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v16 or higher recommended)
- [MongoDB](https://www.mongodb.com/) running locally or accessible via URI

### Installation

1. **Clone the repository:**

   ```bash
   git clone https://github.com/YOUR_USERNAME/se_project_express.git
   cd se_project_express
Install dependencies:

bash
Copy
Edit
npm install
Set up environment variables:

Create a .env file in the root directory and add:

env
Copy
Edit
PORT=3001
MONGO_URL=mongodb://127.0.0.1:27017/wtwr_db
Start the server:

bash
Copy
Edit
npm start
The API will be running at: http://localhost:3001

Folder Structure
bash
Copy
Edit
se_project_express/
├── controllers/     # Business logic
├── models/          # Mongoose schemas and models
├── routes/          # API routes
├── utils/           # Utility functions/constants
├── middlewares/     # Optional custom middleware
├── .env             # Environment configuration
├── app.js           # Entry point
└── package.json     # Dependencies and scripts
License
This project is licensed under the ISC License.
© Fred Hobbs
