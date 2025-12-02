import { useState, useEffect } from 'react';
import toast, { Toaster } from "react-hot-toast";
import { useNavigate, useSearchParams } from 'react-router-dom';
import { resetPasswordConfirm } from "../../services/accounts";

const ResetPasswordPage = () => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const [form, setForm] = useState({
      email: '',
      password: '',
      password_again: ''
    });

    useEffect(() => {
        const uid = searchParams.get("uid");
        const token = searchParams.get("token");
        console.log("uid: " + uid);
        console.log("token: " + token);
        if(uid === null || token === null)
            navigate('/authentication/login');
    }, []);

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value }); 
    };
    
    const handleResetPassword = async (e) => {
        e.preventDefault();

        if(form.password !== form.password_again)
        {
            toast.error("Şifreler uyuşmuyor");
            return;
        }

        // servis bağlantısı
        const uid = searchParams.get("uid");
        const token = searchParams.get("token");
        // console.log("uid: " + uid);
        // console.log("token: " + token);

        let data = {uid: uid, token: token, new_password: form.password }

        let result = await resetPasswordConfirm(data);
        
        if(result.status === 200) {
          toast.success(result.data.msg);
          setTimeout(() => {
            navigate("/authentication/login");
          }, 5000);
        } else {
          toast.success(result.data.msg);
        }

        

  };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-[#FFFFFF] text-[#444444] font-sans px-4 py-8">
        <div className="flex flex-col items-center mb-8">
            <img src="/aicook-logo.png" alt="AICOOK Logo" className="h-32"/>
            <h2 className="text-[24px] font-semibold mt-4 text-center">AI Tracking for Kids Development</h2>
             <Toaster />
        </div>

        <div className="bg-white border border-[#DDDDDD] rounded-2xl shadow p-8 w-full max-w-sm">
            <form onSubmit={handleResetPassword}>
            <div className="mb-4">
                <input type="password" name="password" placeholder="Şifre" onBlur={handleChange} required className="w-full px-3 py-2 border border-[#DDDDDD] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FFB74D]" />
            </div>
            <div className="mb-4">
                <input type="password" name="password_again" placeholder="Şifre Tekrar" onBlur={handleChange} required className="w-full px-3 py-2 border border-[#DDDDDD] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FFB74D]" />
            </div>

            <button type="submit" className="w-full bg-[#FF6600] hover:bg-[#e65c00] text-white font-semibold py-2 rounded-xl transition">
                Kaydet
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
