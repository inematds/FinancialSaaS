import { useParams, Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { getQuote, type Quote } from '../services/finnhub';
import { supabase } from '../lib/supabase';

interface CompanyProfile {
    symbol: string;
    name: string;
    sector: string;
    industry: string;
    description: string;
    website: string;
    employees: string;
    executives: { name: string; title: string }[];
}

interface CompanyStats {
    market_cap: string;
    pe_ratio: string;
    eps: string;
    dividend_yield: string;
    beta: string;
    '52_week_high': string;
    '52_week_low': string;
}

// Mock data for demo (since Python scraper runs server-side)
const MOCK_PROFILES: Record<string, CompanyProfile> = {
    'AAPL': {
        symbol: 'AAPL',
        name: 'Apple Inc.',
        sector: 'Technology',
        industry: 'Consumer Electronics',
        description: 'Apple Inc. designs, manufactures, and markets smartphones, personal computers, tablets, wearables, and accessories worldwide. The company offers iPhone, Mac, iPad, and wearables, home, and accessories.',
        website: 'https://apple.com',
        employees: '164,000',
        executives: [
            { name: 'Tim Cook', title: 'Chief Executive Officer' },
            { name: 'Luca Maestri', title: 'Chief Financial Officer' },
            { name: 'Jeff Williams', title: 'Chief Operating Officer' },
        ]
    },
    'MSFT': {
        symbol: 'MSFT',
        name: 'Microsoft Corporation',
        sector: 'Technology',
        industry: 'Software - Infrastructure',
        description: 'Microsoft Corporation develops, licenses, and supports software, services, devices, and solutions worldwide. The company operates in Productivity and Business Processes, Intelligent Cloud, and More Personal Computing segments.',
        website: 'https://microsoft.com',
        employees: '221,000',
        executives: [
            { name: 'Satya Nadella', title: 'Chairman & CEO' },
            { name: 'Amy Hood', title: 'Chief Financial Officer' },
            { name: 'Brad Smith', title: 'Vice Chair & President' },
        ]
    },
};

const MOCK_STATS: Record<string, CompanyStats> = {
    'AAPL': {
        market_cap: '$2.95T',
        pe_ratio: '31.2',
        eps: '$6.42',
        dividend_yield: '0.48%',
        beta: '1.28',
        '52_week_high': '$199.62',
        '52_week_low': '$164.08',
    },
    'MSFT': {
        market_cap: '$3.12T',
        pe_ratio: '36.8',
        eps: '$11.54',
        dividend_yield: '0.72%',
        beta: '0.89',
        '52_week_high': '$468.35',
        '52_week_low': '$309.45',
    },
};

// Generate mock data for unknown symbols
function generateMockProfile(symbol: string, name: string): CompanyProfile {
    return {
        symbol,
        name,
        sector: 'Technology',
        industry: 'General',
        description: `${name} is a publicly traded company listed on major US exchanges. Detailed company information will be available once connected to the intelligence backend.`,
        website: '',
        employees: 'N/A',
        executives: []
    };
}

function generateMockStats(): CompanyStats {
    return {
        market_cap: 'N/A',
        pe_ratio: 'N/A',
        eps: 'N/A',
        dividend_yield: 'N/A',
        beta: 'N/A',
        '52_week_high': 'N/A',
        '52_week_low': 'N/A',
    };
}

export default function CompanyIntelligence() {
    const { symbol } = useParams<{ symbol: string }>();
    const [quote, setQuote] = useState<Quote | null>(null);
    const [profile, setProfile] = useState<CompanyProfile | null>(null);
    const [stats, setStats] = useState<CompanyStats | null>(null);
    const [stockInfo, setStockInfo] = useState<{ name: string } | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            if (!symbol) return;
            setLoading(true);

            // Fetch stock info from Supabase
            const { data: stockData } = await supabase
                .from('stocks')
                .select('name')
                .eq('symbol', symbol.toUpperCase())
                .single();

            if (stockData) {
                setStockInfo(stockData);
            }

            // Fetch live quote
            const quoteData = await getQuote(symbol.toUpperCase());
            setQuote(quoteData);

            // Get profile (mock or real)
            const mockProfile = MOCK_PROFILES[symbol.toUpperCase()];
            const mockStats = MOCK_STATS[symbol.toUpperCase()];

            setProfile(mockProfile || generateMockProfile(symbol.toUpperCase(), stockData?.name || symbol));
            setStats(mockStats || generateMockStats());

            setLoading(false);
        };

        fetchData();
    }, [symbol]);

    if (loading) {
        return (
            <div className="space-y-8">
                <div className="animate-pulse">
                    <div className="h-10 bg-bg-tertiary rounded w-1/3 mb-4" />
                    <div className="h-6 bg-bg-tertiary rounded w-1/2" />
                </div>
            </div>
        );
    }

    const isPositive = (quote?.dp || 0) >= 0;

    return (
        <div className="space-y-8">
            {/* Back link */}
            <Link to="/portfolio" className="text-accent-blue hover:text-accent-green transition-colors text-sm">
                ← Back to Portfolio
            </Link>

            {/* Header */}
            <div className="flex justify-between items-start">
                <div>
                    <div className="flex items-center gap-4 mb-2">
                        <h1 className="font-archivo font-black text-5xl text-gradient">{symbol?.toUpperCase()}</h1>
                        {quote && (
                            <span className={`font-mono font-bold text-2xl ${isPositive ? 'text-accent-green' : 'text-accent-red'}`}>
                                {isPositive ? '▲' : '▼'} {quote.dp.toFixed(2)}%
                            </span>
                        )}
                    </div>
                    <p className="text-xl text-text-secondary">{profile?.name || stockInfo?.name}</p>
                </div>
                {quote && (
                    <div className="text-right">
                        <div className="font-mono font-black text-4xl">${quote.c.toFixed(2)}</div>
                        <div className={`font-mono ${isPositive ? 'text-accent-green' : 'text-accent-red'}`}>
                            {isPositive ? '+' : ''}${quote.d.toFixed(2)} today
                        </div>
                    </div>
                )}
            </div>

            <div className="grid grid-cols-12 gap-6">
                {/* Company Overview */}
                <div className="col-span-8 card-base clip-top-right opacity-0 animate-fade-in-up delay-200">
                    <div className="text-xs uppercase tracking-[2px] text-text-secondary font-semibold mb-4">
                        Company Overview
                    </div>

                    <div className="grid grid-cols-2 gap-6 mb-6">
                        <div>
                            <span className="text-text-secondary text-sm">Sector</span>
                            <div className="font-semibold">{profile?.sector || 'N/A'}</div>
                        </div>
                        <div>
                            <span className="text-text-secondary text-sm">Industry</span>
                            <div className="font-semibold">{profile?.industry || 'N/A'}</div>
                        </div>
                        <div>
                            <span className="text-text-secondary text-sm">Employees</span>
                            <div className="font-semibold">{profile?.employees || 'N/A'}</div>
                        </div>
                        <div>
                            <span className="text-text-secondary text-sm">Website</span>
                            <div className="font-semibold">
                                {profile?.website ? (
                                    <a href={profile.website} target="_blank" rel="noopener noreferrer" className="text-accent-blue hover:text-accent-green">
                                        {profile.website.replace('https://', '')}
                                    </a>
                                ) : 'N/A'}
                            </div>
                        </div>
                    </div>

                    <p className="text-text-secondary leading-relaxed">
                        {profile?.description || 'Company description not available.'}
                    </p>
                </div>

                {/* Key Statistics */}
                <div className="col-span-4 card-base clip-bottom-right opacity-0 animate-fade-in-up delay-300">
                    <div className="text-xs uppercase tracking-[2px] text-text-secondary font-semibold mb-4">
                        Key Statistics
                    </div>

                    <div className="space-y-4">
                        <div className="flex justify-between">
                            <span className="text-text-secondary">Market Cap</span>
                            <span className="font-mono font-bold">{stats?.market_cap || 'N/A'}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-text-secondary">P/E Ratio</span>
                            <span className="font-mono font-bold">{stats?.pe_ratio || 'N/A'}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-text-secondary">EPS</span>
                            <span className="font-mono font-bold">{stats?.eps || 'N/A'}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-text-secondary">Dividend Yield</span>
                            <span className="font-mono font-bold">{stats?.dividend_yield || 'N/A'}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-text-secondary">Beta</span>
                            <span className="font-mono font-bold">{stats?.beta || 'N/A'}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-text-secondary">52W High</span>
                            <span className="font-mono font-bold text-accent-green">{stats?.['52_week_high'] || 'N/A'}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-text-secondary">52W Low</span>
                            <span className="font-mono font-bold text-accent-red">{stats?.['52_week_low'] || 'N/A'}</span>
                        </div>
                    </div>
                </div>

                {/* Executives */}
                {profile?.executives && profile.executives.length > 0 && (
                    <div className="col-span-6 card-base opacity-0 animate-fade-in-up delay-400">
                        <div className="text-xs uppercase tracking-[2px] text-text-secondary font-semibold mb-4">
                            Key Executives
                        </div>
                        <div className="space-y-3">
                            {profile.executives.map((exec, index) => (
                                <div key={index} className="flex justify-between items-center p-3 bg-bg-tertiary clip-ticker">
                                    <span className="font-semibold">{exec.name}</span>
                                    <span className="text-text-secondary text-sm">{exec.title}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* AI Analysis Placeholder */}
                <div className="col-span-6 card-base border-accent-blue opacity-0 animate-fade-in-up delay-500">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="w-10 h-10 bg-accent-blue clip-hexagon flex items-center justify-center text-xl">
                            🤖
                        </div>
                        <div className="text-xs uppercase tracking-[2px] text-text-secondary font-semibold">
                            AI Analysis
                        </div>
                    </div>
                    <div className="bg-accent-blue/10 border-l-4 border-accent-blue p-4 text-sm leading-relaxed">
                        <p>
                            <strong>Coming Soon:</strong> AI-powered analysis including sentiment analysis from recent news,
                            technical indicators, and personalized investment recommendations based on your portfolio goals.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
