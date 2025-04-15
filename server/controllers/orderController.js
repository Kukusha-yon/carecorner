import Order from '../models/Order.js';
import Product from '../models/Product.js';
import NewArrival from '../models/NewArrival.js';
import User from '../models/User.js';
import { validationResult } from 'express-validator';

// Create order
export const createOrder = async (req, res) => {
  try {
    console.log('Received order request:', {
      body: req.body,
      user: req.user,
      headers: req.headers
    });

    // Check if user is authenticated
    if (!req.user || !req.user._id) {
      return res.status(401).json({ message: 'Authentication required' });
    }

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      console.log('Validation errors:', errors.array());
      return res.status(400).json({ errors: errors.array() });
    }

    const { items, shippingDetails, totalAmount } = req.body;
    console.log('Order data:', { items, shippingDetails, totalAmount });

    // Validate required fields
    if (!items || !items.length || !shippingDetails || !totalAmount) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    // Verify stock and calculate total
    let calculatedTotal = 0;
    let processedItems = [];
    
    for (const item of items) {
      // First try to find the product in the Product collection
      let product = await Product.findById(item.product);
      console.log('Checking product:', { productId: item.product, product });
      
      let productType = 'product';
      
      // If not found in Product collection, try NewArrival collection
      if (!product) {
        console.log('Product not found in Product collection, checking NewArrival collection');
        product = await NewArrival.findById(item.product);
        console.log('NewArrival result:', product);
        if (product) {
          productType = 'newArrival';
        }
      }
      
      if (!product) {
        return res.status(404).json({ message: `Product ${item.product} not found in either collection` });
      }
      
      // For NewArrival products, we don't have stock tracking, so we'll assume it's in stock
      if (productType === 'product' && product.stock < item.quantity) {
        return res.status(400).json({ message: `Insufficient stock for ${product.name}` });
      }
      
      calculatedTotal += product.price * item.quantity;
      
      // Add the item with productType to processedItems
      processedItems.push({
        ...item,
        productType
      });
    }

    console.log('Calculated total:', calculatedTotal);

    // Verify total amount matches
    if (Math.abs(calculatedTotal - totalAmount) > 0.01) {
      console.log('Total mismatch:', { calculatedTotal, receivedTotal: totalAmount });
      return res.status(400).json({ message: 'Total amount mismatch' });
    }

    // Create order
    const order = new Order({
      user: req.user._id,
      items: processedItems,
      totalAmount,
      shippingDetails,
      paymentMethod: req.body.paymentMethod,
      status: 'pending'
    });

    console.log('Created order object:', order);

    // Update product stock (only for Product collection items)
    for (const item of processedItems) {
      const product = await Product.findById(item.product);
      if (product) {
        await Product.findByIdAndUpdate(item.product, {
          $inc: { stock: -item.quantity }
        });
      }
      // For NewArrival products, we don't update stock
    }

    await order.save();
    console.log('Order saved successfully:', order);
    res.status(201).json(order);
  } catch (error) {
    console.error('Order creation error:', error);
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ message: 'Token expired. Please log in again.' });
    }
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get user orders
export const getUserOrders = async (req, res) => {
  try {
    console.log('Fetching orders for user:', req.user._id);
    
    const orders = await Order.find({ user: req.user._id })
      .sort({ createdAt: -1 });

    console.log('Found orders:', orders.length);

    // Populate product details for each order's items
    const ordersWithProducts = await Promise.all(orders.map(async (order) => {
      const populatedItems = await Promise.all(order.items.map(async (item) => {
        try {
          let product;
          
          // Check which collection to use based on productType
          if (item.productType === 'newArrival') {
            product = await NewArrival.findById(item.product);
          } else {
            product = await Product.findById(item.product);
          }
          
          return {
            ...item.toObject(),
            name: product?.name || 'Product not found',
            image: product?.image || '',
            price: product?.price || 0
          };
        } catch (error) {
          console.error('Error populating product:', error);
          return {
            ...item.toObject(),
            name: 'Product not found',
            image: '',
            price: 0
          };
        }
      }));

      return {
        ...order.toObject(),
        items: populatedItems
      };
    }));

    console.log('Successfully populated orders with products');
    res.json(ordersWithProducts);
  } catch (error) {
    console.error('Error in getUserOrders:', error);
    res.status(500).json({ 
      message: 'Error fetching user orders',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// Get single order
export const getOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate('user', 'name email');

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    // Check if user is authorized to view this order
    if (req.user.role !== 'admin' && 
        (order.user._id ? order.user._id.toString() : order.user.toString()) !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to view this order' });
    }

    res.json(order);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get all orders (admin only)
export const getAllOrders = async (req, res) => {
  try {
    const { status } = req.query;
    let query = {};

    if (status) {
      query.status = status;
    }

    const orders = await Order.find(query)
      .populate('user', 'name email')
      .sort({ createdAt: -1 });

    // Populate product details for each order's items
    const ordersWithProducts = await Promise.all(orders.map(async (order) => {
      const populatedItems = await Promise.all(order.items.map(async (item) => {
        let product;
        
        // Check which collection to use based on productType
        if (item.productType === 'newArrival') {
          product = await NewArrival.findById(item.product);
        } else {
          product = await Product.findById(item.product);
        }
        
        return {
          ...item.toObject(),
          name: product?.name || 'Product not found',
          image: product?.image || '',
          price: product?.price || 0
        };
      }));

      return {
        ...order.toObject(),
        items: populatedItems
      };
    }));

    res.json(ordersWithProducts);
  } catch (error) {
    console.error('Error fetching all orders:', error);
    res.status(500).json({ 
      message: 'Error fetching orders',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// Update order status (admin only)
export const updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    order.status = status;
    await order.save();
    res.json(order);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get order statistics (admin only)
export const getOrderStats = async (req, res) => {
  try {
    const { timeRange = 'week' } = req.query;
    const now = new Date();
    let startDate;

    // Calculate start date based on timeRange
    switch (timeRange) {
      case 'week':
        startDate = new Date(now.setDate(now.getDate() - 7));
        break;
      case 'month':
        startDate = new Date(now.setMonth(now.getMonth() - 1));
        break;
      case 'year':
        startDate = new Date(now.setFullYear(now.getFullYear() - 1));
        break;
      default:
        startDate = new Date(now.setDate(now.getDate() - 7));
    }

    // Get total orders and revenue
    const totalOrders = await Order.countDocuments({
      createdAt: { $gte: startDate }
    });

    const orders = await Order.find({
      createdAt: { $gte: startDate }
    });

    const totalRevenue = orders.reduce((sum, order) => sum + order.totalAmount, 0);

    // Get orders by status
    const pendingOrders = await Order.countDocuments({
      createdAt: { $gte: startDate },
      status: 'pending'
    });

    const processingOrders = await Order.countDocuments({
      createdAt: { $gte: startDate },
      status: 'processing'
    });

    const shippedOrders = await Order.countDocuments({
      createdAt: { $gte: startDate },
      status: 'shipped'
    });

    const deliveredOrders = await Order.countDocuments({
      createdAt: { $gte: startDate },
      status: 'delivered'
    });

    const cancelledOrders = await Order.countDocuments({
      createdAt: { $gte: startDate },
      status: 'cancelled'
    });

    res.json({
      totalOrders,
      totalRevenue,
      pendingOrders,
      processingOrders,
      shippedOrders,
      deliveredOrders,
      cancelledOrders
    });
  } catch (error) {
    console.error('Error getting order statistics:', error);
    res.status(500).json({ 
      message: 'Error fetching order statistics',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// Delete order
export const deleteOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    // Check if user is authorized to delete this order
    if (req.user.role !== 'admin' && 
        (order.user._id ? order.user._id.toString() : order.user.toString()) !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to delete this order' });
    }

    // Restore product stock (only for Product collection items)
    for (const item of order.items) {
      if (item.productType === 'product') {
        await Product.findByIdAndUpdate(item.product, {
          $inc: { stock: item.quantity }
        });
      }
      // For NewArrival products, we don't update stock
    }

    await order.deleteOne();
    res.json({ message: 'Order deleted successfully' });
  } catch (error) {
    console.error('Error deleting order:', error);
    res.status(500).json({ 
      message: 'Error deleting order',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// Cancel order
export const cancelOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    // Check if user is authorized to cancel this order
    if (req.user.role !== 'admin' && 
        (order.user._id ? order.user._id.toString() : order.user.toString()) !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to cancel this order' });
    }

    // Only allow cancellation of pending orders
    if (order.status !== 'pending') {
      return res.status(400).json({ message: 'Order cannot be cancelled' });
    }

    // Restore product stock (only for Product collection items)
    for (const item of order.items) {
      if (item.productType === 'product') {
        await Product.findByIdAndUpdate(item.product, {
          $inc: { stock: item.quantity }
        });
      }
      // For NewArrival products, we don't update stock
    }

    order.status = 'cancelled';
    await order.save();
    res.json(order);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
}; 