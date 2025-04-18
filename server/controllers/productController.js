import Product from '../models/Product.js';
import { validationResult } from 'express-validator';
import { uploadToCloudinary, deleteFromCloudinary, upload } from '../utils/cloudinary.js';
import asyncHandler from 'express-async-handler';
import mongoose from 'mongoose';
import FeaturedProduct from '../models/FeaturedProduct.js';

// @desc    Fetch all products
// @route   GET /api/products
// @access  Public
export const getProducts = asyncHandler(async (req, res) => {
  try {
    console.log('Fetching products with query:', req.query);
    console.log('Request headers:', req.headers);
    console.log('User from request:', req.user ? { id: req.user._id, role: req.user.role } : 'No user');
    
    const { category, sort, search, admin } = req.query;
    let query = {};
    
    // If admin parameter is true and user is authenticated as admin, return all products
    if (admin === 'true' && req.user && req.user.role === 'admin') {
      console.log('Admin request detected, returning all products');
      // No additional query filters for admin
    } else {
      // For non-admin requests, only return active products
      query.isActive = true;
    }
    
    if (category) {
      query.category = category;
    }
    
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }
    
    console.log('Products query:', query);
    
    let sortOption = {};
    if (sort === 'price-asc') {
      sortOption = { price: 1 };
    } else if (sort === 'price-desc') {
      sortOption = { price: -1 };
    } else if (sort === 'newest') {
      sortOption = { createdAt: -1 };
    }
    
    console.log('Sort option:', sortOption);
    
    const products = await Product.find(query).sort(sortOption);
    
    console.log(`Found ${products.length} products`);
    
    res.json(products);
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({ 
      message: 'Error fetching products',
      error: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
});

// @desc    Fetch single product
// @route   GET /api/products/:id
// @access  Public
export const getProductById = asyncHandler(async (req, res) => {
  // Check if the ID is valid
  if (!req.params.id || req.params.id === 'undefined') {
    console.log('Invalid product ID provided:', req.params.id);
    res.status(400);
    throw new Error('Invalid product ID');
  }

  // Check if the ID is a valid MongoDB ObjectId
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    console.log('Invalid MongoDB ObjectId format:', req.params.id);
    res.status(400);
    throw new Error('Invalid product ID format');
  }

  console.log('Attempting to fetch product with ID:', req.params.id);
  
  try {
    const product = await Product.findById(req.params.id);
    console.log('Product fetch result:', product);

    if (product) {
      res.json(product);
    } else {
      console.log('Product not found with ID:', req.params.id);
      res.status(404);
      throw new Error('Product not found');
    }
  } catch (error) {
    console.error('Error fetching product:', error);
    // Don't throw an error here, just send a 404 response
    res.status(404).json({ message: 'Product not found' });
  }
});

// @desc    Delete a product
// @route   DELETE /api/products/:id
// @access  Private/Admin
export const deleteProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);

  if (product) {
    // Delete images from Cloudinary
    if (product.image) {
      await deleteFromCloudinary(product.image);
    }
    if (product.galleryImages && product.galleryImages.length > 0) {
      for (const image of product.galleryImages) {
        await deleteFromCloudinary(image.url);
      }
    }

    await product.deleteOne();
    res.json({ message: 'Product removed' });
  } else {
    res.status(404);
    throw new Error('Product not found');
  }
});

