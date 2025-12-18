// src/services/serviceService.js
import api from '../api/axios';

export const serviceService = {
  // Get all active services
  getActiveServices: async () => {
    try {
      const response = await api.get('/services');
      return response.data;
    } catch (error) {
      throw error.response?.data || { error: 'Failed to fetch services' };
    }
  },

  // Get service by ID
  getServiceById: async (serviceId) => {
    try {
      const response = await api.get(`/services/${serviceId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { error: 'Failed to fetch service' };
    }
  },

  // Get featured services
  getFeaturedServices: async () => {
    try {
      const response = await api.get('/services/featured');
      return response.data;
    } catch (error) {
      throw error.response?.data || { error: 'Failed to fetch featured services' };
    }
  }
};