# WTWR API — Express Backend (Sprint 12)

A minimal Express + MongoDB API for the **What To Wear (WTWR)** project.  
This sprint intentionally **omits authentication** and uses a **hardcoded user id** middleware.

---

## ✅ Tech Stack
- Node.js, Express
- MongoDB + Mongoose
- ESLint

## ⚙️ Requirements
- Node 18+
- MongoDB running locally (or set `MONGO_URL`)

---

## 🚀 Quickstart
```bash
npm i
npm run dev   # or: npm start
```
You should see a message like:
```
✅ MongoDB connected
WTWR API is running on http://localhost:3001
```

### Defaults
- Base URL: `http://127.0.0.1:3001`
- MongoDB: `mongodb://127.0.0.1:27017/wtwr_db`

### Optional `.env`
```
PORT=3001
MONGO_URL=mongodb://127.0.0.1:27017/wtwr_db
```

---

## 🧱 Project Structure
```
se_project_express/
├─ app.js
├─ controllers/
│  ├─ clothes.js
│  └─ users.js
├─ models/
│  ├─ clothingItem.js
│  └─ user.js
├─ routes/
│  ├─ index.js
│  ├─ items.js
│  └─ users.js
├─ middlewares/
│  ├─ hardcodedUser.js
│  └─ (removed) auth.js
├─ utils/
│  └─ constants.js
└─ package.json
```

**Sprint‑12 scope**
- No auth files or routes
- Uses `hardcodedUser` middleware (sets `req.user._id = "000000000000000000000001"`)
- No `celebrate/Joi` required; validation handled by Mongoose & simple checks
- CORS restricted to `http://localhost:3000` and `http://127.0.0.1:3000`

---

## 🗄 Models (schemas)
### User
```js
{
  name: String(2..30),           // required
  avatar: URL,                   // required (http/https)
  createdAt: Date                // default: now
}
```
### ClothingItem
```js
{
  name: String(2..30),           // required
  weather: "cold"|"warm"|"hot",  // required
  imageUrl: URL,                 // required (http/https)
  owner: ObjectId(User),         // required
  likes: [ObjectId(User)],       // default: []
  createdAt: Date                // default: now
}
```

---

## 🔌 API
### Users
- `GET /users` — list users
- `GET /users/:userId` — get user by id
- `POST /users` — create user  
  Body:
  ```json
  { "name": "Fred", "avatar": "https://example.com/a.png" }
  ```

### Items
- `GET /items` — list items
- `POST /items` — create item  
  Body:
  ```json
  { "name": "Parka", "weather": "cold", "imageUrl": "https://example.com/p.jpg" }
  ```
- `DELETE /items/:id`
- `PUT /items/:id/likes`
- `DELETE /items/:id/likes`

### Status codes & errors
- `400` — invalid id or invalid data (`ValidationError`)
- `404` — not found
- `500` — server error

> Note: Do **not** send a JSON body with **GET** requests; some clients add `Content-Type: application/json` automatically and cause parsing errors.

---

## 🧪 How to test with Postman
1. Create environment var: `baseUrl = http://127.0.0.1:3001`.
2. **Users**
   - `GET {{baseUrl}}/users`
   - `POST {{baseUrl}}/users`
     ```json
     { "name": "Fred", "avatar": "https://example.com/a.png" }
     ```
   - Copy an `_id` and request `GET {{baseUrl}}/users/<id>`
3. **Items**
   - `GET {{baseUrl}}/items`
   - `POST {{baseUrl}}/items`
     ```json
     { "name": "Parka", "weather": "cold", "imageUrl": "https://example.com/p.jpg" }
     ```
   - Like/Unlike/Delete using the returned item `_id`

---

## 🧹 Dev Tips
- Lint fix: `npm run lint:fix`
- If you enable cookies in the future, keep CORS `origin` explicit (not `*`) and set `credentials: true` on both client & server.

## 📄 License
MIT
