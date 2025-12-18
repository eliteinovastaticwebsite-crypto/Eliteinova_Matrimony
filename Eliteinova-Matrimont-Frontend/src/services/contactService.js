// src/services/contactService.js
import api from '../api/axios';

export const contactService = {
  // Submit contact form
  submitContact: async (contactData) => {
    try {
      const response = await api.post('/contact', contactData);
      return response.data;
    } catch (error) {
      throw error.response?.data || { error: 'Failed to submit contact form' };
    }
  }
};