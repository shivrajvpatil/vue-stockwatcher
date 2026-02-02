# 📖 Project Reading Order Guide

## How to Analyze the Vue 3 Project Flow

Follow this order to understand the complete application architecture:

---

## 🎯 **Phase 1: Understand the Data** (5 minutes)

### 1. **src/types/stock.ts** ⭐ START HERE
**Why first?** Understanding the data structures is crucial before seeing how they're used.

**What to look for:**
- `StockPrice` interface (symbol, price, change, changePercent)
- `DelistedException` custom error class
- These types are used everywhere in the app

**Key concept:** TypeScript interfaces define the "contract" for data shape

---

## 🔌 **Phase 2: Understand the Backend Integration** (10 minutes)

### 2. **src/services/stockService.ts**
**Why second?** See how the app talks to the backend (replaces GWT RPC).

**What to look for:**
- `getStockPrices()` - Makes HTTP POST to `/api/stocks/prices`
- `generateRandomStockPrices()` - Client-side fallback when server unavailable
- Error handling (DelistedException, network failures)

**Key concept:** Service layer separates API logic from UI components

**GWT equivalent:** 
```java
StockPriceService + StockPriceServiceAsync + AsyncCallback
```

---

## 🧠 **Phase 3: Understand the Business Logic** (20 minutes)

### 3. **src/composables/useStockWatcher.ts** ⭐ MOST IMPORTANT
**Why third?** This is the heart of the application - all business logic lives here.

**What to look for:**

#### **State Management** (Lines 1-20)
```typescript
const stocks = ref<string[]>([]);           // List of stock symbols
const stockPrices = ref<Map<...>>();        // Symbol -> Price mapping
const lastUpdated = ref<Date | null>(null); // Last refresh timestamp
const errorMessage = ref('');               // Error display
```

#### **Core Functions** (Read in this order)
1. **`isValidSymbol()`** - Validates stock symbol format
2. **`addStock()`** - Adds stock to watch list (validation + update)
3. **`removeStock()`** - Removes stock from watch list
4. **`refreshWatchList()`** - Fetches latest prices (server or client)
5. **`getChangeStyleClass()`** - Returns CSS class based on price change
6. **`formatPrice()` / `formatChange()`** - Number formatting utilities

#### **Computed Values**
```typescript
const stockList = computed(() => { /* ... */ }); // Combines stocks + prices
```

**Key concept:** Composables extract reusable logic that can be shared across components

**GWT equivalent:** All the methods in `StockWatcher.java` class

---

## 🎨 **Phase 4: Understand the UI Components** (30 minutes)

### 4. **src/components/AddStockPanel.vue**
**Why fourth?** Start with the simplest component.

**Read in this order:**
1. **`<template>`** section (HTML)
   - `<input v-model="symbolInput">` - Two-way binding to symbolInput
   - `@keypress.enter="handleAddStock"` - Submit on Enter key
   - `@click="handleAddStock"` - Submit on button click

2. **`<script setup>`** section (Logic)
   - `symbolInput` ref - Holds current input value
   - `handleAddStock()` - Emits event to parent
   - `onMounted()` - Auto-focus input on load

3. **`<style scoped>`** section (CSS)
   - `.add-panel` - Flexbox layout
   - `.gwt-TextBox` - Input styling
   - `.gwt-Button` - Button styling

**Key concepts:**
- `v-model` - Two-way data binding
- `defineEmits` - Child → Parent communication
- `ref` template reference for DOM access

**GWT equivalent:**
```java
HorizontalPanel + TextBox + Button + KeyPressHandler + ClickHandler
```

---

### 5. **src/components/StockTable.vue**
**Why fifth?** More complex component with dynamic rendering.

**Read in this order:**
1. **`<template>`** section
   - `<thead>` - Static header row
   - `<tbody>` with `v-for="stock in stocks"` - Dynamic rows
   - `:class="getChangeStyleClass(...)"` - Dynamic CSS classes
   - `@click="$emit('remove-stock', ...)"` - Remove button event

2. **`<script setup>`** section
   - `defineProps<Props>()` - Receives data from parent
   - `defineEmits` - Sends events to parent

3. **`<style scoped>`** section
   - `.negative-change` / `.positive-change` - Color coding
   - Table layout styles

