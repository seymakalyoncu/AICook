import { useEffect, useState, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { userInfo } from "../services/accounts";

const Header = () => {
  const [user, setUser] = useState(null);
  const [error, setError] = useState(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef();
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;

    const fetchUser = async () => {
      try {
        const response = await userInfo(token);
        localStorage.setItem("user_id", response.data.id);

        if (response.data.user_id !== undefined) {
          localStorage.setItem("user_id", response.data.user_id);
          localStorage.setItem("userType", "SuperUser");
        }

        setUser(response.data);
      } catch (err) {
        console.error("API hatası:", err);
        setError("Kullanıcı bilgisi alınamadı");
      }
    };

    fetchUser();
  }, []);

  // Menü dışına tıklanırsa menüyü kapatma
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);




  return (
    <header className="flex items-center justify-between px-6 py-4 border-b border-borderGray bg-background font-sans">
      <div className="w-1/3"></div>
     
      <div className="flex items-center justify-center w-1/3">
        <Link to="/" className="flex items-center space-x-2">
          <img src="/aicook-logo.png" alt="Logo" className="h-16 w-16 object-contain" />
          <span className="text-heading font-bold text-bodyText tracking-wide">AICOOK</span>
        </Link>
      </div>


      {/* Sağ: Kullanıcı Bilgisi ve İkonlar */}
      <div
        className="flex justify-end items-center space-x-4 w-1/3 text-helperText text-helper relative"
        ref={menuRef}
      >
        {error && <div className="text-red-500">{error}</div>}
        {user && (
          <>
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="hover:text-warm-orange text-bodyText transition-colors duration-200 focus:outline-none"
            >
              {user.first_name} {user.last_name}
            </button>

            {menuOpen && (
              <div className="absolute right-0 top-full mt-1 w-48 bg-white border border-gray-200 rounded-md shadow-lg z-50">
                {(
                  <Link
                    to="/user/edit"
                    className="block px-4 py-2 text-gray-700 hover:bg-warm-orange hover:text-white transition-colors"
                    onClick={() => setMenuOpen(false)}
                  >
                    Kişisel Bilgilerim
                  </Link>
                )}
                {(
                  <Link
                    to="/user/change-password"
                    className="block px-4 py-2 text-gray-700 hover:bg-warm-orange hover:text-white transition-colors"
                    onClick={() => setMenuOpen(false)}
                  >
                    Şifremi Güncelle
                  </Link>
                )}
              </div>
            )}

            <Link to="/authentication/logout" className="hover:text-warm-orange transition-colors duration-200">
              <img src="/cikis.png" alt="Çıkış" className="h-8 w-8 object-contain" />
            </Link>
          </>
        )}
      </div>

    </header>
  );
};

export default Header;
