# Authentication App

A full-stack authentication system built with React (Vite) on the frontend and Express + MongoDB + Redis on the backend. It includes user registration, login, email verification, OTP verification, token refresh, logout, and password reset.

## Features

- User registration
- Email verification
- OTP-based verification flow
- Secure login/logout
- JWT access token + refresh token flow
- CSRF protection
- Password reset via email link
- Redis-based token storage for secure reset flows
- Responsive frontend UI

## Tech Stack

Frontend:
- React
- Vite
- React Router
- Axios
- Tailwind CSS
- React Toastify

Backend:
- Node.js
- Express
- MongoDB (Mongoose)
- Redis
- JWT
- Nodemailer
- bcrypt
- Zod

## Project Structure

```bash
Authentication/
├── backend/
│   ├── config/
│   ├── controllers/
│   ├── middlewares/
│   ├── models/
│   ├── routes/
│   ├── .env-sample
│   ├── .gitignore
│   ├── index.js
│   ├── package.json
│   └── package-lock.json
│
├── frontend/
│   ├── public/
│   ├── src/
│   ├── .env-sample
│   ├── .gitignore
│   ├── eslint.config.js
│   ├── index.html
│   ├── package.json
│   ├── vite.config.js
│   └── package-lock.json
│
└── README.md
```

## Prerequisites

Before running the project, make sure you have:

- Node.js installed
- MongoDB running
- Redis running
- A Gmail account or SMTP provider for sending emails

## Installation

### 1. Clone the repository

```bash
git clone https://github.com/Mansi-prasad/Authentication.git
cd Authentication
```

### 2. Install backend dependencies

```bash
cd backend
npm install
```

### 3. Install frontend dependencies

```bash
cd ../frontend
npm install
```

## Environment Variables

Create `.env` files based on the sample files in both apps.

### Backend `.env`
Use `backend/.env-sample` as a reference:

```env
NODE_ENV=
COOKIE_SAME_SITE=
COOKIE_SECURE=
APP_NAME=
MONGO_URI=
PORT=
REDIS_URL=
FRONTEND_URL=
SMPT_PASSWORD=
SMPT_USER=
JWT_SECRET=
REFRESH_SECRET=
FORGOT_PASSWORD_SECRET=
```

### Frontend `.env`
Use `frontend/.env-sample` as a reference:

```env
VITE_BACKEND_URL=
VITE_RECAPTCHA_SITE_KEY=
```

## Running the Application

### Backend

```bash
cd backend
npm run dev
```

### Frontend

```bash
cd frontend
npm run dev
```

The frontend will usually run on:

```bash
http://localhost:5173
```

The backend will run on the port defined in `backend/.env` (commonly `5000` or similar).

## Main API Flow

The backend exposes authentication-related endpoints such as:

- `POST /api/register`
- `POST /api/verify/:token`
- `POST /api/login`
- `POST /api/verify`
- `POST /api/send-otp`
- `GET /api/me`
- `POST /api/refresh`
- `POST /api/logout`
- `POST /api/refresh-csrf`
- `POST /api/forgot-password`
- `POST /api/reset-password/:token`

Note: The exact API base path depends on the backend router setup in your project configuration.

## Security Notes

This app includes several common auth security measures:

- Password hashing with bcrypt
- JWT-based authentication
- Refresh token workflow
- CSRF token validation
- Redis-based reset token management
- Secure email reset links with expiration
