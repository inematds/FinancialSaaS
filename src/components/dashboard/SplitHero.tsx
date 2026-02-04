import { TrendingUp } from 'lucide-react';

export default function SplitHero() {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 h-auto md:h-[400px] w-full">
            <div className="bg-surface rounded-2xl p-8 flex flex-col justify-between border border-white/10 relative overflow-hidden group" data-testid="hero-pulse">
                {/* Pulse Side */}
                <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-20 transition-opacity">
                    <TrendingUp size={120} />
                </div>

                <h2 className="text-gray-400 font-medium text-lg">Portfolio Value</h2>
                <div className="z-10">
                    <span className="text-5xl md:text-6xl font-bold text-white tracking-tight">$1,250,000</span>
                    <div className="flex items-center gap-2 mt-4 text-secondary">
                        <div className="bg-secondary/20 p-1 rounded">
                            <TrendingUp size={16} />
                        </div>
                        <span className="font-medium">+$4,200 (Day)</span>
                    </div>
                </div>
            </div>

            <div className="bg-surface rounded-2xl p-8 border border-white/10 flex items-center justify-center relative overflow-hidden" data-testid="hero-vision">
                {/* Vision Side - Placeholder for Charts */}
                <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-transparent" />
                <div className="text-center z-10">
                    <h3 className="text-xl font-medium text-gray-300 mb-2">Net Worth Growth</h3>
                    <p className="text-gray-500 text-sm">Interactive Chart Component Loading...</p>
                </div>
            </div>
        </div>
    );
}
