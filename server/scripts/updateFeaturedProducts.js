import mongoose from 'mongoose';
import FeaturedProduct from '../models/FeaturedProduct.js';
import Product from '../models/Product.js';
import dotenv from 'dotenv';

dotenv.config();

const updateFeaturedProducts = async () => {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // Get all products
    const products = await Product.find();
    console.log(`Found ${products.length} products`);

    // Get all featured products
    const featuredProducts = await FeaturedProduct.find();
    console.log(`Found ${featuredProducts.length} featured products`);

    // Update each featured product with a valid product reference
    for (let i = 0; i < featuredProducts.length; i++) {
      const featuredProduct = featuredProducts[i];
      const product = products[i % products.length]; // Cycle through available products

      console.log('\nUpdating featured product:', {
        id: featuredProduct._id,
        title: featuredProduct.title,
        newProductId: product._id,
        newProductName: product.name
      });

      featuredProduct.productId = product._id;
      await featuredProduct.save();
    }

    console.log('\nAll featured products updated successfully');

    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
};

updateFeaturedProducts(); 