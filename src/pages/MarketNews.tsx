import { useEffect, useState, useCallback } from 'react';
import {
    getMarketNews,
    getQuote,
    refreshMarketNews,
    getNextRefreshTime,
    hasApiKey,
    type NewsItem,
    type Quote,
    type NewsCategory
} from '../services/finnhub';

const tickerSymbols = [
    { symbol: 'SPY', name: 'S&P 500' },
    { symbol: 'QQQ', name: 'NASDAQ' },
    { symbol: 'DIA', name: 'DOW' },
];

const newsCategories: { value: NewsCategory; label: string }[] = [
    { value: 'general', label: 'General' },
    { value: 'forex', label: 'Forex' },
    { value: 'crypto', label: 'Crypto' },
    { value: 'merger', label: 'M&A' },
];

export default function MarketNews() {
    const [news, setNews] = useState<NewsItem[]>([]);
    const [quotes, setQuotes] = useState<Record<string, Quote | null>>({});
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [category, setCategory] = useState<NewsCategory>('general');
    const [nextRefresh, setNextRefresh] = useState<Date | null>(null);
    const [timeUntilRefresh, setTimeUntilRefresh] = useState<string>('');

    const apiKeyConfigured = hasApiKey();

    const fetchData = useCallback(async (forceRefresh = false) => {
        if (!apiKeyConfigured) {
            setLoading(false);
            return;
        }

        if (forceRefresh) {
            setRefreshing(true);
        } else {
            setLoading(true);
        }

        const [newsData, ...quoteData] = await Promise.all([
            forceRefresh ? refreshMarketNews(category) : getMarketNews({ category }),
            ...tickerSymbols.map(t => getQuote(t.symbol))
        ]);

        setNews(newsData);
        const quotesMap: Record<string, Quote | null> = {};
        tickerSymbols.forEach((t, i) => {
            quotesMap[t.symbol] = quoteData[i];
        });
        setQuotes(quotesMap);
        setNextRefresh(getNextRefreshTime(category));
        setLoading(false);
        setRefreshing(false);
    }, [category, apiKeyConfigured]);

    // Initial fetch and category change
    useEffect(() => {
        fetchData();
    }, [fetchData]);

    // Auto-refresh timer (checks every minute)
    useEffect(() => {
        if (!apiKeyConfigured) return;

        const checkRefresh = () => {
            const refreshTime = getNextRefreshTime(category);
            if (refreshTime && new Date() >= refreshTime) {
                console.log('Auto-refreshing news (6 hour interval)...');
                fetchData(true);
            }
        };

        const interval = setInterval(checkRefresh, 60000); // Check every minute
        return () => clearInterval(interval);
    }, [category, fetchData, apiKeyConfigured]);

    // Update countdown timer
    useEffect(() => {
        const updateCountdown = () => {
            if (!nextRefresh) {
                setTimeUntilRefresh('');
                return;
            }

            const now = new Date();
            const diff = nextRefresh.getTime() - now.getTime();

            if (diff <= 0) {
                setTimeUntilRefresh('Refreshing...');
                return;
            }

            const hours = Math.floor(diff / (1000 * 60 * 60));
            const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

            if (hours > 0) {
                setTimeUntilRefresh(`${hours}h ${minutes}m`);
            } else {
                setTimeUntilRefresh(`${minutes}m`);
            }
        };

        updateCountdown();
        const interval = setInterval(updateCountdown, 60000);
        return () => clearInterval(interval);
    }, [nextRefresh]);

    const hasQuotes = Object.values(quotes).some(q => q !== null);

    // Show API key missing message
    if (!apiKeyConfigured) {
        return (
            <div className="space-y-8">
                <div>
                    <h1 className="font-archivo font-black text-4xl leading-none mb-2 text-gradient animate-fade-in-up">
                        Market
                    </h1>
                    <p className="text-text-secondary animate-fade-in-up delay-100">
                        Real-time market data and financial news.
                    </p>
                </div>

                <div className="card-base clip-top-right text-center py-16">
                    <div className="text-6xl mb-4">🔑</div>
                    <h3 className="text-xl font-bold mb-2">Finnhub API Key Required</h3>
                    <p className="text-text-secondary max-w-md mx-auto mb-4">
                        Add your Finnhub API key to see real-time market data and news.
                    </p>
                    <div className="bg-bg-tertiary p-4 inline-block text-left font-mono text-sm">
                        <div className="text-text-secondary mb-2">Add to .env.local:</div>
                        <code className="text-accent-green">VITE_FINNHUB_API_KEY=your_api_key_here</code>
                    </div>
                    <p className="text-text-secondary text-sm mt-4">
                        Get a free API key at{' '}
                        <a href="https://finnhub.io/register" target="_blank" rel="noopener noreferrer" className="text-accent-blue hover:text-accent-green">
                            finnhub.io/register
                        </a>
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-8">
            <div>
                <h1 className="font-archivo font-black text-4xl leading-none mb-2 text-gradient animate-fade-in-up">
                    Market
                </h1>
                <p className="text-text-secondary animate-fade-in-up delay-100">
                    Real-time market data and financial news.
                </p>
            </div>

            {/* Market Ticker */}
            <div className="card-base clip-top-right opacity-0 animate-fade-in-up delay-200">
                {loading ? (
                    <div className="flex gap-8">
                        {tickerSymbols.map((ticker) => (
                            <div key={ticker.symbol} className="flex items-center gap-6 animate-pulse">
                                <div>
                                    <div className="h-5 bg-bg-tertiary rounded w-20 mb-2" />
                                    <div className="h-4 bg-bg-tertiary rounded w-16" />
                                </div>
                                <div className="h-5 bg-bg-tertiary rounded w-14" />
                            </div>
                        ))}
                    </div>
                ) : hasQuotes ? (
                    <div className="flex gap-8">
                        {tickerSymbols.map((ticker) => {
                            const quote = quotes[ticker.symbol];
                            if (!quote) return null;
                            const isPositive = (quote.dp || 0) >= 0;
                            return (
                                <div key={ticker.symbol} className="flex items-center gap-6">
                                    <div>
                                        <div className="font-mono font-bold text-lg">{ticker.name}</div>
                                        <div className="font-mono text-text-secondary">
                                            ${quote.c.toLocaleString()}
                                        </div>
                                    </div>
                                    <div className={`font-mono font-bold ${isPositive ? 'text-accent-green' : 'text-accent-red'}`}>
                                        {isPositive ? '+' : ''}{quote.dp.toFixed(2)}%
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                ) : (
                    <div className="text-center py-4 text-text-secondary">
                        <p>Unable to fetch market data. Check your API key or try again later.</p>
                    </div>
                )}
            </div>

            {/* News Section */}
            <div className="card-base clip-top-right opacity-0 animate-fade-in-up delay-300">
                {/* Header with category filter and refresh */}
                <div className="flex justify-between items-center mb-6">
                    <div className="flex items-center gap-4">
                        <div className="text-xs uppercase tracking-[2px] text-text-secondary font-semibold">
                            Latest News
                        </div>
                        <div className="flex gap-1">
                            {newsCategories.map((cat) => (
                                <button
                                    key={cat.value}
                                    onClick={() => setCategory(cat.value)}
                                    className={`px-3 py-1 text-xs font-semibold uppercase transition-all ${category === cat.value
                                            ? 'bg-accent-green text-bg-primary'
                                            : 'bg-bg-tertiary text-text-secondary hover:text-white'
                                        }`}
                                >
                                    {cat.label}
                                </button>
                            ))}
                        </div>
                    </div>
                    <div className="flex items-center gap-4">
                        {timeUntilRefresh && (
                            <div className="text-xs text-text-secondary">
                                Refresh in {timeUntilRefresh}
                            </div>
                        )}
                        <button
                            onClick={() => fetchData(true)}
                            disabled={refreshing}
                            className="text-xs text-accent-blue hover:text-accent-green transition-colors disabled:opacity-50"
                        >
                            {refreshing ? 'Refreshing...' : '↻ Refresh'}
                        </button>
                    </div>
                </div>

                {/* News Grid */}
                {loading ? (
                    <div className="grid grid-cols-3 gap-6">
                        {[...Array(6)].map((_, i) => (
                            <div key={i} className="animate-pulse">
                                <div className="aspect-video bg-bg-tertiary mb-4" />
                                <div className="h-4 bg-bg-tertiary rounded w-1/3 mb-2" />
                                <div className="h-6 bg-bg-tertiary rounded w-full mb-2" />
                                <div className="h-4 bg-bg-tertiary rounded w-2/3" />
                            </div>
                        ))}
                    </div>
                ) : news.length === 0 ? (
                    <div className="text-center py-16">
                        <div className="text-6xl mb-4">📰</div>
                        <h3 className="text-xl font-bold mb-2">No News Available</h3>
                        <p className="text-text-secondary max-w-md mx-auto">
                            No {category} news found. Try a different category or click refresh.
                        </p>
                    </div>
                ) : (
                    <div className="grid grid-cols-3 gap-6">
                        {news.map((article, index) => (
                            <a
                                key={article.id || index}
                                href={article.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="group block"
                            >
                                <div className="aspect-video bg-bg-tertiary mb-4 overflow-hidden">
                                    <img
                                        src={article.image || 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=400'}
                                        alt={article.headline}
                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                        onError={(e) => {
                                            e.currentTarget.src = 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=400';
                                        }}
                                    />
                                </div>
                                <div className="flex items-center gap-2 mb-2">
                                    <span className="text-xs text-accent-blue font-semibold">{article.source}</span>
                                    <span className="text-xs text-text-secondary">
                                        {new Date(article.datetime * 1000).toLocaleDateString()}
                                    </span>
                                </div>
                                <h3 className="font-semibold line-clamp-2 mb-2 group-hover:text-accent-green transition-colors">
                                    {article.headline}
                                </h3>
                                {article.summary && (
                                    <p className="text-sm text-text-secondary line-clamp-2">{article.summary}</p>
                                )}
                            </a>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
