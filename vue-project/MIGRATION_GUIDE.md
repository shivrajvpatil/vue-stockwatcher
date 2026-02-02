# GWT to Vue 3 Migration Guide - StockWatcher App

## 📋 Overview

This document explains how the GWT StockWatcher application was converted to Vue 3 with TypeScript.

## 🗂️ Project Structure

```
/
├── src/
│   ├── components/          # Vue components (GWT Widgets)
│   │   ├── StockTable.vue      # FlexTable → Vue table component
│   │   └── AddStockPanel.vue   # HorizontalPanel + TextBox + Button
│   ├── composables/         # Business logic (extracted from EntryPoint)
│   │   └── useStockWatcher.ts  # Main app logic
│   ├── services/            # API calls (GWT RPC replacement)
│   │   └── stockService.ts     # StockPriceService → Fetch API
│   ├── types/               # TypeScript types
│   │   └── stock.ts            # StockPrice interface, exceptions
│   ├── App.vue              # Main component (StockWatcher.java)
│   └── main.ts              # Entry point (onModuleLoad)
├── index.html               # Host page (StockWatcher.html)
├── package.json
├── vite.config.ts
└── tsconfig.json
```

## 🔄 Key Conversions

### 1. **GWT Widget → Vue Component**

| GWT Widget | Vue Component | Notes |
|------------|---------------|-------|
| `FlexTable` | `StockTable.vue` | HTML `<table>` with v-for |
| `TextBox` | `<input v-model>` | Two-way binding |
| `Button` | `<button @click>` | Event handler |
| `Label` | `<div>` or `{{ }}` | Template interpolation |
| `VerticalPanel` | `<div>` | CSS flexbox/grid |
| `HorizontalPanel` | `<div class="flex">` | CSS flexbox |

### 2. **GWT RPC → Fetch API**

**GWT Code:**
```java
stockPriceSvc.getPrices(stocks.toArray(new String[0]), callback);
```

**Vue Code:**
```typescript
const prices = await getStockPrices(stocks.value);
```

**Key Changes:**
- `AsyncCallback<T>` → `async/await` with `Promise<T>`
- Server proxy creation → Direct fetch calls
- Manual serialization → JSON (native)

### 3. **Event Handlers**

| GWT | Vue |
|-----|-----|
| `addClickHandler(new ClickHandler() {...})` | `@click="method"` |
| `addKeyPressHandler(new KeyPressHandler() {...})` | `@keypress.enter="method"` |
| Anonymous inner classes | Arrow functions |

### 4. **State Management**

**GWT (Class Fields):**
```java
private ArrayList<String> stocks = new ArrayList<String>();
private Label lastUpdatedLabel = new Label();
```

**Vue (Reactive Refs):**
```typescript
const stocks = ref<string[]>([]);
const lastUpdated = ref<Date | null>(null);
```

### 5. **Styling**

**GWT:**
```java
stocksFlexTable.addStyleName("watchList");
stocksFlexTable.getRowFormatter().addStyleName(0, "watchListHeader");
```

**Vue:**
```vue
<table class="watch-list">
  <tr class="watch-list-header">
```

CSS classes are applied directly in templates using `:class` binding.

## 🚀 How to Run

### Installation
```bash
npm install
```

### Development Server
```bash
npm run dev
```
Opens at `http://localhost:3000`

### Build for Production
```bash
npm run build
```

### Type Check
```bash
npm run type-check
```

## 🔌 Backend Integration

The app expects a REST API at `/api/stocks/prices`:

### Request
```json
POST /api/stocks/prices
Content-Type: application/json

{
  "symbols": ["AAPL", "GOOGL", "MSFT"]
}
```

### Response
```json
{
  "prices": [
    {
      "symbol": "AAPL",
      "price": 150.25,
      "change": 2.50,
      "changePercent": 1.69
    }
  ],
  "timestamp": "2026-02-02T10:30:00Z"
}
```

### Error Response (Delisted Stock)
```json
{
  "errorType": "DELISTED",
  "symbol": "XYZ",
  "message": "Company 'XYZ' was delisted"
}
```

## 📝 Component Breakdown

### **App.vue** (Main Component)
- **GWT Equivalent:** `StockWatcher.java` EntryPoint
- **Purpose:** Orchestrates all child components
- **Responsibilities:**
  - Timer setup for auto-refresh
  - Event handling coordination
  - Error display

### **StockTable.vue**
- **GWT Equivalent:** `FlexTable` widget
- **Props:** Stock data, formatting functions
- **Events:** `remove-stock`
- **Features:**
  - Dynamic row rendering with `v-for`
  - Conditional styling for price changes
  - Remove button per row

### **AddStockPanel.vue**
- **GWT Equivalent:** `HorizontalPanel` + `TextBox` + `Button`
- **Features:**
  - Two-way binding with `v-model`
  - Enter key support
  - Auto-focus on mount
  - Exposed methods for parent control

