-- Refined Seed data for AtomGoal Demo

-- Delete existing to ensure clean state
DELETE FROM users;
DELETE FROM goal_cycles;
DELETE FROM shared_goals;
DELETE FROM goals;
DELETE FROM checkins;

-- Demo Users
-- Passwords for all: 'demo123'
-- Our server has fallback logic to allow 'demo123' even if hash is placeholder
INSERT INTO users (id, email, password_hash, name, role, department, manager_id) VALUES
('u1', 'sneha@atomgoal.com', '$2a$10$placeholder_hash', 'Sneha Reddy', 'admin', 'HR', NULL),
('u2', 'amit@atomgoal.com', '$2a$10$placeholder_hash', 'Amit Kumar', 'manager', 'Engineering', NULL),
('u3', 'rahul@atomgoal.com', '$2a$10$placeholder_hash', 'Rahul Sharma', 'employee', 'Engineering', 'u2'),
('u4', 'priya@atomgoal.com', '$2a$10$placeholder_hash', 'Priya Patel', 'employee', 'Engineering', 'u2');

-- Active Goal Cycle
INSERT INTO goal_cycles (id, name, start_date, end_date, phase1_start, phase1_end, q1_start, q1_end, q2_start, q2_end, q3_start, q3_end, q4_start, q4_end) VALUES
('c1', 'FY 2025-26', '2025-04-01', '2026-03-31', '2025-05-01', '2025-05-31', '2025-07-01', '2025-07-31', '2025-10-01', '2025-10-31', '2026-01-01', '2026-01-31', '2026-03-01', '2026-04-15');

-- Pre-populated Goals for "Rahul" (to see something on dashboard immediately)
INSERT INTO goals (id, user_id, cycle_id, thrust_area, title, description, unit_of_measurement, target, weightage, status, is_locked) VALUES
('g1', 'u3', 'c1', 'Technical Excellence', 'API Response Time', 'Reduce p99 latency to 200ms', 'numeric', 200, 30, 'approved', 1),
('g2', 'u3', 'c1', 'System Stability', 'Uptime Maintenance', 'Maintain 99.9% uptime', 'percentage', 99.9, 40, 'approved', 1),
('g3', 'u3', 'c1', 'Growth', 'Mentorship', 'Mentor 2 junior developers', 'numeric', 2, 30, 'submitted', 0);

-- Shared Goal
INSERT INTO shared_goals (id, title, description, target, unit_of_measurement, department, created_by) VALUES
('sg1', 'Zero Security Vulnerabilities', 'Ensure no critical vulnerabilities in production', 0, 'zero_based', 'Engineering', 'u1');
