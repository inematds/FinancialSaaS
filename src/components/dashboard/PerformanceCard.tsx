export default function PerformanceCard() {
    return (
        <div className="col-span-6 card-base opacity-0 animate-fade-in-up delay-800">
            <div className="text-xs uppercase tracking-[2px] text-text-secondary font-semibold mb-4">
                Portfolio Performance
            </div>
            <div className="flex flex-col items-center justify-center py-12 text-center">
                <div className="text-4xl mb-4">📈</div>
                <h3 className="text-lg font-bold mb-2 text-text-secondary">No Performance Data</h3>
                <p className="text-text-secondary text-sm">
                    Add holdings and track their performance over time.
                </p>
            </div>
        </div>
    );
}
