# CampusCare

CampusCare is a role-based campus service portal for students, support staff, and administrators. The React client now uses the Express API for login, registration, requests, status changes, assignments, notifications, alerts, user management, performance summaries, and CSV export.

## Local development

### 1. Start MongoDB and configure the API

Copy `server/.env.example` to `server/.env`. Set `MONGO_URI`, a long random `JWT_SECRET`, and `CLIENT_ORIGIN=http://localhost:5173`.

```bash
cd server
npm install
npm run dev
```

The API listens on port 4000 by default. To add one admin account, set `ADMIN_EMAIL`, `ADMIN_NAME`, and a unique 12+ character `ADMIN_PASSWORD` in `server/.env`, then run `npm run create-admin`. To insert sample accounts and requests into a **development database only**, run `npm run seed`; that script clears existing sample-domain users, requests, and resolutions before inserting its fixtures.

### 2. Start the client

```bash
cd client
npm install
npm run dev
```

The client opens at `http://localhost:5173` and calls `http://localhost:4000/api` by default. For another API URL, create `client/.env.local` using `client/.env.example` and set `VITE_API_URL` to the API base URL ending in `/api`.

Use `http://localhost:5173/?demo=1` to open the interactive sample dashboard without an API or database. The login screen also has an **Explore interactive demo** button. Demo changes exist only in browser memory.

The sample seed account credentials are intended for local development only: `admin@campuscare.edu` / `Admin@123`. Staff and student sample accounts use `CampusCare!2026`. Do not use the sample seed on a public database.

## Features connected to the API

- Student registration and login, and login for staff/admin accounts.
- JWT protected client sessions and server-side role-based access checks.
- Student request history and creation; status history and notifications refresh every 20 seconds.
- Staff assigned work, campus-wide open-request browsing, progress changes, and resolution notes.
- Admin assignment, account listing/deactivation, staff creation, urgency/overdue alerts, stats, and staff resolution performance.
- Search, category/status filters, and request CSV export.

Successful API responses use `{ success, data, message }`. Protected calls use `Authorization: Bearer <token>`. Passwords use bcrypt (12 rounds); incoming payloads use Zod validation. The API configures Helmet, origin-specific CORS, JSON size limits, and login rate limiting. Logout clears the browser token; JWTs remain valid until expiry if copied elsewhere.

## Public deployment setup

The included deployment configuration targets a static client on Vercel and the API on Render. MongoDB Atlas (or another reachable MongoDB deployment) is required.

1. Create the production database and deploy `server/` using the included `render.yaml` blueprint. In Render, set `MONGO_URI`, a long random `JWT_SECRET`, and `CLIENT_ORIGIN` to the exact public client origin. The API health route is `/api/health`.
2. Create the initial administrator against the production database by setting `ADMIN_EMAIL`, `ADMIN_NAME`, `ADMIN_PASSWORD` locally in the server environment and running `npm run create-admin` once. This script refuses to overwrite an existing account. Do not run the sample seed against production.
3. Deploy `client/` as the Vercel project root. Set `VITE_API_URL` to the deployed API URL ending with `/api`, then deploy. The included `vercel.json` sends client-side routes to the React entry point.
4. Set Render's `CLIENT_ORIGIN` to the deployed Vercel domain and redeploy/restart the API. Confirm `/api/health`, student registration, admin login, and request creation.

Do not paste production passwords or database connection strings into chat or commit them into the repository. Enter them directly in the hosting provider's secret/environment settings. You need access to Vercel, Render, and MongoDB Atlas accounts to publish the site and connect its production data.

## API endpoints

All routes are under `/api`.

| Area | Routes |
|---|---|
| Auth | `POST /auth/register`, `POST /auth/login`, `POST /auth/logout`, `PATCH /auth/password`, `GET /auth/me` |
| Requests | `GET/POST /requests`, `GET /requests/:id` (includes status history), `GET /requests/search`, `PATCH /requests/:id/status`, `PATCH /requests/:id/assign`, `DELETE /requests/:id` (closes) |
| Resolutions | `POST /resolutions/:requestId`, `GET /resolutions/:requestId` |
| Users | `GET /users`, `GET/PATCH /users/:id`, `PATCH /users/:id/deactivate`, `POST /users/staff` |
| Admin | `GET /admin/stats`, `GET /admin/alerts`, `GET /admin/performance` |
| Notifications | `GET /notifications`, `PATCH /notifications/:id/read` |
