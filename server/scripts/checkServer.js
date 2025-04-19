import axios from 'axios';
import dotenv from 'dotenv';
import mongoose from 'mongoose';

// Load environment variables
dotenv.config();

const PORT = process.env.PORT || 5001;
const HOST = 'localhost';

console.log(`Checking if server is running on ${HOST}:${PORT}...`);

const checkServer = async () => {
  console.log('Checking server health...');
  
  try {
    // Check MongoDB connection
    console.log('Checking MongoDB connection...');
    try {
      await mongoose.connect(process.env.MONGODB_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        serverSelectionTimeoutMS: 5000
      });
      console.log('✅ MongoDB connection successful');
      console.log(`Connected to: ${mongoose.connection.host}`);
      console.log(`Database: ${mongoose.connection.name}`);
    } catch (error) {
      console.error('❌ MongoDB connection failed:', error.message);
      console.error('Error details:', {
        name: error.name,
        code: error.code,
        codeName: error.codeName
      });
    }
    
    // Check environment variables
    console.log('\nChecking environment variables...');
    const requiredEnvVars = [
      'MONGODB_URI',
      'JWT_SECRET',
      'NODE_ENV',
      'CLIENT_URL'
    ];
    
    let missingEnvVars = false;
    for (const envVar of requiredEnvVars) {
      if (!process.env[envVar]) {
        console.error(`❌ Missing environment variable: ${envVar}`);
        missingEnvVars = true;
      } else {
        console.log(`✅ Environment variable ${envVar} is set`);
      }
    }
    
    if (missingEnvVars) {
      console.error('\n⚠️ Some required environment variables are missing');
    } else {
      console.log('\n✅ All required environment variables are set');
    }
    
    // Check API health endpoint
    console.log('\nChecking API health endpoint...');
    try {
      const response = await axios.get('http://localhost:5001/api/health');
      console.log('✅ API health endpoint is responding');
      console.log('Response:', response.data);
    } catch (error) {
      console.error('❌ API health endpoint check failed:', error.message);
      if (error.response) {
        console.error('Response status:', error.response.status);
        console.error('Response data:', error.response.data);
      }
    }
    
    console.log('\nServer check completed');
  } catch (error) {
    console.error('Error during server check:', error);
  } finally {
    // Close MongoDB connection
    if (mongoose.connection.readyState === 1) {
      await mongoose.connection.close();
      console.log('MongoDB connection closed');
    }
  }
};

// Run the check
checkServer(); 