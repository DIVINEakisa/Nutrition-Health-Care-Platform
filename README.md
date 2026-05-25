# Nutrition Healthcare Platform

A modern full-stack nutrition healthcare platform for nutrition education, registered healthcare consultation, appointment booking, secure payments, and online communication.

## Tech Stack

- Frontend: React, Vite, Tailwind CSS, lucide-react
- Backend: Node.js, Express, JWT, Socket.io
- Database target: PostgreSQL
- Integrations: Stripe payment intents, Cloudinary image uploads

## Project Structure

```text
client/              React and Tailwind application
server/              Express API and Socket.io server
server/db/schema.sql PostgreSQL schema
docs/                Project documentation
```

## Frontend Features

- Premium responsive healthcare homepage
- Nutrition course catalog with search, category filter, progress tracking, and course details
- Embedded YouTube video lessons
- Appointment booking with dates, time slots, status tracking, payment history, and invoice action
- Authentication screens for login, registration, forgot password, and role selection
- Patient, registered nutritionist, and admin dashboards
- Nutritionist course builder, lesson builder, YouTube upload flow, schedule management, appointment approvals, payments, and chat
- Admin analytics, user management, course moderation, appointment oversight, and payment views

## API Features

- `POST /api/auth/register`
- `POST /api/auth/login`
- `POST /api/auth/forgot-password`
- `GET /api/auth/me`
- `GET /api/courses`
- `POST /api/courses`
- `POST /api/courses/:id/lessons`
- `GET /api/appointments`
- `POST /api/appointments`
- `PATCH /api/appointments/:id/status`
- `POST /api/payments/intent`
- `POST /api/payments/confirm`
- `GET /api/chat/:appointmentId/messages`
- `POST /api/chat/:appointmentId/messages`
- `GET /api/admin/analytics`

## Getting Started

Install dependencies:

```bash
npm install --prefix client
npm install --prefix server
```

Run the frontend:

```bash
npm run dev
```

Run the backend:

```bash
npm run dev:api
```

Build the frontend:

```bash
npm run build
```

## Environment

Copy `server/.env.example` to `server/.env` and configure:

```text
DATABASE_URL=
JWT_SECRET=
STRIPE_SECRET_KEY=
CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=
```

The API includes in-memory development data so routes can run before PostgreSQL is connected.

