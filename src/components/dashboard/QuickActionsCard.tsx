const actions = [
    { icon: '📊', title: 'Generate Report', description: 'Monthly portfolio summary' },
    { icon: '💸', title: 'Make Transfer', description: 'Move funds between accounts' },
    { icon: '📅', title: 'Schedule Meeting', description: 'Book advisor consultation' },
    { icon: '🎯', title: 'Rebalance Portfolio', description: 'Optimize asset allocation' },
    { icon: '📄', title: 'Tax Documents', description: 'View & download forms' },
];

export default function QuickActionsCard() {
    return (
        <div className="col-span-12 card-base opacity-0 animate-fade-in-up delay-900">
            <div className="text-xs uppercase tracking-[2px] text-text-secondary font-semibold mb-4">
                Quick Actions
            </div>

            <div className="grid grid-cols-5 gap-4 mt-4">
                {actions.map((action) => (
                    <button
                        key={action.title}
                        className="p-6 bg-bg-tertiary border-2 border-border-color clip-action flex items-center gap-4 cursor-pointer transition-all hover:bg-bg-primary hover:border-accent-green hover:translate-x-1"
                    >
                        <div className="text-3xl">{action.icon}</div>
                        <div className="flex-1 text-left">
                            <h3 className="font-semibold">{action.title}</h3>
                            <p className="text-sm text-text-secondary">{action.description}</p>
                        </div>
                    </button>
                ))}
            </div>
        </div>
    );
}
