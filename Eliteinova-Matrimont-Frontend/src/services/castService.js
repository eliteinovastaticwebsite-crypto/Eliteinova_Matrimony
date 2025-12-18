// src/services/casteService.js
import api from '../api/axios';

export const casteService = {
  // Get all castes
  async getAllCastes() {
    try {
      const response = await api.get('/api/castes');
      return response.data.castes || response.data;
    } catch (error) {
      console.error('Error fetching all castes:', error);
      throw error;
    }
  },

  // Get castes by religion
  async getCastesByReligion(religion) {
    try {
      const response = await api.get(`/api/castes/religion/${religion}`);
      return response.data.castes || response.data;
    } catch (error) {
      console.error(`Error fetching castes for religion ${religion}:`, error);
      throw error;
    }
  },

  // Get castes with profile counts
  async getCastesWithCounts() {
    try {
      const response = await api.get('/api/castes/with-counts');
      return response.data.castes || response.data;
    } catch (error) {
      console.error('Error fetching castes with counts:', error);
      throw error;
    }
  }
};