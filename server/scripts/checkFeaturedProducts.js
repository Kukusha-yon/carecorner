import mongoose from 'mongoose';
import FeaturedProduct from '../models/FeaturedProduct.js';
import Product from '../models/Product.js';
import dotenv from 'dotenv';

dotenv.config();

const checkFeaturedProducts = async () => {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // Get all featured products
    const featuredProducts = await FeaturedProduct.find();
    console.log(`Found ${featuredProducts.length} featured products`);

    // Check each featured product
    for (const featuredProduct of featuredProducts) {
      console.log('\nChecking featured product:', {
        id: featuredProduct._id,
        title: featuredProduct.title,
        productId: featuredProduct.productId
      });

      // Check if the referenced product exists
      const product = await Product.findById(featuredProduct.productId);
      if (!product) {
        console.error('ERROR: Referenced product not found:', featuredProduct.productId);
      } else {
        console.log('Referenced product found:', {
          id: product._id,
          name: product.name
        });
      }
    }

    await mongoose.disconnect();
    console.log('\nDisconnected from MongoDB');
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
};

checkFeaturedProducts(); 