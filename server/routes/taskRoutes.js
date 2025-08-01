import express from 'express';
import protect, { adminOnly } from '../middleware/authMiddleware.js';
import { getDashboardTasks, getUserDashboardTasks, getTasks, getTaskById, createTask, updateTask, updateTaskStatus, updateTaskCheckList, deleteTask } from '../controllers/taskControllers.js';

const router = express.Router();
// @desc    Get all tasks
// @route   GET /api/tasks
// @access  Private
router.get('/dashboard-tasks', protect, getDashboardTasks);
router.get('/user-dashboard-tasks', protect, getUserDashboardTasks);
router.get('/', protect, getTasks); // get all tasks admin
router.get('/:id', protect, getTaskById); // get task by id
router.post('/', protect, adminOnly, createTask); // create task
router.put('/:id', protect, adminOnly, updateTask); // update task
router.delete('/:id', protect, adminOnly, deleteTask); // delete task// get all tasks user
router.put('/:id/status', protect, updateTaskStatus); // update task status
router.put('/:id/todo', protect, updateTaskCheckList); // update task check list


export default router;
