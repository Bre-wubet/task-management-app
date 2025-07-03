import express from 'express';
import Task from '../models/Task.js';

const router = express.Router();
// @desc    Get all tasks
// @route   GET /api/tasks
// @access  Private
router.get('/', async (req, res) => {
  try {
    const tasks = await Task.find({});
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// @desc    Create a new task
// @route   POST /api/tasks
// @access  Private

export default router;
