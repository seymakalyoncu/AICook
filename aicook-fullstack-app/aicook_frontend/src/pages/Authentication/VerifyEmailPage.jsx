import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";
import { verifyEmail } from "../../services/accounts";

const VerifyEmailPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  useEffect(() => {
    const uid = searchParams.get("uid");
    const token = searchParams.get("token");

    const verify = async () => {
      try {
        const result = await verifyEmail(uid, token);
        if (result.status === 200) {
          toast.success(result.data.msg);
          setTimeout(() => {
            navigate("/authentication/login");
          }, 5000);
        } else {
          toast.error(result.data.msg);
        }
      } catch (error) {
        if (error.response?.data) {
          Object.values(error.response.data).forEach((value) =>
            toast.error(value)
          );
        } else {
          toast.error("Beklenmeyen bir hata oluştu.");
        }
      }
    };

    verify();
  }, [navigate, searchParams]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-[#FFFFFF] text-[#444444] font-sans px-4 py-8">
      <div className="bg-white border border-[#DDDDDD] rounded-2xl shadow p-8 w-full max-w-xl">
        <Toaster />
        <p className="text-center text-lg">Email doğrulama işlemi yapılıyor...</p>
      </div>
    </div>
  );
};

export default VerifyEmailPage;
