# AuthFlow — Node.js Authentication Project

A full-stack authentication app built with **Node.js**, **Express**, **MongoDB**, and vanilla **HTML/CSS/JS**.

---

## Features

- **Register** — create an account with hashed password (bcryptjs)
- **Login** — verify credentials and receive a signed JWT in a secure HttpOnly cookie
- **Protected profile** — `GET /api/users/me` returns your data only when authenticated
- **Logout** — clears the auth cookie server-side
- **Role-based access** — admin-only route (`GET /api/admin/users`)
- **Rate limiting** — auth endpoints limited to 30 requests per 15 minutes
- **Security headers** — Helmet, strict CORS, SameSite cookie policy

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Backend | Node.js, Express 4, Mongoose |
| Database | MongoDB |
| Auth | JWT (jsonwebtoken), bcryptjs |
| Frontend | Vanilla HTML, CSS, JavaScript |

---

## Project Structure

```
authflow-node-auth-learning-starter/
├── backend/
│   ├── .env.example          ← copy to .env and fill in your values
│   ├── package.json
│   └── src/
│       ├── server.js
│       ├── config/db.js
│       ├── models/User.js
│       ├── controllers/
│       │   ├── auth.controller.js
│       │   └── user.controller.js
│       ├── middleware/
│       │   ├── requireAuth.js
│       │   └── requireRole.js
│       └── routes/
│           ├── auth.routes.js
│           └── user.routes.js
└── frontend/
    ├── login.html
    ├── register.html
    ├── profile.html
    ├── styles.css
    └── app.js
```

---

## Getting Started

### Prerequisites
- Node.js 18+
- MongoDB running locally on port `27017` **or** a [MongoDB Atlas](https://www.mongodb.com/atlas) connection string

### 1. Clone the repo

```bash
git clone https://github.com/your-username/authflow-node-auth-learning-starter.git
cd authflow-node-auth-learning-starter
```

### 2. Set up backend environment

```bash
cd backend
cp .env.example .env
```

Edit `.env` and set:
- `MONGODB_URI` — your MongoDB connection string
- `JWT_SECRET` — a long random secret (generate with `openssl rand -hex 64`)

### 3. Install backend dependencies

```bash
cd backend
npm install
```

### 4. Start the backend

```bash
npm run dev       # development (nodemon)
# or
npm start         # production
```

The API will be available at `http://127.0.0.1:5000`.

### 5. Open the frontend

Open `frontend/login.html` in your browser, or use **VS Code Live Server** (recommended — sets origin to `http://127.0.0.1:5500` which matches the default CORS config).

---

## API Endpoints

| Method | Route | Auth required | Description |
|--------|-------|--------------|-------------|
| GET | `/api/health` | No | Health check |
| POST | `/api/auth/register` | No | Create account |
| POST | `/api/auth/login` | No | Login & set cookie |
| POST | `/api/auth/logout` | No | Clear cookie |
| GET | `/api/users/me` | Yes | Authenticated user profile |
| GET | `/api/admin/users` | Yes (admin) | List all users |

---

## Security Notes

- Passwords are **never stored in plain text** — bcryptjs hashes them at cost factor 10
- JWT is stored in an **HttpOnly, SameSite=strict cookie** (not localStorage)
- CORS is restricted to the configured `CLIENT_ORIGIN`
- Error messages use **generic wording** to prevent user enumeration

---

## License

MIT
