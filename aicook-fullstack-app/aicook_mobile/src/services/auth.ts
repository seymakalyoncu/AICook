import { LoginRequest } from "../types/auth"; 
import api from "./api"; 

export const login = async (data: LoginRequest) => { const res = await api.post("/api/accounts/token/", data); 
    return res.data;};

export const register = async (data: any) => {const res = await api.post("/api/accounts/register/", data); 
    return res.data;};

export const verifyEmail = async (uid: string, token: string) => {const res = await api.get(`/api/accounts/verify-email/?uid=${uid}&token=${token}`);
  return res.data;};

export const requestPasswordReset = async (data: { email: string }) => {const res = await api.post("/api/accounts/request-reset/", data);
     return res.data;};

export const resetPasswordConfirm  = async (data: {uid: string; token: string; new_password: string;}) => {const res = await api.post("/api/accounts/password-reset-confirm/",data);
  return res.data;};

export const userInfo = async (token: string) => {
  const res = await api.get("/api/accounts/userinfo", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return res.data;
};


export const changeUserStatus = async (user_id: number, status: boolean, token: string) => {const res = await api.get("/api/accounts/user-change-status", {
    headers: {Authorization: `Bearer ${token}`,},
    params: {user_id, status: status ? "True" : "False",},
  });
  return res.data;
};

export const updateUsers = async (uid: number, data: any, token: string) => {const res = await api.put(`/api/accounts/updateUser/${uid}/`, data, {
      headers: { Authorization: `Bearer ${token}` }, });
  return res.data;
};

export const changePassword = async (uid: number, data: any, token: string) => {const res = await api.put(`/api/accounts/updateUser/${uid}/`, data, {
      headers: {Authorization: `Bearer ${token}`,},
    });
  return res.data;
};