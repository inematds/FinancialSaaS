import axios from 'axios';

const API_KEY = import.meta.env.VITE_FINNHUB_API_KEY || '';
const BASE_URL = 'https://finnhub.io/api/v1';

// Cache configuration
const NEWS_CACHE_KEY = 'finnhub_news_cache';
const CACHE_DURATION_MS = 6 * 60 * 60 * 1000; // 6 hours in milliseconds

export interface NewsItem {
    category: string;
    datetime: number;
    headline: string;
    id: number;
    image: string;
    source: string;
    summary: string;
    url: string;
}

export interface Quote {
    c: number; // Current price
    d: number; // Change
    dp: number; // Percent change
}

interface NewsCache {
    data: NewsItem[];
    timestamp: number;
    category: string;
}

// News categories available on Finnhub
export type NewsCategory = 'general' | 'forex' | 'crypto' | 'merger';

// Custom search parameters for finance news
export interface NewsSearchParams {
    category?: NewsCategory;
    minId?: number; // For pagination - get news after this ID
}

// Check if API key is configured
export function hasApiKey(): boolean {
    return Boolean(API_KEY);
}

function getCachedNews(category: string): NewsItem[] | null {
    try {
        const cached = localStorage.getItem(`${NEWS_CACHE_KEY}_${category}`);
        if (!cached) return null;

        const parsed: NewsCache = JSON.parse(cached);
        const now = Date.now();

        // Check if cache is still valid (within 6 hours)
        if (now - parsed.timestamp < CACHE_DURATION_MS && parsed.category === category) {
            console.log(`Using cached news for "${category}" (${Math.round((now - parsed.timestamp) / 60000)} minutes old)`);
            return parsed.data;
        }

        // Cache expired
        console.log(`News cache for "${category}" expired, fetching fresh data...`);
        return null;
    } catch {
        return null;
    }
}

function setCachedNews(category: string, data: NewsItem[]): void {
    const cache: NewsCache = {
        data,
        timestamp: Date.now(),
        category
    };
    localStorage.setItem(`${NEWS_CACHE_KEY}_${category}`, JSON.stringify(cache));
}

export function getNextRefreshTime(category: string = 'general'): Date | null {
    try {
        const cached = localStorage.getItem(`${NEWS_CACHE_KEY}_${category}`);
        if (!cached) return null;

        const parsed: NewsCache = JSON.parse(cached);
        return new Date(parsed.timestamp + CACHE_DURATION_MS);
    } catch {
        return null;
    }
}

export function clearNewsCache(category?: string): void {
    if (category) {
        localStorage.removeItem(`${NEWS_CACHE_KEY}_${category}`);
    } else {
        // Clear all news caches
        ['general', 'forex', 'crypto', 'merger'].forEach(cat => {
            localStorage.removeItem(`${NEWS_CACHE_KEY}_${cat}`);
        });
    }
}

export async function getMarketNews(params: NewsSearchParams = {}): Promise<NewsItem[]> {
    const { category = 'general', minId } = params;

    if (!API_KEY) {
        console.warn('No Finnhub API key found.');
        return [];
    }

    // Check cache first (only if not paginating with minId)
    if (!minId) {
        const cached = getCachedNews(category);
        if (cached) {
            return cached;
        }
    }

    try {
        const response = await axios.get(`${BASE_URL}/news`, {
            params: {
                category,
                minId,
                token: API_KEY
            },
            timeout: 10000 // 10 second timeout
        });

        const newsData = response.data.slice(0, 12); // Get up to 12 articles

        // Cache the results (only for initial fetch, not pagination)
        if (!minId) {
            setCachedNews(category, newsData);
        }

        return newsData;
    } catch (error) {
        console.error('Failed to fetch news:', error);
        return [];
    }
}

// Force refresh news (bypasses cache)
export async function refreshMarketNews(category: NewsCategory = 'general'): Promise<NewsItem[]> {
    clearNewsCache(category);
    return getMarketNews({ category });
}

export async function getQuote(symbol: string): Promise<Quote | null> {
    if (!API_KEY) {
        console.warn(`No Finnhub API key.`);
        return null;
    }

    try {
        const response = await axios.get(`${BASE_URL}/quote`, {
            params: {
                symbol,
                token: API_KEY
            },
            timeout: 10000 // 10 second timeout
        });

        // Check if we got valid data (Finnhub returns empty object for invalid symbols)
        if (response.data && response.data.c > 0) {
            return response.data;
        }

        console.warn(`No data from Finnhub for ${symbol}`);
        return null;
    } catch (error) {
        console.error(`Failed to fetch quote for ${symbol}:`, error);
        return null;
    }
}
