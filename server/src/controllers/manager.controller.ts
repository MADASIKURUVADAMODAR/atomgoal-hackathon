import { Response } from 'express';
import { v4 as uuidv4 } from 'uuid';
import db from '../config/database.js';
import { AuthRequest } from '../middleware/auth.js';

export const getTeamGoals = (req: AuthRequest, res: Response) => {
    try {
        const teamGoals = db.prepare(`
            SELECT g.*, u.name as employee_name, u.department 
            FROM goals g 
            JOIN users u ON g.user_id = u.id 
            WHERE u.manager_id = ?
        `).all(req.user?.id);
        res.json(teamGoals);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

export const reviewGoal = (req: AuthRequest, res: Response) => {
    const { id } = req.params;
    const { action, comments, modified_target, modified_weightage } = req.body;

    try {
        const goal = db.prepare('SELECT * FROM goals WHERE id = ?').get(id) as any;
        if (!goal) return res.status(404).json({ message: 'Goal not found' });

        const transaction = db.transaction(() => {
            // Update goal status
            db.prepare(`
                UPDATE goals 
                SET status = ?, target = COALESCE(?, target), weightage = COALESCE(?, weightage), is_locked = ?, updated_at = CURRENT_TIMESTAMP
                WHERE id = ?
            `).run(action, modified_target, modified_weightage, action === 'approved' ? 1 : 0, id);

            // Record approval action
            db.prepare(`
                INSERT INTO approvals (id, goal_id, manager_id, action, comments, modified_target, modified_weightage)
                VALUES (?, ?, ?, ?, ?, ?, ?)
            `).run(uuidv4(), id, req.user?.id, action, comments, modified_target, modified_weightage);
        });

        transaction();
        res.json({ message: `Goal ${action} successfully` });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};
