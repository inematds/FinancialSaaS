import { useEffect, useState, useCallback } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { getHoldingsWithPrices } from '../../services/portfolio';

export default function PortfolioHeroCard() {
    const { user } = useAuth();
    const [totalValue, setTotalValue] = useState<number>(0);
    const [loading, setLoading] = useState(true);

    const fetchPortfolioValue = useCallback(async () => {
        if (!user) {
            setLoading(false);
            return;
        }
        setLoading(true);
        const holdings = await getHoldingsWithPrices(user.id);
        const total = holdings.reduce((sum, h) => sum + (h.market_value || 0), 0);
        setTotalValue(total);
        setLoading(false);
    }, [user]);

    useEffect(() => {
        fetchPortfolioValue();
    }, [fetchPortfolioValue]);

    return (
        <div
            className="col-span-8 bg-gradient-to-br from-[#0d1117] to-[#161b22] border-[3px] border-accent-green p-8 clip-top-right opacity-0 animate-fade-in-up delay-200"
        >
            <div className="flex justify-between items-start mb-8">
                <div>
                    <div className="text-xs uppercase tracking-[2px] text-text-secondary font-semibold">
                        Total Portfolio Value
                    </div>
                </div>
            </div>

            {loading ? (
                <div className="font-mono text-7xl font-extrabold leading-none mb-4 tracking-tight animate-pulse">
                    <div className="h-20 bg-bg-tertiary rounded w-80" />
                </div>
            ) : totalValue === 0 ? (
                <div className="text-center py-8">
                    <div className="text-4xl mb-4">📊</div>
                    <div className="font-mono text-3xl text-text-secondary mb-2">$0.00</div>
                    <p className="text-text-secondary text-sm">Add holdings to see your portfolio value</p>
                </div>
            ) : (
                <div className="font-mono text-7xl font-extrabold leading-none mb-4 tracking-tight">
                    ${totalValue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </div>
            )}
        </div>
    );
}
