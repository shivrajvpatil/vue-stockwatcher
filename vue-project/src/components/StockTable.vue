<template>
  <table class="watch-list">
    <thead>
      <tr class="watch-list-header">
        <th>Symbol</th>
        <th class="watch-list-numeric-column">Price</th>
        <th class="watch-list-numeric-column">Change</th>
        <th class="watch-list-remove-column">Remove</th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="stock in stocks" :key="stock.symbol">
        <td>{{ stock.symbol }}</td>
        <td class="watch-list-numeric-column">
          {{ formatPrice(stock.price) }}
        </td>
        <td 
          class="watch-list-numeric-column"
          :class="getChangeStyleClass(stock.changePercent)"
        >
          {{ formatChange(stock.change) }} ({{ formatChange(stock.changePercent) }}%)
        </td>
        <td class="watch-list-remove-column">
          <button 
            class="gwt-Button gwt-Button-remove"
            @click="$emit('remove-stock', stock.symbol)"
            aria-label="Remove stock"
          >
            x
          </button>
        </td>
      </tr>
    </tbody>
  </table>
</template>

<script setup lang="ts">
import type { StockPrice } from '../types/stock';

// Props (corresponds to passing data to GWT widgets)
interface Props {
  stocks: Array<StockPrice & { symbol: string }>;
  formatPrice: (price: number) => string;
  formatChange: (change: number) => string;
  getChangeStyleClass: (changePercent: number) => string;
}

defineProps<Props>();

// Events (corresponds to GWT ClickHandler)
defineEmits<{
  'remove-stock': [symbol: string];
}>();
</script>

<style scoped>
.watch-list {
  border-collapse: collapse;
  width: 100%;
  margin-bottom: 1em;
}

.watch-list td,
.watch-list th {
  padding: 6px;
  text-align: left;
}

.watch-list-header {
  background-color: #f0f0f0;
  font-weight: bold;
}

.watch-list-numeric-column {
  text-align: right;
}

.watch-list-remove-column {
  text-align: center;
}

/* Change color styling - corresponds to GWT changeStyleName */
.negative-change {
  color: #d9534f;
}

.positive-change {
  color: #5cb85c;
}

.no-change {
  color: #333;
}

/* Remove button styling - corresponds to GWT Button with "remove" style */
.gwt-Button {
  border: 1px solid #ccc;
  background-color: #f9f9f9;
  cursor: pointer;
  padding: 2px 6px;
  font-size: 0.9em;
}

.gwt-Button-remove {
  background-color: #d9534f;
  color: white;
  border: 1px solid #c9302c;
  border-radius: 3px;
  font-weight: bold;
}

.gwt-Button-remove:hover {
  background-color: #c9302c;
}
</style>
