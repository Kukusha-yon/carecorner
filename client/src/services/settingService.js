import { api } from './api';

// Get all app settings (key-value pairs)
export const getAppSettings = async () => {
  const response = await api.get('/settings');
  return response.data;
};

// Get a specific app setting by key
export const getAppSetting = async (key) => {
  const response = await api.get(`/settings/${key}`);
  return response.data;
};

// Update a specific app setting
export const updateAppSetting = async (key, value) => {
  const response = await api.put(`/settings/${key}`, { value });
  return response.data;
};

// Get site settings (singleton)
export const getSiteSettings = async () => {
  const response = await api.get('/admin/settings');
  return response.data;
};

// Update site settings
export const updateSiteSettings = async (data) => {
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
}; 