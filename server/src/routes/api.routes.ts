import { Router } from 'express';
import * as auth from '../controllers/auth.controller.js';
import * as goals from '../controllers/goals.controller.js';
import * as manager from '../controllers/manager.controller.js';
import * as checkins from '../controllers/checkins.controller.js';
import * as admin from '../controllers/admin.controller.js';
import { authenticate, authorize } from '../middleware/auth.js';

const router = Router();

// Auth
router.post('/auth/login', auth.login);
router.get('/auth/me', authenticate, auth.getMe);

// Goals (Employee)
router.get('/goals', authenticate, goals.getGoals);
router.post('/goals', authenticate, goals.createGoalSheet);
router.put('/goals/:id', authenticate, goals.updateGoal);

// Manager Review
router.get('/manager/team-goals', authenticate, authorize(['manager', 'admin']), manager.getTeamGoals);
router.post('/manager/goals/:id/review', authenticate, authorize(['manager', 'admin']), manager.reviewGoal);

// Check-ins
router.get('/checkins', authenticate, checkins.getCheckins);
router.post('/checkins', authenticate, checkins.updateCheckin);

// Admin
router.get('/admin/users', authenticate, authorize(['admin']), admin.getUsers);
router.post('/admin/cycles', authenticate, authorize(['admin']), admin.createCycle);
router.post('/admin/shared-goals', authenticate, authorize(['admin']), admin.pushSharedGoal);
router.post('/admin/goals/:id/unlock', authenticate, authorize(['admin']), admin.unlockGoal);

export default router;
