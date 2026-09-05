# Mini Social Post Application

MERN mini social feed: signup/login (JWT + bcrypt), text/image/text+image posts, like/unlike (duplicate-safe), comments — all updating instantly in the UI. Original dark-navy, rounded-card, bottom-nav mobile-first UI inspired by TaskPlanet's social page (no proprietary assets copied).

Exactly two MongoDB collections: `users` and `posts`. Likes and comments are embedded arrays on each Post document — no separate collections.

Images are stored as base64 data URIs directly on the Post document (not on disk). This is deliberate: Render's filesystem is ephemeral, so anything written to `backend/uploads` would be wiped on every redeploy/restart/scale event. Storing in MongoDB Atlas instead means images persist reliably and the same code works unchanged in local dev and production, with no third-party file storage service needed.

## 1. Backend install
```
cd backend
npm install
```

## 2. Frontend install
```
cd frontend
npm install
```

## 3. MongoDB Atlas setup
1. Create a free cluster at https://cloud.mongodb.com.
2. Database Access → add a database user (username + password).
3. Network Access → add IP `0.0.0.0/0` (or your machine's IP for local-only).
4. Database → Connect → Drivers → copy the `mongodb+srv://...` connection string.

## 4. Backend `.env` configuration
Copy the example and fill in real values (never commit `.env` — it's gitignored):
```
cd backend
cp .env.example .env
```
Edit `backend/.env`:
```
PORT=5000
NODE_ENV=development
MONGO_URI=mongodb+srv://<user>:<password>@<cluster-url>/mini-social?retryWrites=true&w=majority
JWT_SECRET=<a long random string>
JWT_EXPIRES_IN=7d
CLIENT_URL=http://localhost:5173
```

## 5. Start backend
```
cd backend
npm run dev        # or: npm start
```
Runs on `http://localhost:5000`. Check `http://localhost:5000/api/health` → `{"status":"ok"}`.

## 6. Start frontend
```
cd frontend
npm run dev
```
Runs on `http://localhost:5173`. `/api` calls are proxied to `localhost:5000` by `vite.config.js` — no frontend `.env` needed for local dev (leave `VITE_API_URL` unset).

## 7. Local URLs
- Frontend: http://localhost:5173
- Backend API: http://localhost:5000/api
- Health check: http://localhost:5000/api/health

## 8. Manual test checklist
1. Go to `/signup`, create an account → redirected to `/social`.
2. Log out, log back in at `/login` with the same credentials.
3. Create a text-only post, an image-only post, and a text+image post.
4. Try submitting an empty post → should be blocked (button disabled / error shown).
5. Like a post → count increments instantly, icon fills. Click again → unlikes, count decrements. Refresh the page → state is correct (fetched from DB, not just local state).
6. Log in as a second user (different browser/incognito) → like the same post → confirm both users appear correctly and neither can double-like.
7. Add a comment → appears instantly with your username and timestamp, comment count increments.
8. Open browser dev tools → Network tab → confirm `/api/posts`, `/api/posts/:id/like`, `/api/posts/:id/comment` all require the `Authorization: Bearer <token>` header, and that calling them without a token (e.g. after clearing localStorage) returns `401`.

## 9. Production deployment

**GitHub**
```
git init
git add .
git commit -m "Mini social app"
git branch -M main
git remote add origin <your-repo-url>
git push -u origin main
```
`.env` files are gitignored at the root, backend, and frontend level — only `.env.example` files are tracked.

**MongoDB Atlas** — same cluster as local setup; just make sure Network Access allows Render's egress (`0.0.0.0/0` is simplest for a student project).

**Render (backend)**
1. New → Web Service → connect your GitHub repo.
2. Root Directory: `backend`
3. Build Command: `npm install`
4. Start Command: `npm start`
5. Add environment variables (see table below).
6. Deploy → note the URL, e.g. `https://mini-social-backend.onrender.com`.
(A `backend/render.yaml` blueprint is included if you prefer Render's "Blueprint" import instead of manual setup.)

**Vercel (frontend)**
1. New Project → import the same GitHub repo.
2. Root Directory: `frontend`
3. Framework preset: Vite (auto-detected). Build Command: `npm run build`. Output Directory: `dist`.
4. Add environment variable `VITE_API_URL` = `https://mini-social-backend.onrender.com/api` (your actual Render URL + `/api`).
5. Deploy → note the URL, e.g. `https://mini-social-app.vercel.app`.
6. `frontend/vercel.json` is included so client-side routes (`/social`, `/login`) don't 404 on refresh.
7. Go back to Render and set `CLIENT_URL` to this Vercel URL (see below), then redeploy the backend so CORS allows it.

### Required environment variables

| Where | Variable | Value |
|---|---|---|
| Local backend (`backend/.env`) | `MONGO_URI` | Your Atlas connection string |
| | `JWT_SECRET` | Long random string |
| | `JWT_EXPIRES_IN` | e.g. `7d` |
| | `CLIENT_URL` | `http://localhost:5173` |
| | `PORT` | `5000` |
| Render backend | `MONGO_URI` | Your Atlas connection string |
| | `JWT_SECRET` | Long random string (different from any dev value) |
| | `JWT_EXPIRES_IN` | e.g. `7d` |
| | `CLIENT_URL` | Your Vercel URL, e.g. `https://mini-social-app.vercel.app` (comma-separate multiple origins if needed) |
| | `NODE_ENV` | `production` |
| Vercel frontend | `VITE_API_URL` | Your Render URL + `/api`, e.g. `https://mini-social-backend.onrender.com/api` |

## Honesty note on testing in this environment

This sandbox has no network access and no local MongoDB installed, so I could not run `npm install`, start a live server, or execute the checklist above myself here. Every backend file passes `node --check` and every frontend file passes an `esbuild` syntax check, and I traced the request/response flow by hand (auth, post creation with base64 image conversion, like/unlike dedup, comment updates, CORS, env var usage) — but that is static verification, not a live test run. Please run the checklist in section 8 yourself after `npm install`; tell me the exact error if anything fails and I'll fix it directly.

## Structure
```
backend/
  config/       db.js (Mongo connection), upload.js (multer memory storage -> base64)
  controllers/  authController.js, postController.js
  middleware/   auth.js (JWT guard), errorHandler.js
  models/       User.js, Post.js (only 2 collections; likes/comments embedded)
  routes/       authRoutes.js, postRoutes.js
  server.js
  render.yaml   optional Render blueprint

frontend/src/
  components/   Header, BottomNav, CreatePost, PostCard, CommentSection, ProtectedRoute
  context/      AuthContext (JWT + user in localStorage)
  pages/        Signup, Login, Social
  services/     api.js (axios + VITE_API_URL), authService.js, postService.js
  vercel.json   SPA rewrite for client-side routing
```
