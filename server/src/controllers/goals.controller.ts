import { Response } from 'express';
import { v4 as uuidv4 } from 'uuid';
import db from '../config/database.js';
import { AuthRequest } from '../middleware/auth.js';
import { validateGoalSheet } from '../utils/validators.js';

export const getGoals = (req: AuthRequest, res: Response) => {
    try {
        const goals = db.prepare('SELECT * FROM goals WHERE user_id = ?').all(req.user?.id);
        res.json(goals);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

export const createGoalSheet = (req: AuthRequest, res: Response) => {
    const { goals, cycle_id, is_draft } = req.body;
    const userId = req.user?.id;

    if (!is_draft) {
        const validation = validateGoalSheet(goals);
        if (!validation.valid) {
            return res.status(400).json({ message: validation.message });
        }
    }

    try {
        const insert = db.prepare(`
            INSERT INTO goals (id, user_id, cycle_id, thrust_area, title, description, unit_of_measurement, target, weightage, status)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `);

        const transaction = db.transaction((goalsData) => {
            // Delete existing drafts if replacing
            db.prepare('DELETE FROM goals WHERE user_id = ? AND status = "draft"').run(userId);
            
            for (const goal of goalsData) {
                insert.run(
                    uuidv4(),
                    userId,
                    cycle_id,
                    goal.thrust_area,
                    goal.title,
                    goal.description,
                    goal.unit_of_measurement,
                    goal.target,
                    goal.weightage,
                    is_draft ? 'draft' : 'submitted'
                );
            }
        });

        transaction(goals);
        res.json({ message: is_draft ? 'Draft saved' : 'Goals submitted successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

export const updateGoal = (req: AuthRequest, res: Response) => {
    const { id } = req.params;
    const { thrust_area, title, description, unit_of_measurement, target, weightage } = req.body;

    try {
        const goal = db.prepare('SELECT * FROM goals WHERE id = ? AND user_id = ?').get(id, req.user?.id) as any;
        if (!goal) return res.status(404).json({ message: 'Goal not found' });
        if (goal.is_locked) return res.status(403).json({ message: 'Goal is locked' });

        db.prepare(`
            UPDATE goals SET thrust_area = ?, title = ?, description = ?, unit_of_measurement = ?, target = ?, weightage = ?, updated_at = CURRENT_TIMESTAMP
            WHERE id = ?
        `).run(thrust_area, title, description, unit_of_measurement, target, weightage, id);

        res.json({ message: 'Goal updated' });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};
