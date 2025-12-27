import {View, Text, ScrollView, TouchableOpacity, StyleSheet, Modal, ActivityIndicator, TextInput, Image,} from "react-native";
import { useEffect, useState, useContext } from "react";
import { useRoute } from "@react-navigation/native";
import Toast from "react-native-toast-message";

import { analyzeFridgePhoto } from "../services/fridge_detect";
import { getIngredients } from "../services/ingredients";
import { searchRecipes } from "../services/recipes";
import { toggleFavoriteRecipe, getFavoriteStatus,} from "../services/favorite_recipes";
import { addMealHistory } from "../services/meal_histories";
import { AuthContext } from "../context/AuthContext";
import Header from "../components/Header";

export default function FridgeAnalysisScreen() {
  const route = useRoute<any>();
  const { photoId } = route.params;
  const { token, userId } = useContext(AuthContext);

  const [ingredients, setIngredients] = useState<any[]>([]);
  const [allIngredients, setAllIngredients] = useState<any[]>([]);
  const [recipes, setRecipes] = useState<any[] | null>(null);
  const [openedRecipeId, setOpenedRecipeId] = useState<number | null>(null);

  const [ingredientModalOpen, setIngredientModalOpen] = useState(false);
  const [favoriteStatus, setFavoriteStatus] = useState<any>({});
  const [loading, setLoading] = useState(true);

  const [showMealModal, setShowMealModal] = useState(false);
  const [mealDate, setMealDate] = useState("");
  const [mealRating, setMealRating] = useState(0); 
  const [mealComment, setMealComment] = useState("");
  const [selectedRecipe, setSelectedRecipe] = useState<any>(null);
  const [mealError, setMealError] = useState("");

  useEffect(() => {
    const fetchIngredients = async () => {
      try {
        const res = await analyzeFridgePhoto(photoId, token);
        setIngredients(
          (res.ingredients || []).map((i: any) => ({
            ...i,
            selected: true,
          }))
        );
      } catch {
        Toast.show({ type: "error", text1: "Analiz hatası" });
      } finally {
        setLoading(false);
      }
    };
    fetchIngredients();
  }, [photoId]);

  useEffect(() => {
    if (ingredientModalOpen) {
      getIngredients().then((res) => {
        setAllIngredients(
          res.data.map((i: any) => ({
            ...i,
            selected: ingredients.some((ing) => ing.id === i.id),
          }))
        );
      });
    }
  }, [ingredientModalOpen]);

  const toggleIngredient = (idx: number, modal = false) => {
    const setter = modal ? setAllIngredients : setIngredients;
    setter((prev) =>
      prev.map((i, index) =>
        index === idx ? { ...i, selected: !i.selected } : i
      )
    );
  };

  const addIngredientsFromModal = () => {
    setIngredients(allIngredients.filter((i) => i.selected));
    setIngredientModalOpen(false);
  };

  const handleGetRecipes = async () => {
    const ids = ingredients.filter((i) => i.selected).map((i) => i.id);
    if (!ids.length) return setRecipes([]);

    const res = await searchRecipes({
      searchType: "filter",
      ingredients: ids,
    });
    setRecipes(res.data || []);
  };

const handleSaveMeal = async () => {
  const regex = /^\d{2}-\d{2}-\d{4}$/;

  if (!regex.test(mealDate)) {
    setMealError("Tarih GG-AA-YYYY formatında olmalı");
    return;
  }

  try {
    const [day, month, year] = mealDate.split("-");
    const cookedDateISO = `${year}-${month}-${day}`;

    await addMealHistory(
      {
        recipe_id: selectedRecipe.id,
        user_id: userId,
        cooked_date: cookedDateISO, 
        rating: mealRating || null, 
        comment: mealComment || "",
      },
      token
    );

    Toast.show({
      type: "success",
      text1: "Yemek kaydedildi",
    });

    setShowMealModal(false);
    setMealDate("");
    setMealRating(0);
    setMealComment("");
    setSelectedRecipe(null);

  } catch (e) {
    console.log("MEAL SAVE ERROR:", e);
    Toast.show({
      type: "error",
      text1: "Kayıt sırasında hata oluştu",
    });
  }
};


  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" />
        <Text>Analiz ediliyor...</Text>
      </View>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: "#fff" }}>
      <Header />

      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.title}>Tespit Edilen Malzemeler</Text>

        {/* ÜST MALZEMELER */}
        {ingredients.map((i, idx) => (
          <TouchableOpacity
            key={i.id}
            style={[
              styles.ingredientItem,
              i.selected && styles.ingredientSelected,
            ]}
            onPress={() => toggleIngredient(idx)}
          >
            <Text style={[ i.selected && styles.btnTextWhite, ]}>{i.name}</Text>
          </TouchableOpacity>
        ))}

        <View style={styles.row}>
          <TouchableOpacity
            style={styles.secondaryBtn}
            onPress={() => setIngredientModalOpen(true)}
          >
            <Text style={styles.btnText}>Malzeme Ekle</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.primaryBtn}
            onPress={handleGetRecipes}
          >
            <Text style={styles.btnText}>Tarifleri Getir</Text>
          </TouchableOpacity>
        </View>

        {recipes?.map((r) => {
          const isOpen = openedRecipeId === r.id;

          return (
            <View key={r.id} style={styles.recipeCard}>
              <View style={styles.recipeHeader}>
                <View style={{ flex: 1 }}>
                  <Text style={styles.recipeTitle}>{r.recipe}</Text>
                  <Text style={styles.recipeMeta}>
                    {r.category_name} • {r.cooking_area_name} •{" "}
                    {r.servings} porsiyon • {r.cooking_time}{" "}
                    {r.time_type_name}
                  </Text>

                  {/* TARİF MALZEMELERİ */}
                  <Text style={styles.recipeIngredients}>
                    {r.recipe_ingredient_list?.map((ing: any, i: number) => (
                      <Text
                        key={ing.id}
                        style={{
                          color: ing.selected ? "#1a3752" : "#ef4444",
                        }}
                      >
                        {ing.name}
                        {i <
                        r.recipe_ingredient_list.length - 1
                          ? " - "
                          : ""}
                      </Text>
                    ))}
                  </Text>
                </View>

                <TouchableOpacity
                  style={styles.openBtn}
                  onPress={async () => {
                    setOpenedRecipeId(isOpen ? null : r.id);
                    if (!isOpen) {
                      const fav = await getFavoriteStatus(r.id, token);
                      setFavoriteStatus((p: any) => ({
                        ...p,
                        [r.id]: fav,
                      }));
                    }
                  }}
                >
                  <Text style={styles.btnText}>
                    {isOpen ? "Kapat" : "Aç"}
                  </Text>
                </TouchableOpacity>
              </View>

              {isOpen && (
                <>
                  <Text style={styles.recipeDesc}>
                    {r.description || "Açıklama yok"}
                  </Text>

                  <View style={styles.iconRow}>
                    <TouchableOpacity
                      onPress={async () => {
                        const res = await toggleFavoriteRecipe(
                          { recipe_id: r.id },
                          token
                        );
                        setFavoriteStatus((p: any) => ({
                          ...p,
                          [r.id]: res.active === 1,
                        }));
                      }}
                    >
                      <Image
                        source={
                          favoriteStatus[r.id]
                            ? require("../assets/images/love_blue.png")
                            : require("../assets/images/love.png")
                        }
                        style={styles.icon}
                      />
                    </TouchableOpacity>

                    <TouchableOpacity
                      onPress={() => {
                        setSelectedRecipe(r);
                        setMealRating(0);
                        setShowMealModal(true);
                      }}
                    >
                      <Image
                        source={require("../assets/images/done.png")}
                        style={styles.icon}
                      />
                    </TouchableOpacity>
                  </View>
                </>
              )}
            </View>
          );
        })}
      </ScrollView>

      <Modal visible={ingredientModalOpen} transparent animationType="fade">
        <View style={styles.modalOverlay}>
            <View style={styles.modalBox}>
            <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>Malzeme Ekle</Text>
            </View>

            <ScrollView
                style={styles.modalContent}
                contentContainerStyle={{ paddingBottom: 12 }}
            >
                {allIngredients.map((i, idx) => (
                <TouchableOpacity
                    key={i.id}
                    onPress={() => toggleIngredient(idx, true)}
                    style={[
                    styles.ingredientItem,
                    i.selected && styles.ingredientSelected,
                    ]}
                >
                    <Text
                    style={[
                        styles.ingredientText,
                        i.selected && styles.ingredientTextSelected,
                    ]}
                    >
                    {i.name}
                    </Text>
                </TouchableOpacity>
                ))}
            </ScrollView>

            <View style={styles.modalFooter}>
                <TouchableOpacity
                style={styles.secondaryBtn}
                onPress={() => setIngredientModalOpen(false)}
                >
                <Text style={styles.btnText}>Kapat</Text>
                </TouchableOpacity>

                <TouchableOpacity
                style={styles.primaryBtn}
                onPress={addIngredientsFromModal}
                >
                <Text style={styles.btnText}>Ekle</Text>
                </TouchableOpacity>
            </View>

            </View>
        </View>
        </Modal>

        <Modal visible={showMealModal} transparent animationType="fade">
            <View style={styles.modalOverlay}>
                <View style={styles.mealModalBox}>

                <View style={styles.modalHeader}>
                    <Text style={styles.modalTitle}>Yemek Bilgisi</Text>
                </View>
                <ScrollView
                    style={styles.modalContent}
                    keyboardShouldPersistTaps="handled"
                >
                    <TextInput
                        placeholder="GG-AA-YYYY"
                        value={mealDate}
                        onChangeText={(v) => {
                            setMealDate(v);
                            setMealError("");
                        }}
                        style={styles.input}
                        />

                        {mealError ? (
                        <Text style={styles.errorText}>{mealError}</Text>
                        ) : null}

                    <View style={styles.starRow}>
                    {[1,2,3,4,5,6,7,8,9,10].map((s) => (
                        <TouchableOpacity
                        key={s}
                        onPress={() => setMealRating(s)}
                        activeOpacity={0.7}
                        >
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
                    style={[styles.input, styles.textArea]}
                    multiline
                    />
                </ScrollView>

                <View style={styles.modalFooter}>
                    <TouchableOpacity
                    style={styles.secondaryBtn}
                    onPress={() => setShowMealModal(false)}
                    >
                    <Text style={styles.btnText}>Vazgeç</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                    style={styles.primaryBtn}
                    onPress={handleSaveMeal}
                    >
                    <Text style={styles.btnText}>Kaydet</Text>
                    </TouchableOpacity>
                </View>

                </View>
            </View>
        </Modal>
   </View>
  );
}

const styles = StyleSheet.create({
  container: { padding: 16 },
  title: { fontSize: 20, fontWeight: "600", marginBottom: 12 },

  ingredientItem: {
    padding: 10,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    marginBottom: 6,
  },
  ingredientSelected: { backgroundColor: "#b8e3fe", color: "#fff", },

  row: { flexDirection: "row", gap: 8, marginVertical: 10 },
  primaryBtn: {
    flex: 1,
    backgroundColor: "#4294ff",
    padding: 12,
    borderRadius: 10,
    alignItems: "center",
  },
  secondaryBtn: {
    flex: 1,
    backgroundColor: "#1a3752",
    padding: 12,
    borderRadius: 10,
    alignItems: "center",
  },
  btnText: { color: "#fff", fontWeight: "600" },

  btnTextWhite: { color: "#444444" },

  recipeCard: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
  },
  recipeHeader: { flexDirection: "row", gap: 8 },
  recipeTitle: { fontWeight: "600", fontSize: 16 },
  recipeMeta: { fontSize: 12, color: "#666", marginVertical: 2 },
  recipeIngredients: { fontSize: 12 },

  recipeDesc: { marginTop: 8, color: "#555" },

  iconRow: { flexDirection: "row", gap: 16, marginTop: 10 },
  icon: { width: 26, height: 26 },

  openBtn: {
    backgroundColor: "#4294ff",
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 8,
    height: 35,
  },

  errorText: {
    color: "#4294ff",
    fontSize: 13,
    marginBottom: 8,
    marginTop: -4,
    },

  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "center",
    alignItems: "center",
  },
 

  input: {
    borderWidth: 1,
    borderColor: "#DDD",
    borderRadius: 10,
    padding: 12,
    marginBottom: 14,
  },

  starRow: { justifyContent: "center", flexDirection: "row", flexWrap: "wrap", gap: 6, marginBottom: 16, },
  star: { width: 26, height: 26 },

  center: { flex: 1, justifyContent: "center", alignItems: "center" },
    modalBox: {
    backgroundColor: "#fff",
    width: "90%",
    maxHeight: "80%",
    borderRadius: 16,
    overflow: "hidden", // 🔥 çok önemli
    },

    modalHeader: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
    backgroundColor: "#fff",
    },

    modalTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#444",
    },

    modalContent: {
    padding: 16,
    },

    modalFooter: {
    flexDirection: "row",
    gap: 10,
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: "#eee",
    backgroundColor: "#fff",
    },

    ingredientText: {
    color: "#444",
    },

    ingredientTextSelected: {
    color: "#fff",
    fontWeight: "600",
    },

    mealModalBox: {
        backgroundColor: "#fff",
        width: "90%",
        maxHeight: "75%",
        borderRadius: 16,
        overflow: "hidden",
        },

    textArea: {
        height: 80,
        textAlignVertical: "top",
        },
});
