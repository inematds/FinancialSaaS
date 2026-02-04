export default function AIAdvisorCard() {
    return (
        <div
            className="col-span-4 bg-gradient-to-br from-[#1a0a2e] to-[#0f0520] border-[3px] border-accent-blue p-8 clip-bottom-right opacity-0 animate-fade-in-up delay-300"
        >
            <div className="flex items-center gap-4 mb-6">
                <div className="w-[50px] h-[50px] bg-accent-blue clip-hexagon flex items-center justify-center text-2xl animate-pulse-glow">
                    🤖
                </div>
                <div>
                    <div className="text-lg font-bold">AI Advisor</div>
                    <div className="text-sm text-text-secondary">Real-time insights</div>
                </div>
            </div>

            <div className="bg-accent-blue/10 border-l-[3px] border-accent-blue p-4 mb-4 text-sm leading-relaxed text-text-secondary">
                Add holdings to your portfolio to receive personalized AI-powered insights and recommendations.
            </div>

            <div className="flex gap-2">
                <button className="flex-1 py-3 bg-accent-blue/50 text-text-secondary font-bold text-sm uppercase clip-button cursor-not-allowed" disabled>
                    Ask AI
                </button>
                <button className="flex-1 py-3 bg-accent-blue/50 text-text-secondary font-bold text-sm uppercase clip-button cursor-not-allowed" disabled>
                    Optimize
                </button>
            </div>
        </div>
    );
}
