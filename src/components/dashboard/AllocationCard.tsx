export default function AllocationCard() {
    return (
        <div className="col-span-4 card-base opacity-0 animate-fade-in-up delay-500">
            <div className="text-xs uppercase tracking-[2px] text-text-secondary font-semibold mb-4">
                Asset Allocation
            </div>
            <div className="flex flex-col items-center justify-center py-8 text-center">
                <div className="text-4xl mb-4">📊</div>
                <h3 className="text-lg font-bold mb-2 text-text-secondary">No Allocation Data</h3>
                <p className="text-text-secondary text-sm">
                    Add holdings to see your asset allocation breakdown.
                </p>
            </div>
        </div>
    );
}
