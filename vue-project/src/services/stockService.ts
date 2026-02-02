import type { StockPrice, StockPricesResponse } from '../types/stock';
import { DelistedException } from '../types/stock';

// API base URL - adjust this to your backend endpoint
const API_BASE_URL = '/api/stocks';

/**
 * Fetches stock prices from the server
 * Corresponds to: stockPriceSvc.getPrices() in GWT
 */
export async function getStockPrices(symbols: string[]): Promise<StockPrice[]> {
  try {
    const response = await fetch(`${API_BASE_URL}/prices`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ symbols }),
    });

    if (!response.ok) {
      // Check if it's a delisted stock error
      const errorData = await response.json().catch(() => ({}));
      
      if (errorData.errorType === 'DELISTED' && errorData.symbol) {
        throw new DelistedException(errorData.symbol, errorData.message);
      }
      
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data: StockPricesResponse = await response.json();
    return data.prices;
  } catch (error) {
    // Re-throw DelistedException as-is
    if (error instanceof DelistedException) {
      throw error;
    }
    
    // Wrap other errors
    throw new Error(
      error instanceof Error ? error.message : 'Failed to fetch stock prices'
    );
  }
}

/**
 * Generates random stock prices (client-side fallback)
 * Corresponds to: refreshWatchListClient() in GWT
 */
export function generateRandomStockPrices(symbols: string[]): StockPrice[] {
  const MAX_PRICE = 100.0; // $100.00
  const MAX_PRICE_CHANGE = 0.02; // +/- 2%

  return symbols.map((symbol) => {
    const price = Math.random() * MAX_PRICE;
    const change = price * MAX_PRICE_CHANGE * (Math.random() * 2.0 - 1.0);
    const changePercent = (change / price) * 100;

    return {
      symbol,
      price,
      change,
      changePercent,
    };
  });
}
