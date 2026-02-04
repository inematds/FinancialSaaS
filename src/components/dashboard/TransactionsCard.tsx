export default function TransactionsCard() {
    return (
        <div className="col-span-6 card-base opacity-0 animate-fade-in-up delay-700">
            <div className="text-xs uppercase tracking-[2px] text-text-secondary font-semibold mb-6">
                Recent Transactions
            </div>

            <div className="flex flex-col items-center justify-center py-12 text-center">
                <div className="text-4xl mb-4">💸</div>
                <h3 className="text-lg font-bold mb-2 text-text-secondary">No Transactions</h3>
                <p className="text-text-secondary text-sm">
                    Transaction history will appear here.
                </p>
            </div>
        </div>
    );
}
