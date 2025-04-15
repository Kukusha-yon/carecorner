import { api } from './api';

const API_URL = '/featured-products';

export const getFeaturedProducts = async (includeInactive = false) => {
  try {
    const response = await api.get(`${API_URL}${includeInactive ? '?includeInactive=true' : ''}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching featured products:', error);
    throw error;
  }
};

export const getFeaturedProduct = async (id) => {
  try {
    const response = await api.get(`${API_URL}/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching featured product:', error);
    throw error;
  }
};

export const getFeaturedProductByProductId = async (productId) => {
  try {
    const response = await api.get(`${API_URL}/product/${productId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching featured product by product ID:', error);
    throw error;
  }
};

export const createFeaturedProduct = async (formData) => {
  try {
    // Check if formData is already a FormData object
    if (formData instanceof FormData) {
      // Ensure required fields are present
      if (!formData.get('title') || !formData.get('description') || !formData.get('link') || !formData.get('productId')) {
        throw new Error('All required fields must be provided');
      }
      
      // Ensure image is present
      if (!formData.get('image')) {
        throw new Error('Image is required');
      }
      
      const response = await api.post(API_URL, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      return response.data;
    } else {
      // If formData is a plain object, convert it to FormData
      const data = new FormData();
      
      // Add required fields
      data.append('title', formData.title || '');
      data.append('description', formData.description || '');
      data.append('link', formData.link || '');
      data.append('productId', formData.productId || '');
      
      // Add optional fields if they exist
      if (formData.detailedDescription) {
        data.append('detailedDescription', formData.detailedDescription);
      }
      if (formData.order !== undefined) {
        data.append('order', formData.order);
      }
      if (formData.isActive !== undefined) {
        data.append('isActive', formData.isActive);
      }
      if (formData.startDate) {
        data.append('startDate', formData.startDate);
      }
      if (formData.endDate) {
        data.append('endDate', formData.endDate);
      }
      if (formData.buttonText) {
        data.append('buttonText', formData.buttonText);
      }
      if (formData.highlightText) {
        data.append('highlightText', formData.highlightText);
      }
      if (formData.features) {
        data.append('features', JSON.stringify(formData.features));
      }
      if (formData.specifications) {
        data.append('specifications', JSON.stringify(formData.specifications));
      }
      if (formData.seoMetadata) {
        data.append('seoMetadata', JSON.stringify(formData.seoMetadata));
      }
      
      // Add image files
      if (formData.image) {
        data.append('image', formData.image);
      }
      
      // Add gallery images
      if (formData.galleryImages && formData.galleryImages.length > 0) {
        formData.galleryImages.forEach(image => {
          data.append('galleryImages', image);
        });
      }
      
      // Validate required fields
      if (!data.get('title') || !data.get('description') || !data.get('link') || !data.get('productId') || !data.get('image')) {
        throw new Error('All required fields must be provided');
      }
      
      const response = await api.post(API_URL, data, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      return response.data;
    }
  } catch (error) {
    console.error('Error creating featured product:', error);
    throw new Error(error.response?.data?.message || error.message || 'Failed to create featured product');
  }
};

export const updateFeaturedProduct = async (id, formData) => {
  try {
    const response = await api.put(`${API_URL}/${id}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error updating featured product:', error);
    throw new Error(error.response?.data?.message || 'Failed to update featured product');
  }
};

export const deleteFeaturedProduct = async (id) => {
  try {
    const response = await api.delete(`${API_URL}/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error deleting featured product:', error);
    throw new Error(error.response?.data?.message || 'Failed to delete featured product');
  }
};

export const updateFeaturedProductOrder = async (id, order) => {
  try {
    const response = await api.put(`${API_URL}/${id}/order`, { order });
    return response.data;
  } catch (error) {
    console.error('Error updating featured product order:', error);
    throw new Error(error.response?.data?.message || 'Failed to update featured product order');
  }
}; 