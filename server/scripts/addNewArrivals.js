import mongoose from 'mongoose';
import dotenv from 'dotenv';
import NewArrival from '../models/NewArrival.js';
import connectDB from '../config/db.js';

dotenv.config();

const newArrivals = [
  {
    name: "Apple MacBook Air M3",
    description: "The latest MacBook Air with M3 chip - faster than ever",
    detailedDescription: "The new MacBook Air with M3 chip offers exceptional performance and battery life in Apple's thinnest and lightest notebook design.",
    image: "https://placehold.co/800x600?text=MacBook+Air+M3",
    price: 1199.99,
    category: "Laptops",
    isActive: true,
    startDate: new Date('2023-10-30'),
    endDate: new Date('2023-12-31'),
    features: [
      "Apple M3 chip with 8-core CPU and 10-core GPU",
      "16GB unified memory",
      "512GB SSD storage",
      "Liquid Retina display with True Tone",
      "Up to 18 hours battery life"
    ],
    specifications: {
      "Processor": "Apple M3",
      "Memory": "16GB",
      "Storage": "512GB SSD",
      "Display": "13.6-inch Liquid Retina",
      "Battery": "Up to 18 hours"
    }
  },
  {
    name: "Dell XPS 15 (2023)",
    description: "Premium laptop with OLED display and Intel Core i9",
    detailedDescription: "The Dell XPS 15 combines exceptional performance with a stunning OLED display in a premium, compact design.",
    image: "https://placehold.co/800x600?text=Dell+XPS+15",
    price: 2499.99,
    category: "Laptops",
    isActive: true,
    startDate: new Date('2023-09-15'),
    endDate: new Date('2023-12-31'),
    features: [
      "13th Gen Intel Core i9 processor",
      "32GB DDR5 RAM",
      "1TB NVMe SSD",
      "15.6-inch 3.5K OLED touch display",
      "NVIDIA GeForce RTX 4070 graphics"
    ],
    specifications: {
      "Processor": "Intel Core i9-13900H",
      "Memory": "32GB DDR5-4800MHz",
      "Storage": "1TB M.2 PCIe NVMe SSD",
      "Display": "15.6-inch 3.5K (3456 x 2160) OLED",
      "Graphics": "NVIDIA GeForce RTX 4070"
    }
  },
  {
    name: "Samsung Galaxy S24 Ultra",
    description: "Samsung's latest flagship with advanced AI capabilities",
    detailedDescription: "The Galaxy S24 Ultra features Samsung's most advanced camera system ever, powered by Galaxy AI for incredible photos and videos.",
    image: "https://placehold.co/800x600?text=Galaxy+S24+Ultra",
    price: 1299.99,
    category: "Smartphones",
    isActive: true,
    startDate: new Date('2023-11-01'),
    endDate: new Date('2024-01-31'),
    features: [
      "200MP main camera with advanced night mode",
      "Snapdragon 8 Gen 3 processor",
      "12GB RAM and 512GB storage",
      "6.8-inch Dynamic AMOLED 2X display",
      "5000mAh battery with 45W fast charging"
    ],
    specifications: {
      "Processor": "Snapdragon 8 Gen 3",
      "Memory": "12GB LPDDR5X",
      "Storage": "512GB UFS 4.0",
      "Display": "6.8-inch Dynamic AMOLED 2X",
      "Battery": "5000mAh"
    }
  }
];

const seedNewArrivals = async () => {
  try {
    await connectDB();
    console.log('Connected to MongoDB');
    
    // Clear existing new arrivals
    await NewArrival.deleteMany({});
    console.log('Existing new arrivals cleared');

    // Add new arrivals
    await NewArrival.insertMany(newArrivals);
    console.log('New arrivals added successfully');

    process.exit(0);
  } catch (error) {
    console.error(`Error adding new arrivals: ${error.message}`);
    process.exit(1);
  }
};

seedNewArrivals(); 