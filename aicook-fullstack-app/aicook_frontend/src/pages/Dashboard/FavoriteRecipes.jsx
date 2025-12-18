import { useEffect, useState } from "react";
import { Toaster, toast } from "react-hot-toast"; // 🔹 import ekledik
import { getFavoriteList, toggleFavoriteRecipe } from "../../services/favorite_recipes";
import { addMealHistory } from "../../services/meal_histories";

export default function FavoriteRecipes() {
  const token = localStorage.getItem("token");
  const user_id = localStorage.getItem("user_id");
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [openedId, setOpenedId] = useState(null);

  const [showMealModal, setShowMealModal] = useState(false);
  const [mealDate, setMealDate] = useState("");
  const [mealRating, setMealRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [mealComment, setMealComment] = useState("");
  const [selectedRecipeForMeal, setSelectedRecipeForMeal] = useState(null);

  const fetchFavorites = async () => {
    setLoading(true);
    try {
      const res = await getFavoriteList(token);
      setRecipes(res.data || []);
    } catch (e) {
      console.error("Favoriler alınamadı", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFavorites();
  }, []);

  const removeFavorite = async (recipeId) => {
    try {
      await toggleFavoriteRecipe({ recipe_id: recipeId }, token);
      setRecipes(prev => prev.filter(recipe => recipe.id !== recipeId));
    } catch (e) {
      console.error("Favori kaldırma hatası", e);
    }
  };

  const handleMealSave = async () => {
    if (!mealDate) {
      toast.error("Tarih alanı boş olamaz!");
      return;
    }

    if (!selectedRecipeForMeal) return;

    try {
      await addMealHistory(
        {
          user_id,
          recipe_id: selectedRecipeForMeal.id,
          cooked_date: mealDate,
          rating: mealRating,
          comment: mealComment,
        },
        token
      );

      toast.success("Yemek geçmişi kaydedildi!"); 

      setShowMealModal(false);
      setMealDate("");
      setMealRating(0);
      setHoverRating(0);
      setMealComment("");
      setSelectedRecipeForMeal(null);
    } catch (e) {
      console.error("Meal history kaydedilemedi", e);
      toast.error("Kayıt sırasında hata oluştu!");
    }
  };

  return (
    <div className="p-4 pb-24">
      <Toaster position="top-right" reverseOrder={false} />

      <h1 className="text-2xl font-semibold text-[#444444] mb-6">Favori Tarifler</h1>

      {!loading && (!recipes || recipes.length === 0) && (
        <p className="text-center text-gray-500">Henüz favori tarif yok</p>
      )}

      <div className="space-y-4">
        {(recipes || []).map(recipe => {
          const isOpen = openedId === recipe.id;

          return (
            <div key={recipe.id} className="border rounded-lg p-4 shadow-sm">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-3">
                  <img
                    src="/love_blue.png"
                    alt="remove favorite"
                    onClick={() => removeFavorite(recipe.id)}
                    className="w-6 h-6 cursor-pointer hover:scale-110 transition"
                  />
                  <img
                    src="/done.png"
                    alt="done"
                    onClick={() => {
                      setSelectedRecipeForMeal(recipe);
                      setShowMealModal(true);
                    }}
                    className="w-7 h-7 cursor-pointer transition-transform duration-200 hover:scale-110 active:scale-95"
                  />
                  <span className="font-medium">{recipe.title}</span>
                </div>

                <div className="flex gap-2">
                   <button
                    onClick={() => setOpenedId(isOpen ? null : recipe.id)}
                    className="bg-[#4294ff] text-white px-6 py-2 rounded-lg text-sm hover:bg-[#84cafe]"
                  >
                    {isOpen ? "Kapat" : "Aç"}
                  </button>
                </div>
              </div>

              <p className="text-[13px] text-gray-500">
                {recipe.category} • {recipe.cooking_area} • {recipe.servings} porsiyon•{" "}
                {recipe.cooking_time} {recipe.time_type}
              </p>

              {isOpen && (
                <div className="text-[14px] text-gray-700 text-justify flex-1 mt-2">
                  {recipe.description || "Tarif açıklaması bulunamadı."}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {showMealModal && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/40">
          <div className="bg-white w-[90%] max-w-sm rounded-2xl p-5 shadow-xl">
            <h3 className="text-2xl font-semibold text-[#444444] mb-6">Yemek Yapılma Bilgisi</h3>

            <div className="mb-3">
              <label className="text-[14px]">Yemek Yapılma Tarihi</label>
              <input
                type="date"
                value={mealDate}
                onChange={(e) => setMealDate(e.target.value)}
                className="w-full border px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#e6ecff]"
              />
            </div>

            <div className="mb-4">
              <label className="text-[14px]">Puan</label>
              <div className="flex gap-2">
                {[1,2,3,4,5,6,7,8,9,10].map(star => (
                  <img
                    key={star}
                    src={(hoverRating || mealRating) >= star ? "/star_blue.png" : "/star.png"}
                    alt="star"
                    className="w-6 h-6 cursor-pointer transition-transform duration-150 hover:scale-110"
                    onMouseEnter={() => setHoverRating(star)}
                    onMouseLeave={() => setHoverRating(0)}
                    onClick={() => setMealRating(star)}
                  />
                ))}
              </div>
            </div>

            <div className="mb-4">
              <label className="text-[14px]">Yorum</label>
              <textarea
                rows="3"
                value={mealComment}
                onChange={(e) => setMealComment(e.target.value)}
                placeholder="Yemek nasıl oldu?"
                className="w-full border px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#e6ecff]"
              />
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setShowMealModal(false)}
                className="flex-1 px-6 py-2 rounded-xl border border-[#DDDDDD] text-[#444444] hover:bg-[#f5f5f5]"
              >
                Vazgeç
              </button>

              <button
                onClick={handleMealSave}
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
