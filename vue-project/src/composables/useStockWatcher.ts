import { ref, computed } from 'vue';
import type { Ref } from 'vue';
import type { StockPrice } from '../types/stock';
import { getStockPrices, generateRandomStockPrices } from '../services/stockService';
import { DelistedException } from '../types/stock';

/**
 * Composable for managing the stock watch list
 * Extracts business logic from the monolithic GWT EntryPoint
 */
export function useStockWatcher() {
  // State (corresponds to GWT class fields)
  const stocks: Ref<string[]> = ref([]);
  const stockPrices: Ref<Map<string, StockPrice>> = ref(new Map());
  const lastUpdated: Ref<Date | null> = ref(null);
  const errorMessage: Ref<string> = ref('');
  const serverAvailable: Ref<boolean> = ref(true);
  const isRefreshing: Ref<boolean> = ref(false);

  // Computed
  const hasError = computed(() => errorMessage.value !== '');
  const stockList = computed(() => {
    return stocks.value.map((symbol) => ({
      symbol,
      ...(stockPrices.value.get(symbol) || {
        price: 0,
        change: 0,
        changePercent: 0,
      }),
    }));
  });

  /**
   * Validates stock symbol
   * Corresponds to: symbol.matches("^[0-9a-zA-Z\\.]{1,10}$") in GWT
   */
  function isValidSymbol(symbol: string): boolean {
    return /^[0-9a-zA-Z.]{1,10}$/.test(symbol);
  }

  /**
   * Adds a stock to the watch list
   * Corresponds to: addStock() in GWT
   */
  function addStock(symbol: string): { success: boolean; message?: string } {
    const normalizedSymbol = symbol.toUpperCase().trim();

    // Validate symbol
    if (!isValidSymbol(normalizedSymbol)) {
      return {
        success: false,
        message: `'${normalizedSymbol}' is not a valid symbol.`,
      };
    }

    // Check for duplicates
    if (stocks.value.includes(normalizedSymbol)) {
      return { success: false, message: 'Stock already in watch list.' };
    }

    // Add to list
    stocks.value.push(normalizedSymbol);
    
    // Refresh prices immediately
    refreshWatchList();

    return { success: true };
  }

  /**
   * Removes a stock from the watch list
   * Corresponds to: removeStockButton.onClick() in GWT
   */
  function removeStock(symbol: string): void {
    const index = stocks.value.indexOf(symbol);
    if (index !== -1) {
      stocks.value.splice(index, 1);
      stockPrices.value.delete(symbol);
    }
  }

  /**
   * Refreshes the watch list prices
   * Corresponds to: refreshWatchList() in GWT
   */
  async function refreshWatchList(): Promise<void> {
    if (stocks.value.length === 0) {
      return;
    }

    isRefreshing.value = true;
    errorMessage.value = '';

    try {
      let prices: StockPrice[];

      if (serverAvailable.value) {
        // Try server first
        try {
          prices = await getStockPrices(stocks.value);
        } catch (error) {
          if (error instanceof DelistedException) {
            errorMessage.value = `Error: Company '${error.symbol}' was delisted`;
            return;
          }
          
          // Fallback to client-side generation
          console.warn('Server unavailable, using client-side prices');
          serverAvailable.value = false;
          prices = generateRandomStockPrices(stocks.value);
        }
      } else {
        // Use client-side generation
        prices = generateRandomStockPrices(stocks.value);
      }

      // Update prices map
      prices.forEach((price) => {
        stockPrices.value.set(price.symbol, price);
      });

      lastUpdated.value = new Date();
    } catch (error) {
      console.error('Error refreshing watch list:', error);
      errorMessage.value = 'Failed to refresh prices';
    } finally {
      isRefreshing.value = false;
    }
  }

  /**
   * Gets the CSS class for change styling
   * Corresponds to: changeStyleName logic in updateTable() in GWT
   */
  function getChangeStyleClass(changePercent: number): string {
    if (changePercent < -0.1) {
      return 'negative-change';
    } else if (changePercent > 0.1) {
      return 'positive-change';
    }
    return 'no-change';
  }

  /**
   * Formats a number as currency
   * Corresponds to: NumberFormat.getFormat("#,##0.00") in GWT
   */
  function formatPrice(price: number): string {
    return price.toLocaleString('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  }

  /**
   * Formats change with +/- sign
   * Corresponds to: NumberFormat.getFormat("+#,##0.00;-#,##0.00") in GWT
   */
  function formatChange(change: number): string {
    const formatted = Math.abs(change).toLocaleString('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
    return change >= 0 ? `+${formatted}` : `-${formatted}`;
  }

  /**
   * Formats the last updated timestamp
   * Corresponds to: DateTimeFormat.getMediumDateTimeFormat().format() in GWT
   */
  function formatLastUpdated(): string {
    if (!lastUpdated.value) {
      return '';
    }
    return `Last update : ${lastUpdated.value.toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      second: '2-digit',
    })}`;
  }

  return {
    // State
    stocks,
    stockList,
    lastUpdated,
    errorMessage,
    hasError,
    isRefreshing,
    serverAvailable,
    
    // Methods
    addStock,
    removeStock,
    refreshWatchList,
    getChangeStyleClass,
    formatPrice,
    formatChange,
    formatLastUpdated,
  };
}
