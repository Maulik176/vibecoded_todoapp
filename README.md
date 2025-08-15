<!--- Project README for vibecoded_todoapp (aka ThinkBoard) --->

# ThinkBoard — vibecoded_todoapp

A lightweight note / todo application built with the MERN stack (MongoDB, Express, React, Node) with request rate-limiting and full CRUD. This README explains how to run the project locally, the API surface, environment variables, and developer guidance so contributors can get started quickly.

---

## Table of contents
- Project overview
- Tech stack
- Quick start (dev)
- Build & production
- Environment variables
- API reference (server endpoints)
- Frontend routes
- Development notes & tips
- Troubleshooting
- Contributing
- License

---

## Project overview

ThinkBoard is a small note-taking / todo app that demonstrates a simple, production-ready layout for a MERN project. It includes:

- REST API (Express + Mongoose)
- Rate limiting middleware (Upstash)
- React frontend (Vite + Tailwind + DaisyUI)
- CRUD flows: create, read (list + single), update, delete

The backend serves the frontend build when running in production mode.

---

## Tech stack

- Backend: Node.js, Express, Mongoose (MongoDB)
- Rate limiting: Upstash (redis-based rate limiter)
- Frontend: React (Vite), Tailwind CSS, DaisyUI, react-router, axios
- Dev tooling: nodemon (backend), vite (frontend)

---

## Quick start (development)

Clone the repository and install dependencies for both packages:

```bash
git clone https://github.com/Maulik176/vibecoded_todoapp.git
cd vibecoded_todoapp

# Install backend deps
npm install --prefix backend

# Install frontend deps
npm install --prefix frontend
```

Start both servers in separate terminals (recommended):

Terminal 1 — backend (dev):
```bash
cd backend
npm run dev
```

Terminal 2 — frontend (dev):
```bash
cd frontend
npm run dev
```

By default, the backend runs on port 5001 (see `backend/src/server.js`) and the frontend Vite dev server runs on its default port (Vite will log it, usually 5173).

Open the app in your browser (example):

- Frontend: http://localhost:5173/
- API: http://localhost:5001/api/notes

---

## Build & production

To build the frontend and run the backend server (production-like):

```bash
# From the project root
npm run build

# Then run the backend server
npm start
```

When `NODE_ENV=production`, the backend serves the frontend files from `frontend/dist`.

---

## Environment variables

Create a `.env` file in the `backend/` folder. The backend uses `dotenv` to load these values.

Required variables (example names from the code and typical usage):

- MONGODB_URI — your MongoDB connection string (Atlas or local)
- PORT — optional, defaults to `5001`
- UPSTASH_REDIS_REST_URL — (if using Upstash rate limiter)
- UPSTASH_REDIS_REST_TOKEN — (if using Upstash rate limiter)

Example `.env` (do NOT commit this file):

```bash
MONGODB_URI=mongodb+srv://<user>:<password>@cluster0.mongodb.net/your-db?retryWrites=true&w=majority
PORT=5001
UPSTASH_REDIS_REST_URL=<your-upstash-url>
UPSTASH_REDIS_REST_TOKEN=<your-upstash-token>
NODE_ENV=development
```

If you are not using Upstash or rate-limiting in development, you can omit the Upstash variables. The server includes rate limiter middleware by default; check `backend/src/middleware/rateLimiter.js` to adapt behavior.

---

## API reference

Base URL (dev): `http://localhost:5001/api`

Notes endpoints (mounted at `/api/notes`):

- GET /notes — list all notes (sorted by createdAt desc)
- GET /notes/:id — fetch a single note by id
- POST /notes — create a new note
	- body: { title: string, content: string }
- PUT /notes/:id — update a note
	- body: { title: string, content: string }
- DELETE /notes/:id — delete a note

Responses:
- 200 for OK operations
- 201 for created resources
- 404 if resource not found
- 429 if rate limit exceeded
- 500 for server errors

See `backend/src/controllers/notesControllers.js` for server-side implementation.

---

## Frontend routes (React Router)

- `/` — Home page (list of notes)
- `/create` — Create note page
- `/note/:id` — Note details / edit page

The frontend uses `src/lib/axios.js` to contact the backend API. In dev the base URL is currently set to `http://localhost:5001/api`.

---

## Development notes & tips

- Project structure (important files):
	- `backend/src/server.js` — Express app + route mounting
	- `backend/src/routes/notesRoutes.js` — API routes
	- `backend/src/controllers/notesControllers.js` — controller logic
	- `backend/src/models/Note.js` — Mongoose model
	- `frontend/src` — React app

- Rate limiting: middleware is applied globally (`app.use(rateLimiter)` in `server.js`). Adjust or disable in development if needed.
- Eslint: run `npm run lint` in `frontend` to check frontend lint issues.

Local debugging recommendations:
- Use Postman / HTTPie to test the API endpoints independent of the frontend.
- When working on both front and backend, run them in separate terminals for faster feedback.

---

## Troubleshooting

- "Failed to push refs" when pushing to GitHub: you probably need to fetch remote changes and rebase or merge before pushing. Example:

```bash
git fetch origin
git pull --rebase origin main
# resolve conflicts if any
git push -u origin main
```

- If the backend cannot connect to MongoDB, verify `MONGODB_URI` in `backend/.env` and ensure IP access rules (for Atlas) allow your client.
- If rate-limiting blocks you during development, check `backend/src/middleware/rateLimiter.js` and adjust the configuration.

---

## Contributing

Contributions are welcome. Recommended workflow:

1. Fork the repo
2. Create a feature branch
	 - `git checkout -b feat/your-feature`
3. Make changes and run both servers locally
4. Add tests (if applicable) and ensure linting passes
5. Push and open a pull request describing the change

For any architecture or API changes, open an issue first so we can discuss the design.

---

## License

This project doesn't include a license file.

---

