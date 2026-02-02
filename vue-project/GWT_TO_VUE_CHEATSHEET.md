# GWT to Vue 3 Quick Reference Cheatsheet

## 🎯 Core Concepts

| Concept | GWT | Vue 3 |
|---------|-----|-------|
| **Entry Point** | `EntryPoint.onModuleLoad()` | `createApp(App).mount('#app')` |
| **Component** | Widget class | `.vue` file (SFC) |
| **State** | Class fields | `ref()`, `reactive()` |
| **Derived State** | Computed manually | `computed()` |
| **Lifecycle** | `onLoad()`, `onUnload()` | `onMounted()`, `onUnmounted()` |

---

## 🧩 Widget Conversions

### Text Input
```java
// GWT
TextBox textBox = new TextBox();
textBox.setText("value");
String value = textBox.getText();
```

```vue
<!-- Vue -->
<input v-model="value" type="text" />
<script setup>
const value = ref('');
</script>
```

### Button
```java
// GWT
Button button = new Button("Click Me");
button.addClickHandler(new ClickHandler() {
  public void onClick(ClickEvent event) {
    // Handle click
  }
});
```

```vue
<!-- Vue -->
<button @click="handleClick">Click Me</button>
<script setup>
const handleClick = () => {
  // Handle click
};
</script>
```

### Label
```java
// GWT
Label label = new Label("Hello");
label.setText("World");
```

```vue
<!-- Vue -->
<div>{{ text }}</div>
<script setup>
const text = ref('Hello');
text.value = 'World';
</script>
```

### FlexTable / Grid
```java
// GWT
FlexTable table = new FlexTable();
table.setText(0, 0, "Header");
table.setText(1, 0, "Row 1");
```

```vue
<!-- Vue -->
<table>
  <thead>
    <tr><th>Header</th></tr>
  </thead>
  <tbody>
    <tr v-for="row in rows" :key="row.id">
      <td>{{ row.data }}</td>
    </tr>
  </tbody>
</table>
```

### Panels (Layout)
```java
// GWT - VerticalPanel
VerticalPanel panel = new VerticalPanel();
panel.add(widget1);
panel.add(widget2);

// GWT - HorizontalPanel
HorizontalPanel hPanel = new HorizontalPanel();
hPanel.add(widget1);
hPanel.add(widget2);
```

```vue
<!-- Vue - Vertical -->
<div class="vertical">
  <ComponentOne />
  <ComponentTwo />
</div>

<!-- Vue - Horizontal -->
<div class="horizontal">
  <ComponentOne />
  <ComponentTwo />
</div>

<style scoped>
.vertical { display: flex; flex-direction: column; }
.horizontal { display: flex; flex-direction: row; }
</style>
```

---

## 🔄 Event Handling

### Click Events
```java
// GWT
widget.addClickHandler(new ClickHandler() {
  public void onClick(ClickEvent event) {
    doSomething();
  }
});
```

```vue
<!-- Vue -->
<div @click="doSomething">Click me</div>
<script setup>
const doSomething = () => { /* ... */ };
</script>
```

### Keyboard Events
```java
// GWT
textBox.addKeyPressHandler(new KeyPressHandler() {
  public void onKeyPress(KeyPressEvent event) {
    if (event.getCharCode() == KeyCodes.KEY_ENTER) {
      submit();
    }
  }
});
```

```vue
<!-- Vue -->
<input @keypress.enter="submit" />
<script setup>
const submit = () => { /* ... */ };
</script>
```

### Change Events
```java
// GWT
textBox.addValueChangeHandler(new ValueChangeHandler<String>() {
  public void onValueChange(ValueChangeEvent<String> event) {
    String newValue = event.getValue();
  }
});
```

```vue
<!-- Vue -->
<input v-model="value" @change="handleChange" />
<script setup>
const value = ref('');
const handleChange = () => {
  console.log('New value:', value.value);
};
</script>
```

---

## 🎨 Styling

### Add Style Name
```java
// GWT
widget.addStyleName("my-class");
widget.setStyleName("primary-class");
```

```vue
<!-- Vue -->
<div class="my-class"></div>
<div :class="dynamicClass"></div>
<div :class="{ active: isActive, disabled: !enabled }"></div>
```

### Dynamic Styling
```java
// GWT
if (condition) {
  widget.addStyleName("highlight");
} else {
  widget.removeStyleName("highlight");
}
```

```vue
<!-- Vue -->
<div :class="{ highlight: condition }"></div>
```

---

## 📡 Asynchronous Operations

### GWT RPC
```java
// GWT - Service Interface
public interface StockPriceService extends RemoteService {
  StockPrice[] getPrices(String[] symbols) throws DelistedException;
}

// GWT - Async Interface
public interface StockPriceServiceAsync {
  void getPrices(String[] symbols, AsyncCallback<StockPrice[]> callback);
}

// GWT - Client Call
stockPriceSvc.getPrices(symbols, new AsyncCallback<StockPrice[]>() {
  public void onSuccess(StockPrice[] result) {
    updateUI(result);
  }
  
  public void onFailure(Throwable caught) {
    handleError(caught);
  }
});
```

