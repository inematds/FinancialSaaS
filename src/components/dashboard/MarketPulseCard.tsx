export default function MarketPulseCard() {
    return (
        <div className="col-span-4 card-base opacity-0 animate-fade-in-up delay-400">
            <div className="text-xs uppercase tracking-[2px] text-text-secondary font-semibold mb-6">
                Market Pulse
            </div>

            <div className="flex flex-col items-center justify-center py-8 text-center">
                <div className="text-4xl mb-4">📉</div>
                <h3 className="text-lg font-bold mb-2 text-text-secondary">Market Data</h3>
                <p className="text-text-secondary text-sm">
                    Real-time market indices coming soon.
                </p>
            </div>
        </div>
    );
}
