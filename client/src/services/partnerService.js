import { api } from './api';

const API_URL = '/partners';

export const getPartners = async () => {
  try {
    const response = await api.get(API_URL);
    // Ensure we always return an array
    return Array.isArray(response.data) ? response.data : [];
  } catch (error) {
    console.error('Error fetching partners:', error);
    // Return empty array on error to prevent UI errors
    return [];
  }
};

export const createPartner = async (partnerData) => {
  try {
    const formData = new FormData();
    formData.append('name', partnerData.name);
    formData.append('logo', partnerData.logo);
    formData.append('link', partnerData.link);
    formData.append('order', partnerData.order);

    const response = await api.post(API_URL, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error creating partner:', error);
    throw error;
  }
};

export const updatePartner = async (id, partnerData) => {
  try {
    const formData = new FormData();
    formData.append('name', partnerData.name);
    if (partnerData.logo) {
      formData.append('logo', partnerData.logo);
    }
    formData.append('link', partnerData.link);
    formData.append('order', partnerData.order);

    const response = await api.put(`${API_URL}/${id}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error updating partner:', error);
    throw error;
  }
};

export const deletePartner = async (id) => {
  try {
    const response = await api.delete(`${API_URL}/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error deleting partner:', error);
    throw error;
  }
}; 