**Key concepts:**
- `v-for` - List rendering (like FlexTable rows)
- `:class` binding - Dynamic classes based on data
- Props down, Events up pattern

**GWT equivalent:**
```java
FlexTable with row manipulation
setCellFormatter, setStyleName, setText, setWidget
```

---

### 6. **src/App.vue** ⭐ THE ORCHESTRATOR
**Why sixth?** Now you understand all the pieces, see how they fit together.

**Read in this order:**
1. **`<script setup>`** section FIRST (unusual but important)
   - `useStockWatcher()` - Imports all business logic
   - `refreshTimer` setup - Auto-refresh every 1 second
   - `handleAddStock()` - Coordinates adding stocks
   - `handleRemoveStock()` - Coordinates removing stocks
   - `onMounted()` / `onUnmounted()` - Timer lifecycle

2. **`<template>`** section
   - Error message display (conditional with `v-if`)
   - `<StockTable>` with props and event handlers
   - `<AddStockPanel>` with event handler
   - Last updated timestamp

3. **`<style>`** section (NOT scoped - global styles)
   - Body and container styles
   - Error message styling

**Key concepts:**
- Composition API: Logic separated from template
- Component composition: Parent orchestrates children
- Lifecycle hooks: Setup/teardown resources

**GWT equivalent:**
```java
StockWatcher.java EntryPoint class
onModuleLoad() method
VerticalPanel assembly
Timer.scheduleRepeating()
```

---

## 🚀 **Phase 5: Understand the Entry Point** (5 minutes)

### 7. **src/main.ts**
**Why seventh?** Application bootstrap.

**What to look for:**
- `createApp(App)` - Creates Vue app instance
- `.mount('#app')` - Mounts to DOM element

**GWT equivalent:**
```java
<script src="stockwatcher/stockwatcher.nocache.js"></script>
RootPanel.get("stockList").add(mainPanel)
```

---

### 8. **index.html**
**Why eighth?** The HTML host page.

**What to look for:**
- `<div id="app"></div>` - Mount point for Vue app
- `<script type="module" src="/src/main.ts">` - Entry point

**GWT equivalent:**
```html
StockWatcher.html with <div id="stockList">
```

---

## 🔧 **Phase 6: Configuration Files** (Optional - 10 minutes)

### 9. **package.json**
- Project dependencies (Vue, TypeScript, Vite)
- NPM scripts (`dev`, `build`, `preview`)

### 10. **vite.config.ts**
- Development server configuration
- Proxy setup for backend API calls
- Path aliases

### 11. **tsconfig.json**
- TypeScript compiler options
- Type checking settings

---

## 📊 **Visual Flow Diagram**

```
┌─────────────────────────────────────────────────────────┐
│                     index.html                           │
│                    <div id="app">                        │
└────────────────────────┬────────────────────────────────┘
                         │
                         ↓
┌─────────────────────────────────────────────────────────┐
│                      main.ts                             │
│              createApp(App).mount('#app')                │
└────────────────────────┬────────────────────────────────┘
                         │
                         ↓
┌─────────────────────────────────────────────────────────┐
│                      App.vue                             │
│  ┌─────────────────────────────────────────────────┐   │
│  │   useStockWatcher() composable                   │   │
│  │   - stocks state                                 │   │
│  │   - addStock(), removeStock(), refresh()         │   │
│  └─────────────────────────────────────────────────┘   │
│                                                          │
│  ┌───────────────────┐  ┌──────────────────────────┐   │
│  │ Error Message     │  │   StockTable             │   │
│  │ (conditional)     │  │   - Display stocks       │   │
│  └───────────────────┘  │   - Format prices        │   │
│                          │   - Remove button        │   │
│  ┌───────────────────┐  └──────────────────────────┘   │
│  │ AddStockPanel     │                                  │
│  │ - Input box       │                                  │
│  │ - Add button      │                                  │
│  └───────────────────┘                                  │
│                                                          │
│  ┌───────────────────┐                                  │
│  │ Last Updated      │                                  │
│  └───────────────────┘                                  │
└──────────────────────────┬───────────────────────────────┘
                           │
                           ↓
              ┌────────────────────────┐
              │  stockService.ts       │
              │  - getStockPrices()    │
              │  - generateRandom()    │
              └────────────┬───────────┘
                           │
                           ↓
              ┌────────────────────────┐
              │   Backend API          │
              │   POST /api/stocks     │
              └────────────────────────┘
```

