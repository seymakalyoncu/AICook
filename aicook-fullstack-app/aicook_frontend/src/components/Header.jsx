import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { userInfo } from "../services/accounts";
import { sendChatMessage } from "../services/chat";

const Header = () => {
  const [user, setUser] = useState(null);
  const [error, setError] = useState(null);

  const chatContainerRef = useRef(null);

  const [leftMenuOpen, setLeftMenuOpen] = useState(false);
  const [accountMenuOpen, setAccountMenuOpen] = useState(false);

  const [chatOpen, setChatOpen] = useState(false);
  const [chatInput, setChatInput] = useState("");
  const [chatMessages, setChatMessages] = useState([]);

  const leftMenuRef = useRef();
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;

    const fetchUser = async () => {
      try {
        const response = await userInfo(token); // TOKEN EKLENMİŞ HALİ
        localStorage.setItem("user_id", response.data.id);
        setUser(response.data);
      } catch (err) {
        setError("Kullanıcı bilgisi alınamadı");
      }
    };

    fetchUser();
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        leftMenuRef.current &&
        !leftMenuRef.current.contains(event.target)
      ) {
        setLeftMenuOpen(false);
        setAccountMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSendMessage = async () => {
    if (!chatInput.trim()) return;

    const token = localStorage.getItem("token");

    const userMessage = chatInput;
    setChatInput("");

    setChatMessages((prev) => [
      ...prev,
      { question: userMessage, answer: "..." },
    ]);

    setTimeout(() => {
      if (chatContainerRef.current) {
        chatContainerRef.current.scrollTop =
          chatContainerRef.current.scrollHeight;
      }
    }, 0);

    try {
      const response = await sendChatMessage(
        { message: userMessage },
        token 
      );

      const answer = response?.data?.answer || "Cevap alınamadı";

      setChatMessages((prev) =>
        prev.map((msg, idx) =>
          idx === prev.length - 1 ? { ...msg, answer } : msg
        )
      );
    } catch (err) {
      setChatMessages((prev) =>
        prev.map((msg, idx) =>
          idx === prev.length - 1
            ? { ...msg, answer: "Hata oluştu" }
            : msg
        )
      );
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/authentication/logout");
  };

  return (
    <>
      <header className="flex items-center justify-between px-6 py-4 border-b border-borderGray bg-background font-sans">

        {/* SOL MENÜ */}
        <div className="relative w-1/3" ref={leftMenuRef}>
          <button onClick={() => setLeftMenuOpen(!leftMenuOpen)}>
            <img src="/menu.png" alt="menu" className="h-10 w-10 cursor-pointer" />
          </button>

          {leftMenuOpen && (
            <div className="absolute left-0 top-full mt-2 w-56 bg-white border border-gray-200 rounded-md shadow-lg z-50">

              {/* HESABIM */}
              <div
                className="relative px-4 py-2 cursor-pointer hover:bg-gray-100"
                onClick={() => setAccountMenuOpen(!accountMenuOpen)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <img src="/user.png" className="w-5 h-5" alt="hesap" />
                    <span>Hesabım</span>
                  </div>
                </div>

                {accountMenuOpen && (
                  <div className="ml-6 mt-2 border-l border-gray-200">
                    <div
                      className="block px-4 py-2 text-gray-700 hover:bg-gray-100 cursor-pointer"
                      onClick={() => {
                        setLeftMenuOpen(false);
                        setAccountMenuOpen(false);
                        navigate("/user/edit");
                      }}
                    >
                      Kişisel Bilgilerim
                    </div>

                    <div
                      className="block px-4 py-2 text-gray-700 hover:bg-gray-100 cursor-pointer"
                      onClick={() => {
                        setLeftMenuOpen(false);
                        setAccountMenuOpen(false);
                        navigate("/user/change-password");
                      }}
                    >
                      Şifremi Güncelle
                    </div>
                  </div>
                )}
              </div>

              {/* ÇIKIŞ */}
              <div
                className="flex items-center gap-3 px-4 py-2 text-gray-700 hover:bg-gray-100 cursor-pointer"
                onClick={handleLogout}
              >
                <img src="/logout.png" className="w-5 h-5" alt="çıkış" />
                <span>Çıkış Yap</span>
              </div>
            </div>
          )}
        </div>

        {/* ORTA LOGO */}
        <div className="flex items-center justify-center w-1/3">
          <div
            className="flex items-center space-x-2 cursor-pointer"
            onClick={() => navigate("/")}
          >
            <img
              src="/aicook-logo.png"
              alt="Logo"
              className="h-12 w-12 object-contain"
            />
            <span className="text-heading font-bold text-bodyText tracking-wide">
              AICOOK
            </span>
          </div>
        </div>

        {/* SAĞ CHAT */}
        <div className="w-1/3 flex justify-end items-center space-x-4 relative">
          <img
            src="/chat.png"
            alt="Sohbet"
            className="h-12 w-12 object-contain cursor-pointer"
            onClick={() => setChatOpen(true)}
          />
        </div>
      </header>

      {/* CHAT MODAL */}
      {chatOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50 font-sans">
          <div className="bg-white rounded-2xl w-[90%] max-w-md p-6 shadow-xl flex flex-col">

            <h2 className="text-2xl font-semibold text-[#444444] mb-6 leading-snug tracking-wide">
              Sohbet
            </h2>

            {/* MESAJLAR */}
            <div 
              ref={chatContainerRef}
              className="flex-1 border border-[#DDDDDD] rounded-lg p-3 mb-4 overflow-y-auto max-h-80 bg-[#f9f9f9] text-[14px]"
            >
              {chatMessages.length === 0 && (
                <div className="text-[#999999] text-[14px]">Henüz mesaj yok</div>
              )}

              {chatMessages.map((msg, idx) => (
                <div key={idx} className="mb-3">

                  {/* USER MESSAGE — SAĞA */}
                  <div className="flex justify-end mb-1">
                    <div className="bg-[#4294ff] text-white px-6 py-2 rounded-xl max-w-[80%]">
                      {msg.question}
                    </div>
                  </div>

                  {/* BOT MESSAGE — SOLA */}
                  <div className="flex justify-start">
                    <div className="bg-[#DDDDDD] text-[#444444] px-4 py-2 rounded-xl max-w-[80%]">
                      {msg.answer}
                    </div>
                  </div>

                </div>
              ))}
            </div>

            {/* YAZMA ALANI */}
            <textarea
              placeholder="Yemek, tarif veya besinlerle ilgili bir soru sorun..."
              className="border border-[#DDDDDD] rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#e6ecff] mb-4 resize-none"
              value={chatInput}
              onChange={(e) => setChatInput(e.target.value)}
              rows={3}
            />

            {/* BUTONLAR */}
            <div className="flex justify-between gap-3">
              <button
                onClick={() => setChatMessages([])}
                className="flex-1 px-6 py-2 rounded-xl border border-[#DDDDDD] text-[#444444] px-6 py-2 rounded-xl hover:bg-[#f5f5f5]"
              >
                Temizle
              </button>

              <button
                onClick={() => setChatOpen(false)}
                className="flex-1 px-6 py-2 rounded-xl border border-[#DDDDDD] text-[#444444] px-6 py-2 rounded-xl hover:bg-[#f5f5f5]"
              >
                Kapat
              </button>

              <button
                onClick={handleSendMessage}
                className="flex-1 px-6 py-2 rounded-xl border bg-[#4294ff] text-white px-6 py-2 rounded-xl hover:bg-[#84cafe]"
              >
                Gönder
              </button>
            </div>
          </div>
        </div>
      )}


    </>
  );
};

export default Header;
