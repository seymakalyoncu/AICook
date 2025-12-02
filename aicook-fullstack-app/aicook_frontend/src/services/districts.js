import api from './api';

export const getDistricts = (city_id) => api.get(`/api/districts/by-city/${city_id}/`);