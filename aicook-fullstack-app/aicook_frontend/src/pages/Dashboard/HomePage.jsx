import { useEffect, useState, useRef } from "react";
import { userInfo } from "../../services/accounts";
import Header from "../../components/Header";

export default function HomePage() {
  const [user, setUser] = useState(null);

  const [searchText, setSearchText] = useState("");
  const [showFilter, setShowFilter] = useState(false);

  const [category, setCategory] = useState("");
  const [cookTime, setCookTime] = useState(30);
  const [cookPlace, setCookPlace] = useState("");

  const [lensOpen, setLensOpen] = useState(false);
  const lensRef = useRef(null);

  // USER FETCH
  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) return;

        const response = await userInfo(token);
        if (response?.data) setUser(response.data);

      } catch (error) {
        console.error("Kullanıcı bilgisi alınamadı:", error);
      }
    };

    fetchData();
  }, []);

  // LENS MENÜ DIŞINA TIKLAMA → KAPAT
  useEffect(() => {
    if (!lensOpen) return;

    const handleClickOutside = (e) => {
      if (lensRef.current && !lensRef.current.contains(e.target)) {
        setLensOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [lensOpen]);

  const handleSearch = () => {
    console.log("Arama yapılıyor:", searchText);
  };

  return (
    <>
      {/* SEARCH BAR */}
      <div className="relative min-h-[calc(100vh-80px)] bg-background text-[#444444] font-sans px-8 py-12">
        <div className="max-w-3xl mx-auto text-center">

          <div className="flex items-center gap-3 justify-center max-w-xl mx-auto">

            <div className="relative w-full font-sans">

              {/* SEARCH ICON */}
              <img
                src="/search.png"
                alt=""
                className="w-6 h-6 absolute left-3 top-2.5 cursor-pointer opacity-80 hover:opacity-100 transition"
                onClick={handleSearch}
              />

              <input
                type="text"
                placeholder="Yemek ara..."
                className="
                  w-full border border-[#DDDDDD] 
                  px-3 py-2 rounded-lg 
                  pl-12 pr-4
                  text-[16px] text-[#444444]
                  font-normal tracking-wide
                  focus:outline-none 
                  focus:ring-2 focus:ring-[#e6ecff]
                "
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
              />
            </div>

            {/* FILTER ICON */}
            <img
              src="/filter.png"
              alt=""
              onClick={() => setShowFilter(true)}
              className="w-9 h-9 cursor-pointer opacity-80 hover:opacity-100 transition"
            />
          </div>
        </div>
      </div>

      {/* FILTER MODAL */}
      {showFilter && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50 font-sans">
          <div className="bg-white rounded-2xl w-[90%] max-w-md p-6 shadow-xl">

            <h2 className="text-[22px] font-semibold text-[#444444] tracking-wide mb-6">
              Filtre
            </h2>

            {/* KATEGORI */}
            <div className="mb-5 text-left">
              <label className="block mb-1 text-[14px] font-normal text-[#444444] tracking-wide">
                Kategori
              </label>

              <select
                className="
                  w-full 
                  border border-[#DDDDDD]
                  px-3 py-2 
                  rounded-lg
                  text-[16px] text-[#444444] 
                  font-normal tracking-wide
                  bg-white
                  focus:outline-none 
                  focus:ring-2 focus:ring-[#e6ecff]
                  hover:border-[#e6ecff]
                "
                value={category}
                onChange={(e) => setCategory(e.target.value)}
              >
                <option value="">Kategori Seçiniz</option>
                <option value="corba">Çorba</option>
                <option value="ana">Ana Yemek</option>
                <option value="tatli">Tatlı</option>
              </select>
            </div>

            {/* RANGE SLIDER */}
            <div className="mb-5 text-left">
              <label className="block mb-1 text-[14px] text-[#444444] tracking-wide">
                Pişirme Süresi: {cookTime} dk
              </label>

              <input
                type="range"
                min="0"
                max="120"
                value={cookTime}
                onChange={(e) => setCookTime(Number(e.target.value))}
                className="w-full range-custom-blue"
              />
            </div>

            {/* PİŞİRME YERİ */}
            <div className="mb-5 text-left">
              <label className="block mb-2 text-[14px] text-[#444444] tracking-wide">
                Pişirme Yeri
              </label>

              <div className="flex items-center gap-6 text-[#444444] text-[16px] font-normal tracking-wide">
                {["Fırın", "Ocak", "Airfryer"].map((item) => {
                  const key = item.toLowerCase();
                  return (
                    <label key={key} className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name="cookPlace"
                        value={key}
                        checked={cookPlace === key}
                        onChange={() => setCookPlace(key)}
                        className="accent-[#4294ff]"
                      />
                      {item}
                    </label>
                  );
                })}
              </div>
            </div>

            {/* BUTTONS */}
            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={() => setShowFilter(false)}
                className="
                  px-5 py-2 
                  border border-[#DDDDDD] 
                  rounded-lg 
                  text-[16px] text-[#444444] 
                  font-normal tracking-wide
                  hover:bg-[#f5f5f5] 
                  transition
                "
              >
                Kapat
              </button>

              <button
                onClick={() => {
                  console.log({ category, cookTime, cookPlace });
                  setShowFilter(false);
                }}
                className="
                  px-6 py-2 
                  bg-[#4294ff] text-white 
                  rounded-lg 
                  text-[16px] font-medium tracking-wide
                  hover:bg-[#84cafe] 
                  transition
                "
              >
                Uygula
              </button>
            </div>
          </div>
        </div>
      )}

     <div className="fixed bottom-6 w-full flex justify-center items-center pointer-events-none z-50">
        <div className="w-full max-w-md flex justify-between items-center px-10 pointer-events-auto">

          {/* LEFT ICON */}
          <img
            src="/past.png"
            alt=""
            className="w-15 h-15 cursor-pointer hover:scale-110 transition"
          />

          {/* CENTER LENS */}
          <div className="relative flex flex-col items-center" ref={lensRef}>
            {lensOpen && (
              <div className="flex items-center justify-between w-40 absolute -top-20 animate-fadeIn">
                <img 
                  src="/camera.png" 
                  alt="camera" 
                  className="w-15 h-15 cursor-pointer hover:scale-110 transition" 
                />

                <img 
                  src="/folder.png" 
                  alt="folder" 
                  className="w-15 h-15 cursor-pointer hover:scale-110 transition" 
                />
              </div>
            )}

            <img
              src="/lens.png"
              alt=""
              onClick={() => setLensOpen(!lensOpen)}
              className="w-20 h-20 cursor-pointer hover:scale-110 transition active:scale-95 drop-shadow-xl"
            />
          </div>

          {/* RIGHT ICON */}
          <img
            src="/love.png"
            alt=""
            className="w-15 h-15 cursor-pointer hover:scale-110 transition"
          />
        </div>
      </div>

      <style>{`
        .range-custom-blue {
          -webkit-appearance: none;
          width: 100%;
          height: 6px;
          background: #E5E7EB;
          border-radius: 4px;
          overflow: hidden;
        }
        .range-custom-blue::-webkit-slider-thumb {
          -webkit-appearance: none;
          width: 16px;
          height: 16px;
          background: #4294ff;
          border-radius: 50%;
          cursor: pointer;
          box-shadow: -200px 0 0 200px #4294ff;
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeIn {
          animation: fadeIn 0.25s ease-out;
        }
      `}</style>
    </>
  );
}
