import { Response } from 'express';
import { v4 as uuidv4 } from 'uuid';
import db from '../config/database.js';
import { AuthRequest } from '../middleware/auth.js';

export const updateCheckin = (req: AuthRequest, res: Response) => {
    const { goal_id, quarter, achievement, comments } = req.body;

    try {
        const goal = db.prepare('SELECT * FROM goals WHERE id = ?').get(goal_id) as any;
        if (!goal) return res.status(404).json({ message: 'Goal not found' });

        // Calculate progress based on logic
        let progress_pct = 0;
        const target = goal.target;

        if (goal.unit_of_measurement === 'percentage' || goal.unit_of_measurement === 'numeric') {
            progress_pct = (achievement / target) * 100;
        } else if (goal.unit_of_measurement === 'zero_based') {
            progress_pct = achievement === 0 ? 100 : 0;
        }
        // Timeline logic would involve date comparison, placeholder for now
        
        let status = 'not_started';
        if (progress_pct >= 100) status = 'completed';
        else if (progress_pct > 0) status = 'on_track';

        db.prepare(`
            INSERT INTO checkins (id, goal_id, quarter, achievement, progress_pct, status, comments)
            VALUES (?, ?, ?, ?, ?, ?, ?)
            ON CONFLICT(id) DO UPDATE SET 
                achievement = excluded.achievement,
                progress_pct = excluded.progress_pct,
                status = excluded.status,
                comments = excluded.comments,
                updated_at = CURRENT_TIMESTAMP
        `).run(uuidv4(), goal_id, quarter, achievement, progress_pct, status, comments);

        res.json({ message: 'Check-in updated', progress: progress_pct });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

export const getCheckins = (req: AuthRequest, res: Response) => {
    const { goal_id } = req.query;
    try {
        const checkins = db.prepare('SELECT * FROM checkins WHERE goal_id = ?').all(goal_id);
        res.json(checkins);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};
