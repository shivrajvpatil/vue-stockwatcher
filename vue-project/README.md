# StockWatcher - Vue 3 Migration

A modern Vue 3 + TypeScript implementation of the classic GWT StockWatcher tutorial application.

## 🎯 Original GWT vs Vue 3 Comparison

| Feature | GWT | Vue 3 |
|---------|-----|-------|
| **Language** | Java | TypeScript |
| **UI Framework** | GWT Widgets | Vue Components |
| **RPC** | GWT-RPC | Fetch API / Axios |
| **Reactivity** | Manual DOM manipulation | Reactive refs & computed |
| **Build Tool** | Maven/Ant | Vite |
| **Dev Experience** | Compile + reload | Hot Module Replacement |
| **Bundle Size** | ~500KB+ | ~50KB (optimized) |

## 📦 Project Structure

```
src/
├── components/
│   ├── StockTable.vue       # Stock list table
│   └── AddStockPanel.vue    # Input form for adding stocks
├── composables/
│   └── useStockWatcher.ts   # Business logic
├── services/
│   └── stockService.ts      # API integration
├── types/
│   └── stock.ts             # TypeScript interfaces
├── App.vue                  # Main app component
└── main.ts                  # Entry point
```

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ and npm

### Installation

```bash
# Install dependencies
npm install

# Start development server
npm run dev
```

Visit `http://localhost:3000`

### Build for Production

```bash
npm run build
npm run preview
```

## 🔑 Key Features

✅ **Real-time stock price updates** (1-second refresh interval)  
✅ **Add/remove stocks** dynamically  
✅ **Client-side fallback** if server unavailable  
✅ **Color-coded price changes** (green/red)  
✅ **Input validation** for stock symbols  
✅ **Error handling** for delisted stocks  
✅ **TypeScript** for type safety  
✅ **Fully responsive** design  

## 🔌 Backend API Requirements

The app expects a REST API at `/api/stocks/prices`:

### Endpoint: `POST /api/stocks/prices`

**Request:**
```json
{
  "symbols": ["AAPL", "GOOGL", "MSFT"]
}
```

**Response:**
```json
{
  "prices": [
    {
      "symbol": "AAPL",
      "price": 150.25,
      "change": 2.50,
      "changePercent": 1.69
    }
  ]
}
```

**Error Response (Delisted):**
```json
{
  "errorType": "DELISTED",
  "symbol": "XYZ",
  "message": "Company 'XYZ' was delisted"
}
```

> **Note:** If the backend is unavailable, the app automatically falls back to generating random prices on the client side.

## 📖 Migration Documentation

See [MIGRATION_GUIDE.md](./MIGRATION_GUIDE.md) for:
- Detailed GWT to Vue conversion patterns
- Component architecture explanations
- API integration guide
- Testing strategies
- Best practices

## 🛠️ Development Commands

```bash
npm run dev          # Start dev server
npm run build        # Build for production
npm run preview      # Preview production build
npm run type-check   # TypeScript type checking
```

## 🎓 Learning the Conversion

This project demonstrates:

1. **Widget → Component**: How GWT Widgets map to Vue components
2. **RPC → REST**: Converting GWT-RPC to modern HTTP APIs
3. **Event Handling**: From Java anonymous classes to Vue event handlers
4. **State Management**: From class fields to reactive refs
5. **Styling**: From programmatic CSS to declarative classes

## 🔧 Configuration

### Backend Proxy (vite.config.ts)
```typescript
server: {
  proxy: {
    '/api': {
      target: 'http://localhost:8080', // Your backend URL
      changeOrigin: true,
    },
  },
}
```

### Environment Variables
Create a `.env` file:
```
VITE_API_BASE_URL=http://localhost:8080/api
```

## 🎨 Customization

### Change Refresh Interval
In `App.vue`:
```typescript
const REFRESH_INTERVAL = 5000; // Change to 5 seconds
```

### Modify Styling
Edit component `<style>` sections or create global CSS:
```css
/* src/style.css */
:root {
  --primary-color: #4CAF50;
  --error-color: #d9534f;
}
```

## 📊 Performance Optimizations

- **Lazy Loading**: Split routes with dynamic imports
- **Virtual Scrolling**: For large stock lists (e.g., using `vue-virtual-scroller`)
- **Debouncing**: Reduce API calls during rapid input
- **Caching**: Cache stock prices with expiration

## 🐛 Troubleshooting

### API calls return 404
- Check `vite.config.ts` proxy configuration
- Verify backend server is running
- Inspect browser Network tab

### TypeScript errors
- Run `npm run type-check`
- Ensure all dependencies are installed
- Check `tsconfig.json` configuration

### Styles not applying
- Clear browser cache
- Check CSS class names match
- Verify scoped styles usage

## 📝 License

MIT License - feel free to use for learning and projects

## 🙏 Acknowledgments

Based on the original [GWT StockWatcher Tutorial](https://www.gwtproject.org/doc/latest/tutorial/)

---

**Made with ❤️ using Vue 3**
