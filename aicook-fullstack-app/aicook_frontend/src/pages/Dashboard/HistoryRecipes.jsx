import { useEffect, useState } from "react";
import { Toaster } from "react-hot-toast";
import { getMealHistories } from "../../services/meal_histories";
import { getFavoriteStatus, toggleFavoriteRecipe } from "../../services/favorite_recipes";

export default function HistoryRecipes() {
  const token = localStorage.getItem("token");
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [openedId, setOpenedId] = useState(null);
  const [favoriteStatus, setFavoriteStatus] = useState({});

  const fetchHistories = async () => {
    setLoading(true);
    try {
      const res = await getMealHistories(token);
      const data = res.data || [];
      setRecipes(data);

      const favStatus = {};
      for (const mh of data) {
        try {
          const favRes = await getFavoriteStatus(mh.recipe_id, token);
          favStatus[mh.recipe_id] = favRes.data.active === 1;
        } catch {
          favStatus[mh.recipe_id] = false;
        }
      }
      setFavoriteStatus(favStatus);

    } catch (e) {
      console.error("Meal histories alınamadı", e);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return "-";
    const d = new Date(dateStr);
    const day = String(d.getDate()).padStart(2, "0");
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const year = d.getFullYear();
    return `${day}/${month}/${year}`;
  };

  const renderStars = (rating) => {
    const stars = [];
    for (let i = 1; i <= 10; i++) {
      stars.push(
        <img
          key={i}
          src={i <= (rating || 0) ? "/star_blue.png" : "/star.png"}
          alt="star"
          className="w-4 h-4"
        />
      );
    }
    return stars;
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
      <Toaster position="top-right" />

      <h1 className="text-2xl font-semibold text-[#444444] mb-6">
        Yemek Geçmişi
      </h1>

      {!loading && recipes.length === 0 && (
        <p className="text-center text-gray-500">Henüz yemek geçmişi yok</p>
      )}

      <div className="space-y-4">
        {recipes.map(mh => {
          const isOpen = openedId === mh.meal_history_id;

          return (
            <div key={mh.meal_history_id} className="border rounded-lg p-4 shadow-sm">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-3">
                  <img
                    src={favoriteStatus[mh.recipe_id] ? "/love_blue.png" : "/love.png"}
                    alt="favorite"
                    onClick={() => toggleFavorite(mh.recipe_id)}
                    className="w-6 h-6 cursor-pointer hover:scale-110 transition"
                  />
                  <span className="font-medium">{mh.title}</span>
                </div>

                <button
                  onClick={() => setOpenedId(isOpen ? null : mh.meal_history_id)}
                  className="bg-[#4294ff] text-white px-6 py-2 rounded-lg text-sm hover:bg-[#84cafe]"
                >
                  {isOpen ? "Kapat" : "Aç"}
                </button>
              </div>

              <p className="text-[13px] text-gray-500">
                {mh.category} • {mh.cooking_area} • {mh.servings} porsiyon •{" "}
                {mh.cooking_time} {mh.time_type}
              </p>

              {isOpen && (
                <div className="text-[14px] text-gray-700 mt-2 space-y-2">
                  <div>{mh.description || "Tarif açıklaması bulunamadı."}</div>

                  <div className="mt-2 border-t pt-2 space-y-1">
                    <p className="text-[13px] text-gray-500">
                      <span className="font-semibold text-gray-700">Yapılma Tarihi:</span>{" "}
                      {formatDate(mh.cooked_date)}
                    </p>

                    <p className="text-[13px] text-gray-500 flex items-center gap-2">
                      <span className="font-semibold text-gray-700">Puan:</span>
                      <span className="flex gap-1">
                        {renderStars(mh.rating)}
                      </span>
                    </p>

                    <p className="text-[13px] text-gray-500">
                      <span className="font-semibold text-gray-700">Yorum:</span>{" "}
                      {mh.comment || "-"}
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
