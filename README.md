# Laravel and Node.js Login System

A simple login system with Laravel backend and Node.js frontend.

## Setup Instructions

### Backend (Laravel)

1. Start your Laravel server:
   ```
   cd /path/to/laravel/project
   php artisan serve
   ```

2. Laravel server will run on `http://localhost:8000`

### Frontend (Node.js)

1. Navigate to the frontend directory:
   ```
   cd frontend
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Start the frontend server:
   ```
   npm start
   ```

4. Frontend server will run on `http://localhost:3000`

## Test Users

Use these credentials to login:

- Email: admin@example.com, Password: password123
- Email: user@example.com, Password: password456

## Features

- User login with hardcoded credentials
- JWT-like token authentication
- Protected dashboard route
- Logout functionality