// @desc    Create a product
// @route   POST /api/products
// @access  Private/Admin
export const createProduct = asyncHandler(async (req, res) => {
  const {
    name,
    sku,
    manufacturer,
    modelNumber,
    description,
    detailedDescription,
    brand,
    category,
    price,
    countInStock,
    features,
    technicalSpecs,
    dimensions,
    weight,
    warranty,
    tags,
    seoMetadata,
    isActive,
    isNewArrival,
    isBestSeller,
  } = req.body;

  // Upload main image
  let imageUrl = '';
  if (req.files && req.files.image && req.files.image[0]) {
    try {
      const result = await uploadToCloudinary(req.files.image[0]);
      imageUrl = result.secure_url;
    } catch (error) {
      console.error('Error uploading main image:', error);
      res.status(400);
      throw new Error('Error uploading main image: ' + error.message);
    }
  }

  // Upload gallery images
  const galleryImages = [];
  if (req.files && req.files.galleryImages && req.files.galleryImages.length > 0) {
    try {
      for (const file of req.files.galleryImages) {
        const result = await uploadToCloudinary(file);
        galleryImages.push({
          url: result.secure_url,
          alt: file.originalname,
          order: galleryImages.length,
        });
      }
    } catch (error) {
      console.error('Error uploading gallery images:', error);
      res.status(400);
      throw new Error('Error uploading gallery images: ' + error.message);
    }
  }

  const product = await Product.create({
    user: req.user._id,
    name,
    sku,
    manufacturer,
    modelNumber,
    description,
    detailedDescription,
    brand,
    category,
    price,
    countInStock,
    image: imageUrl,
    galleryImages,
    features: features ? JSON.parse(features) : [],
    technicalSpecs: technicalSpecs ? JSON.parse(technicalSpecs) : {},
    dimensions: dimensions ? JSON.parse(dimensions) : {},
    weight: weight ? JSON.parse(weight) : {},
    warranty: warranty ? JSON.parse(warranty) : {},
    tags: tags ? JSON.parse(tags) : [],
    seoMetadata: seoMetadata ? JSON.parse(seoMetadata) : {},
    isActive: isActive === 'true',
    isNewArrival: isNewArrival === 'true',
    isBestSeller: isBestSeller === 'true',
  });

  res.status(201).json(product);
});

// @desc    Update a product
// @route   PUT /api/products/:id
// @access  Private/Admin
export const updateProduct = asyncHandler(async (req, res) => {
  const {
    name,
    sku,
    manufacturer,
    modelNumber,
    description,
    detailedDescription,
    brand,
    category,
    price,
    countInStock,
    features,
    technicalSpecs,
    dimensions,
    weight,
    warranty,
    tags,
    seoMetadata,
    isActive,
    isFeatured,
    isNewArrival,
    isBestSeller,
  } = req.body;

  const product = await Product.findById(req.params.id);

  if (product) {
    // Handle main image update
    if (req.files && req.files.image) {
      // Delete old image if exists
      if (product.image) {
        await deleteFromCloudinary(product.image);
      }
      const result = await uploadToCloudinary(req.files.image);
      product.image = result.secure_url;
    }

    // Handle gallery images update
    if (req.files && req.files.galleryImages) {
      // Delete old gallery images
      if (product.galleryImages && product.galleryImages.length > 0) {
        for (const image of product.galleryImages) {
          await deleteFromCloudinary(image.url);
        }
      }

      const files = Array.isArray(req.files.galleryImages)
        ? req.files.galleryImages
        : [req.files.galleryImages];

      product.galleryImages = [];
      for (const file of files) {
        const result = await uploadToCloudinary(file);
        product.galleryImages.push({
          url: result.secure_url,
          alt: file.name,
          order: product.galleryImages.length,
        });
      }
    }

    // Update fields while preserving the user field
    const updatedFields = {
      name: name || product.name,
      sku: sku || product.sku,
      manufacturer: manufacturer || product.manufacturer,
      modelNumber: modelNumber || product.modelNumber,
      description: description || product.description,
      detailedDescription: detailedDescription || product.detailedDescription,
      brand: brand || product.brand,
      category: category || product.category,
      price: price || product.price,
      countInStock: countInStock || product.countInStock,
      features: features ? JSON.parse(features) : product.features,
      technicalSpecs: technicalSpecs ? JSON.parse(technicalSpecs) : product.technicalSpecs,
      dimensions: dimensions ? JSON.parse(dimensions) : product.dimensions,
      weight: weight ? JSON.parse(weight) : product.weight,
      warranty: warranty ? JSON.parse(warranty) : product.warranty,
      tags: tags ? JSON.parse(tags) : product.tags,
      seoMetadata: seoMetadata ? JSON.parse(seoMetadata) : product.seoMetadata,
      isActive: isActive === 'true',
      isFeatured: isFeatured === 'true',
      isNewArrival: isNewArrival === 'true',
      isBestSeller: isBestSeller === 'true',
      user: req.user._id // Set the user field from the authenticated request
    };

    // Update the product with all fields
    Object.assign(product, updatedFields);

    const updatedProduct = await product.save();
    res.json(updatedProduct);
  } else {
    res.status(404);
    throw new Error('Product not found');
  }
});

