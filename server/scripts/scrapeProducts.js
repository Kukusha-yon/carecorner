import axios from 'axios';
import cheerio from 'cheerio';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Product from '../models/Product.js';

dotenv.config();

const categories = [
  {
    name: 'CISCO Switch',
    url: 'https://www.cisco.com/c/en/us/products/switches/index.html',
    selector: '.product-tile'
  },
  {
    name: 'Servers',
    url: 'https://www.dell.com/en-us/servers',
    selector: '.product-tile'
  },
  {
    name: 'Monitors',
    url: 'https://www.dell.com/en-us/monitors',
    selector: '.product-tile'
  },
  {
    name: 'Logitech World',
    url: 'https://www.logitech.com/en-us/products/audio.html',
    selector: '.product-tile'
  },
  {
    name: 'Bags',
    url: 'https://www.amazon.com/Computer-Bags/b?node=15743261',
    selector: '.product-tile'
  },
  {
    name: 'Chargers',
    url: 'https://www.amazon.com/Chargers-Power-Adapters/b?node=13983711',
    selector: '.product-tile'
  }
];

const scrapeProduct = async (category, url, selector) => {
  try {
    const response = await axios.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
      }
    });

    const $ = cheerio.load(response.data);
    const products = [];

    $(selector).each((i, element) => {
      const product = {
        name: $(element).find('.product-name').text().trim(),
        description: $(element).find('.product-description').text().trim(),
        price: parseFloat($(element).find('.product-price').text().replace(/[^0-9.-]+/g, '')),
        image: $(element).find('img').attr('src'),
        category: category,
        stock: Math.floor(Math.random() * 100) + 1,
        rating: (Math.random() * 2 + 3).toFixed(1),
        reviews: Math.floor(Math.random() * 1000),
        featured: Math.random() > 0.7,
        newArrival: Math.random() > 0.8,
        bestSeller: Math.random() > 0.9
      };

      if (product.name && product.price && product.image) {
        products.push(product);
      }
    });

    return products;
  } catch (error) {
    console.error(`Error scraping ${category}:`, error.message);
    return [];
  }
};

const seedDatabase = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // Clear existing products
    await Product.deleteMany({});
    console.log('Cleared existing products');

    // Scrape and insert products for each category
    for (const category of categories) {
      console.log(`Scraping ${category.name}...`);
      const products = await scrapeProduct(category.name, category.url, category.selector);
      
      if (products.length > 0) {
        await Product.insertMany(products);
        console.log(`Inserted ${products.length} products for ${category.name}`);
      }
    }

    console.log('Database seeding completed');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
};

seedDatabase(); 