import dotenv from 'dotenv';
dotenv.config();

import mongoose from 'mongoose';

// Cache the connection to avoid creating multiple connections in serverless environment
let cachedConnection = null;

const connectDB = async () => {
  // If we already have a connection, return it
  if (cachedConnection) {
    console.log('Using cached MongoDB connection');
    return cachedConnection;
  }

  try {
    console.log('Attempting to connect to MongoDB...');
    
    // Don't log the full URI for security reasons
    const uriParts = process.env.MONGODB_URI ? process.env.MONGODB_URI.split('@') : [];
    const sanitizedUri = uriParts.length > 1 
      ? `mongodb+srv://****:****@${uriParts[1]}` 
      : 'mongodb+srv://****:****@****';
    
    console.log('MongoDB URI (sanitized):', sanitizedUri);
    
    // Check if MONGODB_URI is defined
    if (!process.env.MONGODB_URI) {
      throw new Error('MONGODB_URI environment variable is not defined');
    }
    
    const conn = await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 5000, // Reduced timeout for serverless
      socketTimeoutMS: 30000,
      maxPoolSize: 5, // Reduced pool size for serverless
      minPoolSize: 0,
      maxIdleTimeMS: 10000, // Reduced idle time for serverless
      connectTimeoutMS: 5000, // Reduced connection timeout for serverless
      retryWrites: true,
      retryReads: true
    });

    console.log(`MongoDB Connected: ${conn.connection.host}`);
    console.log('Database name:', conn.connection.name);
    console.log('MongoDB connection state:', conn.connection.readyState);
    
    // Cache the connection
    cachedConnection = conn;
    
    // Handle connection errors after initial connection
    mongoose.connection.on('error', (err) => {
      console.error('MongoDB connection error:', err);
      console.error('Error details:', {
        name: err.name,
        message: err.message,
        code: err.code,
        codeName: err.codeName
      });
      // Don't try to reconnect in serverless environment
      // Just log the error and let the function timeout
    });

    mongoose.connection.on('disconnected', () => {
      console.log('MongoDB disconnected');
      // Don't try to reconnect in serverless environment
      // Just log the disconnection and let the function timeout
    });

    return conn;
  } catch (error) {
    console.error('Error connecting to MongoDB:', error);
    console.error('Error details:', {
      name: error.name,
      message: error.message,
      code: error.code,
      codeName: error.codeName
    });
    // In serverless environment, we don't want to retry indefinitely
    // Just throw the error to be handled by the error middleware
    throw error;
  }
};

export default connectDB; 