import React, { useEffect, useState, useContext } from "react";
import {View, Text, ScrollView, TouchableOpacity, Image, ActivityIndicator, StyleSheet,} from "react-native";
import Toast from "react-native-toast-message";
import { getMealHistories } from "../services/meal_histories";
import { getFavoriteStatus, toggleFavoriteRecipe,} from "../services/favorite_recipes";
import { AuthContext } from "../context/AuthContext";
import Header from "../components/Header";

export default function HistoryRecipesScreen() {
  const { token } = useContext(AuthContext);

  const [recipes, setRecipes] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [openedId, setOpenedId] = useState<number | null>(null);
  const [favoriteStatus, setFavoriteStatus] = useState<Record<number, boolean>>({});

  /* ---------------- FETCH ---------------- */
  const fetchHistories = async () => {
    setLoading(true);
    try {
      const data = await getMealHistories(token!); // 🔥 DİREKT DATA
      setRecipes(data);

      const favMap: Record<number, boolean> = {};
      await Promise.all(
        data.map(async (mh: any) => {
          try {
            const isFav = await getFavoriteStatus(mh.recipe_id, token!);
            favMap[mh.recipe_id] = isFav;
          } catch {
            favMap[mh.recipe_id] = false;
          }
        })
      );

      setFavoriteStatus(favMap);
    } catch (e) {
      console.log("Meal histories error:", e);
      Toast.show({
        type: "error",
        text1: "Yemek geçmişi alınamadı",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHistories();
  }, []);

  /* ---------------- HELPERS ---------------- */
  const formatDate = (dateStr?: string) => {
    if (!dateStr) return "-";
    const d = new Date(dateStr);
    const day = String(d.getDate()).padStart(2, "0");
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const year = d.getFullYear();
    return `${day}/${month}/${year}`;
  };

  const toggleFavorite = async (recipeId: number) => {
    try {
      const res = await toggleFavoriteRecipe(
        { recipe_id: recipeId },
        token!
      );

      setFavoriteStatus((prev) => ({
        ...prev,
        [recipeId]: res.active === 1,
      }));
    } catch (e) {
      console.log("Favorite toggle error:", e);
      Toast.show({
        type: "error",
        text1: "Favori işlemi başarısız",
      });
    }
  };

  /* ---------------- UI ---------------- */
  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" />
        <Text>Yükleniyor...</Text>
      </View>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: "#fff" }}>
      <Header />

      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.title}>Yemek Geçmişi</Text>

        {recipes.length === 0 && (
          <Text style={styles.emptyText}>Henüz yemek geçmişi yok</Text>
        )}

        {recipes.map((mh) => {
          const isOpen = openedId === mh.meal_history_id;

          return (
            <View key={mh.meal_history_id} style={styles.card}>
              {/* HEADER */}
              <View style={styles.cardHeader}>
                <View style={styles.headerLeft}>
                  <TouchableOpacity
                    onPress={() => toggleFavorite(mh.recipe_id)}
                  >
                    <Image
                      source={
                        favoriteStatus[mh.recipe_id]
                          ? require("../assets/images/love_blue.png")
                          : require("../assets/images/love.png")
                      }
                      style={styles.icon}
                    />
                  </TouchableOpacity>

                  <Text style={styles.recipeTitle}>{mh.title}</Text>
                </View>

                <TouchableOpacity
                  style={styles.openBtn}
                  onPress={() =>
                    setOpenedId(isOpen ? null : mh.meal_history_id)
                  }
                >
                  <Text style={styles.openBtnText}>
                    {isOpen ? "Kapat" : "Aç"}
                  </Text>
                </TouchableOpacity>
              </View>

              <Text style={styles.meta}>
                {mh.category} • {mh.cooking_area} • {mh.servings} porsiyon •{" "}
                {mh.cooking_time} {mh.time_type}
              </Text>

              {/* OPEN CONTENT */}
              {isOpen && (
                <View style={styles.openContent}>
                  <Text style={styles.description}>
                    {mh.description || "Tarif açıklaması bulunamadı."}
                  </Text>

                  <View style={styles.infoRow}>
                    <Text style={styles.infoLabel}>Yapılma Tarihi:</Text>
                    <Text style={styles.infoValue}>
                      {formatDate(mh.cooked_date)}
                    </Text>
                  </View>

                  <View style={styles.infoRow}>
                    <Text style={styles.infoLabel}>Puan:</Text>
                    <View style={styles.starRow}>
                      {Array.from({ length: 10 }).map((_, i) => (
                        <Image
                          key={i}
                          source={
                            i + 1 <= (mh.rating || 0)
                              ? require("../assets/images/star_blue.png")
                              : require("../assets/images/star.png")
                          }
                          style={styles.star}
                        />
                      ))}
                    </View>
                  </View>

                  <View style={styles.infoRow}>
                    <Text style={styles.infoLabel}>Yorum:</Text>
                    <Text style={styles.infoValue}>{mh.comment || "-"}</Text>
                  </View>
                </View>
              )}
            </View>
          );
        })}
      </ScrollView>
    </View>
  );
}

/* ---------------- STYLES ---------------- */
const styles = StyleSheet.create({
  container: {
    padding: 16,
    paddingBottom: 40,
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    fontSize: 22,
    fontWeight: "600",
    color: "#444",
    marginBottom: 16,
  },
  emptyText: {
    textAlign: "center",
    color: "#777",
    marginTop: 40,
  },
  card: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 14,
    padding: 12,
    marginBottom: 12,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  headerLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  recipeTitle: {
    fontSize: 15,
    fontWeight: "600",
    color: "#444",
  },
  meta: {
    fontSize: 12,
    color: "#777",
    marginTop: 4,
  },
  icon: {
    width: 24,
    height: 24,
  },
  openBtn: {
    backgroundColor: "#4294ff",
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 10,
  },
  openBtnText: {
    color: "#fff",
    fontWeight: "500",
  },
  openContent: {
    marginTop: 10,
    borderTopWidth: 1,
    borderTopColor: "#eee",
    paddingTop: 10,
    gap: 6,
  },
  description: {
    fontSize: 14,
    color: "#555",
  },
  infoRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 6,
    alignItems: "center",
  },
  infoLabel: {
    fontSize: 13,
    fontWeight: "600",
    color: "#555",
  },
  infoValue: {
    fontSize: 13,
    color: "#555",
  },
  starRow: {
    flexDirection: "row",
    gap: 2,
  },
  star: {
    width: 14,
    height: 14,
  },
});
