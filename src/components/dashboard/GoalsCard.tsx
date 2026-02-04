import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { getGoals, type Goal } from '../../services/goals';

export default function GoalsCard() {
    const { user } = useAuth();
    const [goals, setGoals] = useState<Goal[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!user) return;
        const fetchGoals = async () => {
            const data = await getGoals(user.id);
            setGoals(data.slice(0, 3)); // Show top 3
            setLoading(false);
        };
        fetchGoals();
    }, [user]);

    return (
        <div className="col-span-4 card-base opacity-0 animate-fade-in-up delay-600 relative group">
            <div className="flex justify-between items-center mb-6">
                <div className="text-xs uppercase tracking-[2px] text-text-secondary font-semibold">
                    Financial Goals
                </div>
                <Link to="/goals" className="text-xs text-accent-blue hover:text-accent-green transition-colors">
                    View All →
                </Link>
            </div>

            {loading ? (
                <div className="space-y-4 animate-pulse">
                    <div className="h-10 bg-bg-tertiary rounded" />
                    <div className="h-10 bg-bg-tertiary rounded" />
                </div>
            ) : goals.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-6 text-center">
                    <div className="text-3xl mb-2">🎯</div>
                    <h3 className="text-sm font-bold mb-1 text-text-secondary">No Goals Yet</h3>
                    <Link to="/goals" className="text-xs text-accent-blue hover:text-white">
                        + Create your first goal
                    </Link>
                </div>
            ) : (
                <div className="space-y-4">
                    {goals.map((goal) => {
                        const progress = Math.min((goal.current_amount / goal.target_amount) * 100, 100);
                        return (
                            <Link key={goal.id} to="/goals" className="block group/item">
                                <div className="flex justify-between items-center mb-1">
                                    <span className="font-semibold text-sm group-hover/item:text-accent-green transition-colors">{goal.name}</span>
                                    <span className="font-mono text-xs text-text-secondary">
                                        {Math.round(progress)}%
                                    </span>
                                </div>
                                <div className="h-1.5 bg-bg-tertiary relative overflow-hidden clip-bar">
                                    <div
                                        className="h-full bg-gradient-to-r from-accent-green to-accent-blue transition-all duration-1000"
                                        style={{ width: `${progress}%` }}
                                    />
                                </div>
                            </Link>
                        );
                    })}
                </div>
            )}
        </div>
    );
}
