# Stock Tracker API Documentation

## Base URL
```
http://localhost:3001/api
```

## Overview
The Stock Tracker API provides fake stock market data for businesses from the television show Parks & Recreation. All stock prices are randomly generated with fluctuations between -5% and +5% of the base price.

## Available Stocks

The API starts with the following stock symbols (you can add/remove with the endpoints below):

| Symbol | Company Name | Base Price |
|--------|--------------|------------|
| SWANSON | Swanson Foods | $45.50 |
| LITTLES | Little Sebastian Memorial | $120.00 |
| PAWN | Pawn Shop | $15.25 |
| RENT | Rent-A-Swag | $32.75 |
| TOMS | Tom's Bistro | $28.50 |
| JJ | JJ's Diner | $18.90 |
| PIT | The Pit | $22.30 |
| SWEET | Sweetums | $55.00 |
| GRIZ | Gryzzl | $95.75 |
| ENT | Entertainment 720 | $0.05 |

---

## Endpoints

### 1. Get All Available Stocks

Retrieves a list of all available stocks with current prices and changes.

**Endpoint:** `GET /api/stocks`

**Request:**
```http
GET http://localhost:3001/api/stocks
```

**Response:**
```json
[
  {
    "symbol": "SWANSON",
    "name": "Swanson Foods",
    "price": 46.23,
    "change": "2.15",
    "changePercent": "0.0473"
  },
  {
    "symbol": "LITTLES",
    "name": "Little Sebastian Memorial",
    "price": 118.45,
    "change": "-1.55",
    "changePercent": "-0.0129"
  },
  {
    "symbol": "PAWN",
    "name": "Pawn Shop",
    "price": 15.78,
    "change": "0.53",
    "changePercent": "0.0348"
  }
  // ... more stocks
]
```

**Response Fields:**
- `symbol` (string): Stock ticker symbol
- `name` (string): Company name
- `price` (number): Current stock price (rounded to 2 decimal places)
- `change` (string): Price change in dollars (formatted to 2 decimal places)
- `changePercent` (string): Price change as percentage (formatted to 4 decimal places)

**Example using cURL:**
```bash
curl http://localhost:3001/api/stocks
```

**Example using JavaScript (fetch):**
```javascript
fetch('http://localhost:3001/api/stocks')
  .then(response => response.json())
  .then(data => console.log(data))
  .catch(error => console.error('Error:', error));
```

---

### 2. Get Single Stock by Symbol

Retrieves current price and change data for a specific stock.

**Endpoint:** `GET /api/stocks/:symbol`

**Parameters:**
- `symbol` (path parameter, required): Stock ticker symbol (case-sensitive)

**Request:**
```http
GET http://localhost:3001/api/stocks/SWANSON
```

**Response (Success):**
```json
{
  "symbol": "SWANSON",
  "name": "Swanson Foods",
  "price": 46.23,
  "change": "2.15",
  "changePercent": "0.0473"
}
```

**Response (Not Found - 404):**
```json
{
  "error": "Stock not found"
}
```

**Example using cURL:**
```bash
curl http://localhost:3001/api/stocks/SWANSON
```

**Example using JavaScript (fetch):**
```javascript
fetch('http://localhost:3001/api/stocks/SWANSON')
  .then(response => response.json())
  .then(data => console.log(data))
  .catch(error => console.error('Error:', error));
```

---

### 3. Get Multiple Stocks (Batch Request)

Retrieves current price and change data for multiple stocks in a single request.

**Endpoint:** `GET /api/stocks/batch/:symbols`

**Parameters:**
- `symbols` (path parameter, required): Comma-separated list of stock symbols (case-sensitive)

**Request:**
```http
GET http://localhost:3001/api/stocks/batch/SWANSON,LITTLES,PAWN
```

**Response:**
```json
[
  {
    "symbol": "SWANSON",
    "name": "Swanson Foods",
    "price": 46.23,
    "change": "2.15",
    "changePercent": "0.0473"
  },
  {
    "symbol": "LITTLES",
    "name": "Little Sebastian Memorial",
    "price": 118.45,
    "change": "-1.55",
    "changePercent": "-0.0129"
  },
  {
    "symbol": "PAWN",
    "name": "Pawn Shop",
    "price": 15.78,
    "change": "0.53",
    "changePercent": "0.0348"
  }
]
```

**Note:** Invalid symbols are filtered out and not included in the response.

**Example using cURL:**
```bash
curl http://localhost:3001/api/stocks/batch/SWANSON,LITTLES,PAWN
```

**Example using JavaScript (fetch):**
```javascript
const symbols = ['SWANSON', 'LITTLES', 'PAWN'].join(',');
fetch(`http://localhost:3001/api/stocks/batch/${symbols}`)
  .then(response => response.json())
  .then(data => console.log(data))
  .catch(error => console.error('Error:', error));
```

---

### 4. Create a Stock

Adds a new stock to the in-memory list. Data is not persisted after server restarts.

**Endpoint:** `POST /api/stocks`

**Body (JSON):**
```json
{
  "symbol": "E720",
  "name": "Entertainment 720 SPAC",
  "basePrice": 12.5
}
```

**Response (201):**
```json
{
  "symbol": "E720",
  "name": "Entertainment 720 SPAC",
  "basePrice": 12.5
}
```

**Validation & Errors:**
- Missing `symbol`, `name`, or numeric `basePrice`: `400 { "error": "symbol, name, and numeric basePrice are required" }`
- Duplicate `symbol`: `409 { "error": "Stock symbol already exists" }`

**Example using cURL:**
```bash
curl -X POST http://localhost:3001/api/stocks \
  -H "Content-Type: application/json" \
  -d '{"symbol":"E720","name":"Entertainment 720 SPAC","basePrice":12.5}'
