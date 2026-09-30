# AI WeatherWise

MERN weather platform with JWT auth, role-based admin tools, OpenWeather/WeatherAPI integration, Google Gemini insights, and a resilient fallback mode when external APIs are unavailable.

## Stack

- Backend: Node.js, Express, MongoDB/Mongoose, JWT, bcryptjs, Helmet, Morgan, rate limiting, express-validator
- Frontend: React, Vite, Redux Toolkit, React Router, Axios, Bootstrap, Chart.js
- AI: Google Gemini (`gemini-2.0-flash`) with local recommendation fallback
- Weather: OpenWeather first, WeatherAPI second, deterministic fallback last

## Collections

Users, WeatherHistory, FavoriteLocations, AIInsights, Notifications, Settings

## Setup

1. Start MongoDB locally (default `mongodb://127.0.0.1:27017/ai_weatherwise`).
2. Backend:

```bash
cd backend
copy .env.example .env
npm install
npm run dev
```

3. Optional keys in `backend/.env`:

- `OPENWEATHER_API_KEY`
- `WEATHERAPI_KEY`
- `GEMINI_API_KEY`

Without keys the API still runs in fallback mode.

4. Frontend:

```bash
cd frontend
npm install
npm run dev
```

Open http://localhost:5173

Seeded admin (created on first backend start):

- Email: `admin@weatherwise.local`
- Password: `Admin123!`

## Tests

```bash
cd backend
npm test
```

Covers authentication, profile updates, weather fallback, favorites, history, AI insights, admin RBAC, and health.

## API (all except health/auth register-login require Bearer token)

- `POST /api/auth/register` `POST /api/auth/login` `GET /api/auth/me`
- `PUT /api/users/profile` `PUT /api/users/password`
- `GET /api/weather/current?city=` `GET /api/weather/forecast?city=` `GET /api/weather/search?q=` `GET /api/weather/analytics`
- `GET/POST /api/favorites` `DELETE /api/favorites/:id`
- `GET /api/history` `DELETE /api/history/:id`
- `POST /api/ai/generate` `GET /api/ai`
- `GET /api/settings` `PUT /api/settings`
- `GET /api/notifications`
- Admin: `GET /api/admin/dashboard` `GET /api/admin/reports` `GET /api/users`
