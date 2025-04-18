import http from 'http';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const PORT = process.env.PORT || 5001;
const HOST = 'localhost';

console.log(`Checking if server is running on ${HOST}:${PORT}...`);

const options = {
  hostname: HOST,
  port: PORT,
  path: '/api/health',
  method: 'GET',
  timeout: 5000
};

const req = http.request(options, (res) => {
  console.log(`Server is running! Status code: ${res.statusCode}`);
  
  let data = '';
  
  res.on('data', (chunk) => {
    data += chunk;
  });
  
  res.on('end', () => {
    try {
      const jsonData = JSON.parse(data);
      console.log('Server response:', jsonData);
    } catch (e) {
      console.log('Raw response:', data);
    }
  });
});

req.on('error', (error) => {
  console.error('Server is not running or not accessible:');
  console.error(error.message);
  
  if (error.code === 'ECONNREFUSED') {
    console.log('\nPossible solutions:');
    console.log('1. Make sure the server is running with: npm run server');
    console.log('2. Check if the server is running on the correct port (5001)');
    console.log('3. Check if there are any firewall issues blocking the connection');
  }
});

req.on('timeout', () => {
  console.error('Request timed out. Server might be running but not responding.');
  req.destroy();
});

req.end(); 