### **useStockWatcher.ts** (Composable)
- **Purpose:** Business logic extraction
- **Contains:**
  - State management (stocks, prices, errors)
  - Validation logic
  - API calls
  - Formatting utilities
- **Benefits:**
  - Reusable across components
  - Testable in isolation
  - Clear separation of concerns

### **stockService.ts**
- **GWT Equivalent:** `StockPriceService` + `StockPriceServiceAsync`
- **Functions:**
  - `getStockPrices()` - Server fetch
  - `generateRandomStockPrices()` - Client fallback
- **Error Handling:**
  - Custom `DelistedException`
  - Network failure fallback

## 🎯 Key Vue 3 Concepts Used

### **Composition API**
- `ref()` - Reactive primitive values
- `computed()` - Derived reactive state
- `watch()` - Side effects on state changes
- `onMounted()` / `onUnmounted()` - Lifecycle hooks

### **Component Communication**
- **Props down:** Parent → Child data flow
- **Events up:** Child → Parent events via `$emit`
- **Template refs:** Parent access to child methods

### **Reactivity**
```typescript
// Reactive state
const stocks = ref<string[]>([]);

// Computed property
const hasError = computed(() => errorMessage.value !== '');

// Watch for changes
watch(stocks, () => {
  refreshWatchList();
});
```

## 🔍 Migration Patterns

### Pattern 1: Timer/Polling
**GWT:**
```java
Timer refreshTimer = new Timer() {
  @Override
  public void run() {
    refreshWatchList();
  }
};
refreshTimer.scheduleRepeating(REFRESH_INTERVAL);
```

**Vue:**
```typescript
onMounted(() => {
  const timer = setInterval(() => {
    refreshWatchList();
  }, REFRESH_INTERVAL);
  
  onUnmounted(() => clearInterval(timer));
});
```

### Pattern 2: Form Validation
**GWT:**
```java
if (!symbol.matches("^[0-9a-zA-Z\\.]{1,10}$")) {
  Window.alert("Invalid symbol");
  return;
}
```

**Vue:**
```typescript
function isValidSymbol(symbol: string): boolean {
  return /^[0-9a-zA-Z.]{1,10}$/.test(symbol);
}

if (!isValidSymbol(symbol)) {
  alert("Invalid symbol");
  return;
}
```

### Pattern 3: Dynamic Styling
**GWT:**
```java
String changeStyleName = "noChange";
if (price.getChangePercent() < -0.1f) {
  changeStyleName = "negativeChange";
}
changeWidget.setStyleName(changeStyleName);
```

**Vue:**
```vue
<td :class="getChangeStyleClass(stock.changePercent)">
  {{ formatChange(stock.change) }}
</td>
```

```typescript
function getChangeStyleClass(changePercent: number): string {
  if (changePercent < -0.1) return 'negative-change';
  if (changePercent > 0.1) return 'positive-change';
  return 'no-change';
}
```

## 🎨 Styling Strategy

1. **Scoped Styles:** Component-specific styles in `<style scoped>`
2. **Global Styles:** App-wide styles in `App.vue` or separate CSS file
3. **Dynamic Classes:** Use `:class` binding for conditional styles
4. **CSS Variables:** For theming (optional enhancement)

## 🧪 Testing Recommendations

### Unit Tests (Components)
- Use Vitest + Vue Test Utils
- Test component props, events, rendering

### Unit Tests (Composables)
- Test business logic in isolation
- Mock API calls

### Integration Tests
- Test component interactions
- Test API error handling

### E2E Tests
- Use Playwright or Cypress
- Test complete user workflows

## 🚀 Next Steps

1. **Add Loading States:** Show spinner during API calls
2. **Add Persistence:** LocalStorage for stock list
3. **Add Charts:** Integrate Chart.js for price history
4. **Add Filtering:** Search/filter stocks
5. **Add Sorting:** Click column headers to sort
6. **Add WebSocket:** Real-time price updates
7. **Add Authentication:** User accounts
8. **Add Tests:** Unit, integration, E2E tests

## 📚 Learning Resources

- [Vue 3 Docs](https://vuejs.org/)
- [Composition API](https://vuejs.org/guide/extras/composition-api-faq.html)
- [TypeScript with Vue](https://vuejs.org/guide/typescript/overview.html)
- [Vite](https://vitejs.dev/)

## 🐛 Common Issues

### Issue: API calls fail
**Solution:** Check proxy configuration in `vite.config.ts` and ensure backend is running

### Issue: Types not recognized
**Solution:** Run `npm run type-check` to verify TypeScript configuration

### Issue: Styles not applying
**Solution:** Check CSS class names match between template and styles

### Issue: Component not reactive
**Solution:** Ensure you're using `.value` to access ref values in `<script>`

## 💡 Tips

1. **Use Composition API:** More flexible than Options API
2. **Extract Logic:** Move business logic to composables
3. **Type Everything:** Leverage TypeScript for safety
4. **Keep Components Small:** Single responsibility principle
5. **Use Dev Tools:** Vue DevTools browser extension

---

**Happy coding! 🎉**
