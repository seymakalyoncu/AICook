import { useParams } from "react-router-dom";
import toast, { Toaster } from 'react-hot-toast';
import { useEffect, useState } from "react";
import { analyzeFridgePhoto } from "../../services/fridge_detect";
import { getIngredients } from "../../services/ingredients";
import { searchRecipes } from "../../services/recipes";
import { toggleFavoriteRecipe, getFavoriteStatus } from "../../services/favorite_recipes";
import { addMealHistory } from "../../services/meal_histories";

const FridgeAnalysis = () => {
  const { photoId } = useParams();
  const [ingredients, setIngredients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [recipes, setRecipes] = useState(null);
  const [allIngredients, setAllIngredients] = useState([]);
  const [openedRecipeId, setOpenedRecipeId] = useState(null);
  const [ingredientModalOpen, setIngredientModalOpen] = useState(false);
  const token = localStorage.getItem("token");
  const user_id = localStorage.getItem("user_id");
  const [favoriteStatus, setFavoriteStatus] = useState({});
  const [showMealModal, setShowMealModal] = useState(false);
  const [mealDate, setMealDate] = useState("");
  const [mealRating, setMealRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [mealComment, setMealComment] = useState("");
  const [selectedRecipeForMeal, setSelectedRecipeForMeal] = useState(null);

  // Fotoğraf analizinden gelen malzemeler
  useEffect(() => {
    const fetchIngredients = async () => {
      try {
        const res = await analyzeFridgePhoto(photoId, token);
        const data = (res.data.ingredients || []).map((i) => ({
          ...i,
          selected: true,
        }));
        setIngredients(data);
      } catch (err) {
        console.error("Analiz hatası", err);
      } finally {
        setLoading(false);
      }
    };
    fetchIngredients();
  }, [photoId, token]);

  // Modal açıldığında tüm malzemeleri çek ve seçili olanları işaretle
  useEffect(() => {
    if (ingredientModalOpen) {
      getIngredients()
        .then((res) => {
          const data = res.data.map((i) => ({
            ...i,
            selected: ingredients.some((ing) => ing.id === i.id),
          }));
          setAllIngredients(data);
        })
        .catch((err) => console.error("Ingredients alınamadı", err));
    }
  }, [ingredientModalOpen, ingredients]);

  const toggleSelectIngredient = (idx, inModal = false) => {
    if (inModal) {
      setAllIngredients((prev) =>
        prev.map((item, i) =>
          i === idx ? { ...item, selected: !item.selected } : item
        )
      );
    } else {
      setIngredients((prev) =>
        prev.map((item, i) =>
          i === idx ? { ...item, selected: !item.selected } : item
        )
      );
    }
  };

  const addSelectedIngredients = () => {
    const selected = allIngredients.filter((i) => i.selected);
    const newIngredients = [...ingredients];
    selected.forEach((i) => {
      if (!newIngredients.some((ing) => ing.id === i.id)) {
        newIngredients.push(i);
      }
    });
    setIngredients(newIngredients);
    setIngredientModalOpen(false);
  };

  // Tarifleri backend'den OR mantığı ile çek
  const handleGetRecipes = async () => {
    try {
      const selectedIds = ingredients.filter((i) => i.selected).map((i) => i.id);
      if (!selectedIds.length) {
        setRecipes([]);
        return;
      }

      const payload = {
        searchType: "filter",
        ingredients: selectedIds,
      };

      const res = await searchRecipes(payload);
      setRecipes(res.data || []);
    } catch (err) {
      console.error("Tarifler alınamadı", err);
      setRecipes([]);
    }
  };

  if (loading) return <p className="p-4">Malzemeler analiz ediliyor...</p>;

  return (
    <div className="p-4 space-y-6">
      <Toaster  position="top-right" reverseOrder={false} />
      <h1 className="text-2xl font-semibold text-[#444444] mb-6">
        Tespit Edilen Malzemeler
      </h1>

      {ingredients.length === 0 && (
        <p className="text-gray-500">
          Fotoğrafta tanımlanabilir malzeme bulunamadı.
        </p>
      )}

      <ul className="space-y-2">
        {ingredients.map((i, idx) => (
          <li
            key={i.id}
            className="flex items-center justify-between border px-4 py-2 rounded-lg"
          >
            <label className="flex items-center gap-2 w-full cursor-pointer">
              <input
                type="checkbox"
                checked={i.selected}
                onChange={() => toggleSelectIngredient(idx)}
              />
              <span className="flex-1">{i.name}</span>
            </label>
          </li>
        ))}
      </ul>

      <div className="flex justify-between mb-4">
        <button
          className="bg-[#1a3752] text-white px-6 py-2 rounded-lg text-sm hover:bg-[#84cafe]"
          onClick={() => setIngredientModalOpen(true)}
        >
          Malzeme Ekle
        </button>

        <button
          className="bg-[#4294ff] text-white px-6 py-2 rounded-lg text-sm hover:bg-[#84cafe]"
          onClick={handleGetRecipes}
        >
          Tarifleri Getir
        </button>
      </div>

      {/* Tarifler */}
      {recipes === null ? null : recipes.length === 0 ? (
        <p className="text-center text-gray-500">Bu malzemelerle tarif bulunamadı.</p>
      ) : (
        <div className="space-y-3">
        {recipes.map((item) => {
          const isOpen = openedRecipeId === item.id;

          return (
            <div key={item.id} className="border rounded-lg p-4">
              <div className="flex justify-between items-center">
                <div className="flex-1">
                  <div className="mt-1 flex flex-wrap items-center">
                    {/* Tarif adı */}
                    <span className="font-medium text-base">{item.recipe}</span>

                    {/* Tarif malzemeleri */}
                    {item.recipe_ingredient_list && item.recipe_ingredient_list.length > 0 && (
                      <span className="text-[12px] text-gray-600 ml-2">
                        {item.recipe_ingredient_list.map((ing, idx) => (
                          <span
                            key={ing.id}
                            className={ing.selected ? "#1a3752" : "text-red-500"}
                          >
                            {ing.name}
                            {idx < item.recipe_ingredient_list.length - 1 && " - "}
                          </span>
                        ))}
                      </span>
                    )}
                  </div>
                
                  {/* Kategori, alan, porsiyon vs. */}
                  <p className="text-[13px] text-gray-500">
                    {item.category_name || "Kategori yok"} • {item.cooking_area_name || "Alan yok"} • {item.servings || "-"} porsiyon • {item.cooking_time || "-"} {item.time_type_name || ""}
                  </p>
                </div>

                <button
                  onClick={async () => {
                    setOpenedRecipeId(isOpen ? null : item.id)
                    if (!isOpen && user_id && token) {
                      try {
                        const res = await getFavoriteStatus(item.id, token);
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
                  <div className="text-[14px] text-gray-700 text-justify flex-1">
                    {item.description || "Tarif açıklaması bulunamadı."}
                  </div>
                  <div className="flex flex-col items-center gap-2">
                    {/* LOVE ICON */}
                    <img
                      src={favoriteStatus[item.id] ? "/love_blue.png" : "/love.png"}
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
                      className="w-7 h-7 cursor-pointer transition-transform duration-200 hover:scale-110 active:scale-95"
                    />

                    {/* DONE ICON */}
                    <img
                      src="/done.png"
                      alt="done"
                      onClick={() => {
                        setSelectedRecipeForMeal(item);
                        setShowMealModal(true);
                      }}
                      className="w-7 h-7 cursor-pointer transition-transform duration-200 hover:scale-110 active:scale-95"
                    />
                  </div>
                </div>
              )}
            </div>
          );
        })}
        </div>
      )}

      {/* Malzeme ekleme modalı */}
      {ingredientModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex justify-center items-center z-50">
          <div className="bg-white rounded-lg w-96 max-h-[80vh] flex flex-col">
            <div className="p-6 overflow-y-auto flex-1">
              <h2 className="text-2xl font-semibold text-[#444444] mb-6 leading-snug tracking-wide">
                Malzeme Ekle
              </h2>

              <ul className="space-y-2">
                {allIngredients.map((i, idx) => (
                  <li key={i.id} className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={i.selected}
                      onChange={() => toggleSelectIngredient(idx, true)}
                    />
                    <span>{i.name}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="flex justify-end gap-2 p-4 border-t">
              <button
                className="flex-1 border border-[#DDDDDD] text-[#444444] px-6 py-2 rounded-xl hover:bg-[#f5f5f5]"
                onClick={() => setIngredientModalOpen(false)}
              >
                Kapat
              </button>
              <button
                className="flex-1 border bg-[#4294ff] text-white px-6 py-2 rounded-xl hover:bg-[#84cafe]"
                onClick={addSelectedIngredients}
              >
                Ekle
              </button>
            </div>
          </div>
        </div>
      )}
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
                  toast.success("Yemek kaydedildi!", { position: "top-right" });

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
};

export default FridgeAnalysis;
