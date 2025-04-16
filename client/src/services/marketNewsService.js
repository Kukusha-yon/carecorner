import axios from 'axios';

// Use a hardcoded API key
const API_KEY = 'M7D09RV5M7LUPML3';
const BASE_URL = 'https://www.alphavantage.co/query';

// Cache for API responses to reduce API calls
const cache = new Map();
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

// Helper function to check cache
const getCachedData = (key) => {
  const cached = cache.get(key);
  if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
    return cached.data;
  }
  return null;
};

// Helper function to set cache
const setCachedData = (key, data) => {
  cache.set(key, {
    data,
    timestamp: Date.now()
  });
};

// Get stock data
export const getStockData = async (symbol = 'AAPL') => {
  try {
    // Check cache first
    const cacheKey = `stock_${symbol}`;
    const cachedData = getCachedData(cacheKey);
    if (cachedData) {
      console.log('Using cached stock data for:', symbol);
      return cachedData;
    }

    console.log('Fetching stock data for symbol:', symbol);
    const response = await axios.get(`${BASE_URL}`, {
      params: {
        function: 'TIME_SERIES_DAILY',
        symbol,
        apikey: API_KEY,
        outputsize: 'compact'
      }
    });

    console.log('Stock data response:', response.data);

    if (!response.data) {
      throw new Error('No data received from API');
    }

    // Check for rate limit message
    if (response.data.Information && response.data.Information.includes('API call frequency')) {
      console.warn('Rate limit reached:', response.data.Information);
      const mockData = getMockStockData();
      setCachedData(cacheKey, mockData);
      return mockData;
    }

    if (response.data.Note) {
      console.warn('API Note:', response.data.Note);
      const mockData = getMockStockData();
      setCachedData(cacheKey, mockData);
      return mockData;
    }

    if (response.data['Error Message']) {
      console.error('API Error:', response.data['Error Message']);
      const mockData = getMockStockData();
      setCachedData(cacheKey, mockData);
      return mockData;
    }

    if (!response.data['Time Series (Daily)']) {
      console.warn('Invalid stock data structure received');
      const mockData = getMockStockData();
      setCachedData(cacheKey, mockData);
      return mockData;
    }

    // Cache the successful response
    setCachedData(cacheKey, response.data);
    return response.data;
  } catch (error) {
    console.error('Error fetching stock data:', error);
    if (error.response) {
      console.error('API Response:', error.response.data);
      console.error('API Status:', error.response.status);
    }
    const mockData = getMockStockData();
    setCachedData(cacheKey, mockData);
    return mockData;
  }
};

// Mock stock data for fallback
const getMockStockData = () => {
  const today = new Date();
  const mockData = {
    'Time Series (Daily)': {}
  };
  
  // Generate 30 days of mock data
  for (let i = 0; i < 30; i++) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    const dateStr = date.toISOString().split('T')[0];
    
    // Generate a random price between 150 and 200
    const basePrice = 175;
    const randomFactor = 0.1; // 10% variation
    const price = basePrice + (Math.random() * 2 - 1) * basePrice * randomFactor;
    
    mockData['Time Series (Daily)'][dateStr] = {
      '1. open': price.toFixed(2),
      '2. high': (price * 1.02).toFixed(2),
      '3. low': (price * 0.98).toFixed(2),
      '4. close': (price * 1.01).toFixed(2),
      '5. volume': Math.floor(Math.random() * 10000000).toString()
    };
  }
  
  return mockData;
};

// Get company overview
export const getCompanyOverview = async (symbol) => {
  try {
    // Check cache first
    const cacheKey = `overview_${symbol}`;
    const cachedData = getCachedData(cacheKey);
    if (cachedData) {
      console.log('Using cached company overview for:', symbol);
      return cachedData;
    }

    const response = await axios.get(`${BASE_URL}`, {
      params: {
        function: 'OVERVIEW',
        symbol,
        apikey: API_KEY
      }
    });

    if (!response.data || Object.keys(response.data).length === 0) {
      throw new Error('Invalid company overview data received');
    }

    // Cache the successful response
    setCachedData(cacheKey, response.data);
    return response.data;
  } catch (error) {
    console.error('Error fetching company overview:', error);
    throw new Error('Failed to fetch company overview');
  }
};

