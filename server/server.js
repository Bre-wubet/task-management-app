import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

import connectDB from './config/db.js';

// Route imports
import authRoutes from './routes/authRoutes.js';
// import userRoutes from './routes/userRoutes.js';
// import taskRoutes from './routes/taskRoutes.js';
// import reportRoutes from './routes/reportRoutes.js';

dotenv.config();


const app = express();

app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:3000',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));
app.use(express.json());

//db connection
connectDB();

// routes
// app.use('/api/tasks', taskRoutes);
// app.use('/api/users', userRoutes);
app.use('/api/auth', authRoutes);
// app.use('/api/reports', reportRoutes);

app.get('/', (req, res) => {
  res.send('Task manager API is running...');
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});