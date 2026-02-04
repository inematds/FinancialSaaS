import { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { getHoldingsWithPrices, addHolding, deleteHolding, getCurrentPrice, type Holding } from '../services/portfolio';
import StockDropdown from '../components/portfolio/StockDropdown';

interface Stock {
    id: number;
    symbol: string;
    name: string;
    exchange: string;
    sector: string | null;
}

export default function Portfolio() {
    const { user } = useAuth();
    const [holdings, setHoldings] = useState<Holding[]>([]);
    const [loading, setLoading] = useState(true);
    const [addingStock, setAddingStock] = useState<Stock | null>(null);
    const [shares, setShares] = useState('');
    const [currentPrice, setCurrentPrice] = useState<number | null>(null);
    const [fetchingPrice, setFetchingPrice] = useState(false);

    const fetchHoldings = useCallback(async () => {
        if (!user) return;
        setLoading(true);
        const data = await getHoldingsWithPrices(user.id);
        setHoldings(data);
        setLoading(false);
    }, [user]);

    useEffect(() => {
        fetchHoldings();
    }, [fetchHoldings]);

    const handleStockSelect = async (stock: Stock) => {
        setAddingStock(stock);
        setShares('');
        setCurrentPrice(null);
        setFetchingPrice(true);

        const quote = await getCurrentPrice(stock.symbol);
        if (quote && quote.c > 0) {
            setCurrentPrice(quote.c);
        }
        setFetchingPrice(false);
    };

    const handleAddConfirm = async () => {
        if (!user || !addingStock || !currentPrice || !shares) return;

        await addHolding(
            user.id,
            addingStock.symbol,
            addingStock.name,
            parseFloat(shares),
            currentPrice,
            'stock'
        );

        setAddingStock(null);
        setShares('');
        setCurrentPrice(null);
        fetchHoldings();
    };

    const handleDelete = async (holdingId: string, symbol: string) => {
        if (!confirm(`Remove ${symbol} from your portfolio?`)) return;
        await deleteHolding(holdingId);
        fetchHoldings();
    };

    const totalValue = holdings.reduce((sum, h) => sum + (h.market_value || 0), 0);
    const totalProfit = holdings.reduce((sum, h) => sum + (h.profit_loss || 0), 0);

    return (
        <div className="space-y-8">
            <div>
                <h1 className="font-archivo font-black text-4xl leading-none mb-2 text-gradient animate-fade-in-up">
                    Portfolio
                </h1>
                <p className="text-text-secondary animate-fade-in-up delay-100">
                    Your holdings with real-time market data.
                </p>
            </div>

            <div className="grid grid-cols-12 gap-6">
                {/* Holdings Card */}
                <div className="col-span-12 card-base clip-top-right opacity-0 animate-fade-in-up delay-200">
                    {/* Header with Add Stock Dropdown */}
                    <div className="flex justify-between items-center mb-6">
                        <div className="text-xs uppercase tracking-[2px] text-text-secondary font-semibold">
                            Your Holdings
                        </div>
                        <div className="flex items-center gap-4">
                            <button
                                onClick={fetchHoldings}
                                className="text-xs text-accent-blue hover:text-accent-green transition-colors"
                            >
                                ↻ Refresh
                            </button>
                            <StockDropdown onSelect={handleStockSelect} />
                        </div>
                    </div>

                    {/* Add Stock Inline Form */}
                    {addingStock && (
                        <div className="bg-bg-tertiary p-4 mb-6 border-l-4 border-accent-green">
                            <div className="flex items-center justify-between mb-4">
                                <div>
                                    <span className="font-mono font-bold text-lg text-accent-green">{addingStock.symbol}</span>
                                    <span className="text-white ml-3">{addingStock.name}</span>
                                </div>
                                <div className="text-right">
                                    {fetchingPrice ? (
                                        <span className="text-text-secondary animate-pulse">Fetching price...</span>
                                    ) : currentPrice ? (
                                        <span className="font-mono font-bold text-xl">${currentPrice.toFixed(2)}</span>
                                    ) : (
                                        <span className="text-accent-red">Price unavailable</span>
                                    )}
                                </div>
                            </div>

                            {currentPrice && (
                                <div className="flex items-center gap-4">
                                    <input
                                        type="number"
                                        step="0.0001"
                                        min="0.0001"
                                        value={shares}
                                        onChange={(e) => setShares(e.target.value)}
                                        placeholder="Number of shares"
                                        className="flex-1 bg-bg-secondary border-2 border-border-color p-3 text-white font-mono focus:border-accent-green focus:outline-none"
                                    />
                                    <div className="font-mono text-lg">
                                        = <span className="text-accent-blue">${shares ? (parseFloat(shares) * currentPrice).toFixed(2) : '0.00'}</span>
                                    </div>
                                    <button
                                        onClick={handleAddConfirm}
                                        disabled={!shares}
                                        className="px-6 py-3 bg-accent-green text-bg-primary font-bold text-sm uppercase clip-button hover:bg-accent-blue transition-colors disabled:opacity-50"
                                    >
                                        Add
                                    </button>
                                    <button
                                        onClick={() => setAddingStock(null)}
                                        className="px-4 py-3 text-text-secondary hover:text-accent-red transition-colors"
                                    >
                                        Cancel
                                    </button>
                                </div>
                            )}
                        </div>
                    )}

                    {/* Summary */}
                    {holdings.length > 0 && (
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
                    )}

                    {/* Holdings List */}
                    {loading ? (
                        <div className="space-y-4">
                            {[...Array(3)].map((_, i) => (
                                <div key={i} className="bg-bg-tertiary p-6 animate-pulse">
                                    <div className="h-6 bg-bg-secondary rounded w-24 mb-2" />
                                    <div className="h-4 bg-bg-secondary rounded w-48" />
                                </div>
                            ))}
                        </div>
                    ) : holdings.length === 0 ? (
                        <div className="bg-bg-tertiary p-12 text-center">
                            <div className="text-6xl mb-4">📊</div>
                            <h3 className="text-xl font-bold mb-2">No Holdings Yet</h3>
                            <p className="text-text-secondary">Click "Add Stock" to start building your portfolio.</p>
                        </div>
                    ) : (
                        <div className="space-y-3">
                            {holdings.map((holding) => {
                                const isPositive = (holding.profit_loss || 0) >= 0;

                                return (
                                    <div key={holding.id} className="bg-bg-tertiary p-4 clip-ticker hover:bg-bg-primary transition-colors">
                                        <div className="flex justify-between items-start">
                                            <div className="flex-1">
                                                <div className="flex items-center gap-3 mb-2">
                                                    <Link
                                                        to={`/company/${holding.symbol}`}
                                                        className="font-mono font-bold text-lg text-accent-green hover:text-accent-blue transition-colors"
                                                    >
                                                        {holding.symbol}
                                                    </Link>
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
                    )}
                </div>
            </div>
        </div>
    );
}