// Get news data
export const getNewsData = async (symbol = 'AAPL') => {
  try {
    // Check cache first
    const cacheKey = `news_${symbol}`;
    const cachedData = getCachedData(cacheKey);
    if (cachedData) {
      console.log('Using cached news data for:', symbol);
      return cachedData;
    }

    console.log('Fetching news data for symbol:', symbol);
    const response = await axios.get(`${BASE_URL}`, {
      params: {
        function: 'NEWS_SENTIMENT',
        tickers: symbol,
        apikey: API_KEY,
        topics: 'technology,earnings,forex,crypto'
      }
    });

    console.log('News data response:', response.data);

    if (!response.data) {
      throw new Error('No data received from API');
    }

    // Check for rate limit message
    if (response.data.Information && response.data.Information.includes('API call frequency')) {
      console.warn('Rate limit reached:', response.data.Information);
      const mockData = getMockNewsData();
      setCachedData(cacheKey, mockData);
      return mockData;
    }

    if (response.data.Note) {
      console.warn('API Note:', response.data.Note);
      const mockData = getMockNewsData();
      setCachedData(cacheKey, mockData);
      return mockData;
    }

    if (response.data['Error Message']) {
      console.error('API Error:', response.data['Error Message']);
      const mockData = getMockNewsData();
      setCachedData(cacheKey, mockData);
      return mockData;
    }

    if (!response.data.feed) {
      console.warn('Invalid news data structure received');
      const mockData = getMockNewsData();
      setCachedData(cacheKey, mockData);
      return mockData;
    }

    // Cache the successful response
    setCachedData(cacheKey, response.data.feed);
    return response.data.feed;
  } catch (error) {
    console.error('Error fetching news data:', error);
    if (error.response) {
      console.error('API Response:', error.response.data);
      console.error('API Status:', error.response.status);
    }
    const mockData = getMockNewsData();
    setCachedData(cacheKey, mockData);
    return mockData;
  }
};

// Mock news data for fallback
const getMockNewsData = () => {
  const mockNews = [
    {
      title: 'Apple Announces New iPhone with Advanced AI Features',
      description: 'Apple has unveiled its latest iPhone with groundbreaking AI capabilities that promise to revolutionize mobile computing.',
      link: 'https://example.com/news/1',
      pubDate: new Date().toISOString(),
      image: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&q=80'
    },
    {
      title: 'Tech Industry Sees Surge in Semiconductor Demand',
      description: 'Global semiconductor manufacturers are ramping up production to meet the increasing demand from various tech sectors.',
      link: 'https://example.com/news/2',
      pubDate: new Date(Date.now() - 86400000).toISOString(), // 1 day ago
      image: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&q=80'
    },
    {
      title: 'New Breakthrough in Quantum Computing Research',
      description: 'Scientists have achieved a significant milestone in quantum computing, bringing practical applications closer to reality.',
      link: 'https://example.com/news/3',
      pubDate: new Date(Date.now() - 172800000).toISOString(), // 2 days ago
      image: 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?auto=format&fit=crop&q=80'
    },
    {
      title: 'Tech Giants Collaborate on Open AI Standards',
      description: 'Major technology companies are joining forces to establish industry standards for artificial intelligence development.',
      link: 'https://example.com/news/4',
      pubDate: new Date(Date.now() - 259200000).toISOString(), // 3 days ago
      image: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&q=80'
    }
  ];
  
  return mockNews;
};

// Get global news
export const getGlobalNews = async () => {
  try {
    // Check cache first
    const cacheKey = 'global_news';
    const cachedData = getCachedData(cacheKey);
    if (cachedData) {
      console.log('Using cached global news data');
      return cachedData;
    }

    const response = await axios.get(`${BASE_URL}`, {
      params: {
        function: 'NEWS_SENTIMENT',
        apikey: API_KEY,
        topics: 'technology,earnings,forex,crypto'
      }
    });

    if (!response.data || !response.data.feed) {
      throw new Error('Invalid global news data received');
    }

    // Cache the successful response
    setCachedData(cacheKey, response.data.feed);
    return response.data.feed;
  } catch (error) {
    console.error('Error fetching global news:', error);
    return getMockNewsData();
  }
};

// Process stock data for chart
export const processStockDataForChart = (timeSeriesData) => {
  if (!timeSeriesData || !timeSeriesData['Time Series (Daily)']) {
    console.warn('Invalid time series data structure');
    return [];
  }

  const dailyData = timeSeriesData['Time Series (Daily)'];
  return Object.entries(dailyData)
    .map(([date, values]) => ({
      date,
      open: parseFloat(values['1. open']),
      high: parseFloat(values['2. high']),
      low: parseFloat(values['3. low']),
      close: parseFloat(values['4. close']),
      volume: parseInt(values['5. volume'])
    }))
    .sort((a, b) => new Date(a.date) - new Date(b.date));
}; 