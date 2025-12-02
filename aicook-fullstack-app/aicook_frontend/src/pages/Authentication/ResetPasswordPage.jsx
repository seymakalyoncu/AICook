import { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { resetPasswordRequest } from "../../services/accounts";

const ResetPasswordPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [email, setEmail] = useState('');

  const handleResetPassword = (e) => {
    e.preventDefault();
    console.log("Şifre sıfırlama isteği gönderildi:", { email });
    // Backend'e e-posta gönderim isteği yapılacak
    // Şifre sıfırlama bağlantısı kullanıcıya e-posta ile gönderilecek
    const uid = searchParams.get("uid");
    const token = searchParams.get("token");
    let data = {email: email};
    let result = resetPasswordRequest(data);  
    // İşlem tamamlandıktan sonra, kullanıcıyı yönlendirebiliriz
    navigate('/authentication/login');
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-[#FFFFFF] text-[#444444] font-sans px-4 py-8">

      <div className="flex flex-col items-center mb-8">
        <img src="/aicook-logo.png" alt="AICOOK Logo" className="h-32"/>
        <h2 className="text-[24px] font-semibold mt-4 text-center">AI Tracking for Kids Development</h2>
      </div>

      <div className="bg-white border border-[#DDDDDD] rounded-2xl shadow p-8 w-full max-w-sm">
        <form onSubmit={handleResetPassword}>
          <div className="mb-4">
            <input
              type="email"
              className="w-full px-3 py-2 border border-[#DDDDDD] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FFB74D]"
              placeholder='E-posta'
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <button type="submit" className="w-full bg-[#FF6600] hover:bg-[#e65c00] text-white font-semibold py-2 rounded-xl transition">
            Şifre Sıfırla
          </button>
        </form>

        <div className="text-[14px] text-[#999999] mt-6 text-center">
          <button onClick={() => navigate('/authentication/login')} className="text-[#D95F45] font-medium hover:underline">
            Geri Dön
          </button>
        </div>
      </div>
    </div>
  );
};

export default ResetPasswordPage;