### Vue with Fetch
```typescript
// Vue - Service Function
export async function getStockPrices(symbols: string[]): Promise<StockPrice[]> {
  const response = await fetch('/api/stocks/prices', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ symbols }),
  });
  
  if (!response.ok) {
    throw new Error('Failed to fetch prices');
  }
  
  return response.json();
}

// Vue - Usage in Component
const fetchPrices = async () => {
  try {
    const prices = await getStockPrices(symbols.value);
    updateUI(prices);
  } catch (error) {
    handleError(error);
  }
};
```

---

## ⏱️ Timers

### GWT Timer
```java
// GWT
Timer timer = new Timer() {
  @Override
  public void run() {
    refreshData();
  }
};
timer.scheduleRepeating(1000); // Every 1 second
```

### Vue Timer
```typescript
// Vue
onMounted(() => {
  const timerId = setInterval(() => {
    refreshData();
  }, 1000);
  
  onUnmounted(() => {
    clearInterval(timerId);
  });
});
```

---

## 📦 State Management

### GWT - Class Fields
```java
// GWT
public class StockWatcher implements EntryPoint {
  private ArrayList<String> stocks = new ArrayList<>();
  private Map<String, StockPrice> prices = new HashMap<>();
  
  private void addStock(String symbol) {
    stocks.add(symbol);
  }
}
```

### Vue - Reactive State
```typescript
// Vue
const stocks = ref<string[]>([]);
const prices = ref<Map<string, StockPrice>>(new Map());

const addStock = (symbol: string) => {
  stocks.value.push(symbol);
};

// Or using reactive()
const state = reactive({
  stocks: [] as string[],
  prices: new Map<string, StockPrice>(),
});

const addStock = (symbol: string) => {
  state.stocks.push(symbol);
};
```

---

## 🔍 DOM Queries

### GWT - Getting Elements
```java
// GWT
RootPanel.get("stockList").add(mainPanel);
```

### Vue - Template Refs
```vue
<!-- Vue -->
<div ref="stockList">
  <MainPanel />
</div>

<script setup>
const stockList = ref<HTMLElement | null>(null);

onMounted(() => {
  console.log(stockList.value); // Access DOM element
});
</script>
```

---

## 📝 Forms & Validation

### GWT
```java
// GWT
String symbol = textBox.getText().toUpperCase().trim();
if (!symbol.matches("^[0-9a-zA-Z\\.]{1,10}$")) {
  Window.alert("Invalid symbol");
  textBox.selectAll();
  return;
}
```

### Vue
```typescript
// Vue
const symbol = ref('');

const validate = () => {
  const normalized = symbol.value.toUpperCase().trim();
  if (!/^[0-9a-zA-Z.]{1,10}$/.test(normalized)) {
    alert('Invalid symbol');
    // Use template ref to select
    return false;
  }
  return true;
};
```

---

## 🧪 Component Communication

### GWT - Manual Callbacks
```java
// GWT - Parent
Button removeButton = new Button("Remove");
removeButton.addClickHandler(new ClickHandler() {
  public void onClick(ClickEvent event) {
    onRemoveStock(symbol);
  }
});
```

### Vue - Props & Events
```vue
<!-- Child Component -->
<button @click="$emit('remove-stock', symbol)">Remove</button>

<script setup>
defineProps<{ symbol: string }>();
defineEmits<{ 'remove-stock': [symbol: string] }>();
</script>

<!-- Parent Component -->
<StockRow 
  :symbol="stock" 
  @remove-stock="handleRemove"
/>

<script setup>
const handleRemove = (symbol: string) => {
  // Handle removal
};
</script>
```

---

## 🔄 Data Binding

### GWT - Manual Updates
```java
// GWT - One-way (manual)
label.setText(value);

// GWT - Two-way (manual)
textBox.addValueChangeHandler(new ValueChangeHandler<String>() {
  public void onValueChange(ValueChangeEvent<String> event) {
    value = event.getValue();
    updateUI();
  }
});
```

### Vue - Automatic Reactivity
```vue
<!-- Vue - One-way -->
<div>{{ value }}</div>

<!-- Vue - Two-way -->
<input v-model="value" />

<script setup>
const value = ref('');
// Automatically updates when value changes
</script>
```

---

## 🎯 Key Differences Summary

| Feature | GWT | Vue 3 |
|---------|-----|-------|
| **Syntax** | Java (verbose) | HTML/JS/CSS (concise) |
| **Reactivity** | Manual DOM updates | Automatic reactivity |
| **Type Safety** | Java compiler | TypeScript (optional) |
| **Bundle Size** | Large (~500KB+) | Small (~50KB) |
| **Dev Experience** | Slow compilation | Instant HMR |
| **Learning Curve** | Java knowledge needed | Web standards |
| **Tooling** | Eclipse, IntelliJ | VS Code, WebStorm |
| **Testing** | JUnit | Vitest, Jest |
| **Community** | Small, legacy | Large, active |

---

## 💡 Pro Tips

1. **Use Composition API**: More flexible than Options API
2. **Extract Logic to Composables**: Reusable business logic
3. **TypeScript Everywhere**: Better than PropTypes
4. **Keep Components Small**: Easier to maintain
5. **Use Vue DevTools**: Essential for debugging

---

## 📚 Resources

- [Vue 3 Migration Guide (Official)](https://v3-migration.vuejs.org/)
- [Composition API FAQ](https://vuejs.org/guide/extras/composition-api-faq.html)
- [TypeScript with Vue](https://vuejs.org/guide/typescript/overview.html)
- [Vite Guide](https://vitejs.dev/guide/)

---

**Happy Migrating! 🚀**
