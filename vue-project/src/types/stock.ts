// Types corresponding to GWT StockPrice class
export interface StockPrice {
  symbol: string;
  price: number;
  change: number;
  changePercent: number;
}

// API Response type
export interface StockPricesResponse {
  prices: StockPrice[];
  timestamp: Date;
}

// Custom error for delisted stocks (corresponds to GWT DelistedException)
export class DelistedException extends Error {
  symbol: string;

  constructor(symbol: string, message?: string) {
    super(message || `Company '${symbol}' was delisted`);
    this.name = 'DelistedException';
    this.symbol = symbol;
  }
}
