import { supabase } from '../lib/supabase';

export interface Goal {
    id: string;
    user_id: string;
    name: string;
    target_amount: number;
    current_amount: number;
    deadline: string | null;
    icon: string;
    created_at: string;
    updated_at: string;
    probability_score?: number; // AI calculated score (0-100)
    ai_insight?: string;
}

export async function getGoals(userId: string): Promise<Goal[]> {
    const { data, error } = await supabase
        .from('goals')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

    if (error) {
        console.error('Error fetching goals:', error);
        return [];
    }

    return data || [];
}

export async function addGoal(
    userId: string,
    name: string,
    targetAmount: number,
    currentAmount: number = 0,
    deadline: string | null = null,
    icon: string = '🎯'
): Promise<{ error: Error | null; data?: Goal }> {
    const { data, error } = await supabase
        .from('goals')
        .insert({
            user_id: userId,
            name,
            target_amount: targetAmount,
            current_amount: currentAmount,
            deadline,
            icon
        })
        .select()
        .single();

    return { error: error as Error | null, data };
}

export async function updateGoal(
    goalId: string,
    updates: Partial<Goal>
): Promise<{ error: Error | null }> {
    const { error } = await supabase
        .from('goals')
        .update({ ...updates, updated_at: new Date().toISOString() })
        .eq('id', goalId);

    return { error: error as Error | null };
}

export async function deleteGoal(goalId: string): Promise<{ error: Error | null }> {
    const { error } = await supabase
        .from('goals')
        .delete()
        .eq('id', goalId);

    return { error: error as Error | null };
}
