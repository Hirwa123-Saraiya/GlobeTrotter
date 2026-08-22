# GlobeTrotter Backend

Node.js / Express API for GlobeTrotter. Current focus: **Authentication module** (branch `feat/authentication`).

## Tech Stack

- **Runtime:** Node.js + Express
- **Database:** PostgreSQL, accessed via raw SQL through the `pg` `Pool` (no ORM)
- **Auth:** JWT (access + refresh tokens), delivered as **httpOnly cookies**
- **Docs:** Swagger (OpenAPI 3) via `swagger-jsdoc` + `swagger-ui-express`
- **Validation:** express-validator

## Getting Started

```bash
npm install
copy .env.example .env      # Windows PowerShell: Copy-Item .env.example .env
```

Edit `.env` and fill in real values (at minimum a real Postgres password and
long random `JWT_SECRET` / `JWT_REFRESH_SECRET`).

Create the database, then run migrations:

```bash
createdb globetrotter
npm run migrate
```

Start the server:

```bash
npm run dev     # node --watch, auto-restarts on file change
# or
npm start
```

## Swagger / API Docs

Once running:

- Swagger UI: `http://localhost:5000/api-docs`

New routes should be documented with `@swagger` JSDoc blocks directly above the
route definition — see `src/routes/auth.routes.js` for the pattern.

## Authentication Design

- Passwords are hashed with **bcrypt** (12 salt rounds) before being stored.
- On **signup** / **login**, the server issues:
  - `accessToken` — short-lived JWT (15 min default), used to authenticate requests.
  - `refreshToken` — long-lived JWT (7 days default), used only to mint new access tokens.
- Both tokens are set as **httpOnly cookies** (`sameSite`, `secure` in production)
  — never exposed to client-side JavaScript, which protects against XSS-based token theft.
- `refresh_token_version` on the `users` row lets a single update invalidate all
  outstanding refresh tokens for that user (used on logout and password reset)
  without needing a separate token-blacklist table.
- `POST /api/auth/refresh-token` reads the `refreshToken` cookie and issues a
  fresh pair of cookies once the access token expires — the frontend should call
  this silently (e.g. on a 401 from a protected route) instead of forcing re-login.
- `protect` middleware (`src/middlewares/auth.middleware.js`) reads `accessToken`
  from the cookie, verifies it, and attaches `req.user` / `req.userRow` for
  downstream handlers.

### Endpoints (`/api/auth`)

| Method | Path              | Auth required  | Description                           |
|--------|-------------------|----------------|----------------------------------------|
| POST   | `/signup`          | No             | Create account, sets auth cookies      |
| POST   | `/login`           | No             | Authenticate, sets auth cookies        |
| POST   | `/logout`          | Yes            | Clears cookies, revokes refresh token  |
| POST   | `/refresh-token`   | Refresh cookie | Issues new access/refresh cookies      |
| GET    | `/me`              | Yes            | Returns current authenticated user     |
| POST   | `/forgot-password` | No             | Generates password reset token         |
| POST   | `/reset-password`  | No             | Resets password using emailed token    |

> Frontend note: calls to this API must be made with `credentials: 'include'`
> (fetch) or `withCredentials: true` (axios) so the browser sends/stores the
> httpOnly cookies, and `FRONTEND_URL` in `.env` must exactly match the frontend origin.

## Project Structure

```
src/
  config/        # db.js (pg Pool + connectDB), swagger.js (OpenAPI spec)
  controllers/   # auth.controller.js
  db/
    migrations/  # raw .sql migration files, applied in filename order
    migrate.js   # migration runner (npm run migrate)
  middlewares/   # auth.middleware.js, validate.middleware.js, error.middleware.js
  models/        # user.model.js (raw SQL query functions against the pg Pool)
  routes/        # index.js, auth.routes.js
  utils/         # jwt.util.js, ApiError.js, asyncHandler.js
  validators/    # auth.validator.js
  server.js      # app bootstrap
```

## Next Steps (per implementation plan)

- Trips, Stops, Cities, Activities, Expenses tables + CRUD (relational, all scoped
  to `req.user.id` — every mutation must verify ownership of the referenced trip/resource).
- Budget engine endpoints (category breakdown, daily average, health state).
- Public/shared itinerary endpoints (no auth, read-only, via a share slug/token).
- Wire `forgotPassword`'s reset link to a real email provider (SES/SendGrid) instead
  of `console.log`.
