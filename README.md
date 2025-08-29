# WTWR API — Sprint 13 (Express + MongoDB)

A Node.js/Express REST API for **What To Wear? (WTWR)** with MongoDB/Mongoose, JWT authentication, protected routes, and robust validation. This repository reflects **Sprint‑13** requirements.

---

## Quick Start

```bash
# 1) Install
npm install

# 2) Environment
# .env (example)
# PORT=3001
# MONGO_URL=mongodb://localhost:27017/wtwr_db
# CORS_ORIGIN=http://localhost:5173,http://localhost:3000

# 3) Dev server
npm run dev
# Server: http://localhost:3001
```

**Health check:** `GET /` → `{ "service": "WTWR API", "status": "ok" }`  
**Public endpoint:** `GET /items` (all other /items & /users routes require JWT).

---

## Scripts

- `npm start` – start server
- `npm run dev` – dev with nodemon
- `npm run lint` – run ESLint (Airbnb base) and Prettier

---

## Tech Stack

- **Node.js**, **Express**
- **MongoDB**, **Mongoose**
- **JWT** (`jsonwebtoken`), **bcrypt**
- **validator** (URLs/emails)
- **CORS**, **dotenv**
- **ESLint (airbnb-base)** + **Prettier**

---

## CORS

Allowlist is configurable via `CORS_ORIGIN` (comma-separated). Non‑browser clients (no Origin) are allowed.

```env
CORS_ORIGIN=http://localhost:5173,http://localhost:3000
```

---

## Data Models

### User (`user`)
| Field | Type | Rules |
| --- | --- | --- |
| `name` | String | required, 2–30 |
| `avatar` | String | required, valid URL |
| `email` | String | required, **unique**, valid email |
| `password` | String | required, `select:false` |
| `createdAt` | Date | default `Date.now`, required |

**Note:** A **single** unique index on `email` is defined (no duplicates).

### Clothing Item (`clothingItem`)
| Field | Type | Rules |
| --- | --- | --- |
| `name` | String | required, 2–30 |
| `weather` | String | required, enum: `hot` \| `warm` \| `cold` |
| `imageUrl` | String | required, valid URL |
| `owner` | ObjectId → `user` | required |
| `likes` | ObjectId[] → `user` | required, default `[]` |
| `createdAt` | Date | default `Date.now`, required |

Populate is configured so responses include **owner** and **likes** as user sub‑documents (selected fields).

---

## Auth & JWT

- `POST /signup` – creates a user (`name`, `email`, `password`, `avatar`)
- `POST /signin` – returns `{ token }` (JWT with 7d expiry)
- Send token as `Authorization: Bearer <token>`

Passwords are hashed on signup; password field is never returned by the API.

---

## Routes

### Public
- `GET /` → health JSON
- `GET /items` → list items (populated owner/likes)

### Protected (JWT required)
**Users**
- `GET /users/me` – current user
- `PATCH /users/me` – update profile (uses `{ new:true, runValidators:true }`)

**Items**
- `POST /items` – create (server sets `owner` from token)
- `DELETE /items/:id` – only owner can delete (403 otherwise)
- `PUT /items/:id/likes` – like (returns populated item)
- `DELETE /items/:id/likes` – unlike (returns populated item)

---

## Error Model & Status Codes

All errors return JSON: `{ "message": "…" }`

| Status | When |
| --- | --- |
| **400** | Validation error or invalid `ObjectId` (CastError) |
| **401** | Missing/invalid/expired token |
| **403** | Forbidden (e.g., delete not owner) |
| **404** | Resource not found or route missing |
| **409** | Email already exists on signup |
| **500** | Default server error (“An error has occurred on the server.”) |

---

## Smoke Tests

### PowerShell (Windows)
```powershell
$base = 'http://localhost:3001'

# Create/login user A
$signupA = @{ name="Fred"; email="fred@example.com"; password="Passw0rd!"; avatar="https://example.com/a.png" } | ConvertTo-Json
try { irm -Method POST "$base/signup" -ContentType 'application/json' -Body $signupA | Out-Null } catch {}
$loginA = @{ email="fred@example.com"; password="Passw0rd!" } | ConvertTo-Json
$tokenA = (irm -Method POST "$base/signin" -ContentType 'application/json' -Body $loginA).token
$hdrA = @{ Authorization = "Bearer $tokenA" }

# Public route
irm "$base/items" | Out-Null

# Create & like (populated)
$new = @{ name='Demo Jacket'; weather='cold'; imageUrl='https://example.com/j.png' } | ConvertTo-Json
$item = irm -Method POST "$base/items" -Headers $hdrA -ContentType 'application/json' -Body $new
irm -Method PUT "$base/items/$($item._id)/likes" -Headers $hdrA | ConvertTo-Json -Depth 6

# Create user B to test 403
$signupB = @{ name="Tester"; email="tester@example.com"; password="Passw0rd!"; avatar="https://example.com/b.png" } | ConvertTo-Json
try { irm -Method POST "$base/signup" -ContentType 'application/json' -Body $signupB | Out-Null } catch {}
$loginB = @{ email="tester@example.com"; password="Passw0rd!" } | ConvertTo-Json
$tokenB = (irm -Method POST "$base/signin" -ContentType 'application/json' -Body $loginB).token
$hdrB = @{ Authorization = "Bearer $tokenB" }

# Try to delete as non-owner → 403; delete as owner → 200
try { irm -Method DELETE "$base/items/$($item._id)" -Headers $hdrB } catch { $_.Exception.Response.StatusCode.value__ }
irm -Method DELETE "$base/items/$($item._id)" -Headers $hdrA
```

### curl (macOS/Linux)
```bash
BASE=http://localhost:3001
curl -s -X POST $BASE/signup -H "Content-Type: application/json"   -d '{"name":"Demo","email":"demo@example.com","password":"Passw0rd!","avatar":"https://example.com/a.png"}' >/dev/null

TOKEN=$(curl -s -X POST $BASE/signin -H "Content-Type: application/json"   -d '{"email":"demo@example.com","password":"Passw0rd!"}' | jq -r .token)

curl -s $BASE/items >/dev/null  # public

ITEM=$(curl -s -X POST $BASE/items -H "Authorization: Bearer $TOKEN" -H "Content-Type: application/json"   -d '{"name":"Demo Jacket","weather":"cold","imageUrl":"https://example.com/j.png"}' | jq -r ._id)

curl -s -X PUT $BASE/items/$ITEM/likes -H "Authorization: Bearer $TOKEN" | jq
```

**Expected:** Responses include populated `owner` and `likes` objects.

---

## Repo Structure (key parts)

```
.
├─ app.js
├─ controllers/
│  ├─ auth.js
│  ├─ items.js      # populate owner & likes
│  └─ users.js
├─ middlewares/
│  └─ auth.js       # verifies JWT, sets req.user
├─ models/
│  ├─ user.js            # model name: 'user'
│  └─ clothingItem.js    # model name: 'clothingItem', refs 'user'
├─ routes/
│  ├─ items.js
│  └─ users.js
├─ utils/
│  └─ constants.js  # status codes
├─ .editorconfig
├─ .eslintrc.cjs    # extends airbnb-base (with _id allowance)
├─ .prettierrc
├─ .gitignore
└─ README.md
```

---

## Notes

- Seed items from previous sprints may lack `owner`; new items created via authenticated POST will include `owner` and populate correctly.
- Duplicate email conflicts are mapped to **409**.
- Linting uses Airbnb base; the codebase avoids inline `eslint-disable` directives.

---

## License

MIT (for educational use in TripleTen’s curriculum).
