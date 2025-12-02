import api from './api';

export const authLogin = (data) => api.post("/api/accounts/token/", data);
export const authRegister = (data) => api.post("/api/accounts/register/", data);
export const verifyEmail = (uid,token) => api.get(`/api/accounts/verify-email/?uid=${uid}&token=${token}`)
export const resetPasswordRequest = (data) => api.post(`/api/accounts/request-reset/`, data)
export const resetPasswordConfirm = (data) => api.post(`/api/accounts/password-reset-confirm/`, data)
export const userInfo = (token, user_id = null) => api.get('/api/accounts/userinfo', {headers: { Authorization: `Bearer ${token}`}, params: {user_id: user_id}})

export const babysitterVerifyEmail = (uid,token) => api.get(`/api/accounts/babysitters/verify-email/?uid=${uid}&token=${token}`)
export const changeUserStatus = (user_id, status,token) => api.get('/api/accounts/user-change-status', {headers: { Authorization: `Bearer ${token}`}, params: {user_id: user_id, status:status?'True':'False'}})

export const updateUser = (uid, data, token) => api.put(`/api/accounts/updateUser/${uid}/`, data, {headers: { Authorization: `Bearer ${token}`}})
export const changePassword = (uid, token, data) => api.put(`/api/accounts/updateUser/${uid}/`, data, {headers: { Authorization: `Bearer ${token}`}})