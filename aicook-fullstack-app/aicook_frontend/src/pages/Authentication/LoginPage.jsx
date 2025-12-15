import React, { useState, useEffect } from 'react';
import { authLogin } from "../../services/accounts";
import toast, { Toaster } from "react-hot-toast";
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const LoginPage = () => {
  const { isAuthenticated, login } = useAuth();
  const navigate = useNavigate();
  const [username, setUserName] = useState('');
  const [password, setPassword] = useState('');

  useEffect(() => {
    if (isAuthenticated) navigate("/");
  }, [isAuthenticated]);
  
  const handleLogin = async (e) => {
    e.preventDefault();

    //console.log("Login:", { username, password });
    
    try {
      let result = await authLogin({ username, password });
      //console.log(result);

      let accessToken = result.data.access;
      //let refreshToken = result.data.refresh;

      login(accessToken);

      // 5 saniyelik işlem
      const timer = setTimeout(() => {
                console.log("5 saniye geçti, işlem tamam!");
                toast.success("İşlem tamamlandı! 5 Saniye sonra anasayfaya yönleneceksiniz!");
              }, 5000);
      
      clearTimeout(timer);
      
      toast.success("Giriş başarılı! Anasayfaya yönlendiriliyorsunuz...");
      navigate('/');

    } catch (error) {
      toast.error("Giriş başarısız");
    }
  
    
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-[#FFFFFF] text-[#444444] font-sans px-4 py-8">
      <Toaster />
      <div className="flex flex-col items-center mb-8">
        <img src="/aicook-logo.png" alt="AICOOK Logo" className="h-32"/>
        <h2 className="text-[24px] font-semibold mt-4 text-center">AI Cooking Assistant</h2>
      </div>

      <div className="bg-white border border-[#DDDDDD] rounded-2xl shadow p-8 w-full max-w-sm">
        <form onSubmit={handleLogin}>
          <div className="mb-4">
            <input
              type="text"
              className="w-full px-3 py-2 border border-[#DDDDDD] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#e6ecff]"
              value={username}
              onChange={(e) => setUserName(e.target.value)}
              placeholder='E-posta'
              required
            />
          </div>

          <div className="mb-6">
            <input
              type="password"
              className="w-full px-3 py-2 border border-[#DDDDDD] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#e6ecff]"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder='Şifre'
              required
            />
          </div>

          <button type="submit" className="w-full bg-[#4294ff] hover:bg-[#84cafe] text-white font-semibold py-2 rounded-xl transition">
            Giriş Yap
          </button>
        </form>

        <div className="text-[14px] text-[#999999] mt-6 text-center flex justify-between">
          <button onClick={() => navigate('/authentication/register')} className="text-[#4294ff] font-medium hover:underline">
            Kayıt Ol
          </button>
          <button onClick={() => navigate('/authentication/reset-password')} className="text-[#4294ff] font-medium hover:underline">
            Şifremi Unuttum
          </button>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
