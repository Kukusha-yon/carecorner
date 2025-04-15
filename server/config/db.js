import dotenv from 'dotenv';
dotenv.config();

import mongoose from 'mongoose';

const connectDB = async () => {
  try {
    console.log('Attempting to connect to MongoDB...');
    
    // Check if MONGODB_URI is defined
    if (!process.env.MONGODB_URI) {
      console.error('MONGODB_URI is not defined in environment variables');
      // Don't throw an error, just log it and continue
      // This allows the server to start even if MongoDB connection fails
      return;
    }
    
    console.log('MongoDB URI:', process.env.MONGODB_URI ? 'URI is defined' : 'URI is undefined');
    
    const conn = await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
    });

    console.log(`MongoDB Connected: ${conn.connection.host}`);
    console.log('Database name:', conn.connection.name);
    console.log('MongoDB connection state:', conn.connection.readyState);
    
    // List all collections in the database
    const collections = await conn.connection.db.listCollections().toArray();
    console.log('Collections in database:', collections.map(c => c.name));
    
    // Check if the products collection exists
    const productsCollection = collections.find(c => c.name === 'products');
    console.log('Products collection exists:', !!productsCollection);
    
    // If the products collection exists, count the documents
    if (productsCollection) {
      const count = await conn.connection.db.collection('products').countDocuments();
      console.log('Number of products:', count);
    }

    // Handle connection errors after initial connection
    mongoose.connection.on('error', (err) => {
      console.error('MongoDB connection error:', err);
      console.error('Error details:', {
        name: err.name,
        message: err.message,
        code: err.code,
        codeName: err.codeName
      });
      setTimeout(connectDB, 5000);
    });

    mongoose.connection.on('disconnected', () => {
      console.log('MongoDB disconnected. Attempting to reconnect...');
      setTimeout(connectDB, 5000);
    });

    mongoose.connection.on('reconnected', () => {
      console.log('MongoDB reconnected');
    });

    // Handle process termination
    process.on('SIGINT', async () => {
      try {
        await mongoose.connection.close();
        console.log('MongoDB connection closed through app termination');
        process.exit(0);
      } catch (err) {
        console.error('Error closing MongoDB connection:', err);
        process.exit(1);
      }
    });

    return conn;
  } catch (error) {
    console.error('MongoDB connection error:', error);
    // Don't throw the error, just log it and continue
    // This allows the server to start even if MongoDB connection fails
  }
};

export default connectDB; 