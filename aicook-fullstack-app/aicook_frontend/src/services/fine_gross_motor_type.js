import api from './api';

export const getFineGrossMotorType = () => api.get("/api/fine_gross_motor_types/");
export const getFineGrossMotorTypeByMotor = (motor_development_types_id) => api.get(`/api/fine_gross_motor_types/by-motor_development_type/${motor_development_types_id}/`);