<template>
  <div class="stock-watcher">
    <!-- Error message (corresponds to errorMsgLabel in GWT) -->
    <div v-if="hasError" class="error-message">
      {{ errorMessage }}
    </div>

    <!-- Stock table (corresponds to stocksFlexTable in GWT) -->
    <StockTable
      :stocks="stockList"
      :format-price="formatPrice"
      :format-change="formatChange"
      :get-change-style-class="getChangeStyleClass"
      @remove-stock="handleRemoveStock"
    />

    <!-- Add stock panel (corresponds to addPanel in GWT) -->
    <AddStockPanel
      ref="addPanelRef"
      @add-stock="handleAddStock"
    />

    <!-- Last updated label (corresponds to lastUpdatedLabel in GWT) -->
    <div class="last-updated">
      {{ formatLastUpdated() }}
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';
import StockTable from './components/StockTable.vue';
import AddStockPanel from './components/AddStockPanel.vue';
import { useStockWatcher } from './composables/useStockWatcher';

// Use the composable (extracts all business logic)
const {
  stockList,
  errorMessage,
  hasError,
  addStock,
  removeStock,
  refreshWatchList,
  getChangeStyleClass,
  formatPrice,
  formatChange,
  formatLastUpdated,
} = useStockWatcher();

// Reference to AddStockPanel for focusing/selecting
const addPanelRef = ref<InstanceType<typeof AddStockPanel> | null>(null);

// Timer for auto-refresh (corresponds to Timer.scheduleRepeating() in GWT)
const REFRESH_INTERVAL = 1000; // ms
let refreshTimer: number | null = null;

/**
 * Handles adding a stock
 * Corresponds to: addStockButton.onClick() and Enter key handler in GWT
 */
function handleAddStock(symbol: string) {
  const result = addStock(symbol);
  
  if (!result.success && result.message) {
    // Show alert for invalid symbol (corresponds to Window.alert() in GWT)
    alert(result.message);
    addPanelRef.value?.selectAll();
  }
}

/**
 * Handles removing a stock
 * Corresponds to: removeStockButton.onClick() in GWT
 */
function handleRemoveStock(symbol: string) {
  removeStock(symbol);
}

/**
 * Setup auto-refresh timer
 * Corresponds to: Timer.scheduleRepeating(REFRESH_INTERVAL) in GWT
 */
onMounted(() => {
  refreshTimer = window.setInterval(() => {
    refreshWatchList();
  }, REFRESH_INTERVAL);
});

/**
 * Cleanup timer on unmount
 */
onUnmounted(() => {
  if (refreshTimer !== null) {
    clearInterval(refreshTimer);
  }
});
</script>

<style>
/* Global styles (corresponds to StockWatcher.css in GWT) */
body {
  font-family: Arial, sans-serif;
  margin: 20px;
  background-color: #f5f5f5;
}

.stock-watcher {
  max-width: 800px;
  margin: 0 auto;
  background-color: white;
  padding: 20px;
  border-radius: 5px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.error-message {
  background-color: #f8d7da;
  color: #721c24;
  padding: 10px;
  margin-bottom: 1em;
  border: 1px solid #f5c6cb;
  border-radius: 3px;
}

.last-updated {
  margin-top: 1em;
  color: #666;
  font-size: 0.9em;
}
</style>
