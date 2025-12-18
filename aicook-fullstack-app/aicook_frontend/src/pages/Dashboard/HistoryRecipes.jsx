import { useEffect, useState } from "react";
import { Toaster } from "react-hot-toast";
import { getMealHistories } from "../../services/meal_histories";
import { getFavoriteStatus, toggleFavoriteRecipe } from "../../services/favorite_recipes";

export default function HistoryRecipes() {
  const token = localStorage.getItem("token");
  const [recipes, setRecipes] = useState([]); // Burada meal_histories ve recipe bilgilerini tutacağız
  const [loading, setLoading] = useState(false);
  const [openedId, setOpenedId] = useState(null);
  const [favoriteStatus, setFavoriteStatus] = useState({}); // Favori durumu

  // Meal histories'i çek
  const fetchHistories = async () => {
    setLoading(true);
    try {
      const res = await getMealHistories(token);
      // res.data => array of meal_histories, her biri recipe bilgisi ile
      setRecipes(res.data || []);

      // Favori durumlarını çek
      const favStatus = {};
      for (const mh of res.data || []) {
        try {
          const favRes = await getFavoriteStatus(mh.recipe.id, token);
          favStatus[mh.recipe.id] = favRes.data.active === 1;
        } catch (e) {
          favStatus[mh.recipe.id] = false;
        }
      }
      setFavoriteStatus(favStatus);

    } catch (e) {
      console.error("Meal histories alınamadı", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHistories();
  }, []);

  const toggleFavorite = async (recipeId) => {
    try {
      const res = await toggleFavoriteRecipe({ recipe_id: recipeId }, token);
      setFavoriteStatus(prev => ({
        ...prev,
        [recipeId]: res.data.active === 1
      }));
    } catch (e) {
      console.error("Favori toggle hatası", e);
    }
  };

  return (
    <div className="p-4 pb-24">
      <Toaster position="top-right" reverseOrder={false} />

      <h1 className="text-2xl font-semibold text-[#444444] mb-6">
        Yemek Geçmişi
      </h1>

      {!loading && (!recipes || recipes.length === 0) && (
        <p className="text-center text-gray-500">Henüz yemek geçmişi yok</p>
      )}

      <div className="space-y-4">
        {(recipes || []).map(mh => {
          const recipe = mh.recipe; // meal_history içerisindeki recipe bilgisi
          const isOpen = openedId === mh.id;

          return (
            <div key={mh.id} className="border rounded-lg p-4 shadow-sm">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-3">
                  {/* FAVORİ ICON */}
                  <img
                    src={favoriteStatus[recipe.id] ? "/love_blue.png" : "/love.png"}
                    alt="favorite"
                    onClick={() => toggleFavorite(recipe)}
                    className="w-6 h-6 cursor-pointer hover:scale-110 transition"
                  />
                  <span className="font-medium">{recipe.title}</span>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => setOpenedId(isOpen ? null : mh.id)}
                    className="bg-[#4294ff] text-white px-6 py-2 rounded-lg text-sm hover:bg-[#84cafe]"
                  >
                    {isOpen ? "Kapat" : "Aç"}
                  </button>
                </div>
              </div>

              <p className="text-[13px] text-gray-500">
                {recipe.category} • {recipe.cooking_area} • {recipe.servings} porsiyon• {recipe.cooking_time} {recipe.time_type}
              </p>

              {isOpen && (
                <div className="text-[14px] text-gray-700 text-justify flex-1 mt-2 space-y-2">
                  {/* TARİF AÇIKLAMASI */}
                  <div>{recipe.description || "Tarif açıklaması bulunamadı."}</div>

                  {/* YAPILAN YEMEK BİLGİLERİ */}
                  <div className="mt-2 border-t pt-2">
                    <p className="text-[13px] text-gray-500">
                      Yapılma Tarihi: <span className="font-medium">{mh.cooked_date}</span>
                    </p>
                    <p className="text-[13px] text-gray-500">
                      Puan: <span className="font-medium">{mh.rating ?? "-"}</span>
                    </p>
                    <p className="text-[13px] text-gray-500">
                      Yorum: <span className="font-medium">{mh.comment || "-"}</span>
                    </p>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
