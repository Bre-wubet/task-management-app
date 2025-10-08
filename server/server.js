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

dotenv.config();


const app = express();

// Handle ES module dirname issue
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Middlewares
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:5173',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}));
app.use(express.json());

// Serve static files from uploads directory
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

//db connection
connectDB();

// routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/tasks', taskRoutes);
app.use('/api/reports', reportRoutes);
// Serve static files from React app in production
if (process.env.NODE_ENV === 'production') {
  const frontendPath = path.join(__dirname, '../client/dist');
  app.use(express.static(frontendPath));
  
  app.get('*', (req, res) => {
    res.sendFile(path.resolve(frontendPath, 'index.html'));
  });
} else {
  app.get('/', (req, res) => {
    res.send('Task manager API is running...');
  });
}

// Test JWT functionality
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

// Serve frontend (if deploying fullstack on same server)
if (process.env.NODE_ENV === 'production') {
  const frontendPath = path.join(__dirname, '/client/dist');
  app.use(express.static(frontendPath));

  app.get('*', (req, res) => {
    res.sendFile(path.resolve(frontendPath, 'index.html'));
  });
}

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});