import { useState, useEffect, useRef } from 'react';
import { supabase } from '../../lib/supabase';

interface Stock {
    id: number;
    symbol: string;
    name: string;
    exchange: string;
    sector: string | null;
}

interface StockDropdownProps {
    onSelect: (stock: Stock) => void;
}

export default function StockDropdown({ onSelect }: StockDropdownProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [stocks, setStocks] = useState<Stock[]>([]);
    const [filteredStocks, setFilteredStocks] = useState<Stock[]>([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [loading, setLoading] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    // Fetch all stocks on mount
    useEffect(() => {
        const fetchStocks = async () => {
            setLoading(true);
            const { data, error } = await supabase
                .from('stocks')
                .select('*')
                .order('symbol', { ascending: true });

            if (!error && data) {
                setStocks(data);
                setFilteredStocks(data);
            }
            setLoading(false);
        };

        fetchStocks();
    }, []);

    // Filter stocks when search query changes
    useEffect(() => {
        if (searchQuery.trim() === '') {
            setFilteredStocks(stocks);
        } else {
            const query = searchQuery.toLowerCase();
            const filtered = stocks.filter(
                (stock) =>
                    stock.symbol.toLowerCase().includes(query) ||
                    stock.name.toLowerCase().includes(query)
            );
            setFilteredStocks(filtered);
        }
    }, [searchQuery, stocks]);

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleSelect = (stock: Stock) => {
        onSelect(stock);
        setIsOpen(false);
        setSearchQuery('');
    };

    return (
        <div ref={dropdownRef} className="relative">
            {/* Dropdown Trigger */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center gap-2 px-4 py-2 bg-accent-green text-bg-primary font-bold text-sm uppercase tracking-wider clip-button hover:bg-accent-blue transition-colors"
            >
                <span className="text-lg">+</span>
                Add Stock
            </button>

            {/* Dropdown Panel */}
            {isOpen && (
                <div className="absolute z-50 top-full right-0 mt-2 w-[400px] bg-bg-secondary border-2 border-accent-green clip-bottom-right shadow-2xl">
                    {/* Search Bar */}
                    <div className="p-3 border-b border-border-color">
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Search symbol or name..."
                            className="w-full bg-bg-tertiary border-2 border-border-color p-3 text-white font-mono text-sm focus:border-accent-green focus:outline-none transition-colors"
                            autoFocus
                        />
                    </div>

                    {/* Stocks List */}
                    <div className="max-h-[350px] overflow-y-auto">
                        {loading ? (
                            <div className="p-6 text-center text-text-secondary">Loading stocks...</div>
                        ) : filteredStocks.length === 0 ? (
                            <div className="p-6 text-center text-text-secondary">No stocks found</div>
                        ) : (
                            filteredStocks.map((stock) => (
                                <button
                                    key={stock.id}
                                    onClick={() => handleSelect(stock)}
                                    className="w-full p-3 flex items-center justify-between hover:bg-bg-tertiary transition-colors text-left border-b border-border-color last:border-0"
                                >
                                    <div className="flex items-center gap-3">
                                        <span className="font-mono font-bold text-accent-green w-14">{stock.symbol}</span>
                                        <span className="text-white text-sm truncate max-w-[200px]">{stock.name}</span>
                                    </div>
                                    <span className="text-xs text-text-secondary">{stock.sector || stock.exchange}</span>
                                </button>
                            ))
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}