---

## 🎓 **Data Flow Example: Adding a Stock**

Let's trace how data flows when a user adds a stock:

```
1. User types "AAPL" in AddStockPanel input box
   └─> symbolInput ref updates automatically (v-model)

2. User presses Enter or clicks Add button
   └─> handleAddStock() is called in AddStockPanel

3. AddStockPanel emits 'add-stock' event with "AAPL"
   └─> emit('add-stock', 'AAPL')

4. App.vue catches the event
   └─> handleAddStock('AAPL') is called

5. App.vue calls composable method
   └─> addStock('AAPL')

6. useStockWatcher.ts processes:
   ├─> Validates: isValidSymbol('AAPL') ✓
   ├─> Checks duplicates: !stocks.includes('AAPL') ✓
   ├─> Adds to list: stocks.value.push('AAPL')
   └─> Triggers refresh: refreshWatchList()

7. refreshWatchList() calls:
   └─> stockService.getStockPrices(['AAPL'])

8. stockService makes HTTP request:
   └─> POST /api/stocks/prices
       Body: { symbols: ['AAPL'] }

9. Server responds with price data:
   └─> { prices: [{ symbol: 'AAPL', price: 150.25, ... }] }

10. useStockWatcher updates state:
    └─> stockPrices.value.set('AAPL', priceData)

11. Vue reactivity triggers UI update:
    └─> StockTable re-renders with new row

12. User sees "AAPL" in the table! 🎉
```

---

## 💡 **Key Concepts to Understand**

### **Reactivity**
```typescript
const stocks = ref<string[]>([]);

// Anywhere this is used in template, it auto-updates:
stocks.value.push('AAPL'); // ← UI updates automatically!
```

### **Props (Parent → Child)**
```typescript
// Parent passes data down
<StockTable :stocks="stockList" />

// Child receives data
defineProps<{ stocks: StockPrice[] }>();
```

### **Events (Child → Parent)**
```typescript
// Child emits event up
emit('remove-stock', symbol);

// Parent catches event
<StockTable @remove-stock="handleRemove" />
```

### **Composables (Reusable Logic)**
```typescript
// Extract logic into composable
export function useStockWatcher() {
  const stocks = ref([]);
  const addStock = () => { /* ... */ };
  return { stocks, addStock };
}

// Use in any component
const { stocks, addStock } = useStockWatcher();
```

---

## 🎯 **Quick Reference: File Purposes**

| File | Purpose | GWT Equivalent |
|------|---------|----------------|
| `types/stock.ts` | Data contracts | Java interfaces/classes |
| `services/stockService.ts` | API calls | GWT RPC Service + Async |
| `composables/useStockWatcher.ts` | Business logic | StockWatcher class methods |
| `components/AddStockPanel.vue` | Input form UI | HorizontalPanel + Widgets |
| `components/StockTable.vue` | Table display UI | FlexTable |
| `App.vue` | App orchestrator | EntryPoint.onModuleLoad() |
| `main.ts` | Bootstrap | Module loading |
| `index.html` | HTML host | StockWatcher.html |

---

## 🏁 **Next Steps After Reading**

1. **Run the app**: `npm install && npm run dev`
2. **Open Vue DevTools**: See reactive state in real-time
3. **Modify a value**: Change `REFRESH_INTERVAL` to see effect
4. **Add a feature**: Try adding a "Clear All" button
5. **Read the docs**: Compare with `MIGRATION_GUIDE.md`

---

## ❓ **Common Questions**

### Q: Why is business logic in a composable instead of components?
**A:** Separation of concerns. Logic can be reused, tested independently, and components stay focused on UI.

### Q: What's the difference between `ref()` and `reactive()`?
**A:** 
- `ref()` - For primitives (strings, numbers, arrays). Access with `.value`
- `reactive()` - For objects. Access properties directly

### Q: Why `v-model` instead of separate value + onChange?
**A:** Syntactic sugar. `v-model="text"` is shorthand for `:value="text" @input="text = $event.target.value"`

### Q: How does Vue know when to update the DOM?
**A:** Vue's reactivity system tracks dependencies. When `stocks.value` changes, all templates using it re-render automatically.

---

**Happy Learning! 📚**

*Start with `src/types/stock.ts` and work your way through!*
