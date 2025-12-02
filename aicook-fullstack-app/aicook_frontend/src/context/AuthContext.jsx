// src/context/AuthContext.jsx
import { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(null); // burada localStorage da kontrol edebilirsin

   // Sayfa yüklendiğinde localStorage kontrolü
   useEffect(() => {
    const storedToken  = localStorage.getItem('token');
    if (storedToken ) {
      setToken(storedToken);
    }
  }, []);

  const login = (newtoken) => {
    localStorage.setItem('token', newtoken);
    setToken(newtoken);
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.clear();
    setToken(null);
  };

  return (
    <AuthContext.Provider value={{ token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
