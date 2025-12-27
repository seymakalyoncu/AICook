import React, { useEffect, useState, useContext } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Image,
  Modal,
  TextInput,
  ActivityIndicator,
  StyleSheet,
} from "react-native";
import Toast from "react-native-toast-message";

import { getFavoriteList, toggleFavoriteRecipe } from "../services/favorite_recipes";
import { addMealHistory } from "../services/meal_histories";
import { AuthContext } from "../context/AuthContext";
import Header from "../components/Header";

export default function FavoriteRecipesScreen() {
  const { token, userId } = useContext(AuthContext);

  const [recipes, setRecipes] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [openedId, setOpenedId] = useState<number | null>(null);

  const [showMealModal, setShowMealModal] = useState(false);
  const [mealDate, setMealDate] = useState("");
  const [mealRating, setMealRating] = useState(0);
  const [mealComment, setMealComment] = useState("");
  const [selectedRecipe, setSelectedRecipe] = useState<any>(null);
  const [mealError, setMealError] = useState<string | null>(null);

  /* ---------------- FETCH FAVORITES ---------------- */
  const fetchFavorites = async () => {
    setLoading(true);
    try {
      const data = await getFavoriteList(token!); // 🔥 DÜZELTİLDİ
      setRecipes(data || []);
    } catch (e) {
      Toast.show({
        type: "error",
        text1: "Favoriler alınamadı",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFavorites();
  }, []);

  /* ---------------- REMOVE FAVORITE ---------------- */
  const removeFavorite = async (recipeId: number) => {
    try {
      await toggleFavoriteRecipe({ recipe_id: recipeId }, token!);
      setRecipes((prev) => prev.filter((r) => r.id !== recipeId));
    } catch {
      Toast.show({ type: "error", text1: "Favori kaldırılamadı" });
    }
  };

  /* ---------------- SAVE MEAL ---------------- */
  const handleMealSave = async () => {
    const regex = /^\d{2}-\d{2}-\d{4}$/;

    if (!regex.test(mealDate)) {
      setMealError("Tarih GG-AA-YYYY formatında olmalı");
      return;
    }

    if (!selectedRecipe) return;

    try {
      const [d, m, y] = mealDate.split("-");
      const cookedDateISO = `${y}-${m}-${d}`;

      await addMealHistory(
        {
          user_id: userId,
          recipe_id: selectedRecipe.id,
          cooked_date: cookedDateISO,
          rating: mealRating || null,
          comment: mealComment || "",
        },
        token!
      );

      Toast.show({
        type: "success",
        text1: "Yemek geçmişi kaydedildi",
      });

      setShowMealModal(false);
      setMealDate("");
      setMealRating(0);
      setMealComment("");
      setMealError(null);
      setSelectedRecipe(null);
    } catch {
      Toast.show({
        type: "error",
        text1: "Kayıt sırasında hata oluştu",
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
        <Text style={styles.title}>Favori Tarifler</Text>

        {recipes.length === 0 && (
          <Text style={styles.emptyText}>Henüz favori tarif yok</Text>
        )}

        {recipes.map((recipe) => {
          const isOpen = openedId === recipe.id;

          return (
            <View key={recipe.id} style={styles.card}>
              <View style={styles.cardHeader}>
                <View style={styles.headerLeft}>
                  <TouchableOpacity onPress={() => removeFavorite(recipe.id)}>
                    <Image
                      source={require("../assets/images/love_blue.png")}
                      style={styles.icon}
                    />
                  </TouchableOpacity>

                  <TouchableOpacity
                    onPress={() => {
                      setSelectedRecipe(recipe);
                      setShowMealModal(true);
                    }}
                  >
                    <Image
                      source={require("../assets/images/done.png")}
                      style={styles.icon}
                    />
                  </TouchableOpacity>

                  <Text style={styles.recipeTitle}>{recipe.title}</Text>
                </View>

                <TouchableOpacity
                  style={styles.openBtn}
                  onPress={() => setOpenedId(isOpen ? null : recipe.id)}
                >
                  <Text style={styles.openBtnText}>
                    {isOpen ? "Kapat" : "Aç"}
                  </Text>
                </TouchableOpacity>
              </View>

              <Text style={styles.meta}>
                {recipe.category} • {recipe.cooking_area} • {recipe.servings} porsiyon •{" "}
                {recipe.cooking_time} {recipe.time_type}
              </Text>

              {isOpen && (
                <Text style={styles.description}>
                  {recipe.description || "Tarif açıklaması bulunamadı."}
                </Text>
              )}
            </View>
          );
        })}
      </ScrollView>

      {/* ---------------- MEAL MODAL ---------------- */}
      <Modal visible={showMealModal} transparent animationType="fade">
        <View style={styles.overlay}>
          <View style={styles.mealModalBox}>
            <Text style={styles.modalTitle}>Yemek Yapılma Bilgisi</Text>

            <TextInput
              placeholder="GG-AA-YYYY"
              value={mealDate}
              onChangeText={(v) => {
                setMealDate(v);
                setMealError(null);
              }}
              style={[
                styles.input,
                mealError && styles.inputError,
              ]}
            />

            {mealError && (
              <Text style={styles.errorText}>{mealError}</Text>
            )}

            <View style={styles.starRow}>
              {[1,2,3,4,5,6,7,8,9,10].map((s) => (
                <TouchableOpacity key={s} onPress={() => setMealRating(s)}>
                  <Image
                    source={
                      mealRating >= s
                        ? require("../assets/images/star_blue.png")
                        : require("../assets/images/star.png")
                    }
                    style={styles.star}
                  />
                </TouchableOpacity>
              ))}
            </View>

            <TextInput
              placeholder="Yorum"
              value={mealComment}
              onChangeText={setMealComment}
              style={[styles.input, { height: 80 }]}
              multiline
            />

            <View style={styles.footerRow}>
              <TouchableOpacity
                style={styles.outlineBtn}
                onPress={() => setShowMealModal(false)}
              >
                <Text>Vazgeç</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.primaryBtn}
                onPress={handleMealSave}
              >
                <Text style={{ color: "#fff", fontWeight: "600" }}>
                  Kaydet
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

/* ---------------- STYLES ---------------- */
const styles = StyleSheet.create({
  container: { padding: 16, paddingBottom: 40 },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
  title: { fontSize: 22, fontWeight: "600", color: "#444", marginBottom: 16 },
  emptyText: { textAlign: "center", color: "#777", marginTop: 40 },
  card: { borderWidth: 1, borderColor: "#ddd", borderRadius: 14, padding: 12, marginBottom: 12 },
  cardHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  headerLeft: { flexDirection: "row", alignItems: "center", gap: 10, flex: 1 },
  recipeTitle: { fontSize: 15, fontWeight: "600", color: "#444", flexShrink: 1 },
  meta: { fontSize: 12, color: "#777", marginTop: 4 },
  description: { marginTop: 8, fontSize: 14, color: "#555" },
  icon: { width: 26, height: 26 },
  openBtn: { backgroundColor: "#4294ff", paddingHorizontal: 16, paddingVertical: 6, borderRadius: 10 },
  openBtnText: { color: "#fff", fontWeight: "500" },
  overlay: { flex: 1, backgroundColor: "rgba(0,0,0,0.4)", justifyContent: "center", alignItems: "center", padding: 16 },
  mealModalBox: { width: "90%", backgroundColor: "#fff", borderRadius: 16, padding: 16 },
  modalTitle: { fontSize: 18, fontWeight: "600", marginBottom: 12 },
  input: { borderWidth: 1, borderColor: "#ddd", borderRadius: 12, padding: 10, marginBottom: 8 },
  errorText: { color: "#4294ff", fontSize: 12, marginBottom: 8 },
  starRow: { flexDirection: "row", gap: 6, marginBottom: 12 },
  star: { width: 24, height: 24 },
  footerRow: { flexDirection: "row", gap: 12, marginTop: 12 },
  outlineBtn: { flex: 1, borderWidth: 1, borderColor: "#ddd", paddingVertical: 12, borderRadius: 12, alignItems: "center" },
  primaryBtn: { flex: 1, backgroundColor: "#4294ff", paddingVertical: 12, borderRadius: 12, alignItems: "center" },
  inputError: { borderColor: "#4294ff", },
});
