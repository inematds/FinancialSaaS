import { useState } from 'react';
import StockSearch from '../../components/portfolio/StockSearch';
import { addHolding, getCurrentPrice } from '../../services/portfolio';
import { useAuth } from '../../contexts/AuthContext';

interface Stock {
    id: number;
    symbol: string;
    name: string;
    exchange: string;
    sector: string | null;
}

interface AddStockFormProps {
    onSuccess: () => void;
}

export default function AddStockForm({ onSuccess }: AddStockFormProps) {
    const { user } = useAuth();
    const [selectedStock, setSelectedStock] = useState<Stock | null>(null);
    const [shares, setShares] = useState('');
    const [loading, setLoading] = useState(false);
    const [fetchingPrice, setFetchingPrice] = useState(false);
    const [currentPrice, setCurrentPrice] = useState<number | null>(null);
    const [error, setError] = useState('');

    const handleStockSelect = async (stock: Stock) => {
        setSelectedStock(stock);
        setCurrentPrice(null);
        setFetchingPrice(true);
        setError('');

        // Fetch current price from Finnhub
        const quote = await getCurrentPrice(stock.symbol);

        if (quote && quote.c > 0) {
            setCurrentPrice(quote.c);
        } else {
            setError('Could not fetch current price. Please try again.');
        }
        setFetchingPrice(false);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!user || !selectedStock || !currentPrice || !shares) return;

        setLoading(true);
        setError('');

        const { error } = await addHolding(
            user.id,
            selectedStock.symbol,
            selectedStock.name,
            parseFloat(shares),
            currentPrice,
            'stock'
        );

        if (error) {
            setError(error.message);
            setLoading(false);
        } else {
            setSelectedStock(null);
            setShares('');
            setCurrentPrice(null);
            setLoading(false);
            onSuccess();
        }
    };

    const totalValue = currentPrice && shares ? (currentPrice * parseFloat(shares)).toFixed(2) : '0.00';

    return (
        <div className="bg-bg-secondary border-[3px] border-accent-green p-6 clip-top-right">
            <h3 className="text-lg font-bold mb-6 flex items-center gap-2">
                <span className="text-2xl">➕</span> Add Stock to Portfolio
            </h3>

            {error && (
                <div className="bg-accent-red/10 border border-accent-red text-accent-red p-4 mb-6 text-sm">
                    {error}
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
                {/* Stock Search */}
                <div>
                    <label className="text-xs uppercase tracking-wider text-text-secondary font-semibold block mb-2">
                        Search Stock
                    </label>
                    <StockSearch onSelect={handleStockSelect} placeholder="Search by symbol or name..." />
                </div>

                {/* Selected Stock Info */}
                {selectedStock && (
                    <div className="bg-bg-tertiary p-4 clip-ticker">
                        <div className="flex justify-between items-center">
                            <div>
                                <span className="font-mono font-bold text-xl text-accent-green">{selectedStock.symbol}</span>
                                <span className="text-white ml-3">{selectedStock.name}</span>
                            </div>
                            <div className="text-right">
                                {fetchingPrice ? (
                                    <span className="text-text-secondary animate-pulse">Fetching price...</span>
                                ) : currentPrice ? (
                                    <span className="font-mono font-bold text-2xl">${currentPrice.toFixed(2)}</span>
                                ) : null}
                            </div>
                        </div>
                    </div>
                )}

                {/* Shares Input */}
                {selectedStock && currentPrice && (
                    <>
                        <div>
                            <label className="text-xs uppercase tracking-wider text-text-secondary font-semibold block mb-2">
                                Number of Shares
                            </label>
                            <input
                                type="number"
                                step="0.0001"
                                min="0.0001"
                                value={shares}
                                onChange={(e) => setShares(e.target.value)}
                                className="w-full bg-bg-tertiary border-2 border-border-color p-4 text-white font-mono focus:border-accent-green focus:outline-none transition-colors"
                                placeholder="0.00"
                                required
                            />
                        </div>

                        {/* Total Value */}
                        <div className="bg-bg-tertiary p-4 flex justify-between items-center">
                            <span className="text-text-secondary">Total Value</span>
                            <span className="font-mono font-bold text-xl text-accent-blue">${totalValue}</span>
                        </div>

                        <button
                            type="submit"
                            disabled={loading || !shares}
                            className="w-full py-4 bg-accent-green text-bg-primary font-bold text-sm uppercase tracking-wider clip-button hover:bg-accent-blue transition-colors disabled:opacity-50"
                        >
                            {loading ? 'Adding...' : 'Add to Portfolio'}
                        </button>
                    </>
                )}
            </form>
        </div>
    );
}
