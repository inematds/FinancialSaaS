import { supabase } from '../lib/supabase';
import { getQuote, type Quote } from './finnhub';

export interface Holding {
    id: string;
    user_id: string;
    symbol: string;
    name: string;
    shares: number;
    avg_cost: number;
    asset_type: string;
    created_at: string;
    // Computed from live price
    current_price?: number;
    change_percent?: number;
    market_value?: number;
    profit_loss?: number;
}

export async function getHoldings(userId: string): Promise<Holding[]> {
    const { data, error } = await supabase
        .from('holdings')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

    if (error) {
        console.error('Error fetching holdings:', error);
        return [];
    }

    return data || [];
}

export async function addHolding(
    userId: string,
    symbol: string,
    name: string,
    shares: number,
    avgCost: number,
    assetType: string = 'stock'
): Promise<{ error: Error | null }> {
    const { error } = await supabase
        .from('holdings')
        .insert({
            user_id: userId,
            symbol,
            name,
            shares,
            avg_cost: avgCost,
            asset_type: assetType
        });

    return { error: error as Error | null };
}

export async function updateHolding(
    holdingId: string,
    shares: number,
    avgCost: number
): Promise<{ error: Error | null }> {
    const { error } = await supabase
        .from('holdings')
        .update({ shares, avg_cost: avgCost, updated_at: new Date().toISOString() })
        .eq('id', holdingId);

    return { error: error as Error | null };
}

export async function deleteHolding(holdingId: string): Promise<{ error: Error | null }> {
    const { error } = await supabase
        .from('holdings')
        .delete()
        .eq('id', holdingId);

    return { error: error as Error | null };
}

export async function getHoldingsWithPrices(userId: string): Promise<Holding[]> {
    const holdings = await getHoldings(userId);

    // Fetch live prices for all holdings
    const holdingsWithPrices = await Promise.all(
        holdings.map(async (holding) => {
            const quote = await getQuote(holding.symbol);

            if (quote) {
                const currentPrice = quote.c;
                const marketValue = currentPrice * holding.shares;
                const costBasis = holding.avg_cost * holding.shares;
                const profitLoss = marketValue - costBasis;

                return {
                    ...holding,
                    current_price: currentPrice,
                    change_percent: quote.dp,
                    market_value: marketValue,
                    profit_loss: profitLoss
                };
            }

            return holding;
        })
    );

    return holdingsWithPrices;
}

export async function getCurrentPrice(symbol: string): Promise<Quote | null> {
    return getQuote(symbol);
}
