-- SQLite Schema for AtomGoal

-- Users Table
CREATE TABLE IF NOT EXISTS users (
    id TEXT PRIMARY KEY,
    email TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    name TEXT NOT NULL,
    role TEXT CHECK(role IN ('employee', 'manager', 'admin')) NOT NULL,
    department TEXT NOT NULL,
    manager_id TEXT,
    is_active INTEGER DEFAULT 1,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (manager_id) REFERENCES users(id)
);

-- Goal Cycles Table
CREATE TABLE IF NOT EXISTS goal_cycles (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    phase1_start DATE,
    phase1_end DATE,
    q1_start DATE,
    q1_end DATE,
    q2_start DATE,
    q2_end DATE,
    q3_start DATE,
    q3_end DATE,
    q4_start DATE,
    q4_end DATE,
    is_active INTEGER DEFAULT 1
);

-- Shared Goals Table (KPIs)
CREATE TABLE IF NOT EXISTS shared_goals (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT,
    target REAL NOT NULL,
    unit_of_measurement TEXT CHECK(unit_of_measurement IN ('numeric', 'percentage', 'timeline', 'zero_based')) NOT NULL,
    department TEXT NOT NULL,
    created_by TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (created_by) REFERENCES users(id)
);

-- Goals Table
CREATE TABLE IF NOT EXISTS goals (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL,
    cycle_id TEXT NOT NULL,
    thrust_area TEXT NOT NULL,
    title TEXT NOT NULL,
    description TEXT,
    unit_of_measurement TEXT CHECK(unit_of_measurement IN ('numeric', 'percentage', 'timeline', 'zero_based')) NOT NULL,
    target REAL NOT NULL,
    weightage INTEGER NOT NULL CHECK(weightage >= 10),
    status TEXT CHECK(status IN ('draft', 'submitted', 'approved', 'rejected', 'rework')) DEFAULT 'draft',
    is_shared INTEGER DEFAULT 0,
    shared_goal_id TEXT,
    is_locked INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (cycle_id) REFERENCES goal_cycles(id),
    FOREIGN KEY (shared_goal_id) REFERENCES shared_goals(id)
);

-- Check-ins Table
CREATE TABLE IF NOT EXISTS checkins (
    id TEXT PRIMARY KEY,
    goal_id TEXT NOT NULL,
    quarter TEXT CHECK(quarter IN ('Q1', 'Q2', 'Q3', 'Q4')) NOT NULL,
    achievement REAL NOT NULL,
    progress_pct REAL NOT NULL,
    status TEXT CHECK(status IN ('not_started', 'on_track', 'completed')) DEFAULT 'not_started',
    comments TEXT,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (goal_id) REFERENCES goals(id)
);

-- Approvals Table
CREATE TABLE IF NOT EXISTS approvals (
    id TEXT PRIMARY KEY,
    goal_id TEXT NOT NULL,
    manager_id TEXT NOT NULL,
    action TEXT CHECK(action IN ('approved', 'rejected', 'rework')) NOT NULL,
    comments TEXT,
    modified_target REAL,
    modified_weightage INTEGER,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (goal_id) REFERENCES goals(id),
    FOREIGN KEY (manager_id) REFERENCES users(id)
);

-- Notifications Table
CREATE TABLE IF NOT EXISTS notifications (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL,
    type TEXT CHECK(type IN ('email', 'teams', 'in_app')) NOT NULL,
    title TEXT NOT NULL,
    message TEXT NOT NULL,
    is_read INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id)
);

-- Audit Logs Table
CREATE TABLE IF NOT EXISTS audit_logs (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL,
    action TEXT NOT NULL,
    entity_type TEXT NOT NULL,
    entity_id TEXT NOT NULL,
    old_value TEXT, -- JSON string
    new_value TEXT, -- JSON string
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id)
);

-- Escalations Table
CREATE TABLE IF NOT EXISTS escalations (
    id TEXT PRIMARY KEY,
    type TEXT CHECK(type IN ('employee_delayed', 'manager_delayed', 'checkin_overdue')) NOT NULL,
    target_user_id TEXT NOT NULL,
    escalated_to TEXT NOT NULL,
    goal_id TEXT,
    message TEXT NOT NULL,
    is_resolved INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (target_user_id) REFERENCES users(id),
    FOREIGN KEY (escalated_to) REFERENCES users(id),
    FOREIGN KEY (goal_id) REFERENCES goals(id)
);
