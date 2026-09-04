# Mini Kanban Board

A collaborative kanban board app. Create boards, add columns and tasks, drag tasks around, invite people to your board with different permission levels, and see a log of who did what.

Frontend is Next.js + React + Redux Toolkit + Tailwind. Backend is Express + TypeScript + Prisma + PostgreSQL.

## Folder structure

```
kanban-board-web-main/
├── frontend/
├── backend/
└── docker-compose.yml
```

## Running it with Docker

Easiest way if you have Docker installed. From the root folder:

```bash
docker compose up --build
```

This starts Postgres, the backend, and the frontend together.

- App: http://localhost:3000
- API: http://localhost:5000/api/v1

Stop it with `Ctrl + C` and then `docker compose down` if you want to remove the containers.

## Running it manually

### Backend

```bash
cd backend
npm install
```

Create a `.env` file in `backend/`:

```env
PORT=5000
NODE_ENV=development

DATABASE_URL="postgresql://postgres:<YOUR_PASSWORD>@localhost:5432/kanban_db?schema=public"

JWT_ACCESS_SECRET="fgsdfgsfg-adfladfa-adfadf"
JWT_ACCESS_EXPIRES_IN="7d"

SALT_ROUNDS=12
FRONTEND_URL=http://localhost:3000
```

You'll need a local Postgres database called `kanban_db` before this will work — create it in pgAdmin or with `createdb kanban_db`.

Then:

```bash
npx prisma migrate dev --name init
npx prisma generate
npm run dev
```

Backend runs on http://localhost:5000

### Frontend

In another terminal:

```bash
cd frontend
npm install
```

Create `.env.local` in `frontend/`:

```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api/v1
```

Then:

```bash
npm run dev
```

Frontend runs on http://localhost:3000

## Using the app

Register an account, then create a board — it comes with three default columns (To Do, In Progress, Done). Add tasks, drag them between columns or reorder them within a column. Use "Share Board" to invite another registered user by email and pick a role for them. There's an activity page/drawer that shows the history of changes on a board or task.

Roles work like this:

- Owner — full control, including deleting the board and sharing it with others
- Editor — can create/edit/move columns and tasks, can't share the board or delete it
- Viewer — read only

## Backend API

The backend has its own README (`backend/README.md`) with the full list of endpoints, request/response shapes, and the database schema.

## Troubleshooting

- Backend won't connect to the DB — double check `DATABASE_URL` and make sure Postgres is actually running.
- Frontend requests are failing — make sure `NEXT_PUBLIC_API_URL` in `frontend/.env.local` points to wherever the backend is actually running.
- CORS errors — `FRONTEND_URL` in the backend `.env` needs to match the frontend's actual URL.