```

---

### 5. Delete a Stock

Removes a stock from the in-memory list.

**Endpoint:** `DELETE /api/stocks/:symbol`

**Request:**
```http
DELETE http://localhost:3001/api/stocks/E720
```

**Response (Success):**
```json
{ "deleted": "E720" }
```

**Response (Not Found - 404):**
```json
{ "error": "Stock not found" }
```

**Example using cURL:**
```bash
curl -X DELETE http://localhost:3001/api/stocks/E720
```

---

## Testing Examples

### Using Postman

1. **Get All Stocks:**
   - Method: `GET`
   - URL: `http://localhost:3001/api/stocks`

2. **Get Single Stock:**
   - Method: `GET`
   - URL: `http://localhost:3001/api/stocks/SWANSON`

3. **Get Multiple Stocks:**
   - Method: `GET`
   - URL: `http://localhost:3001/api/stocks/batch/SWANSON,LITTLES,PAWN`

4. **Create Stock:**
   - Method: `POST`
   - URL: `http://localhost:3001/api/stocks`
   - Body: `{ "symbol": "E720", "name": "Entertainment 720 SPAC", "basePrice": 12.5 }`

5. **Delete Stock:**
   - Method: `DELETE`
   - URL: `http://localhost:3001/api/stocks/E720`

### Using cURL

```bash
# Get all stocks
curl http://localhost:3001/api/stocks

# Get single stock
curl http://localhost:3001/api/stocks/GRIZ

# Get multiple stocks
curl http://localhost:3001/api/stocks/batch/TOMS,JJ,PIT

# Create a stock
curl -X POST http://localhost:3001/api/stocks \
  -H "Content-Type: application/json" \
  -d '{"symbol":"E720","name":"Entertainment 720 SPAC","basePrice":12.5}'

# Delete a stock
curl -X DELETE http://localhost:3001/api/stocks/E720
```

### Using JavaScript/Node.js

```javascript
// Get all stocks
async function getAllStocks() {
  try {
    const response = await fetch('http://localhost:3001/api/stocks');
    const stocks = await response.json();
    console.log(stocks);
  } catch (error) {
    console.error('Error:', error);
  }
}

// Get single stock
async function getStock(symbol) {
  try {
    const response = await fetch(`http://localhost:3001/api/stocks/${symbol}`);
    const stock = await response.json();
    console.log(stock);
  } catch (error) {
    console.error('Error:', error);
  }
}

// Get multiple stocks
async function getMultipleStocks(symbols) {
  try {
    const symbolsParam = symbols.join(',');
    const response = await fetch(`http://localhost:3001/api/stocks/batch/${symbolsParam}`);
    const stocks = await response.json();
    console.log(stocks);
  } catch (error) {
    console.error('Error:', error);
  }
}

// Usage examples
getAllStocks();
getStock('SWANSON');
getMultipleStocks(['SWANSON', 'LITTLES', 'PAWN']);
```

### Using Python

```python
import requests

# Get all stocks
response = requests.get('http://localhost:3001/api/stocks')
stocks = response.json()
print(stocks)

# Get single stock
response = requests.get('http://localhost:3001/api/stocks/SWANSON')
stock = response.json()
print(stock)

# Get multiple stocks
symbols = 'SWANSON,LITTLES,PAWN'
response = requests.get(f'http://localhost:3001/api/stocks/batch/{symbols}')
stocks = response.json()
print(stocks)
```

---

## Response Format

All successful responses return JSON data with the following structure:

### Single Stock Object
```json
{
  "symbol": "STRING",
  "name": "STRING",
  "price": NUMBER,
  "change": "STRING",
  "changePercent": "STRING"
}
```

### Array of Stock Objects
```json
[
  { /* stock object */ },
  { /* stock object */ }
]
```

### Error Response
```json
{
  "error": "STRING"
}
```

---

## Price Generation

Stock prices are generated using the following algorithm:
1. Each stock has a base price (see Available Stocks table)
2. A random fluctuation between -5% and +5% is applied
3. The final price is rounded to 2 decimal places
4. Change and changePercent are calculated relative to the base price

**Note:** Prices are regenerated on each request, so calling the same endpoint multiple times will return different values.

---

## Error Handling

### 404 Not Found
Occurs when requesting a stock symbol that doesn't exist.

**Example:**
```http
GET /api/stocks/INVALID
```

**Response:**
```json
{
  "error": "Stock not found"
}
```

### CORS
The API has CORS enabled, allowing requests from any origin. This is configured for development purposes.

---

## Testing Checklist

- [ ] Server is running on port 3001
- [ ] GET /api/stocks returns array of all stocks
- [ ] GET /api/stocks/:symbol returns single stock for valid symbol
- [ ] GET /api/stocks/:symbol returns 404 for invalid symbol
- [ ] GET /api/stocks/batch/:symbols returns array of requested stocks
- [ ] GET /api/stocks/batch/:symbols filters out invalid symbols
- [ ] POST /api/stocks creates a stock when body is valid
- [ ] POST /api/stocks returns 409 when symbol already exists
- [ ] DELETE /api/stocks/:symbol removes an existing stock
- [ ] DELETE /api/stocks/:symbol returns 404 when symbol is missing
- [ ] Prices are different on each request (random generation working)
- [ ] All responses are valid JSON
- [ ] CORS headers are present (for browser requests)

---

## Notes

- The API generates fake data and should not be used for real financial transactions
- Prices fluctuate randomly between -5% and +5% of base price
- All prices are in USD
- The API does not require authentication
- The API does not persist data between server restarts; POST/DELETE changes are in-memory only
