# CareCorner

CareCorner is an e-commerce platform for electronics products.

## Project Structure

- `client/`: Frontend React application
- `server/`: Backend Node.js/Express application

## Development

### Prerequisites

- Node.js (v18 or higher)
- npm (v8 or higher)
- MongoDB

### Client Setup

```bash
# Navigate to the client directory
cd client

# Install dependencies
npm install

# Start the development server
npm run dev
```

### Server Setup

```bash
# Navigate to the server directory
cd server

# Install dependencies
npm install

# Start the development server
npm run dev
```

## Production Deployment

### Client Deployment

```bash
# Navigate to the client directory
cd client

# Run the production build script
./build.sh

# The build output will be in the 'dist' directory
```

### Server Deployment

```bash
# Navigate to the server directory
cd server

# Run the production build script
./build.sh

# Deploy to Vercel
vercel --prod
```

## Environment Variables

### Client

Create a `.env.production` file in the client directory with the following variables:

```
VITE_API_URL=https://your-api-url.com/api
VITE_STRIPE_PUBLIC_KEY=your_stripe_public_key
VITE_APP_NAME=CareCorner
VITE_APP_DESCRIPTION=Your one-stop shop for electronics
VITE_APP_VERSION=1.0.0
```

### Server

Create a `.env.production` file in the server directory with the following variables:

```
PORT=5001
NODE_ENV=production
MONGODB_URI=your_mongodb_uri
JWT_SECRET=your_jwt_secret
JWT_EXPIRE=30d
JWT_REFRESH_SECRET=your_jwt_refresh_secret
JWT_REFRESH_EXPIRE=7d
ADMIN_EMAIL=admin@carecorner.com
ADMIN_PASSWORD=admin123
SMTP_HOST=your_smtp_host
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=your_smtp_user
SMTP_PASS=your_smtp_password
SMTP_FROM=noreply@carecorner.com
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
CLIENT_URL=https://your-client-url.com
ALPHA_VANTAGE_API_KEY=your_alpha_vantage_api_key
NEWSDATA_API_KEY=your_newsdata_api_key
```

## License

ISC 