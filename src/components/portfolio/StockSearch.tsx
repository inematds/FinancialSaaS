import { useState, useEffect, useRef } from 'react';
import { supabase } from '../../lib/supabase';

interface Stock {
    id: number;
    symbol: string;
    name: string;
    exchange: string;
    sector: string | null;
}

interface StockSearchProps {
    onSelect: (stock: Stock) => void;
    placeholder?: string;
}

export default function StockSearch({ onSelect, placeholder = 'Search stocks...' }: StockSearchProps) {
    const [query, setQuery] = useState('');
    const [results, setResults] = useState<Stock[]>([]);
    const [isOpen, setIsOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const inputRef = useRef<HTMLInputElement>(null);
    const dropdownRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    useEffect(() => {
        const searchStocks = async () => {
            if (query.length < 1) {
                setResults([]);
                return;
            }

            setLoading(true);
            const { data, error } = await supabase
                .from('stocks')
                .select('*')
                .or(`symbol.ilike.%${query}%,name.ilike.%${query}%`)
                .limit(10);

            if (!error && data) {
                setResults(data);
            }
            setLoading(false);
        };

        const debounce = setTimeout(searchStocks, 200);
        return () => clearTimeout(debounce);
    }, [query]);

    const handleSelect = (stock: Stock) => {
        onSelect(stock);
        setQuery('');
        setResults([]);
        setIsOpen(false);
    };

    return (
        <div ref={dropdownRef} className="relative">
            <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={(e) => {
                    setQuery(e.target.value);
                    setIsOpen(true);
                }}
                onFocus={() => setIsOpen(true)}
                placeholder={placeholder}
                className="w-full bg-bg-tertiary border-2 border-border-color p-4 text-white focus:border-accent-green focus:outline-none transition-colors font-mono"
            />

            {isOpen && (query.length > 0 || loading) && (
                <div className="absolute z-50 top-full left-0 right-0 mt-1 bg-bg-secondary border-2 border-border-color max-h-[300px] overflow-y-auto">
                    {loading ? (
                        <div className="p-4 text-text-secondary text-center">Searching...</div>
                    ) : results.length === 0 ? (
                        <div className="p-4 text-text-secondary text-center">No stocks found</div>
                    ) : (
                        results.map((stock) => (
                            <button
                                key={stock.id}
                                onClick={() => handleSelect(stock)}
                                className="w-full p-4 flex items-center justify-between hover:bg-bg-tertiary transition-colors text-left border-b border-border-color last:border-0"
                            >
                                <div>
                                    <span className="font-mono font-bold text-accent-green">{stock.symbol}</span>
                                    <span className="text-white ml-3">{stock.name}</span>
                                </div>
                                <span className="text-xs text-text-secondary">{stock.exchange}</span>
                            </button>
                        ))
                    )}
                </div>
            )}
        </div>
    );
}
