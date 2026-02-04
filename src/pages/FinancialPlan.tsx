

export default function FinancialPlan() {
    return (
        <div className="space-y-8">
            <header>
                <h1 className="text-2xl font-bold tracking-tight">Financial Plan</h1>
                <p className="text-gray-400">Track progress towards your life goals.</p>
            </header>

            <div className="bg-surface rounded-xl p-12 border border-white/10 flex flex-col items-center justify-center text-center space-y-4">
                <div className="h-16 w-16 bg-white/5 rounded-full flex items-center justify-center text-4xl">
                    🗺️
                </div>
                <div>
                    <h3 className="text-xl font-medium text-white">Goal Probability</h3>
                    <p className="text-gray-400 max-w-md mx-auto mt-2">Monte Carlo simulations and goal tracking visualizations coming soon.</p>
                </div>
            </div>
        </div>
    );
}
