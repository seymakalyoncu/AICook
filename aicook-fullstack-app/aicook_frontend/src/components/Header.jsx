import { useEffect, useState, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { userInfo } from "../services/accounts";
import DataEntryModal from "../pages/Dashboard/DataEntry";
import ChildSelectModal from "../pages/Dashboard/ChildSelectModal"; // Path ihtiyacına göre güncelle

const Header = () => {
  const [user, setUser] = useState(null);
  const [error, setError] = useState(null);
  const [showDataEntryModal, setShowDataEntryModal] = useState(false);
  const [showChildModal, setShowChildModal] = useState(false);
  const [childModalTarget, setChildModalTarget] = useState(null); // Yeni
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

        if (response.data.parent_id !== undefined) {
          localStorage.setItem("parent_id", response.data.parent_id);
          localStorage.setItem("userType", "SuperUser");
          localStorage.removeItem("babysitter_id");
        }

        if (response.data.babysitter_id !== undefined) {
          localStorage.setItem("babysitter_id", response.data.babysitter_id);
          localStorage.setItem("userType", "Staff");
          localStorage.removeItem("parent_id");
        }

        setUser(response.data);
      } catch (err) {
        console.error("API hatası:", err);
        setError("Kullanıcı bilgisi alınamadı");
      }
    };

    fetchUser();
  }, []);

  const userType = localStorage.getItem("userType");

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

  const handleChildSelect = (child) => {
    setShowChildModal(false);

    if (childModalTarget === "reports") {
      navigate("/reports", { state: { selectedChild: child } });
    } else if (childModalTarget === "childsuggestion") {
      navigate("/child-suggestions", { state: { selectedChild: child } });
    }
  };

  return (
    <header className="flex items-center justify-between px-6 py-4 border-b border-borderGray bg-background font-sans">
      {/* Sol: Logo */}
      <div className="flex items-center space-x-2 w-1/3">
        <Link to="/" className="flex items-center space-x-2">
          <img src="/aicook-logo.png" alt="Logo" className="h-16 w-16 object-contain" />
          <span className="text-heading font-bold text-bodyText tracking-wide">AICOOK</span>
        </Link>
      </div>

      {/* Orta: Navigasyon */}
      <nav className="flex justify-center items-center w-1/3 text-bodyText font-medium text-body tracking-wide space-x-6">
        {userType === "SuperUser" && (
          <>
            <Link to="/children" className="hover:text-warm-orange">Çocuklar</Link>
            <Link to="/babysitters" className="hover:text-warm-orange">Bakıcılar</Link>
            <button
              onClick={() => {
                setChildModalTarget("reports");
                setShowChildModal(true);
              }}
              className="hover:text-warm-orange"
            >
              Gelişim Raporları
            </button>
          </>
        )}

        {(userType === "SuperUser" || userType === "Staff") && (
          <button onClick={() => setShowDataEntryModal(true)} className="hover:text-warm-orange">
            Veri Girişi
          </button>
        )}
      </nav>

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
                {userType === "SuperUser" && (
                  <Link
                    to="/user/edit"
                    className="block px-4 py-2 text-gray-700 hover:bg-warm-orange hover:text-white transition-colors"
                    onClick={() => setMenuOpen(false)}
                  >
                    Kişisel Bilgilerim
                  </Link>
                )}
                {(userType === "SuperUser" || userType === "Staff") && (
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

            {userType === "SuperUser" && (
              <button
                onClick={() => {
                  setChildModalTarget("childsuggestion");
                  setShowChildModal(true);
                }}
                className="hover:text-warm-orange transition-colors duration-200"
              >
                <img src="/oneri.png" alt="Oneri" className="h-8 w-8 object-contain" />
              </button>
            )}

            <Link to="/authentication/logout" className="hover:text-warm-orange transition-colors duration-200">
              <img src="/cikis.png" alt="Çıkış" className="h-8 w-8 object-contain" />
            </Link>
          </>
        )}
      </div>

      {/* Veri Girişi Modal */}
      <DataEntryModal open={showDataEntryModal} onClose={() => setShowDataEntryModal(false)} />

      {/* Gelişim Raporu Modal (Çocuk Seçimi) */}
      <ChildSelectModal open={showChildModal} onClose={() => setShowChildModal(false)} onSelect={handleChildSelect} />
    </header>
  );
};

export default Header;
