export interface GoalInput {
    thrust_area: string;
    title: string;
    description: string;
    unit_of_measurement: 'numeric' | 'percentage' | 'timeline' | 'zero_based';
    target: number;
    weightage: number;
}

export const validateGoalSheet = (goals: GoalInput[]) => {
    if (goals.length > 8) {
        return { valid: false, message: 'Maximum 8 goals allowed' };
    }

    if (goals.length === 0) {
        return { valid: false, message: 'At least one goal is required' };
    }

    let totalWeightage = 0;
    for (const goal of goals) {
        if (goal.weightage < 10) {
            return { valid: false, message: `Individual goal "${goal.title}" must have at least 10% weightage` };
        }
        totalWeightage += goal.weightage;
    }

    if (totalWeightage !== 100) {
        return { valid: false, message: `Total weightage must be exactly 100% (currently ${totalWeightage}%)` };
    }

    return { valid: true };
};
