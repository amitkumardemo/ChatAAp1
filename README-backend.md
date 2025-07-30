# FoodMart Backend Setup Instructions

This backend is built with Node.js, Express, and SQLite for the FoodMart e-commerce website.

## Prerequisites

- Node.js (version 14 or higher recommended)
- npm (comes with Node.js)

## Setup

1. Open a terminal and navigate to the `backend` directory:

```bash
cd backend
```

2. Install dependencies:

```bash
npm install express sqlite3 bcrypt jsonwebtoken cors body-parser
```

3. Start the backend server:

```bash
node server.js
```

The server will start on port 3001 by default.

## API Endpoints

- `POST /api/register` - Register a new user. Requires JSON body with `username`, `email`, and `password`.
- `POST /api/login` - Login user. Requires JSON body with `email` and `password`. Returns a JWT token.
- `GET /api/products` - Get list of products (sample data).
- `GET /api/profile` - Protected route, requires JWT token in `Authorization` header.

## Frontend

- The frontend files (e.g., `index.html`, `login.html`, `signup.html`) are served separately.
- Make sure to run the backend server on port 3001.
- The frontend uses AJAX calls to communicate with the backend API.

## Notes

- Change the `SECRET_KEY` in `server.js` to a strong secret before deploying.
- This setup is for development and testing purposes.
- For production, consider using a more robust database and secure deployment practices.
