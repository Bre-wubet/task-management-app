import React, { useContext } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { UserContext } from './context/UserContext';

// Auth pages
import Login from './pages/auth/Login';
import SignUp from './pages/auth/SignUp';

// Admin pages
import Dashboard from './pages/admin/Dashboard';
import CreateTask from './pages/admin/CreateTask';
import ManageTasks from './pages/admin/ManageTasks';
import ManageUsers from './pages/admin/ManageUsers';

// User pages
import UserDashboard from './pages/user/UserDashboard';
import MyTasks from './pages/user/MyTasks';
import ViewTaskDetails from './pages/user/ViewTaskDetails';

// Layouts
import AuthLayout from './components/layouts/AuthLayout';
import UserProvider from './context/UserContext';

// Private Route Component
const PrivateRoute = ({ children, allowedRoles = [] }) => {
  const { user, loading } = useContext(UserContext);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles.length > 0 && !allowedRoles.includes(user.role)) {
    return <Navigate to="/" replace />;
  }

  return children;
};

// Admin Route Component
const AdminRoute = ({ children }) => {
  return <PrivateRoute allowedRoles={['Admin']}>{children}</PrivateRoute>;
};

// User Route Component
const UserRoute = ({ children }) => {
  return <PrivateRoute allowedRoles={['Admin', 'Member']}>{children}</PrivateRoute>;
};

function App() {
  const { user } = useContext(UserContext);

  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/login" element={
          user ? <Navigate to={user.role === 'Admin' ? '/admin/dashboard' : '/user/dashboard'} replace /> : <Login />
        } />
        <Route path="/signup" element={
          user ? <Navigate to={user.role === 'Admin' ? '/admin/dashboard' : '/user/dashboard'} replace /> : <SignUp />
        } />

        {/* Admin Routes */}
        <Route path="/admin/dashboard" element={
          <AdminRoute>
            <AuthLayout>
              <Dashboard />
            </AuthLayout>
          </AdminRoute>
        } />
        <Route path="/admin/create-task" element={
          <AdminRoute>
            <AuthLayout>
              <CreateTask />
            </AuthLayout>
          </AdminRoute>
        } />
        <Route path="/admin/manage-tasks" element={
          <AdminRoute>
            <AuthLayout>
              <ManageTasks />
            </AuthLayout>
          </AdminRoute>
        } />
        <Route path="/admin/manage-users" element={
          <AdminRoute>
            <AuthLayout>
              <ManageUsers />
            </AuthLayout>
          </AdminRoute>
        } />

        {/* User Routes */}
        <Route path="/user/dashboard" element={
          <UserRoute>
            <AuthLayout>
              <UserDashboard />
            </AuthLayout>
          </UserRoute>
        } />
        <Route path="/user/my-tasks" element={
          <UserRoute>
            <AuthLayout>
              <MyTasks />
            </AuthLayout>
          </UserRoute>
        } />
        <Route path="/user/task/:id" element={
          <UserRoute>
            <AuthLayout>
              <ViewTaskDetails />
            </AuthLayout>
          </UserRoute>
        } />

        {/* Default redirects */}
        <Route path="/" element={
          user ? (
            user.role === 'Admin' ? 
              <Navigate to="/admin/dashboard" replace /> : 
              <Navigate to="/user/dashboard" replace />
          ) : (
            <Navigate to="/login" replace />
          )
        } />
        <Route path="/admin" element={
          user && user.role === 'Admin' ? 
            <Navigate to="/admin/dashboard" replace /> : 
            <Navigate to="/login" replace />
        } />
        <Route path="/user" element={
          user ? 
            <Navigate to="/user/dashboard" replace /> : 
            <Navigate to="/login" replace />
        } />

        {/* Catch all route */}
        <Route path="*" element={
          user ? (
            user.role === 'Admin' ? 
              <Navigate to="/admin/dashboard" replace /> : 
              <Navigate to="/user/dashboard" replace />
          ) : (
            <Navigate to="/login" replace />
          )
        } />
      </Routes>
    </Router>
  );
}

// Wrap the App with UserProvider
function AppWithProvider() {
  return (
    <UserProvider>
      <App />
    </UserProvider>
  );
}

export default AppWithProvider;