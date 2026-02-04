import { deleteHolding, type Holding } from '../../services/portfolio';

interface HoldingsListProps {
    holdings: Holding[];
    loading: boolean;
    onRefresh: () => void;
}

export default function HoldingsList({ holdings, loading, onRefresh }: HoldingsListProps) {
    const handleDelete = async (holdingId: string, symbol: string) => {
        if (!confirm(`Remove ${symbol} from your portfolio?`)) return;

        const { error } = await deleteHolding(holdingId);
        if (!error) {
            onRefresh();
        }
    };

    if (loading) {
        return (
            <div className="space-y-4">
                {[...Array(3)].map((_, i) => (
                    <div key={i} className="bg-bg-tertiary p-6 animate-pulse">
                        <div className="h-6 bg-bg-secondary rounded w-24 mb-2" />
                        <div className="h-4 bg-bg-secondary rounded w-48" />
                    </div>
                ))}
            </div>
        );
    }

    if (holdings.length === 0) {
        return (
            <div className="bg-bg-tertiary p-12 text-center">
                <div className="text-6xl mb-4">📊</div>
                <h3 className="text-xl font-bold mb-2">No Holdings Yet</h3>
                <p className="text-text-secondary">Add your first stock to start tracking your portfolio.</p>
            </div>
        );
    }

    const totalValue = holdings.reduce((sum, h) => sum + (h.market_value || 0), 0);
    const totalProfit = holdings.reduce((sum, h) => sum + (h.profit_loss || 0), 0);

    return (
        <div className="space-y-4">
            {/* Summary */}
            <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="bg-bg-tertiary p-4">
                    <div className="text-xs uppercase tracking-wider text-text-secondary mb-1">Total Value</div>
                    <div className="font-mono font-bold text-2xl">${totalValue.toLocaleString(undefined, { minimumFractionDigits: 2 })}</div>
                </div>
                <div className="bg-bg-tertiary p-4">
                    <div className="text-xs uppercase tracking-wider text-text-secondary mb-1">Total P/L</div>
                    <div className={`font-mono font-bold text-2xl ${totalProfit >= 0 ? 'text-accent-green' : 'text-accent-red'}`}>
                        {totalProfit >= 0 ? '+' : ''}${totalProfit.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                    </div>
                </div>
            </div>

            {/* Holdings */}
            {holdings.map((holding) => {
                const isPositive = (holding.profit_loss || 0) >= 0;

                return (
                    <div key={holding.id} className="bg-bg-tertiary p-4 clip-ticker hover:bg-bg-secondary transition-colors">
                        <div className="flex justify-between items-start">
                            <div className="flex-1">
                                <div className="flex items-center gap-3 mb-2">
                                    <span className="font-mono font-bold text-lg text-accent-green">{holding.symbol}</span>
                                    <span className="text-text-secondary text-sm">{holding.name}</span>
                                </div>
                                <div className="flex gap-6 text-sm">
                                    <div>
                                        <span className="text-text-secondary">Shares: </span>
                                        <span className="font-mono">{holding.shares}</span>
                                    </div>
                                    <div>
                                        <span className="text-text-secondary">Avg Cost: </span>
                                        <span className="font-mono">${holding.avg_cost.toFixed(2)}</span>
                                    </div>
                                    {holding.current_price && (
                                        <div>
                                            <span className="text-text-secondary">Current: </span>
                                            <span className="font-mono">${holding.current_price.toFixed(2)}</span>
                                            {holding.change_percent !== undefined && (
                                                <span className={`ml-2 ${holding.change_percent >= 0 ? 'text-accent-green' : 'text-accent-red'}`}>
                                                    ({holding.change_percent >= 0 ? '+' : ''}{holding.change_percent.toFixed(2)}%)
                                                </span>
                                            )}
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div className="text-right">
                                {holding.market_value && (
                                    <div className="font-mono font-bold text-lg mb-1">
                                        ${holding.market_value.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                                    </div>
                                )}
                                {holding.profit_loss !== undefined && (
                                    <div className={`font-mono text-sm ${isPositive ? 'text-accent-green' : 'text-accent-red'}`}>
                                        {isPositive ? '+' : ''}${holding.profit_loss.toFixed(2)}
                                    </div>
                                )}
                                <button
                                    onClick={() => handleDelete(holding.id, holding.symbol)}
                                    className="mt-2 text-xs text-text-secondary hover:text-accent-red transition-colors"
                                >
                                    Remove
                                </button>
                            </div>
                        </div>
                    </div>
                );
            })}
        </div>
    );
}
