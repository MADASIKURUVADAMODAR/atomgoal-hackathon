export interface User {
    id: string;
    email: string;
    name: string;
    role: 'employee' | 'manager' | 'admin';
    department: string;
}

export interface Goal {
    id: string;
    user_id: string;
    cycle_id: string;
    thrust_area: string;
    title: string;
    description: string;
    unit_of_measurement: 'numeric' | 'percentage' | 'timeline' | 'zero_based';
    target: number;
    weightage: number;
    status: 'draft' | 'submitted' | 'approved' | 'rejected' | 'rework';
    is_shared: boolean;
    shared_goal_id?: string;
    is_locked: boolean;
    created_at: string;
    updated_at: string;
}

export interface Checkin {
    id: string;
    goal_id: string;
    quarter: 'Q1' | 'Q2' | 'Q3' | 'Q4';
    achievement: number;
    progress_pct: number;
    status: 'not_started' | 'on_track' | 'completed';
    comments: string;
    updated_at: string;
}

export interface AuthResponse {
    token: string;
    user: User;
}