// @desc    Create new review
// @route   POST /api/products/:id/reviews
// @access  Private
export const createProductReview = asyncHandler(async (req, res) => {
  const { rating, comment } = req.body;

  const product = await Product.findById(req.params.id);

  if (product) {
    const alreadyReviewed = product.reviews.find(
      (r) => r.user.toString() === req.user._id.toString()
    );

    if (alreadyReviewed) {
      res.status(400);
      throw new Error('Product already reviewed');
    }

    const review = {
      name: req.user.name,
      rating: Number(rating),
      comment,
      user: req.user._id,
    };

    product.reviews.push(review);

    product.numReviews = product.reviews.length;

    product.rating =
      product.reviews.reduce((acc, item) => item.rating + acc, 0) /
      product.reviews.length;

    await product.save();
    res.status(201).json({ message: 'Review added' });
  } else {
    res.status(404);
    throw new Error('Product not found');
  }
});

// @desc    Get top rated products
// @route   GET /api/products/top
// @access  Public
export const getTopProducts = asyncHandler(async (req, res) => {
  const products = await Product.find({}).sort({ rating: -1 }).limit(5);
  res.json(products);
});

// @desc    Get featured products
// @route   GET /api/products/featured
// @access  Public
export const getFeaturedProducts = asyncHandler(async (req, res) => {
  try {
    console.log('Fetching featured products...');
    
    // Get all featured products from the FeaturedProduct collection
    const featuredProducts = await FeaturedProduct.find({ isActive: true })
      .sort({ order: 1 })
      .populate('productId')
      .limit(10);
    
    console.log('Found featured products:', featuredProducts.length);
    console.log('First featured product:', featuredProducts[0]);

    // Format the response
    const formattedProducts = featuredProducts.map(featuredProduct => {
      if (!featuredProduct.productId) {
        console.error('Featured product has no productId:', featuredProduct._id);
        return null;
      }
      
      const product = featuredProduct.productId;
      return {
        ...product.toObject(),
        _id: product._id, // Use the actual product ID as the main ID
        featuredProductId: featuredProduct._id,
        featuredTitle: featuredProduct.title,
        featuredDescription: featuredProduct.description,
        featuredImage: featuredProduct.image,
        featuredGalleryImages: featuredProduct.galleryImages,
        featuredOrder: featuredProduct.order,
        featuredButtonText: featuredProduct.buttonText,
        featuredHighlightText: featuredProduct.highlightText
      };
    }).filter(Boolean); // Remove any null values
    
    console.log('Formatted products:', formattedProducts.length);
    console.log('First formatted product:', formattedProducts[0]);
    
    res.json(formattedProducts);
  } catch (error) {
    console.error('Error in getFeaturedProducts:', error);
    console.error('Error stack:', error.stack);
    res.status(500).json({ 
      message: 'Error fetching featured products',
      error: error.message,
      stack: error.stack
    });
  }
});

// @desc    Get best sellers
// @route   GET /api/products/best-sellers
// @access  Public
export const getBestSellers = asyncHandler(async (req, res) => {
  const products = await Product.find({ isBestSeller: true })
    .sort({ rating: -1 })
    .limit(10);
  res.json(products);
});

// @desc    Search products
// @route   GET /api/products/search
// @access  Public
export const searchProducts = asyncHandler(async (req, res) => {
  const { q } = req.query;
  console.log('Search query received:', q);
  
  // First, let's check if there are any products in the database
  const totalProducts = await Product.countDocuments({});
  console.log('Total products in database:', totalProducts);
  
  // Get all products to check their categories
  const allProducts = await Product.find({}).select('category name');
  console.log('Available categories:', [...new Set(allProducts.map(p => p.category))]);
  
  const searchQuery = {
    $or: [
      { name: { $regex: q, $options: 'i' } },
      { description: { $regex: q, $options: 'i' } },
      { brand: { $regex: q, $options: 'i' } },
      { category: { $regex: q, $options: 'i' } },
      // Add more lenient search for category
      { category: { $regex: q.replace(/s$/, ''), $options: 'i' } }, // Try without 's'
      { category: { $regex: q + 's', $options: 'i' } }, // Try with 's'
    ],
  };
  
  console.log('Search query:', JSON.stringify(searchQuery, null, 2));
  
  const products = await Product.find(searchQuery).sort({ createdAt: -1 });
  console.log('Number of products found:', products.length);
  
  if (products.length > 0) {
    console.log('First product found:', {
      name: products[0].name,
      category: products[0].category,
      description: products[0].description
    });
  } else {
    console.log('No products found matching the search criteria');
  }
  
  res.json(products);
});

// @desc    Get products by category
// @route   GET /api/products/category/:category
// @access  Public
export const getProductsByCategory = async (req, res) => {
  try {
    const products = await Product.find({ category: req.params.category });
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
}; 