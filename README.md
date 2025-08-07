Task Manager
    A full-stack task management application with user authentication, admin/user roles, task management, reporting, and profile management (including image upload).


Features
    User authentication (JWT-based)
    Admin and Member roles
    Task CRUD (Create, Read, Update, Delete)
    Task status and checklist management
    User management (admin only)
    Export reports (admin only)
    Profile management (update info, upload profile image)
    Responsive UI with React and Tailwind CSS

Project Structure
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

Getting Started
Prerequisites
    Node.js (v18+ recommended)
    npm or yarn
    MongoDB (local or cloud)
    1. Clone the repository 
    git clone <https://github.com/Bre-wubet/task-management-app.git>
    cd TaskManger

2. Setup Environment Variables
Server
Create a .env file in the server/ directory with the following:

    PORT=3001
    MONGO_URI=mongodb://localhost:27017/taskmanager
    JWT_SECRET=your_jwt_secret
    ADMIN_INVITE_TOKEN=your_admin_invite_token
    CLIENT_URL=http://localhost:5173

Client
No environment variables are required by default. The API base URL is set to http://localhost:3001 in client/src/utils/apiPaths.js.

3. Install Dependencies
Server:
    cd server
    npm install

Client:
    cd ../client
    npm install

4. Run the Applications
Start the Server:
    cd server
    npm run dev

Start the Client:
    cd ../client
    npm run dev

API Endpoints:

Auth:
    POST /api/auth/register - Register a new user
    POST /api/auth/login - Login
    GET /api/auth/profile - Get current user profile (auth required)
    PUT /api/auth/profile/:id - Update user profile (auth required)
    POST /api/auth/upload-image - Upload profile image (multipart/form-data)

Users (Admin only unless noted):
    GET /api/users - Get all users (admin)
    GET /api/users/:id - Get user by ID
    DELETE /api/users/:id - Delete user (admin)

Tasks:
    GET /api/tasks/dashboard-tasks - Admin dashboard stats
    GET /api/tasks/user-dashboard-tasks - User dashboard stats
    GET /api/tasks - Get all tasks (admin)
    GET /api/tasks/:id - Get task by ID
    POST /api/tasks - Create task (admin)
    PUT /api/tasks/:id - Update task (admin)
    DELETE /api/tasks/:id - Delete task (admin)
    PUT /api/tasks/:id/status - Update task status
    PUT /api/tasks/:id/todo - Update task checklist

Reports (Admin only):
    GET /api/reports/export-tasks - Export tasks report (Excel)
    GET /api/reports/export-users - Export users report (Excel)

Technologies Used:
Backend:
    Node.js, Express.js
    MongoDB, Mongoose
    JWT for authentication
    Multer for file uploads
    ExcelJS for report export
Frontend:
    React 18+
    React Router DOM
    Axios
    Tailwind CSS
    Context API

Profile Management:
    Users can update their name, email, password, and profile image.
    Profile image upload supports JPG, PNG, GIF (max 5MB).
    Profile settings accessible from the user menu or dashboard.
    Uploaded images are stored in /server/uploads and served at /uploads/<filename>.