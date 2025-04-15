# CareCorner

CareCorner is a modern e-commerce platform for electronics and gadgets.

## Features

- User authentication and authorization
- Product browsing and searching
- Shopping cart functionality
- Order management
- Admin dashboard
- Responsive design for all devices

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- MongoDB

### Installation

1. Clone the repository
```bash
git clone https://github.com/yourusername/carecorner.git
cd carecorner
```

2. Install dependencies
```bash
# Install server dependencies
cd server
npm install

# Install client dependencies
cd ../client
npm install
```

3. Set up environment variables
   - Create a `.env` file in the server directory with the following variables:
   ```
   PORT=5001
   MONGODB_URI=your_mongodb_uri
   JWT_SECRET=your_jwt_secret
   ```
   
   - Create a `.env` file in the client directory with the following variables:
   ```
   VITE_API_URL=http://localhost:5001/api
   VITE_ALPHA_VANTAGE_API_KEY=your_alpha_vantage_api_key
   VITE_NEWS_API_KEY=your_news_api_key
   ```

4. Start the development servers
```bash
# Start the server
cd server
npm run dev

# Start the client
cd ../client
npm run dev
```

5. Open your browser and navigate to `http://localhost:3000`

## API Keys

### Alpha Vantage API
To get real-time stock data, you need an API key from Alpha Vantage:
1. Sign up at [Alpha Vantage](https://www.alphavantage.co/support/#api-key)
2. Copy your API key
3. Add it to your client `.env` file as `VITE_ALPHA_VANTAGE_API_KEY`

### News API
To get technology news, you need an API key from NewsData.io:
1. Sign up at [NewsData.io](https://newsdata.io/)
2. Copy your API key
3. Add it to your client `.env` file as `VITE_NEWS_API_KEY`

## Deployment

### Server
The server can be deployed to any platform that supports Node.js applications, such as Heroku, Vercel, or AWS.

### Client
The client can be deployed to any static hosting service, such as Netlify, Vercel, or GitHub Pages.

## License

This project is licensed under the MIT License - see the LICENSE file for details. 