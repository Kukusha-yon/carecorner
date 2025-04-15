import express from 'express';
import cors from 'cors';

const app = express();

// Enable CORS
app.use(cors());

// Parse JSON bodies
app.use(express.json());

// Simple test endpoint
app.get('/api/test', (req, res) => {
  res.json({ message: 'API is working!' });
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'ok',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development'
  });
});

// Add a root route handler
app.get('/', (req, res) => {
  res.json({ 
    message: 'CareCorner API is running',
    status: 'ok',
    timestamp: new Date().toISOString(),
    endpoints: [
      '/api/test',
      '/api/health'
    ]
  });
});

// Start server
const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

// Export for Vercel
export default app; 