# Mini Kanban Board — Backend API
> **Full-Stack Engineering Challenge**  
> Built with **Node.js**, **Express.js**, **TypeScript**, **PostgreSQL**, and **Prisma ORM**.

---

## 📑 Table of Contents
1. [Overview & Features](#-overview--features)
2. [Tech Stack](#-tech-stack)
3. [Architecture & Folder Structure](#-architecture--folder-structure)
4. [Database & Prisma Models](#-database--prisma-models)
5. [Role-Based Access Control (RBAC)](#-role-based-access-control-rbac)
6. [Task Movement & Reordering System](#-task-movement--reordering-system)
7. [Activity & Audit System](#-activity--audit-system)
8. [Local PostgreSQL & Environment Setup](#-local-postgresql--environment-setup)
9. [Installation & Running the Project](#-installation--running-the-project)
10. [API Reference & Documentation](#-api-reference--documentation)

---

## 🌟 Overview & Features

A robust, production-grade RESTful API for a collaborative Mini Kanban Board application with enterprise-level security, role-based authorization, drag-and-drop movement calculation, and automated chronological activity tracking.

### Core Capabilities:
- **Authentication & Security**: Secure User Registration & Login with Bcrypt password hashing (`SALT_ROUNDS=12`). JWT Access Token stored in **HTTP-Only, Secure, SameSite Cookies** to prevent XSS attacks.
- **Board Management & Auto-Provisioning**: Creating a board automatically initializes default columns (`To Do`, `In Progress`, `Done`) and assigns the creator as `OWNER`.
- **Board Collaboration & Sharing**: Share boards with registered users via email with granular roles: `OWNER`, `EDITOR`, `VIEWER`.
- **Column Lifecycle**: Add, rename, delete (cascade), and reorder columns.
- **Task Lifecycle**: Add tasks with auto-calculated consecutive indexes, update details, delete with automatic downstream index compaction.
- **Atomic Task Movement (`PATCH /api/tasks/:id/move`)**:
  - Same-column reordering (moving items up or down with shift calculation).
  - Cross-column movement with atomic index updates using **Prisma Transactions**.
  - Consecutive, stable ordering guaranteed without index gaps or collisions.
- **Activity & Timeline Logging**: Real-time event logging capturing author, action, and human-readable details for every major change.
- **Centralized Error Handling**: Global error handler transforming Prisma errors, Zod validation errors, JWT expirations, and custom AppErrors into a consistent JSON response contract.

---

## 🛠 Tech Stack

| Component | Technology | Version |
|---|---|---|
| **Runtime** | Node.js | `>=18` |
| **Framework** | Express.js | `^5.2.1` |
| **Language** | TypeScript (Strict Mode) | `^5.9.3` |
| **ORM** | Prisma ORM | `^5.20.0` |
| **Database** | PostgreSQL (Local / pgAdmin 4) | `>=14` |
| **Validation** | Zod | `^4.5.4` |
| **Authentication** | JSON Web Tokens (`jsonwebtoken`) + Cookies (`cookie-parser`) | `^9.0.3` / `^1.4.7` |
| **Cryptography** | Bcrypt | `^6.0.0` |
| **Dev Tooling** | Nodemon & TS-Node | Latest |

---

## 📂 Architecture & Folder Structure

The project follows a clean, maintainable **Module-Based Architecture**:

```
backend/
├── prisma/
│   ├── migrations/          # Version-controlled database migrations
│   └── schema.prisma        # Prisma Database Models & Relations
├── src/
│   ├── config/              # Environment & App configuration
│   │   └── index.ts
│   ├── lib/                 # Shared singletons (Prisma Client)
│   │   └── prisma.ts
│   ├── middleware/          # Express Middlewares
│   │   ├── authorization.ts # Role-based & board membership guards
│   │   ├── globalErrorHandler.ts # Centrally handles all errors
│   │   ├── notFound.ts      # 404 handler
│   │   ├── validateRequest.ts # Zod schema validator
│   │   └── verifyToken.ts   # Cookie JWT verification
│   ├── modules/
│   │   ├── auth/            # Authentication (Register, Login, Logout, Me)
│   │   │   ├── auth.controller.ts
│   │   │   ├── auth.interface.ts
│   │   │   ├── auth.route.ts
│   │   │   ├── auth.service.ts
│   │   │   └── auth.validation.ts
│   │   ├── board/           # Board & Member Collaboration
│   │   │   ├── board.controller.ts
│   │   │   ├── board.interface.ts
│   │   │   ├── board.route.ts
│   │   │   ├── board.service.ts
│   │   │   └── board.validation.ts
│   │   ├── column/          # Column Management
│   │   │   ├── column.controller.ts
│   │   │   ├── column.interface.ts
│   │   │   ├── column.route.ts
│   │   │   ├── column.service.ts
│   │   │   └── column.validation.ts
│   │   ├── task/            # Task & Movement Logic
│   │   │   ├── task.controller.ts
│   │   │   ├── task.interface.ts
│   │   │   ├── task.route.ts
│   │   │   ├── task.service.ts
│   │   │   └── task.validation.ts
│   │   └── activity/        # Activity & Audit Timeline
│   │       ├── activity.controller.ts
│   │       ├── activity.interface.ts
│   │       ├── activity.route.ts
│   │       └── activity.service.ts
│   ├── routes/              # Centralized route registry
│   │   └── index.ts
│   ├── types/               # Type declarations & Express augmentation
│   │   └── index.d.ts
│   ├── utils/               # Reusable utilities
│   │   ├── AppError.ts      # Custom error class
│   │   ├── catchAsync.ts    # Async wrapper for controllers
│   │   └── sendResponse.ts  # Standardized response format
│   ├── app.ts               # Express application initialization
│   └── server.ts            # Server entrypoint & graceful shutdown
├── .env                     # Local environment variables
├── .env.example             # Example environment template
├── package.json
└── tsconfig.json
```

---

## 🗄 Database & Prisma Models

Models are defined in [`prisma/schema.prisma`](file:///home/md.nazmulhasan/Coding%20Part/WebBriks/WebB/backend/prisma/schema.prisma):

```
User (1) ──< Board (Owner)
User (1) ──< BoardMember >── (1) Board
Board (1) ──< Column (1) ──< Task
User (1) ──< Task (CreatedBy)
Board (1) ──< Activity
User (1) ──< Activity
Task (1) ──< Activity
```

### Models Overview:
1. **User**: `id`, `name`, `email` (unique), `password`, `createdAt`, `updatedAt`
2. **Board**: `id`, `title`, `ownerId` (FK User), `createdAt`, `updatedAt`
3. **BoardMember**: `id`, `boardId` (FK Board), `userId` (FK User), `role` (`OWNER`, `EDITOR`, `VIEWER`), `createdAt` (Unique constraint on `[boardId, userId]`)
4. **Column**: `id`, `title`, `position`, `boardId` (FK Board), `createdAt`, `updatedAt`
5. **Task**: `id`, `title`, `description`, `position`, `columnId` (FK Column), `createdById` (FK User), `createdAt`, `updatedAt`
6. **Activity**: `id`, `userId` (FK User), `taskId` (Nullable FK Task), `boardId` (FK Board), `action`, `details`, `createdAt`

---

## 🛡 Role-Based Access Control (RBAC)

Every board endpoint enforces strict authorization:

| Permission | OWNER | EDITOR | VIEWER | Unassigned User |
|---|:---:|:---:|:---:|:---:|
| View Board, Columns, Tasks & Activities | ✅ | ✅ | ✅ | ❌ (403/404) |
| Create, Update, Reorder Columns | ✅ | ✅ | ❌ (403) | ❌ (403) |
| Delete Column | ✅ | ✅ | ❌ (403) | ❌ (403) |
| Create, Update, Move Tasks | ✅ | ✅ | ❌ (403) | ❌ (403) |
| Delete Task | ✅ | ✅ | ❌ (403) | ❌ (403) |
| Update Board Title | ✅ | ✅ | ❌ (403) | ❌ (403) |
| Share Board / Manage Member Roles | ✅ | ❌ (403) | ❌ (403) | ❌ (403) |
| Remove Other Members | ✅ | ❌ (403) | ❌ (403) | ❌ (403) |
| Leave Board (Self-remove) | ❌ | ✅ | ✅ | ❌ |
| Delete Entire Board | ✅ | ❌ (403) | ❌ (403) | ❌ (403) |

---

## 🔄 Task Movement & Reordering System

**Route**: `PATCH /api/tasks/:id/move`

### Payload:
```json
{
  "destinationColumnId": "target-column-uuid",
  "destinationIndex": 1
}
```

### Algorithm & Transaction Workflow:
1. **Case A: Same-Column Reordering (`sourceColumnId === destinationColumnId`)**:
   - If moving **down** (`sourceIndex < destinationIndex`): Shift intermediate items between `(sourceIndex, destinationIndex]` up by decrementing `position: { decrement: 1 }`.
   - If moving **up** (`sourceIndex > destinationIndex`): Shift intermediate items between `[destinationIndex, sourceIndex)` down by incrementing `position: { increment: 1 }`.
   - Sets moving task `position = destinationIndex`.
2. **Case B: Cross-Column Movement (`sourceColumnId !== destinationColumnId`)**:
   - In source column: Decrement position of all tasks with `position > sourceIndex`.
   - In destination column: Increment position of all tasks with `position >= destinationIndex`.
   - Updates moving task to `columnId: destinationColumnId` and `position: destinationIndex`.
3. **Audit Log Generation**:
   - Generates and records readable activity:
     `Nazmul Hasan moved task "Build Authentication" from To Do to In Progress`

---

## ⚡ Activity & Audit System

Activities are automatically created on mutations:
- `CREATE_BOARD`
- `UPDATE_BOARD`
- `SHARE_BOARD`
- `UPDATE_MEMBER_ROLE`
- `REMOVE_MEMBER`
- `CREATE_COLUMN`
- `UPDATE_COLUMN`
- `DELETE_COLUMN`
- `CREATE_TASK`
- `UPDATE_TASK`
- `DELETE_TASK`
- `MOVE_TASK`

### Query Endpoints:
- `GET /api/tasks/:taskId/activities` — History for a single task.
- `GET /api/boards/:boardId/activities` — Full activity timeline for a board.

---

## ⚙️ Local PostgreSQL & Environment Setup

### 1. Create Local Database in pgAdmin 4:
1. Open **pgAdmin 4**.
2. Connect to your PostgreSQL server (default port `5432`).
3. Right-click on **Databases** -> **Create** -> **Database...**
4. Set Database name: `kanban_db` -> Click **Save**.

### 2. Configure `.env`:
Create `.env` inside `backend/`:
```env
PORT=5000
NODE_ENV=development

DATABASE_URL="postgresql://postgres:<YOUR_PASSWORD>@localhost:5432/kanban_db?schema=public"

JWT_ACCESS_SECRET="your_jwt_super_secret_key_here"
JWT_ACCESS_EXPIRES_IN="7d"

SALT_ROUNDS=12
FRONTEND_URL=http://localhost:3000
```

---

## 🚀 Installation & Running the Project

```bash
# 1. Navigate to backend
cd backend

# 2. Install dependencies
npm install

# 3. Apply database migrations
npx prisma migrate dev --name init

# 4. Generate Prisma Client
npx prisma generate

# 5. Start Development Server with Hot-Reload
npm run dev

# 6. Build and Run Production Bundle
npm run build
npm start
```

---

## 📡 API Reference & Documentation

Base URL: `http://localhost:5000/api` (or `/api/v1`)

### Standard Response Structure:
**Success**:
```json
{
  "success": true,
  "message": "Operation successful",
  "data": {}
}
```

**Error**:
```json
{
  "success": false,
  "message": "Error description",
  "error": {}
}
```

---

### 1. Authentication Endpoints

#### Register User
- **POST** `/auth/register`
- **Body**:
  ```json
  {
    "name": "Nazmul Hasan",
    "email": "nazmul@example.com",
    "password": "password123"
  }
  ```
- **Response**: `201 Created`

#### Login User
- **POST** `/auth/login`
- **Body**:
  ```json
  {
    "email": "nazmul@example.com",
    "password": "password123"
  }
  ```
- **Response**: `200 OK` + `Set-Cookie: accessToken=...; HttpOnly; SameSite=Lax; Path=/;`

#### Get Current Authenticated User (Me)
- **GET** `/auth/me`
- **Auth**: Cookie `accessToken` (or `Bearer <token>`)
- **Response**: `200 OK`

#### Logout
- **POST** `/auth/logout`
- **Response**: `200 OK` (Clears `accessToken` cookie)

---

### 2. Board Endpoints

#### Create Board
- **POST** `/boards`
- **Body**:
  ```json
  {
    "title": "Sprint 1 Board"
  }
  ```
- **Note**: Automatically creates 3 default columns: `To Do` (0), `In Progress` (1), `Done` (2).

#### Get All User Boards
- **GET** `/boards`
- Returns boards where user is OWNER or MEMBER.

#### Get Single Board
- **GET** `/boards/:id`
- Returns board with columns, ordered tasks, members, and user's role.

#### Update Board Title
- **PATCH** `/boards/:id`
- **Body**: `{ "title": "Updated Title" }`
- **Permission**: `OWNER` or `EDITOR`

#### Delete Board
- **DELETE** `/boards/:id`
- **Permission**: `OWNER` only

#### Share Board / Add Member
- **POST** `/boards/:id/members`
- **Body**:
  ```json
  {
    "email": "colleague@example.com",
    "role": "EDITOR" // "OWNER" | "EDITOR" | "VIEWER"
  }
  ```
- **Permission**: `OWNER` only

#### Update Member Role
- **PATCH** `/boards/:id/members/:memberId`
- **Body**: `{ "role": "VIEWER" }`
- **Permission**: `OWNER` only

#### Remove Member
- **DELETE** `/boards/:id/members/:memberId`
- **Permission**: `OWNER` or Self-Leave

---

### 3. Column Endpoints

#### Create Column
- **POST** `/columns`
- **Body**:
  ```json
  {
    "title": "QA & Review",
    "boardId": "board-uuid",
    "position": 3
  }
  ```
- **Permission**: `OWNER` or `EDITOR`

#### Get Columns for Board
- **GET** `/columns/board/:boardId`
- Returns columns ordered by position ascending with tasks.

#### Update Column
- **PATCH** `/columns/:id`
- **Body**: `{ "title": "Quality Assurance" }`
- **Permission**: `OWNER` or `EDITOR`

#### Delete Column
- **DELETE** `/columns/:id`
- **Permission**: `OWNER` or `EDITOR` (Cascades tasks)

#### Reorder Columns
- **PATCH** `/columns/board/:boardId/reorder`
- **Body**:
  ```json
  {
    "columns": [
      { "id": "col-1", "position": 0 },
      { "id": "col-2", "position": 1 }
    ]
  }
  ```

---

### 4. Task Endpoints

#### Create Task
- **POST** `/tasks`
- **Body**:
  ```json
  {
    "title": "Implement JWT Auth",
    "description": "Secure cookie handling",
    "columnId": "column-uuid"
  }
  ```
- **Permission**: `OWNER` or `EDITOR`

#### Get Single Task
- **GET** `/tasks/:id`
- Returns task with creator, column, and activity log.

#### Update Task
- **PATCH** `/tasks/:id`
- **Body**:
  ```json
  {
    "title": "Updated Task Title",
    "description": "Updated Description"
  }
  ```
- **Permission**: `OWNER` or `EDITOR`

#### Delete Task
- **DELETE** `/tasks/:id`
- Auto-shifts remaining tasks in column down to prevent index gaps.
- **Permission**: `OWNER` or `EDITOR`

#### Move / Reorder Task
- **PATCH** `/tasks/:id/move`
- **Body**:
  ```json
  {
    "destinationColumnId": "target-col-uuid",
    "destinationIndex": 0
  }
  ```
- **Permission**: `OWNER` or `EDITOR`

---

### 5. Activity Endpoints

#### Get Task Activities
- **GET** `/tasks/:taskId/activities` (or `GET /activities/task/:taskId`)
- Returns chronological history of who created, updated, and moved the task.

#### Get Board Activities
- **GET** `/boards/:boardId/activities` (or `GET /activities/board/:boardId`)
- Query Param: `?limit=50`
- Returns complete chronological timeline of events across the board.
