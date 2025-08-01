import express from 'express';
import protect, { adminOnly } from '../middleware/authMiddleware.js';
import { exportTasksReport, exportUsersReport } from '../controllers/reportControllers.js';

const router = express.Router();

router.get('/export-tasks', protect, adminOnly, exportTasksReport);
router.get('/export-users', protect, adminOnly, exportUsersReport);

export default router;