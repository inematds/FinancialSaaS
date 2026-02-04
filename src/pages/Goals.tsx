import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { getGoals, addGoal, deleteGoal, type Goal } from '../services/goals';
import { getHoldingsWithPrices } from '../services/portfolio';
import { analyzeGoalFeasibility } from '../services/ai';

export default function Goals() {
    const { user } = useAuth();
    const [goals, setGoals] = useState<Goal[]>([]);
    const [loading, setLoading] = useState(true);
    const [analyzing, setAnalyzing] = useState(false);
    const [portfolioValue, setPortfolioValue] = useState(0);
    const [showAddForm, setShowAddForm] = useState(false);

    // Form State
    const [newGoalName, setNewGoalName] = useState('');
    const [newGoalTarget, setNewGoalTarget] = useState('');
    const [newGoalCurrent, setNewGoalCurrent] = useState('');
    const [newGoalDeadline, setNewGoalDeadline] = useState('');

    const fetchData = useCallback(async () => {
        if (!user) return;
        setLoading(true);

        // 1. Fetch Goals
        const userGoals = await getGoals(user.id);

        // 2. Fetch Portfolio Value for AI usage
        const holdings = await getHoldingsWithPrices(user.id);
        const totalValue = holdings.reduce((sum, h) => sum + (h.market_value || 0), 0);
        setPortfolioValue(totalValue);

        // 3. AI Analysis if goals exist and haven't been analyzed recently
        // For this demo, we'll analyze on load if missing
        const analyzedGoals = await Promise.all(userGoals.map(async (g) => {
            if (!g.probability_score) {
                const analysis = await analyzeGoalFeasibility(g, totalValue);
                return { ...g, probability_score: analysis.score, ai_insight: analysis.insight };
            }
            return g;
        }));

        setGoals(analyzedGoals);
        setLoading(false);
    }, [user]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    const handleAddGoal = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!user) return;
        setAnalyzing(true);

        const target = parseFloat(newGoalTarget);
        const current = parseFloat(newGoalCurrent) || 0;

        // Save to DB
        const { error, data } = await addGoal(
            user.id,
            newGoalName,
            target,
            current,
            newGoalDeadline || null
        );

        if (error) {
            console.error(error);
            alert('Failed to add goal');
            setAnalyzing(false);
            return;
        }

        if (data) {
            // Run AI Analysis immediately on new goal
            const analysis = await analyzeGoalFeasibility(data, portfolioValue);
            const analyzedGoal = {
                ...data,
                probability_score: analysis.score,
                ai_insight: analysis.insight
            };

            setGoals([analyzedGoal, ...goals]);
            setShowAddForm(false);
            setNewGoalName('');
            setNewGoalTarget('');
            setNewGoalCurrent('');
            setNewGoalDeadline('');
        }
        setAnalyzing(false);
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure you want to delete this goal?')) return;
        await deleteGoal(id);
        setGoals(goals.filter(g => g.id !== id));
    };

    return (
        <div className="space-y-8">
            <div className="flex justify-between items-end">
                <div>
                    <h1 className="font-archivo font-black text-4xl leading-none mb-2 text-gradient animate-fade-in-up">
                        Financial Goals
                    </h1>
                    <p className="text-text-secondary animate-fade-in-up delay-100">
                        AI-powered tracking and feasibility analysis.
                    </p>
                </div>
                <button
                    onClick={() => setShowAddForm(!showAddForm)}
                    className="px-6 py-3 bg-accent-green text-bg-primary font-bold text-sm uppercase clip-button hover:bg-accent-blue transition-colors animate-fade-in-up delay-100"
                >
                    {showAddForm ? 'Cancel' : '+ New Goal'}
                </button>
            </div>

            {/* Add Goal Form */}
            {showAddForm && (
                <div className="card-base clip-top-right animate-fade-in-up relative overflow-hidden">
                    {analyzing && (
                        <div className="absolute inset-0 bg-bg-primary/80 z-10 flex items-center justify-center flex-col">
                            <div className="text-4xl animate-bounce mb-4">🤖</div>
                            <div className="text-accent-green font-mono">AI Analyzer is evaluating your goal...</div>
                        </div>
                    )}

                    <h3 className="text-xl font-bold mb-6">Define New Goal</h3>
                    <form onSubmit={handleAddGoal} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-xs uppercase text-text-secondary mb-2">Goal Name</label>
                            <input
                                required
                                type="text"
                                value={newGoalName}
                                onChange={e => setNewGoalName(e.target.value)}
                                placeholder="e.g. Dream House, Tesla Model S"
                                className="w-full bg-bg-tertiary border border-border-color p-3 text-white focus:border-accent-green outline-none"
                            />
                        </div>
                        <div>
                            <label className="block text-xs uppercase text-text-secondary mb-2">Target Amount ($)</label>
                            <input
                                required
                                type="number"
                                value={newGoalTarget}
                                onChange={e => setNewGoalTarget(e.target.value)}
                                placeholder="100000"
                                className="w-full bg-bg-tertiary border border-border-color p-3 text-white focus:border-accent-green outline-none"
                            />
                        </div>
                        <div>
                            <label className="block text-xs uppercase text-text-secondary mb-2">Currently Saved ($)</label>
                            <input
                                type="number"
                                value={newGoalCurrent}
                                onChange={e => setNewGoalCurrent(e.target.value)}
                                placeholder="15000"
                                className="w-full bg-bg-tertiary border border-border-color p-3 text-white focus:border-accent-green outline-none"
                            />
                        </div>
                        <div>
                            <label className="block text-xs uppercase text-text-secondary mb-2">Deadline (Optional)</label>
                            <input
                                type="date"
                                value={newGoalDeadline}
                                onChange={e => setNewGoalDeadline(e.target.value)}
                                className="w-full bg-bg-tertiary border border-border-color p-3 text-white focus:border-accent-green outline-none"
                            />
                        </div>
                        <div className="md:col-span-2 text-right">
                            <button
                                type="submit"
                                className="px-8 py-3 bg-accent-blue text-bg-primary font-bold text-sm uppercase clip-button hover:bg-white transition-colors"
                            >
                                Analyze & Save Strategy
                            </button>
                        </div>
                    </form>
                </div>
            )}

            {/* Goals List */}
            {loading ? (
                <div className="flex justify-center py-20">
                    <div className="w-10 h-10 border-4 border-accent-green border-t-transparent rounded-full animate-spin"></div>
                </div>
            ) : goals.length === 0 ? (
                <div className="card-base text-center py-16 opacity-0 animate-fade-in-up delay-200">
                    <div className="text-6xl mb-4">🎯</div>
                    <h3 className="text-xl font-bold mb-2">No Goals Set</h3>
                    <p className="text-text-secondary max-w-md mx-auto">
                        Setting clear financial goals is the first step to wealth. Click "New Goal" to start.
                    </p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {goals.map((goal, idx) => {
                        const progress = Math.min((goal.current_amount / goal.target_amount) * 100, 100);
                        const isFeasible = (goal.probability_score || 0) > 70;
                        const isRisk = (goal.probability_score || 0) < 40;

                        return (
                            <div key={goal.id} className="card-base clip-corner opacity-0 animate-fade-in-up" style={{ animationDelay: `${idx * 100}ms` }}>
                                <div className="flex justify-between items-start mb-4">
                                    <div className="flex items-center gap-3">
                                        <span className="text-3xl">{goal.icon}</span>
                                        <div>
                                            <h3 className="font-bold text-xl">{goal.name}</h3>
                                            <p className="text-xs text-text-secondary">
                                                {goal.deadline ? `Due: ${new Date(goal.deadline).toLocaleDateString()}` : 'No deadline'}
                                            </p>
                                        </div>
                                    </div>
                                    <button onClick={() => handleDelete(goal.id)} className="text-text-secondary hover:text-accent-red">×</button>
                                </div>

                                {/* Progress Bar */}
                                <div className="mb-6">
                                    <div className="flex justify-between text-sm mb-1 font-mono">
                                        <span className="text-text-secondary">${goal.current_amount.toLocaleString()}</span>
                                        <span>${goal.target_amount.toLocaleString()}</span>
                                    </div>
                                    <div className="h-4 bg-bg-tertiary w-full relative overflow-hidden clip-bar">
                                        <div
                                            className="h-full bg-gradient-to-r from-accent-blue to-accent-green transition-all duration-1000"
                                            style={{ width: `${progress}%` }}
                                        />
                                    </div>
                                </div>

                                {/* AI Insight Box */}
                                <div className={`relative p-4 border-l-4 ${isFeasible ? 'border-accent-green bg-accent-green/5' : isRisk ? 'border-accent-red bg-accent-red/5' : 'border-accent-blue bg-accent-blue/5'}`}>
                                    <div className="absolute top-2 right-2 flex items-center gap-1 opacity-50">
                                        <span className="text-[10px] uppercase font-bold tracking-wider">Powered by Gemini</span>
                                        <span className="text-xs">✨</span>
                                    </div>

                                    <div className="flex items-center gap-2 mb-2">
                                        <span className="font-bold text-sm uppercase tracking-wider">Success Probability</span>
                                        <div className={`font-mono font-bold ${isFeasible ? 'text-accent-green' : isRisk ? 'text-accent-red' : 'text-accent-blue'}`}>
                                            {goal.probability_score}%
                                        </div>
                                    </div>

                                    <p className="text-sm italic text-text-secondary">
                                        "{goal.ai_insight || 'Analyzing...'}"
                                    </p>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}
