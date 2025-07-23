# WTWR API

A RESTful API backend for the WTWR (What to Wear?) application, built with Express.js and MongoDB.

## Features

- User and ClothingItem models with MongoDB/Mongoose schemas  
- REST API endpoints for users and clothing items  
- Clean project structure with separate folders for models, controllers, and routes  
- Proper error handling and HTTP status codes  
- Environment-based configuration with `.env` support

## Getting Started

### Prerequisites

- Node.js (v16 or higher recommended)  
- MongoDB installed and running locally or accessible remotely

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/YOUR_USERNAME/se_project_express.git
   cd se_project_express

npm install

PORT=3001
MONGO_URL=mongodb://127.0.0.1:27017/wtwr_db

npm start
