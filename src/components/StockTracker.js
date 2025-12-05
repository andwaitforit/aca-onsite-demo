import React, { useState, useEffect, useCallback, useMemo } from 'react';

export const StockTracker = () => {
  const fallbackStocks = useMemo(() => ([
    { symbol: 'SWANSON', name: 'Swanson Foods', basePrice: 45.50 },
    { symbol: 'LITTLES', name: 'Little Sebastian Memorial', basePrice: 120.00 },
    { symbol: 'PAWN', name: 'Pawn Shop', basePrice: 15.25 },
    { symbol: 'RENT', name: 'Rent-A-Swag', basePrice: 32.75 },
    { symbol: 'TOMS', name: 'Tom\'s Bistro', basePrice: 28.50 },
    { symbol: 'JJ', name: 'JJ\'s Diner', basePrice: 18.90 },
    { symbol: 'PIT', name: 'The Pit', basePrice: 22.30 },
    { symbol: 'SWEET', name: 'Sweetums', basePrice: 55.00 },
    { symbol: 'GRIZ', name: 'Gryzzl', basePrice: 95.75 },
    { symbol: 'ENT', name: 'Entertainment 720', basePrice: 0.05 }
  ]), []);

  const [availableStocks, setAvailableStocks] = useState([]);
  const [trackedStocks, setTrackedStocks] = useState([]);
  const [stockData, setStockData] = useState({});
  const [loadError, setLoadError] = useState(null);
  const [usingFallback, setUsingFallback] = useState(false);
  const [trackedLoadError, setTrackedLoadError] = useState(null);
  const API_URL = process.env.REACT_APP_API_URL 
    || (window.location.hostname === 'localhost' ? 'http://localhost:3001/api' : '/api');

  const generatePrice = useCallback((basePrice) => {
    const changePercent = (Math.random() * 10 - 5) / 100;
    return Math.round(basePrice * (1 + changePercent) * 100) / 100;
  }, []);

  const constructStockMap = useCallback((symbols) => {
    const stockMap = {};
    symbols.forEach(symbol => {
      const stock = availableStocks.find(s => s.symbol === symbol);
      if (stock) {
        stockMap[symbol] = {
          symbol: stock.symbol,
          name: stock.name,
          price: typeof stock.price === 'number' ? stock.price : generatePrice(stock.basePrice || 0),
          change: stock.change ?? (Math.random() * 10 - 5).toFixed(2),
          changePercent: stock.changePercent ?? ((Math.random() * 10 - 5) / 100).toFixed(2)
        };
      }
    });
    return stockMap;
  }, [availableStocks, generatePrice]);

  const buildStockMapFromAvailable = useCallback(() => {
    setStockData(constructStockMap(trackedStocks));
  }, [constructStockMap, trackedStocks]);

  const syncTrackedFromServer = useCallback(async () => {
    try {
      setTrackedLoadError(null);
      const response = await fetch(`${API_URL}/tracked-stocks`);
      if (!response.ok) {
        throw new Error(`Status ${response.status}`);
      }
      const data = await response.json();
      const symbols = data.map(stock => stock.symbol);
      setTrackedStocks(symbols);
      const map = {};
      data.forEach(stock => { map[stock.symbol] = stock; });
      setStockData(map);
      localStorage.setItem('trackedStocks', JSON.stringify(symbols));
    } catch (error) {
      console.error('Error fetching tracked stocks:', error);
      setTrackedLoadError('Unable to load tracked stocks from API. Showing local data.');
      const saved = localStorage.getItem('trackedStocks');
      if (saved) {
        const symbols = JSON.parse(saved);
        setTrackedStocks(symbols);
        setStockData(constructStockMap(symbols));
      } else {
        setTrackedStocks([]);
        setStockData({});
      }
    }
  }, [API_URL, constructStockMap]);

  const fetchAvailableStocks = useCallback(async () => {
    try {
      const response = await fetch(`${API_URL}/stocks`);
      if (!response.ok) {
        throw new Error(`Status ${response.status}`);
      }
      const data = await response.json();
      setAvailableStocks(data);
      setUsingFallback(false);
      setLoadError(null);
    } catch (error) {
      console.error('Error fetching stocks:', error);
      setUsingFallback(true);
      setLoadError('Unable to load stocks from the API. Showing sample data.');
      // fall back to local sample data
      const generated = fallbackStocks.map(stock => ({
        ...stock,
        price: generatePrice(stock.basePrice),
        change: (Math.random() * 10 - 5).toFixed(2),
        changePercent: ((Math.random() * 10 - 5) / 100).toFixed(2)
      }));
      setAvailableStocks(generated);
    }
  }, [API_URL, generatePrice, fallbackStocks]);

  const fetchStockData = useCallback(async () => {
    if (trackedStocks.length === 0) return;

    if (usingFallback) {
      buildStockMapFromAvailable();
      return;
    }

    try {
      const symbols = trackedStocks.join(',');
      const response = await fetch(`${API_URL}/stocks/batch/${symbols}`);
      if (!response.ok) {
        throw new Error(`Status ${response.status}`);
      }
      const data = await response.json();
      
      const stockMap = {};
      data.forEach(stock => {
        stockMap[stock.symbol] = stock;
      });
      setStockData(stockMap);
      setLoadError(null);
    } catch (error) {
      console.error('Error fetching stock data:', error);
      setUsingFallback(true);
      setLoadError('Unable to load stocks from the API. Showing sample data.');
      buildStockMapFromAvailable();
    }
  }, [API_URL, trackedStocks, usingFallback, buildStockMapFromAvailable]);

  // Fetch available stocks
  useEffect(() => {
    fetchAvailableStocks();
  }, [fetchAvailableStocks]);

  useEffect(() => {
    syncTrackedFromServer();
  }, [syncTrackedFromServer]);

  // Fetch stock data for tracked stocks
  useEffect(() => {
    if (trackedStocks.length > 0) {
      fetchStockData();
      const interval = setInterval(fetchStockData, 5000); // Update every 5 seconds
      return () => clearInterval(interval);
    }
  }, [trackedStocks, fetchStockData]);

  const addStock = async (symbol) => {
    if (trackedStocks.includes(symbol)) {
      return;
    }

    try {
      const response = await fetch(`${API_URL}/tracked-stocks`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ symbol })
      });
      if (!response.ok) {
        const data = await response.json().catch(() => ({}));
        throw new Error(data.error || `Status ${response.status}`);
      }
      const data = await response.json();
      const updated = [...trackedStocks, data.symbol];
      setTrackedStocks(updated);
      localStorage.setItem('trackedStocks', JSON.stringify(updated));
      setStockData(prev => ({ ...prev, [data.symbol]: data }));
    } catch (error) {
      console.error('Error adding tracked stock:', error);
      setTrackedLoadError('Unable to add tracked stock.');
    }
  };

  const removeStock = async (symbol) => {
    try {
      const response = await fetch(`${API_URL}/tracked-stocks/${symbol}`, {
        method: 'DELETE'
      });
      if (!response.ok) {
        const data = await response.json().catch(() => ({}));
        throw new Error(data.error || `Status ${response.status}`);
      }
      const updated = trackedStocks.filter(s => s !== symbol);
      setTrackedStocks(updated);
      localStorage.setItem('trackedStocks', JSON.stringify(updated));
      const newStockData = { ...stockData };
      delete newStockData[symbol];
      setStockData(newStockData);
    } catch (error) {
      console.error('Error removing tracked stock:', error);
      setTrackedLoadError('Unable to remove tracked stock.');
    }
  };

  const getChangeColor = (change) => {
    const numChange = parseFloat(change);
    if (numChange > 0) return '#00A86B';
    if (numChange < 0) return '#DC143C';
    return '#444E61';
  };

  const getChangeIcon = (change) => {
    const numChange = parseFloat(change);
    if (numChange > 0) return '↗';
    if (numChange < 0) return '↘';
    return '→';
  };

  return (
    <div id="main-content">
      <h1 className="main">Parks & Rec Stock Tracker</h1>
      
      <div id="form" className="stock-tracker">
        <h2>Tracked Stocks</h2>
        
        {trackedStocks.length === 0 ? (
          <p style={{ color: '#444E61', marginTop: '1rem' }}>
            No stocks tracked yet. Add stocks from the list below.
          </p>
        ) : (
          <div className="stock-list">
            {trackedStocks.map(symbol => {
              const stock = stockData[symbol];
              if (!stock) return null;
              
              return (
                <div key={symbol} className="stock-card">
                  <div className="stock-header">
                    <div>
                      <h3>{stock.symbol}</h3>
                      <p className="stock-name">{stock.name}</p>
                    </div>
                    <button 
                      className="btn-remove"
                      onClick={() => removeStock(symbol)}
                      aria-label={`Remove ${stock.name}`}
                    >
                      ×
                    </button>
                  </div>
                  <div className="stock-price">
                    <span className="price">${stock.price.toFixed(2)}</span>
                    <span 
                      className="change" 
                      style={{ color: getChangeColor(stock.change) }}
                    >
                      {getChangeIcon(stock.change)} ${Math.abs(stock.change).toFixed(2)} 
                      ({stock.changePercent > 0 ? '+' : ''}{stock.changePercent}%)
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        <h2 style={{ marginTop: '2rem' }}>Available Stocks</h2>
        {loadError && availableStocks.length === 0 && (
          <p style={{ color: '#DC143C', marginTop: '0.3rem' }}>{loadError}</p>
        )}
        <div className="available-stocks">
          {availableStocks
            .filter(stock => !trackedStocks.includes(stock.symbol))
            .map(stock => (
              <div key={stock.symbol} className="stock-card available">
                <div className="stock-header">
                  <div>
                    <h3>{stock.symbol}</h3>
                    <p className="stock-name">{stock.name}</p>
                  </div>
                  <button 
                    className="btn-add"
                    onClick={() => addStock(stock.symbol)}
                  >
                    + Add
                  </button>
                </div>
                <div className="stock-price">
                  <span className="price">${stock.price.toFixed(2)}</span>
                </div>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
};
