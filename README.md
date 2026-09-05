# Mini Social Post Application

A full-stack MERN mini social feed where users sign up, log in, and share text and/or image posts to a shared public feed. Users can like/unlike posts and comment on them, with counts and updates reflected instantly in the UI.

## Features

- User signup and login
- Secure password hashing (bcrypt)
- JWT authentication with protected routes/endpoints
- Create text-only posts
- Create image-only posts
- Create text + image posts
- Public social feed (all users' posts, newest first)
- Like/unlike posts, with duplicate-like prevention
- Comments on posts
- Live like count and comment count display
- Users can like and comment on posts created by other users
- Responsive, mobile-first UI with a fixed bottom navigation bar

## Tech Stack

**Frontend**
- React.js (Vite)
- React Router
- Axios
- Material UI (primary component library)
- Bootstrap base styles (bootstrap CSS import; `react-bootstrap` included as a dependency per the required stack)
- Custom CSS (dark navy theme, cards, layout)

**Backend**
- Node.js
- Express.js
- JWT (`jsonwebtoken`) for authentication
- bcrypt for password hashing
- Multer for handling image upload (in-memory, converted to base64)

**Database**
- MongoDB Atlas
- Mongoose

## Project Structure

```
mini-social-app/
├── backend/
│   ├── config/         # db.js (Mongo connection), upload.js (Multer + base64 conversion)
│   ├── controllers/     # authController.js, postController.js
│   ├── middleware/      # auth.js (JWT guard), errorHandler.js
│   ├── models/          # User.js, Post.js
│   ├── routes/          # authRoutes.js, postRoutes.js
│   ├── server.js         # Express app entry point
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── components/   # Header, BottomNav, CreatePost, PostCard, CommentSection, ProtectedRoute
│   │   ├── context/       # AuthContext (JWT + user state, persisted to localStorage)
│   │   ├── pages/         # Signup.jsx, Login.jsx, Social.jsx
│   │   ├── services/      # api.js (axios instance), authService.js, postService.js
│   │   ├── App.jsx
│   │   └── main.jsx
│   └── package.json
└── README.md
```

**Backend folders explained**
- `config/` — database connection and Multer upload configuration.
- `controllers/` — request handlers for auth (signup/login) and posts (feed, create, like, comment).
- `middleware/` — JWT verification (`protect`) and centralized error handling.
- `models/` — Mongoose schemas for `User` and `Post`.
- `routes/` — Express route definitions mapping URLs to controllers.

**Frontend folders explained**
- `components/` — reusable UI pieces (header, bottom nav, post creation form, post card, comment section, route guard).
- `context/` — global authentication state via React Context, backed by `localStorage`.
- `pages/` — top-level routed views (Signup, Login, Social feed).
- `services/` — Axios instance and API call wrappers for auth and posts.

## Database Design

The application uses exactly **two** MongoDB collections:

1. **`users`** — stores account data: `username`, `email`, `passwordHash` (bcrypt hash, never the plain password), `createdAt`.
2. **`posts`** — stores each post's `userId`, `username`, `text`, `image` (base64 data URI or `null`), `createdAt`, plus two embedded arrays:
   - `likes` — one entry per user who liked the post (`userId`, `username`).
   - `comments` — one entry per comment (`userId`, `username`, `text`, `createdAt`).

Likes and comments are stored **inside** each post document rather than in their own collections, so no additional MongoDB collections are required.

## Authentication Flow

1. **Signup** — user submits username/email/password → backend hashes the password with bcrypt and stores the user in the `users` collection.
2. **Login** — backend verifies the email/password against the stored hash and issues a JWT containing the user's id and username.
3. **JWT authentication** — the frontend stores the token (and user info) in `localStorage` and attaches it as an `Authorization: Bearer <token>` header on every request.
4. **Protected actions** — creating a post, liking/unliking, and commenting all pass through backend middleware (`protect`) that verifies the JWT before allowing the action.
5. **Logout** — the frontend clears the token/user from `localStorage`, ending the session client-side.

## Application Flow

Signup/Login → land on the Social feed → create a post (text, image, or both) → the post appears at the top of the public feed → any logged-in user can like/unlike or comment on any post → all changes (users, posts, likes, comments) are persisted in MongoDB and reflected instantly in the UI without a page refresh.

## Local Setup

**Backend**
```
cd backend
npm install
npm run dev
```

**Frontend**
```
cd frontend
npm install
npm run dev
```

### Environment variables

Create your own `.env` files locally (never commit them — they are excluded via `.gitignore`).

**`backend/.env`**
```
PORT=5000
NODE_ENV=development
MONGO_URI=your-mongodb-atlas-connection-string
JWT_SECRET=your-own-long-random-secret
JWT_EXPIRES_IN=7d
CLIENT_URL=http://localhost:5173
```

**`frontend/.env`** (only needed when the backend is not running on the same host as the Vite dev proxy, e.g. in production)
```
VITE_API_URL=your-deployed-backend-url/api
```

Reference `.env.example` files are provided in both `backend/` and `frontend/` with placeholder values only.

## API Endpoints

| Method | Endpoint | Purpose | Auth required |
|---|---|---|---|
| POST | `/api/auth/signup` | Register a new user | No |
| POST | `/api/auth/login` | Log in and receive a JWT | No |
| GET | `/api/auth/me` | Get the current authenticated user's profile | Yes |
| GET | `/api/posts` | Fetch the public feed (newest first) | No |
| POST | `/api/posts` | Create a post (text and/or image, via `multipart/form-data`) | Yes |
| POST | `/api/posts/:id/like` | Toggle like/unlike on a post | Yes |
| POST | `/api/posts/:id/comment` | Add a comment to a post | Yes |
| GET | `/api/health` | Health check | No |

## Deployment

- **Frontend** → Vercel (Vite build, output directory `dist`)
- **Backend** → Render (Node web service)
- **Database** → MongoDB Atlas

Key environment variables for deployment:
- **Render (backend):** `MONGO_URI`, `JWT_SECRET`, `JWT_EXPIRES_IN`, `CLIENT_URL` (set to the deployed Vercel URL), `NODE_ENV=production`.
- **Vercel (frontend):** `VITE_API_URL` (set to the deployed Render backend URL + `/api`).
- **MongoDB Atlas:** connection string used as `MONGO_URI`; network access must allow the backend host to connect.

## Security

- Passwords are hashed with bcrypt before being stored — plain-text passwords are never saved.
- Authentication and route protection use JWT.
- All secrets (Mongo connection string, JWT secret, client URL) are stored in environment variables, not in source code.
- `.env` files are excluded from Git via `.gitignore`; only `.env.example` placeholder files are committed.

## Assignment Requirements Checklist

- [x] Account creation (signup/login with hashed passwords + JWT)
- [x] Create post (text-only, image-only, text + image)
- [x] Public feed (all users' posts, newest first)
- [x] Like/unlike posts with duplicate-like prevention, and comments
- [x] Exactly two MongoDB collections (`users`, `posts`) — likes/comments embedded in posts
- [x] React frontend
- [x] Node.js + Express backend
- [x] MongoDB (via Mongoose, hosted on MongoDB Atlas)
- [x] No Tailwind CSS used

## Author

Developed as a Mini Social Post Application project.