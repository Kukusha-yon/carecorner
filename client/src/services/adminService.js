import api from './api';

// Remove mock data and use real data from the backend
export const getDashboardData = async () => {
  try {
    const response = await api.get('/admin/dashboard');
    return response.data;
  } catch (error) {
    console.error('Error fetching dashboard data:', error);
    throw new Error(error.response?.data?.message || 'Failed to fetch dashboard data');
  }
};

export const getStats = async (timeRange = 'week') => {
  try {
    const response = await api.get(`/admin/stats?timeRange=${timeRange}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching stats:', error);
    throw new Error(error.response?.data?.message || 'Failed to fetch stats');
  }
};

export const getAnalytics = async (timeRange = 'week') => {
  try {
    const response = await api.get(`/admin/analytics?timeRange=${timeRange}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching analytics:', error);
    throw new Error(error.response?.data?.message || 'Failed to fetch analytics');
  }
};

export const getUsers = async () => {
  try {
    const response = await api.get('/admin/users');
    return response.data;
  } catch (error) {
    console.error('Error fetching users:', error);
    throw new Error(error.response?.data?.message || 'Failed to fetch users');
  }
};

export const updateUserStatus = async (userId, status) => {
  try {
    const response = await api.patch(`/admin/users/${userId}/status`, { status });
    return response.data;
  } catch (error) {
    console.error('Error updating user status:', error);
    throw new Error(error.response?.data?.message || 'Failed to update user status');
  }
};

export const updateUserRole = async (userId, role) => {
  try {
    const response = await api.patch(`/admin/users/${userId}/role`, { role });
    return response.data;
  } catch (error) {
    console.error('Error updating user role:', error);
    throw new Error(error.response?.data?.message || 'Failed to update user role');
  }
};

export const deleteUser = async (userId) => {
  try {
    const response = await api.delete(`/admin/users/${userId}`);
    return response.data;
  } catch (error) {
    console.error('Error deleting user:', error);
    throw new Error(error.response?.data?.message || 'Failed to delete user');
  }
};

export const getOrderStats = async (timeRange = 'week') => {
  try {
    const response = await api.get(`/admin/orders/stats?timeRange=${timeRange}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching order stats:', error);
    throw new Error(error.response?.data?.message || 'Failed to fetch order stats');
  }
};

export const getProductStats = async (timeRange = 'week') => {
  try {
    const response = await api.get(`/admin/products/stats?timeRange=${timeRange}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching product stats:', error);
    throw new Error(error.response?.data?.message || 'Failed to fetch product stats');
  }
};

export const getCustomerStats = async (timeRange = 'week') => {
  try {
    const response = await api.get(`/admin/customers/stats?timeRange=${timeRange}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching customer stats:', error);
    throw new Error(error.response?.data?.message || 'Failed to fetch customer stats');
  }
};

export const getSettings = async () => {
  try {
    const response = await api.get('/admin/settings');
    return response.data;
  } catch (error) {
    console.error('Error fetching settings:', error);
    throw new Error(error.response?.data?.message || 'Failed to fetch settings');
  }
};

export const updateSettings = async (data) => {
  try {
    const formData = new FormData();
    Object.keys(data).forEach(key => {
      if (data[key] !== null) {
        formData.append(key, data[key]);
      }
    });
    const response = await api.put('/admin/settings', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error updating settings:', error);
    throw new Error(error.response?.data?.message || 'Failed to update settings');
  }
};

export const createUser = async (userData) => {
  try {
    const response = await api.post('/admin/users', userData);
    return response.data;
  } catch (error) {
    console.error('Error creating user:', error);
    throw new Error(error.response?.data?.message || 'Failed to create user');
  }
};

// Get dashboard statistics
export const getDashboardStats = async () => {
  try {
    const response = await api.get('/admin/dashboard/stats');
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to fetch dashboard statistics');
  }
};

// Get recent orders
export const getRecentOrders = async () => {
  try {
    const response = await api.get('/admin/orders/recent');
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to fetch recent orders');
  }
};

// Get sales data
export const getSalesData = async (period = 'week') => {
  try {
    const response = await api.get(`/admin/sales?period=${period}`);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to fetch sales data');
  }
};

// Get customer data
export const getCustomerData = async () => {
  try {
    const response = await api.get('/admin/customers');
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to fetch customer data');
  }
}; 