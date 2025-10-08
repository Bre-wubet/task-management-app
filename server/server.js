import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import connectDB from './config/db.js';

// Route imports
import authRoutes from './routes/authRoutes.js';
import userRoutes from './routes/userRoutes.js';
import taskRoutes from './routes/taskRoutes.js';
import reportRoutes from './routes/reportRoutes.js';

// Load environment variables
dotenv.config();

// Initialize Express app
const app = express();

// Fix for __dirname in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Database connection
connectDB();

// ===== Middleware =====
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:5173',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}));

app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// ===== API Routes =====
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/tasks', taskRoutes);
app.use('/api/reports', reportRoutes);

// ===== Test Route for JWT =====
app.get('/test-jwt', async (req, res) => {
  try {
    const { testJWT } = await import('./utils/testJwt.js');
    const result = testJWT();
    res.json({
      message: 'JWT test completed',
      success: result
    });
  } catch (error) {
    res.status(500).json({
      message: 'JWT test failed',
      error: error.message
    });
  }
});

// ===== Serve Frontend in Production =====
if (process.env.NODE_ENV === 'production') {
  const frontendPath = path.join(__dirname, '../client/dist');
  app.use(express.static(frontendPath));

  // ✅ Express v5 compatible catch-all route
  app.get('/:path(.*)', (req, res) => {
    res.sendFile(path.resolve(frontendPath, 'index.html'));
  });
} else {
  app.get('/', (req, res) => {
    res.send('✅ Task Manager API is running...');
  });
}

// ===== Start Server =====
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT} in ${process.env.NODE_ENV || 'development'} mode`);
});
