import api from './api';

export const getMotorDevelopmentType = () => api.get("/api/motor_development_types/");