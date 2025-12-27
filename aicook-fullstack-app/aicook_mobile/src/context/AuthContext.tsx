import React, { createContext, useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import api from "../services/api"; // axios instance

export const AuthContext = createContext<any>(null);

export const AuthProvider = ({ children }: any) => {
  const [token, setToken] = useState<string | null>(null);
  const [userId, setUserId] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  /* 🔁 App açılınca storage'tan oku */
  useEffect(() => {
    const loadAuth = async () => {
      const storedToken = await AsyncStorage.getItem("token");
      const storedUserId = await AsyncStorage.getItem("userId");

      if (storedToken) setToken(storedToken);
      if (storedUserId) setUserId(Number(storedUserId));

      setLoading(false);
    };

    loadAuth();
  }, []);

  /* 🔐 LOGIN */
  const signIn = async (token: string) => {
    // 1️⃣ token kaydet
    await AsyncStorage.setItem("token", token);
    setToken(token);

    // 2️⃣ userId al (SADECE 1 KEZ)
    try {
      const res = await api.get("/api/accounts/userinfo", {
        headers: { Authorization: `Bearer ${token}` },
      });

      const uid = res.data.id;

      await AsyncStorage.setItem("userId", uid.toString());
      setUserId(uid);
    } catch (e) {
      console.log("USERINFO ERROR:", e);
    }
  };

  /* 🚪 LOGOUT */
  const signOut = async () => {
    await AsyncStorage.removeItem("token");
    await AsyncStorage.removeItem("userId");
    setToken(null);
    setUserId(null);
  };

  return (
    <AuthContext.Provider
      value={{
        token,
        userId,
        loading,
        signIn,
        signOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
