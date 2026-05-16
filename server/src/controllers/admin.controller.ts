import { Response } from 'express';
import { v4 as uuidv4 } from 'uuid';
import db from '../config/database.js';
import { AuthRequest } from '../middleware/auth.js';

export const getUsers = (req: AuthRequest, res: Response) => {
    try {
        const users = db.prepare('SELECT id, email, name, role, department, manager_id FROM users').all();
        res.json(users);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

export const createCycle = (req: AuthRequest, res: Response) => {
    const { name, start_date, end_date } = req.body;
    try {
        db.prepare('INSERT INTO goal_cycles (id, name, start_date, end_date) VALUES (?, ?, ?, ?)').run(uuidv4(), name, start_date, end_date);
        res.json({ message: 'Cycle created' });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

export const pushSharedGoal = (req: AuthRequest, res: Response) => {
    const { title, description, target, unit_of_measurement, department } = req.body;
    try {
        const sgId = uuidv4();
        db.prepare(`
            INSERT INTO shared_goals (id, title, description, target, unit_of_measurement, department, created_by)
            VALUES (?, ?, ?, ?, ?, ?, ?)
        `).run(sgId, title, description, target, unit_of_measurement, department, req.user?.id);

        // Find employees in department
        const employees = db.prepare('SELECT id FROM users WHERE department = ? AND role = "employee"').all(department) as any[];

        const transaction = db.transaction(() => {
            for (const emp of employees) {
                db.prepare(`
                    INSERT INTO goals (id, user_id, cycle_id, thrust_area, title, description, unit_of_measurement, target, weightage, is_shared, shared_goal_id)
                    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
                `).run(uuidv4(), emp.id, 'c1', 'Department KPI', title, description, unit_of_measurement, target, 10, 1, sgId);
            }
        });

        transaction();
        res.json({ message: `Shared goal pushed to ${employees.length} employees` });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

export const unlockGoal = (req: AuthRequest, res: Response) => {
    const { id } = req.params;
    try {
        db.prepare('UPDATE goals SET is_locked = 0 WHERE id = ?').run(id);
        res.json({ message: 'Goal unlocked' });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};
