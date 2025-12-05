import { useEffect } from "react";
import { userInfo } from "../../services/accounts";
import Header from "../../components/Header";  

export default function HomePage() {

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token");

        if (!token) {
          console.error("Token bulunamadı");
          return;
        }

        const response = await userInfo(token);
        console.log("Kullanıcı Bilgisi:", response);

      } catch (error) {
        console.error("Kullanıcı bilgisi alınamadı:", error);
      }
    };

    fetchData();
  }, []);

  return (
    <>
      <Header />

      <div className="relative min-h-[calc(100vh-80px)] bg-background text-bodyText font-sans px-8 py-12">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="text-[24px] font-semibold mb-4 tracking-wide">Hoş Geldiniz...</h1>
          <p className="text-[16px] font-light text-helperText">
            Çocuk verileri, gelişim raporları ve daha fazlası gibi özelliklere erişmek için lütfen veri girişi yapınız.
          </p>
        </div>
      </div>
    </>
  );
}
