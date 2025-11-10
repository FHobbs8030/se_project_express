# WTWR Backend (Sprint 14)

This is the **backend API** for the WTWR (What To Wear) application, built with **Express** and **MongoDB**.  
It provides user authentication, profile management, and CRUD operations for clothing items.

---

## 🚀 Features

- JWT authentication with signup, signin, and signout
- User profile routes: get current user, get user by ID, update profile
- Clothing item routes: create, list, like/unlike, delete (owner only)
- Input validation with **Celebrate/Joi**
- Centralized error handling
- CORS with configurable client origin
- Environment-based configuration
- Health check endpoint `GET /health`

---

## 📦 Tech Stack

- Node.js / Express
- MongoDB + Mongoose
- Celebrate / Joi (validation)
- bcryptjs (password hashing)
- jsonwebtoken (JWT auth)
- dotenv (environment config)
- cors, cookie-parser
- nodemon (dev)

---

## ⚙️ Setup

### Prerequisites

- Node.js v18+
- MongoDB (local or Atlas)
- Postman (desktop app or web + Desktop Agent)

### Installation

```bash
git clone <repo-url>
cd se_project_express
npm install
```

### Environment Variables

Create a `.env` file in the root:

```ini
PORT=3001
MONGO_URL=mongodb://127.0.0.1:27017/wtwr
JWT_SECRET=supersecretjwt
CLIENT_ORIGIN=http://localhost:5173
```

> Make sure `CLIENT_ORIGIN` matches your frontend origin(s).

---

## ▶️ Running

Start the server:

```bash
npm run dev    # nodemon
# or
npm start
```

Sanity check (HTTP request and expected JSON response):

```http
GET /health HTTP/1.1
Host: localhost:3001
```

```json
{ "status": "ok" }
```

---

## 📡 API Endpoints

### Auth

- `POST /signup` → Create user  
  **Body**:

  ```json
  { "name": "Fred", "email": "fred@example.com", "password": "Password123!", "avatar": "/images/clothes/Avatar.png" }
  ```

- `POST /signin` → Returns `{ "token": "..." }` and sets `jwt` cookie
- `POST /signout` → Clears cookie

### Users (Auth required)

- `GET /users/me`
- `GET /users/:userId`
- `PATCH /users/me`  
  **Body**:

  ```json
  { "name": "Fred Updated", "avatar": "/images/clothes/Avatar.png" }
  ```

### Items (Auth required)

- `GET /items`
- `POST /items` → Create item  
  **Body**:

  ```json
  { "name": "T-shirt", "weather": "warm", "imageUrl": "/images/clothes/T-shirt.png" }
  ```

- `PUT /items/:itemId/likes` → Like
- `DELETE /items/:itemId/likes` → Unlike
- `DELETE /items/:itemId` → Delete (owner only)

---

## ✅ Validation Rules

- `name`: string, 2–30 chars
- `email`: valid email
- `password`: min 8 chars
- `avatar`: valid URL (absolute `https://...` or relative `/images/...`) — **omit** if empty
- `weather`: one of `hot | warm | cold`
- `imageUrl`: valid URL (absolute or `/images/...`)

> Celebrate/Joi is used for all route validation. Errors are returned as `{ "message": "<details>" }` with proper status codes.

---

## 🧪 Testing with Postman

### Import Test Assets

Include these files in the repo root (or `/docs`):

- `WTWR_Sprint14.postman_collection.json`
- `WTWR-Local.postman_environment.json`

### How to Run

1. Import both files into Postman.
2. Select the **WTWR–Local** environment (top-right).
3. Start backend (`npm run dev`).
4. **Run Collection** → executes: Signup → Signin → Users (me/by id/patch) → Items (create/list/like/unlike/delete) → Signout.

#### Common Pitfalls

- **400 on `/signup`** → `avatar` cannot be empty; remove the field or set a valid URL.  
- **409 on `/signup`** → email already exists; change `email` to something unique (e.g., `fred+<timestamp>@example.com`).  
- **401 on `/users` or `/items`** → token missing/invalid; run Signin first.  
- **403 on `/items/:id` delete** → you can only delete items you own.  
- **400 on `/items` create** → `weather` must be `hot|warm|cold`; `imageUrl` must be absolute or `/images/...`.

> Tip: In the Postman Console (**View → Show Postman Console**), you can inspect the exact request body and variables used.

---

## 📊 Newman Test Reports (optional but recommended)

Install:

```bash
npm i -D newman newman-reporter-htmlextra
```

Run:

```bash
npx newman run "WTWR_Sprint14.postman_collection.json"   -e "WTWR-Local.postman_environment.json"   --reporters cli,htmlextra   --reporter-htmlextra-export ./newman/wtwr-sprint14.html   --reporter-htmlextra-title "WTWR Sprint 14 - API Tests"
```

Open `./newman/wtwr-sprint14.html` in your browser.

Add a script to `package.json`:

```json
"scripts": {
  "test:api": "newman run WTWR_Sprint14.postman_collection.json -e WTWR-Local.postman_environment.json --reporters cli,htmlextra --reporter-htmlextra-export ./newman/wtwr-sprint14.html --reporter-htmlextra-title 'WTWR Sprint 14 - API Tests'"
}
```

---

## 📁 Useful NPM Scripts

- `npm run dev` → Run with nodemon
- `npm start` → Start server
- `npm run seed` → Seed items into DB (if included)
- `npm run lint` → Run ESLint
- `npm run test:api` → Run Postman/Newman tests (after adding the script above)

---

## 🎯 Sprint 14 Completion

- All Postman tests (**20/20**) pass: Auth, Users, Items, Likes, Owner Delete, Validation.  
- Backend is **100% complete** for Sprint 14.

---

## 🔒 Security & Production Notes (optional hardening)

- Store strong `JWT_SECRET` and secure it in production.
- Set `COOKIE_SECURE=true` and serve over HTTPS in prod.
- Consider adding rate limiting and security headers (helmet).
- Validate CORS origins carefully in `CLIENT_ORIGIN`.
