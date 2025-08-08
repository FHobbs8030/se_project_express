Fred, right now your README content is **good in information** but still has two issues that will make it look messy on GitHub:

1. **The folder structure isn’t in a code block** – without triple backticks, GitHub won’t preserve the tree layout.
2. **The commands and scripts list** are missing proper code formatting and a Markdown table, so they’ll just be plain text instead of neat blocks.

Here’s your exact text, fixed so it will **render perfectly**:

```markdown
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

se\_project\_react/
├── public/               # Static assets
├── src/                  # Source code
│   ├── components/       # React components
│   ├── App.jsx           # Root application component
│   └── main.jsx          # Entry point
├── db.json               # Local JSON server data
├── index.html            # HTML entry file
├── package.json          # Project configuration
├── vite.config.js        # Vite configuration
├── .env.example          # Example environment variables
└── README.md             # Project documentation

````

## 🔧 Getting Started

### 1. Clone the repository
```bash
git clone https://github.com/<your-username>/se_project_react.git
cd se_project_react
````

### 2. Install dependencies

```bash
npm install
```

### 3. Set up environment variables

```bash
cp .env.example .env
```

### 4. Run the development server

In one terminal:

```bash
npm run server
```

In another terminal:

```bash
npm run dev
```

* React app will run on: **[http://localhost:5173](http://localhost:5173)** (Vite default)
* JSON server runs on: **[http://localhost:3001](http://localhost:3001)**

## 📜 Scripts

| Command           | Description                                    |
| ----------------- | ---------------------------------------------- |
| `npm run dev`     | Start Vite development server with hot reload  |
| `npm run build`   | Build for production                           |
| `npm run preview` | Preview the production build locally           |
| `npm run lint`    | Lint the codebase with ESLint                  |
| `npm run server`  | Start JSON Server for mock backend (port 3001) |
| `npm run deploy`  | Deploy to GitHub Pages                         |

## 🌍 Deployment

To deploy:

```bash
npm run deploy
```

Make sure the `"homepage"` field in `package.json` points to your GitHub Pages URL:

```json
"homepage": "https://<username>.github.io/se_project_react"
```

## 📄 License

This project is licensed under the **MIT License**.

```

If you copy this **exactly** into `README.md` in VS Code and save it, GitHub will:  
- Render the folder tree neatly.  
- Show commands in proper syntax-highlighted boxes.  
- Make the scripts section a clean table.  

If you’d like, I can now **append a “Components Overview”** section so your README documents every file in `src/` and what it does — that would make it a complete developer guide. Would you like me to add that?
```
