# SE Project React

A front-end application built with **React** and **Vite** for the WTWR project.  
It includes a mock backend powered by **JSON Server** for local development, and supports deployment to **GitHub Pages**.

## 🚀 Features
- ⚛️ **React 18** with functional components and hooks
- ⚡ **Vite** for fast builds and hot-module reloading
- 🛣 **React Router DOM** for client-side routing
- 🎨 **normalize.css** for cross-browser styling consistency
- 🗄 Local mock API via `json-server` (`db.json`)
- 🌐 Ready for GitHub Pages deployment
- ✅ **ESLint** + Prettier configuration for consistent code style

## 📂 Project Structure
```
se_project_react/
├── public/                 # Static assets
├── src/                    # Source code
│   ├── components/         # React components
│   ├── App.jsx             # Root application component
│   └── main.jsx            # Entry point
├── db.json                 # Local JSON server data
├── index.html              # HTML entry file
├── package.json            # Project configuration
├── vite.config.js          # Vite configuration
├── .env.example            # Example environment variables
└── README.md               # Project documentation
```

## 🔧 Getting Started

### 1) Clone the repository
```bash
git clone https://github.com/<your-username>/se_project_react.git
cd se_project_react
```

### 2) Install dependencies
```bash
npm install
```

### 3) Set up environment variables
```bash
cp .env.example .env
```

### 4) Run the development server

In one terminal:
```bash
npm run server
```

In another terminal:
```bash
npm run dev
```

- React app: **http://localhost:5173** (Vite default)  
- JSON Server: **http://localhost:3001**

## 📜 Scripts

| Command           | Description                                    |
|-------------------|------------------------------------------------|
| `npm run dev`     | Start Vite development server with hot reload  |
| `npm run build`   | Build for production                           |
| `npm run preview` | Preview the production build locally           |
| `npm run lint`    | Lint the codebase with ESLint                  |
| `npm run server`  | Start JSON Server for mock backend (port 3001) |
| `npm run deploy`  | Deploy to GitHub Pages                         |

## 🌍 Deployment
```bash
npm run deploy
```
Make sure the `"homepage"` field in `package.json` points to your GitHub Pages URL:
```json
"homepage": "https://<username>.github.io/se_project_react"
```

## 🧩 Components Overview

| File | Purpose | Key props/context |
|------|---------|-------------------|
| `src/App.jsx` | App shell: routes, modals, data fetch | Provides outlet context (weather, items, handlers) |
| `src/pages/Main.jsx` or `src/components/Main.jsx` | Home view (WeatherCard + ClothesSection) | Uses `CurrentTemperatureUnitContext`; filters items by weather |
| `src/components/Header.jsx` | Header with logo/nav/profile | `isLoggedIn`, `currentUser` |
| `src/components/Footer.jsx` | Footer links / credits | — |
| `src/components/WeatherCard.jsx` | Current temperature / condition | `temperature`, `unit`, `day`, `type` |
| `src/components/ClothesSection.jsx` | Grid of clothing items | `clothingItems`, `onCardClick`, `weatherType` |
| `src/components/ItemModal.jsx` | Item preview modal | `item`, `onClose`, `onDelete` |
| `src/components/AddItemModal.jsx` | Create clothing item | `onAddItem`, `onClose` |
| `src/components/ConfirmDeleteModal.jsx` | Confirm delete modal | `onConfirm`, `onCancel` |
| `src/pages/Profile.jsx` | User profile + items | `currentUser`, `items` |
| `src/contextStore/CurrentTemperatureUnitContext.js` | °F/°C global state | `currentTemperatureUnit`, `setCurrentTemperatureUnit` |
| `src/utils/weatherApi.js` | OpenWeather calls | `fetchWeatherData(lat, lon)` |
| `src/utils/clothingApi.js` | Backend item calls | `getClothingItems`, `addClothingItem`, `deleteClothingItem` |
| `src/blocks/*.css` | Stylesheets (BEM) | — |

### Backend note
- If you’re using the **Express API** instead of JSON Server, point the frontend to `http://127.0.0.1:3001` in `clothingApi.js` and ignore `npm run server`.
- If you use **JSON Server**, keep `npm run server` and `db.json` as documented.

## 📄 License
This project is licensed under the **MIT License**.
