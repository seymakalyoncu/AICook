import { useEffect, useState, useRef } from "react";
import toast, { Toaster } from 'react-hot-toast';
import { userInfo } from "../../services/accounts";
import { getCategories } from "../../services/categories";
import { getIngredients } from "../../services/ingredients";
import { getCookingAreaType } from "../../services/cooking_area_type";
import { getTimeType } from "../../services/time_type";
import { searchRecipes } from "../../services/recipes";
import { toggleFavoriteRecipe, getFavoriteStatus } from "../../services/favorite_recipes";
import { addMealHistory } from "../../services/meal_histories";
import { useNavigate } from "react-router-dom";
import RecommendationStatus from "../../components/RecommendationStatus";
import FridgePhotoActions from "../../components/FridgePhotos/FridgePhotoActions";


export default function HomePage() {
  const [user, setUser] = useState(null);
  const token = localStorage.getItem("token");
  const user_id = localStorage.getItem("user_id");
  const navigate = useNavigate();

  const [categories, setCategories] = useState([]);
  const [ingredients, setIngredients] = useState([]);
  const [cooking_area_type, setCookingAreaType] = useState([]);
  const [time_type, setTimeType] = useState([]);
  const [cookTime, setCookTime] = useState(null);

  const [searchResults, setSearchResults] = useState([]);
  const [showSearchModal, setShowSearchModal] = useState(false);
  const [searchLoading, setSearchLoading] = useState(false);
  const [openedRecipeId, setOpenedRecipeId] = useState(null);

  const [searchText, setSearchText] = useState("");
  const [showFilter, setShowFilter] = useState(false);

  const [favoriteStatus, setFavoriteStatus] = useState({});
  const [showMealModal, setShowMealModal] = useState(false);
  const [mealDate, setMealDate] = useState("");
  const [mealRating, setMealRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [mealComment, setMealComment] = useState("");
  const [selectedRecipeForMeal, setSelectedRecipeForMeal] = useState(null);


  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedIngredients, setSelectedIngredients] = useState([]);
  const [selectedCookingArea, setSelectedCookingArea] = useState("");
  const [selectedTimeType, setSelectedTimeType] = useState("");

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

  // GET FILTER DATA
  useEffect(() => {
    getCategories().then(res => setCategories(res.data));
    getIngredients().then(res => setIngredients(res.data));
    getCookingAreaType().then(res => setCookingAreaType(res.data));
    getTimeType().then(res => setTimeType(res.data));
  }, []);

  const handleIngredientChange = (e) => {
    const value = Number(e.target.value);
    setSelectedIngredients(prev =>
      prev.includes(value)
        ? prev.filter(id => id !== value)
        : [...prev, value]
    );
  };

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

  
  // SEARCH FUNCTION (INPUT + FILTER)
  const handleSearch = async (isFilter = false) => {
    try {
      setSearchLoading(true);

      let payload;

      if (isFilter) {
        // Filter modal araması
        payload = {
          searchType: "filter",
          ingredients: selectedIngredients, 
          category: selectedCategory || null,
          cooking_area_type: selectedCookingArea || null,
          time_type: selectedTimeType || null,
          cook_time: cookTime !== null ? cookTime : undefined, // null ise backend'e göndermiyoruz
        };
      } else {
        // Input search
        const ingredientsStr = searchText
          .split(";")
          .map(i => i.trim())
          .filter(Boolean)
          .join(";");

        payload = {
          searchType: "input",
          ingredients: ingredientsStr,
        };
      }

      const res = await searchRecipes(payload);
      setSearchResults(res.data);
      setShowSearchModal(true);
      setOpenedRecipeId(null);

    } catch (err) {
      console.error("Search error:", err);
    } finally {
      setSearchLoading(false);
    }
  };

  return (
    <div>
    <Toaster  position="top-right" reverseOrder={false} />
      {/* SEARCH BAR */}
      <div className="bg-gray-50 px-8 py-8 border-b border-gray-200">
        <div className="max-w-3xl mx-auto">
          <div className="flex items-center gap-3">

            <div className="relative w-full">
              <img
                src="/search.png"
                alt=""
                className="w-5 h-5 absolute left-3 top-3 cursor-pointer opacity-70"
                onClick={() => handleSearch(false)}
              />

              <input
                type="text"
                placeholder="Malzemeleri aralarında ; olacak şekilde yazınız..."
                className="
                  w-full
                  bg-white
                  border
                  border-gray-300
                  rounded-lg
                  pl-11
                  px-3
                  py-2.5
                  focus:outline-none
                  focus:ring-2
                  focus:ring-orange-400
                "
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
              />
            </div>

            <img
              src="/filter.png"
              alt=""
              onClick={() => setShowFilter(true)}
              className="w-9 h-9 cursor-pointer opacity-80 hover:opacity-100"
            />
          </div>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-6 py-8">
        <RecommendationStatus />
      </div>
      
      {/* FILTER MODAL */}
      {showFilter && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl w-[95%] max-w-lg p-6 space-y-5">

            <h2 className="text-2xl font-semibold text-[#444444] mb-6 leading-snug tracking-wide">Filtre</h2>

            {/* KATEGORİ */}
            <div>
              <label className="text-[14px]">Kategori</label>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full border px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#e6ecff]"
              >
                <option value="">Kategori Seçiniz</option>
                {categories.map(item => (
                  <option key={item.id} value={item.id}>{item.name}</option>
                ))}
              </select>
            </div>

            {/* MALZEMELER */}
            <div>
              <label className="text-[14px]">Malzeme Listesi</label>
              <div className="border rounded-lg p-2 max-h-32 overflow-y-auto space-y-1">
                {ingredients.map(item => (
                  <label key={item.id} className="flex gap-2 text-[14px]">
                    <input
                      type="checkbox"
                      value={item.id}
                      checked={selectedIngredients.includes(item.id)}
                      onChange={handleIngredientChange}
                    />
                    {item.name}
                  </label>
                ))}
              </div>
            </div>

            {/* PİŞİRME SÜRESİ & BİRİMİ */}
            <div className="flex gap-4 items-center">
              <div className="w-[70%]">
                <label className="text-[14px] block mb-1">Pişirme Süresi: {cookTime}</label>
                  <input
                    type="range"
                    min="0"
                    max="120"
                    value={cookTime ?? 30} // gösterim için 30, ama backend'e gönderme kontrolü handleSearch'ta
                    onChange={(e) => setCookTime(Number(e.target.value))}
                    className="w-full"
                  />
              </div>
              <div className="w-[30%]">
                <label className="text-[14px] block mb-1">Pişirme Birimi</label>
                <div className="flex flex-col gap-2">
                  {time_type.map(item => (
                    <label key={item.id} className="flex items-center gap-2 text-[14px]">
                      <input
                        type="radio"
                        name="timeType"
                        value={item.id}
                        checked={selectedTimeType === String(item.id)}
                        onChange={(e) => setSelectedTimeType(e.target.value)}
                      />
                      {item.name}
                    </label>
                  ))}
                </div>
              </div>
            </div>

            {/* PİŞİRME YERİ */}
            <div>
              <label className="text-[14px]">Pişirme Yeri</label>
              <div className="flex gap-4 flex-wrap">
                {cooking_area_type.map(item => (
                  <label key={item.id} className="flex gap-2 text-[14px]">
                    <input
                      type="radio"
                      name="cookingArea"
                      value={item.id}
                      checked={selectedCookingArea === String(item.id)}
                      onChange={(e) => setSelectedCookingArea(e.target.value)}
                    />
                    {item.name}
                  </label>
                ))}
              </div>
            </div>

            {/* BUTTONS */}
            <div className="flex justify-end gap-3 pt-4">
                <button
                onClick={() => {
                  // Tüm filtreleri temizle
                  setSelectedCategory("");
                  setSelectedIngredients([]);
                  setSelectedCookingArea("");
                  setSelectedTimeType("");
                  setCookTime(null);
                }}
                className="flex-1 border border-[#DDDDDD] text-[#444444] px-6 py-2 rounded-xl hover:bg-[#f5f5f5]"
              >
                Temizle
              </button>
              <button onClick={() => setShowFilter(false)} 
                className="flex-1  border border-[#DDDDDD] text-[#444444] px-6 py-2 rounded-xl hover:bg-[#f5f5f5]">
                  Kapat
              </button>
              <button
                onClick={() => {
                  handleSearch(true); // filter search
                  setShowFilter(false);
                }}
                className="flex-1 border bg-[#4294ff] text-white px-6 py-2 rounded-xl hover:bg-[#84cafe]"
              >
                Uygula
              </button>
            </div>

          </div>
        </div>
      )}

      {/* SEARCH RESULT MODAL */}
      {showSearchModal && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl w-[95%] max-w-2xl p-6">

            <div className="mb-4">
              <h2 className="text-2xl font-semibold text-[#444444] mb-6 leading-snug tracking-wide">{searchResults.length} Tarif Bulundu</h2>
            </div>

            {searchLoading ? (
              <p>Yükleniyor...</p>
            ) : searchResults.length === 0 ? (
              <p className="text-center text-gray-500">Bu malzemelerle tarif bulunamadı.</p>
            ) : (
              <div className="space-y-3 max-h-[60vh] overflow-y-auto">
                {searchResults.map(item => {
                  const isOpen = openedRecipeId === item.id;

                  return (
                    <div key={item.id} className="border rounded-lg p-4">
                      <div className="flex justify-between items-center">
                        <div>
                          <p className="font-medium">{item.recipe}</p>
                          <p className="text-[13px] text-gray-500">
                            {item.category_name} • {item.cooking_area_name} • {item.servings} porsiyon • {item.cooking_time} {item.time_type_name}
                          </p>
                        </div>

                        <button
                          onClick={async () => {
                            if (!isOpen && user_id && token) {
                              try {
                                const res = await getFavoriteStatus(
                                  item.id,
                                  token
                                );

                                setFavoriteStatus(prev => ({
                                  ...prev,
                                  [item.id]: res.data.active === 1
                                }));
                              } catch (e) {
                                console.error("Favori durumu alınamadı", e);
                              }
                            }
                            setOpenedRecipeId(isOpen ? null : item.id);
                          }}
                          className="bg-[#4294ff] text-white px-6 py-2 rounded-lg text-sm hover:bg-[#84cafe]"
                        >
                          {isOpen ? "Kapat" : "Aç"}
                        </button>
                      </div>

                        {isOpen && (
                          <div className="mt-4 border-t pt-3 flex justify-between items-start gap-3">

                            {/* DESCRIPTION */}
                            <div className="text-[14px] text-gray-700 text-justify flex-1">
                              {item.description || "Tarif açıklaması bulunamadı."}
                            </div>
                              <div className="flex flex-col items-center gap-2">
                                {/* LOVE ICON */}
                                <img
                                  src={
                                    favoriteStatus[item.id]
                                      ? "/love_blue.png"
                                      : "/love.png"
                                  }
                                  alt="favorite"
                                  onClick={async () => {
                                    try {
                                      const res = await toggleFavoriteRecipe(
                                        { recipe_id: item.id },
                                        token
                                      );

                                      setFavoriteStatus(prev => ({
                                        ...prev,
                                        [item.id]: res.data.active === 1
                                      }));
                                    } catch (e) {
                                      console.error("Favori toggle hatası", e);
                                    }
                                  }}
                                  className="w-7 h-7 cursor-pointer transition-transform duration-200
                                            hover:scale-110 active:scale-95"
                                />

                                {/* DONE ICON */}
                                  <img
                                    src="/done.png"
                                    alt="done"
                                    onClick={() => {
                                      setSelectedRecipeForMeal(item);
                                      setShowMealModal(true);
                                    }}
                                    className="w-7 h-7 cursor-pointer transition-transform duration-200
                                              hover:scale-110 active:scale-95"
                                  />
                              </div>
                          </div>
                        )}
                    </div>
                  );
                })}
              </div>
            )}

            <div className="flex justify-end pt-5">
              <button
                onClick={() => {
                  setShowSearchModal(false);
                  setOpenedRecipeId(null);
                }}
                className="border px-6 py-2 rounded-lg hover:bg-[#f5f5f5]"
              >
                Kapat
              </button>
            </div>

          </div>
        </div>
      )}

      {/* BOTTOM ICON BAR */}
      <div className="fixed bottom-6 w-full flex justify-center items-center pointer-events-none z-50"> 
        <div className="w-full max-w-md flex justify-between items-center px-10 pointer-events-auto"> 

          {/* LEFT ICON */} 
          <img 
            src="/past.png" 
            alt="histories" 
            onClick={() => navigate("/histories")}
            className="w-15 h-15 cursor-pointer hover:scale-110 transition" /> 

          {/* CENTER LENS */} 
          <FridgePhotoActions />
          
          {/* RIGHT ICON */} 
         <img
          src="/love.png"
          alt="favorites"
          onClick={() => navigate("/favorites")}
          className="w-15 h-15 cursor-pointer hover:scale-110 transition"
         />
        </div> 
      </div>
      {showMealModal && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/40">
          <div className="bg-white w-[90%] max-w-sm rounded-2xl p-5 shadow-xl">

            {/* HEADER */}
            <h3 className="text-2xl font-semibold text-[#444444] mb-6">
              Yemek Yapılma Bilgisi
            </h3>

            {/* TARİH */}
            <div className="mb-3">
              <label className="text-[14px]">
                Yemek Yapılma Tarihi
              </label>
              <input
                type="date"
                value={mealDate}
                onChange={(e) => setMealDate(e.target.value)}
                className="w-full border px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#e6ecff]"
              />
            </div>

            {/* PUAN */}
            <div className="mb-4">
              <label className="text-[14px]">
                Puan
              </label>

              <div className="flex gap-2">
                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(star => (
                  <img
                    key={star}
                    src={
                      (hoverRating || mealRating) >= star
                        ? "/star_blue.png"
                        : "/star.png"
                    }
                    alt="star"
                    className="w-6 h-6 cursor-pointer transition-transform duration-150
                              hover:scale-110"
                    onMouseEnter={() => setHoverRating(star)}
                    onMouseLeave={() => setHoverRating(0)}
                    onClick={() => setMealRating(star)}
                  />
                ))}
              </div>
            </div>

            {/* YORUM */}
            <div className="mb-4">
              <label className="text-[14px]">
                Yorum
              </label>
              <textarea
                rows="2"
                value={mealComment}
                onChange={(e) => setMealComment(e.target.value)}
                placeholder="Yemek nasıl oldu?"
                className="w-full border px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#e6ecff]"
              />
            </div>

            {/* BUTTONS */}
            <div className="flex gap-3">
              <button
                onClick={() => setShowMealModal(false)}
                className="flex-1 px-6 py-2 rounded-xl border border-[#DDDDDD] text-[#444444] px-6 py-2 rounded-xl hover:bg-[#f5f5f5]"
              >
                Vazgeç
              </button>

              <button
                onClick={async () => {
                  if (!selectedRecipeForMeal || !user_id || !mealDate) {
                    toast.error("Tarih alanı boş olamaz!", { position: "top-right" });
                    return;
                  }

                try {
                  const res = await addMealHistory(
                    {
                      recipe_id: selectedRecipeForMeal.id,
                      user_id: user_id,
                      cooked_date: mealDate,
                      rating: mealRating,
                      comment: mealComment,
                    },
                    token
                  );

                  // ✅ Başarılı kayıt toast
                  toast.success("Yemek geçmişi kaydedildi!", { position: "top-right" });

                  // Modal kapat ve alanları temizle
                  setShowMealModal(false);
                  setMealDate("");
                  setMealRating(0);
                  setHoverRating(0);
                  setMealComment("");
                  setSelectedRecipeForMeal(null);

                } catch (e) {
                  console.error("Meal history kaydedilemedi", e);
                  toast.error("Kayıt sırasında hata oluştu!", { position: "top-right" });
                }
              }}
              className="flex-1 px-6 py-2 rounded-xl border bg-[#4294ff] text-white hover:bg-[#84cafe]"
            >
              Kaydet
            </button>
            </div>
          
          </div>
        </div>
      )}

    </div>
  );
}
