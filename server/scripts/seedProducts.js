import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Product from '../models/Product.js';

dotenv.config();

const seedProducts = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // Clear existing products
    await Product.deleteMany({});
    console.log('Cleared existing products');

    // Insert products
    const products = await Product.insertMany([
      {
        name: 'iPhone 15 Pro Max',
        description: 'The latest iPhone with A17 Pro chip and titanium design',
        price: 1199.99,
        category: 'Phones',
        brand: 'Apple',
        stock: 50,
        images: [
          'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9',
          'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9'
        ],
        features: [
          'A17 Pro chip',
          'Titanium design',
          'Pro camera system',
          'USB-C connector'
        ],
        specifications: {
          screen: '6.7-inch Super Retina XDR display',
          processor: 'A17 Pro chip',
          storage: '256GB',
          camera: '48MP Main | 12MP Ultra Wide | 12MP Telephoto'
        }
      },
      {
        name: 'Samsung Galaxy S24 Ultra',
        description: 'The ultimate Android experience with S Pen support',
        price: 1199.99,
        category: 'Phones',
        brand: 'Samsung',
        stock: 45,
        images: [
          'https://images.unsplash.com/photo-1610945415295-d9bbf067e59c',
          'https://images.unsplash.com/photo-1610945415295-d9bbf067e59c'
        ],
        features: [
          'S Pen included',
          '200MP camera',
          'Snapdragon 8 Gen 3',
          'Titanium frame'
        ],
        specifications: {
          screen: '6.8-inch Dynamic AMOLED 2X',
          processor: 'Snapdragon 8 Gen 3',
          storage: '256GB',
          camera: '200MP Main | 12MP Ultra Wide | 50MP Telephoto'
        }
      }
    ]);

    console.log(`Inserted ${products.length} products`);
    process.exit(0);
  } catch (error) {
    console.error('Error seeding products:', error);
    process.exit(1);
  }
};

seedProducts(); 