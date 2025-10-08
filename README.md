# Task Manager

A full-stack task management application with user authentication, admin/user roles, task management, reporting, and profile management (including image upload).

---

## Features

- User authentication (JWT-based)
- Admin and Member roles
- Task CRUD (Create, Read, Update, Delete)
- Task status and checklist management
- User management (admin only)
- Export reports (admin only)
- Profile management (update info, upload profile image)
- Responsive UI with React and Tailwind CSS

---

## Project Structure

```
TaskManger/
  client/      # React frontend
    src/
      pages/
      components/
      context/
      utils/
    public/
    ...
  server/      # Express backend
    controllers/
    models/
    routes/
    middleware/
    config/
    uploads/   # Uploaded images
    ...
```

## Getting Started

### Prerequisites

- Node.js (v18+ recommended)
- npm or yarn
- MongoDB (local or cloud)

### 1. Clone the repository

```bash
git clone <https://github.com/Bre-wubet/task-management-app.git>
cd TaskManger
```

### 2. Setup Environment Variables

#### Development

Create a `.env` file in the `server/` directory with the following:

```bash
cp server/env.example server/.env
```

Edit `server/.env` with your configuration:

```
PORT=3001
MONGO_URI=mongodb://localhost:27017/taskmanager
JWT_SECRET=your_jwt_secret
ADMIN_INVITE_TOKEN=your_admin_invite_token
CLIENT_URL=http://localhost:5173
```

### 3. Install Dependencies

#### Quick Setup (All at once)

```bash
npm run install:all
```

#### Manual Setup

```bash
# Install root dependencies
npm install

# Install server dependencies
cd server && npm install

# Install client dependencies
cd ../client && npm install
```

### 4. Run the Applications

#### Development Mode (Both client and server)

```bash
npm run dev
```

#### Manual Setup

```bash
# Start server
npm run server:dev

# Start client (in another terminal)
npm run client:dev
```

- Client: http://localhost:5173
- Server: http://localhost:3001

## Deployment

### Docker Deployment

#### Build and Run with Docker

```bash
# Build the Docker image
npm run docker:build

# Run the container
npm run docker:run
```

#### Docker Compose (Recommended)

```bash
# Start with MongoDB included
npm run docker:compose
```

This will start:
- Application on http://localhost:3001
- MongoDB on port 27017

### Production Deployment

#### 1. Environment Setup

Create production environment variables:

```bash
cp env.production .env.production
```

Update `.env.production` with your production values:

```
NODE_ENV=production
PORT=3001
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/taskmanager
JWT_SECRET=your_super_secret_jwt_key_here
ADMIN_INVITE_TOKEN=your_admin_invite_token_here
CLIENT_URL=https://yourdomain.com
```

#### 2. Build for Production

```bash
# Build client for production
npm run build:prod

# Start production server
npm start
```

### Cloud Deployment Options

#### Heroku

1. Create a Heroku app
2. Set environment variables in Heroku dashboard
3. Deploy:

```bash
npm run deploy:heroku
```

#### Vercel/Netlify (Frontend) + Railway/Render (Backend)

1. **Frontend**: Deploy client to Vercel/Netlify
2. **Backend**: Deploy server to Railway/Render
3. Update `CLIENT_URL` in backend environment variables

#### DigitalOcean/AWS/GCP

1. Set up a VPS or cloud instance
2. Install Docker
3. Use Docker Compose for deployment
4. Set up reverse proxy (Nginx) for SSL

---

## API Endpoints

### Auth

- `POST   /api/auth/register`         - Register a new user
- `POST   /api/auth/login`            - Login
- `GET    /api/auth/profile`          - Get current user profile (auth required)
- `PUT    /api/auth/profile/:id`      - Update user profile (auth required)
- `POST   /api/auth/upload-image`     - Upload profile image (multipart/form-data)

### Users (Admin only unless noted)

- `GET    /api/users`                 - Get all users (admin)
- `GET    /api/users/:id`             - Get user by ID
- `DELETE /api/users/:id`             - Delete user (admin)

### Tasks

- `GET    /api/tasks/dashboard-tasks`         - Admin dashboard stats
- `GET    /api/tasks/user-dashboard-tasks`    - User dashboard stats
- `GET    /api/tasks`                         - Get all tasks (admin)
- `GET    /api/tasks/:id`                     - Get task by ID
- `POST   /api/tasks`                         - Create task (admin)
- `PUT    /api/tasks/:id`                     - Update task (admin)
- `DELETE /api/tasks/:id`                     - Delete task (admin)
- `PUT    /api/tasks/:id/status`              - Update task status
- `PUT    /api/tasks/:id/todo`                - Update task checklist

### Reports (Admin only)

- `GET    /api/reports/export-tasks`          - Export tasks report (Excel)
- `GET    /api/reports/export-users`          - Export users report (Excel)

---

## Technologies Used

### Backend

- Node.js, Express.js
- MongoDB, Mongoose
- JWT for authentication
- Multer for file uploads
- ExcelJS for report export

### Frontend

- React 18+
- React Router DOM
- Axios
- Tailwind CSS
- Context API

---

## Profile Management

- Users can update their name, email, password, and profile image.
- Profile image upload supports JPG, PNG, GIF (max 5MB).
- Profile settings accessible from the user menu or dashboard.
- Uploaded images are stored in `/server/uploads` and served at `/uploads/<filename>`.
