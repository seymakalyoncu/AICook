import React, { useEffect, useState, useContext } from "react";
import {View, Text, TextInput, TouchableOpacity, ScrollView, Modal, Image, StyleSheet,} from "react-native";
import Slider from "@react-native-community/slider";
import { Picker } from "@react-native-picker/picker";
import Header from "../components/Header";
import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import RecommendationStatus from "../components/RecommendationStatus";
import FridgePhotoActions from "../components/FridgePhotoActions";
import Toast from "react-native-toast-message";
import { getCategories } from "../services/categories";
import { getIngredients } from "../services/ingredients";
import { getCookingAreaType } from "../services/cooking_area_type";
import { getTimeType } from "../services/time_type";
import { searchRecipes } from "../services/recipes";
import { toggleFavoriteRecipe, getFavoriteStatus } from "../services/favorite_recipes";
import { addMealHistory } from "../services/meal_histories";

import { AuthContext } from "../context/AuthContext";

type AuthStackParamList = {
  /*Main: undefined;*/
  HistoryRecipes: undefined;
  FavoriteRecipes: undefined;
};

type NavigationProp =
  NativeStackNavigationProp<AuthStackParamList>;

export default function HomeScreen() {
  const { token, userId } = useContext(AuthContext);
  const navigation = useNavigation<NavigationProp>();
  /* ---------------- STATE ---------------- */
  const [searchText, setSearchText] = useState("");
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [searchLoading, setSearchLoading] = useState(false);
  const [openedRecipeId, setOpenedRecipeId] = useState<number | null>(null);

  const [showFilterModal, setShowFilterModal] = useState(false);
  const [showSearchModal, setShowSearchModal] = useState(false);
  const [showMealModal, setShowMealModal] = useState(false);

  const [categories, setCategories] = useState<any[]>([]);
  const [ingredients, setIngredients] = useState<any[]>([]);
  const [cookingAreas, setCookingAreas] = useState<any[]>([]);
  const [timeTypes, setTimeTypes] = useState<any[]>([]);

  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedIngredients, setSelectedIngredients] = useState<number[]>([]);
  const [selectedCookingArea, setSelectedCookingArea] = useState("");
  const [selectedTimeType, setSelectedTimeType] = useState("");
  const [cookTime, setCookTime] = useState<number | null>(null);

  const [favoriteStatus, setFavoriteStatus] = useState<Record<number, boolean>>({});

  const [selectedRecipeForMeal, setSelectedRecipeForMeal] = useState<any>(null);
  const [mealDate, setMealDate] = useState("");
  const [mealRating, setMealRating] = useState(0);
  const [mealComment, setMealComment] = useState("");
  const [mealError, setMealError] = useState<string | null>(null);

  const resetFilterState = () => {
    setSelectedCategory("");
    setSelectedIngredients([]);
    setSelectedCookingArea("");
    setSelectedTimeType("");
    setCookTime(null);
  };

  useEffect(() => {
    getCategories().then(r => setCategories(r.data));
    getIngredients().then(r => setIngredients(r.data));
    getCookingAreaType().then(r => setCookingAreas(r.data));
    getTimeType().then(r => setTimeTypes(r.data));
  }, []);

  const handleSearch = async (isFilter = false) => {
    try {
      setSearchLoading(true);

      const payload = isFilter
        ? {
            searchType: "filter",
            ingredients: selectedIngredients,
            category: selectedCategory || null,
            cooking_area_type: selectedCookingArea || null,
            time_type: selectedTimeType || null,
            cook_time: cookTime ?? undefined,
          }
        : {
            searchType: "input",
            ingredients: searchText,
          };

      const res = await searchRecipes(payload);
      setSearchResults(res.data || []);
      setOpenedRecipeId(null);
      setShowSearchModal(true);
    } finally {
      setSearchLoading(false);
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: "#fff" }}>
      <Header />

      <View style={styles.searchBar}>
        <View style={styles.searchInput}>

        <TouchableOpacity onPress={() => handleSearch(false)}>
          <Image
            source={require("../assets/images/search.png")}
            style={styles.iconSmall}
          />
        </TouchableOpacity>
         <TextInput
            placeholder="Malzemeleri ; ile ayırın..."
            value={searchText}
            onChangeText={setSearchText}
            onSubmitEditing={() => handleSearch(false)}
            style={{ flex: 1 }}
            returnKeyType="search"   // 👈 klavyede search görünsün
          />
        </View>

        <TouchableOpacity onPress={() => setShowFilterModal(true)}></TouchableOpacity>

        <TouchableOpacity onPress={() => {resetFilterState(); setShowFilterModal(true); }}>
          <Image source={require("../assets/images/filter.png")} style={styles.iconMedium} />
        </TouchableOpacity>
      </View>

      <RecommendationStatus />

      <Modal visible={showFilterModal} transparent animationType="fade">
        <View style={styles.overlay}>
          <View style={styles.filterModalBox}>

            <Text style={styles.modalTitle}>Filtre</Text>

            <ScrollView
              contentContainerStyle={styles.filterContent}
              showsVerticalScrollIndicator={false}
            >
              <Text style={styles.label}>Kategori</Text>
              <View style={styles.pickerWrapper}>
                <Picker
                  selectedValue={selectedCategory}
                  onValueChange={setSelectedCategory}
                >
                  <Picker.Item label="Kategori Seçiniz" value="" />
                  {categories.map(c => (
                    <Picker.Item
                      key={c.id}
                      label={c.name}
                      value={String(c.id)}
                    />
                  ))}
                </Picker>
              </View>

              <Text style={styles.label}>Malzeme Listesi</Text>
              <View style={styles.ingredientsBox}>
                <ScrollView nestedScrollEnabled decelerationRate="normal" overScrollMode="never">
                  {ingredients.map(i => {
                    const active = selectedIngredients.includes(i.id);
                    return (
                      <TouchableOpacity
                        key={i.id}
                        style={styles.checkboxRow}
                        onPress={() =>
                          setSelectedIngredients(prev =>
                            prev.includes(i.id)
                              ? prev.filter(x => x !== i.id)
                              : [...prev, i.id]
                          )
                        }
                      >
                        <View
                          style={[
                            styles.checkbox,
                            active && styles.checkboxActive,
                          ]}
                        />
                        <Text style={styles.checkboxText}>{i.name}</Text>
                      </TouchableOpacity>
                    );
                  })}
                </ScrollView>
              </View>

              <View style={styles.timeRow}>
                <View style={styles.sliderColumn}>
                  <Text style={styles.label}>
                    Pişirme Süresi: {cookTime === null ? "" : cookTime}
                  </Text>

                  <Slider
                    minimumValue={0}
                    maximumValue={120}
                    step={5}
                    value={cookTime ?? 30}
                    onValueChange={v => setCookTime(v)}
                    minimumTrackTintColor="#4294ff"
                  />
                </View>

                <View style={styles.timeTypeColumn}>
                  {timeTypes.map(t => (
                    <TouchableOpacity
                      key={t.id}
                      style={styles.radioRow}
                      onPress={() => setSelectedTimeType(String(t.id))}
                    >
                      <View
                        style={[
                          styles.radio,
                          selectedTimeType === String(t.id) && styles.radioActive,
                        ]}
                      />
                      <Text style={styles.radioText}>{t.name}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              <Text style={styles.label}>Pişirme Yeri</Text>
              <View style={styles.radioWrap}>
                {cookingAreas.map(c => (
                  <TouchableOpacity
                    key={c.id}
                    style={styles.radioRow}
                    onPress={() => setSelectedCookingArea(String(c.id))}
                  >
                    <View
                      style={[
                        styles.radio,
                        selectedCookingArea === String(c.id) &&
                          styles.radioActive,
                      ]}
                    />
                    <Text style={styles.radioText}>{c.name}</Text>
                  </TouchableOpacity>
                ))}
              </View>

            </ScrollView>

            <View style={styles.filterFooter}>
              <TouchableOpacity
                style={styles.filterOutlineBtn}
                onPress={() => {
                  setSelectedCategory("");
                  setSelectedIngredients([]);
                  setSelectedCookingArea("");
                  setSelectedTimeType("");
                  setCookTime(null);
                }}
              >
                <Text style={styles.filterOutlineText}>Temizle</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.filterOutlineBtn}
                onPress={() => setShowFilterModal(false)}
              >
                <Text style={styles.filterOutlineText}>Kapat</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.filterPrimaryBtn}
                onPress={() => {
                  handleSearch(true);
                  setShowFilterModal(false);
                }}
              >
                <Text style={styles.filterPrimaryText}>Uygula</Text>
              </TouchableOpacity>
            </View>

          </View>
        </View>
      </Modal>

      <Modal visible={showSearchModal} transparent animationType="fade">
        <View style={styles.overlay}>
          <View style={[styles.modalBox, { maxHeight: "75%" }]}>
            <Text style={styles.modalTitle}>{searchResults.length} Tarif Bulundu</Text>

            <ScrollView>
              {searchResults.map(item => {
                const isOpen = openedRecipeId === item.id;
                return (
                  <View key={item.id} style={styles.card}>
                    <View style={styles.cardHeader}>
                      <View style={{ flex: 1 }}>
                        <Text style={styles.recipeTitle}>{item.recipe}</Text>
                        <Text style={styles.recipeMeta}>
                          {item.category_name} • {item.cooking_area_name} • {item.servings} porsiyon • {item.cooking_time} {item.time_type_name}
                        </Text>
                      </View>

                      <TouchableOpacity
                        style={styles.primaryBtnSmall}
                        onPress={async () => {
                          if (!isOpen && token) {
                            const res = await getFavoriteStatus(item.id, token);
                            setFavoriteStatus(p => ({ ...p, [item.id]: res}));
                          }
                          setOpenedRecipeId(isOpen ? null : item.id);
                        }}
                      >
                        <Text style={{ color: "#fff" }}>{isOpen ? "Kapat" : "Aç"}</Text>
                      </TouchableOpacity>
                    </View>

                    {isOpen && (
                      <View style={styles.cardOpen}>
                        <Text style={styles.description}>{item.description || "Açıklama yok"}</Text>

                        <View style={styles.iconColumn}>
                          <TouchableOpacity
                            onPress={async () => {
                              const res = await toggleFavoriteRecipe({ recipe_id: item.id }, token!);
                              setFavoriteStatus(p => ({ ...p, [item.id]: res.active === 1 }));
                            }}
                          >
                            <Image
                              source={
                                favoriteStatus[item.id]
                                  ? require("../assets/images/love_blue.png")
                                  : require("../assets/images/love.png")
                              }
                              style={styles.iconMedium}
                            />
                          </TouchableOpacity>

                          <TouchableOpacity
                            onPress={() => {
                              setSelectedRecipeForMeal(item);
                              setShowMealModal(true);
                            }}
                          >
                            <Image source={require("../assets/images/done.png")} style={styles.iconMedium} />
                          </TouchableOpacity>
                        </View>
                      </View>
                    )}
                  </View>
                );
              })}
            </ScrollView>

            <View style={styles.modalFooter}>
              <TouchableOpacity
                style={styles.outlineBtn}
                onPress={() => setShowSearchModal(false)}
              >
                <Text style={styles.outlineText}>Kapat</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      <View style={styles.bottomBar}>
        {/* HISTORY */}
        <TouchableOpacity
          onPress={() => navigation.navigate("HistoryRecipes")}
          activeOpacity={0.7}
        >
          <Image
            source={require("../assets/images/past.png")}
            style={styles.bottomIconalt}
          />
        </TouchableOpacity>
      <FridgePhotoActions />
        {/* FAVORITES */}
        <TouchableOpacity
          onPress={() => navigation.navigate("FavoriteRecipes")}
          activeOpacity={0.7}
        >
          <Image
            source={require("../assets/images/love.png")}
            style={styles.bottomIconalt}
          />
        </TouchableOpacity>
      </View>

      <Modal visible={showMealModal} transparent animationType="fade">
        <View style={styles.overlay}>
          <View style={styles.mealModalBox}>

            {/* TITLE */}
            <Text style={styles.modalTitle}>Yemek Yapılma Bilgisi</Text>

            {/* DATE */}
            <TextInput
              placeholder="GG-AA-YYYY"
              value={mealDate}
              keyboardType="number-pad"
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

            {/* RATING */}
            <View style={styles.starRow}>
              {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(s => (
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

            {/* COMMENT */}
            <TextInput
              placeholder="Yorum"
              value={mealComment}
              onChangeText={setMealComment}
              style={[styles.input, { height: 80 }]}
              multiline
            />

            {/* FOOTER BUTTONS */}
            <View style={styles.mealFooter}>
              <TouchableOpacity
                style={styles.mealCancelBtn}
                onPress={() => {
                  setShowMealModal(false);
                  setMealError(null);
                }}
              >
                <Text style={styles.mealCancelText}>Vazgeç</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.mealSaveBtn}
                onPress={async () => {
                  const regex = /^\d{2}-\d{2}-\d{4}$/;

                  if (!regex.test(mealDate)) {
                    setMealError("Tarih GG-AA-YYYY formatında olmalı");
                    return;
                  }

                  const [d, m, y] = mealDate.split("-");

                  await addMealHistory(
                    {
                      recipe_id: selectedRecipeForMeal.id,
                      user_id: userId,
                      cooked_date: `${y}-${m}-${d}`,
                      rating: mealRating,
                      comment: mealComment,
                    },
                    token!
                  );

                  Toast.show({
                    type: "success",
                    text1: "Yemek kaydedildi",
                  });

                  setShowMealModal(false);
                  setMealDate("");
                  setMealRating(0);
                  setMealComment("");
                  setMealError(null);
                }}
              >
                <Text style={styles.mealSaveText}>Kaydet</Text>
              </TouchableOpacity>
            </View>

          </View>
        </View>
      </Modal>

    </View>
  );
}
const styles = StyleSheet.create({
  searchBar: {
    flexDirection: "row",
    padding: 16,
    gap: 12,
  },
  searchInput: {
    flex: 1,
    flexDirection: "row",
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 12,
    paddingHorizontal: 12,
    alignItems: "center",
  },
  iconSmall: { width: 20, height: 20, marginRight: 8 },
  iconMedium: { width: 28, height: 28 },
  iconLarge: { width: 48, height: 48 },

  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "center",
    padding: 16,
  },
  modalBox: {
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 16,
    maxHeight: "80%",
  },
  
  modalTitle: {
    fontSize: 20,
    fontWeight: "600",
    marginBottom: 12,
  },
  label: {
    marginTop: 12,
    fontWeight: "600",
  },
  pickerWrapper: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 12,
    overflow: "hidden",
  },
  ingredientsBox: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    maxHeight: 180,
    marginTop: 8,
  },
  checkboxRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    padding: 8,
  },
  checkbox: {
    width: 16,
    height: 16,
    borderWidth: 1,
    borderColor: "#444",
  },
  checkboxActive: {
    backgroundColor: "#4294ff",
  },
  footerRow: {
    flexDirection: "row",
    gap: 8,
    marginTop: 16,
  },
  modalFooter: {
    paddingTop: 12,
    borderTopWidth: 1,
    borderColor: "#eee",
  },

  outlineBtn: {
    borderWidth: 1,
    borderColor: "#ddd",
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: "center",
    backgroundColor: "#fff",
  },

  outlineText: {
    color: "#444",
    fontWeight: "500",
  },
  primaryBtn: {
    flex: 1,
    backgroundColor: "#4294ff",
    padding: 12,
    borderRadius: 12,
    alignItems: "center",
  },
  primaryBtnSmall: {
    backgroundColor: "#4294ff",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 10,
  },
  card: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 12,
    padding: 12,
    marginBottom: 10,
  },
  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  recipeTitle: { fontWeight: "600", fontSize: 15 },
  recipeMeta: { fontSize: 12, color: "#777" },
  cardOpen: {
    flexDirection: "row",
    gap: 12,
    marginTop: 10,
  },
  description: {
    flex: 1,
    fontSize: 14,
    color: "#444",
  },
  iconColumn: {
    alignItems: "center",
    gap: 12,
  },
  bottomBar: {
    position: "absolute",
    bottom: 16,
    left: 0,
    right: 0,
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 12,
    padding: 10,
    marginBottom: 10,
  },
  starRow: {
    flexDirection: "row",
    gap: 6,
    marginBottom: 10,
  },
  star: {
    width: 24,
    height: 24,
  },
  filterModalBox: {
    width: "92%",
    maxHeight: "85%",
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 16,
    alignSelf: "center",
  },

  filterContent: {
    paddingBottom: 20,
  },

  timeRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginTop: 8,
  },

  sliderColumn: {
    flex: 1,
  },

  timeTypeColumn: {
    justifyContent: "center",  // 🔥 slider ortasına hizalar
    gap: 6,
  },

  radioColumn: {
    justifyContent: "center",
    gap: 8,
  },

  radioWrap: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
    marginTop: 8,
  },

  radioRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },

  radio: {
    width: 16,
    height: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#444",
  },

  radioActive: {
    backgroundColor: "#4294ff",
  },

  radioText: {
    fontSize: 14,
    color: "#444",
  },

  filterFooter: {
    flexDirection: "row",
    gap: 8,
    marginTop: 12,
  },

  filterOutlineBtn: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 12,
    paddingVertical: 12,
    alignItems: "center",
  },

  filterOutlineText: {
    color: "#444",
    fontWeight: "500",
  },

  filterPrimaryBtn: {
    flex: 1,
    backgroundColor: "#4294ff",
    borderRadius: 12,
    paddingVertical: 12,
    alignItems: "center",
  },

  filterPrimaryText: {
    color: "#fff",
    fontWeight: "600",
  },
  checkboxText: {
    fontSize: 14,
    color: "#444",
  },

  mealModalBox: {
    width: "90%",
    maxHeight: "60%",
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 16,
    alignSelf: "center",
    overflow: "hidden",
  },

  mealFooter: {
    flexDirection: "row",
    gap: 12,
    marginTop: 16,
  },

  mealCancelBtn: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#DDDDDD",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
  },

  mealCancelText: {
    color: "#444444",
    fontWeight: "500",
  },

  mealSaveBtn: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 12,
    backgroundColor: "#4294ff",
    alignItems: "center",
  },

  mealSaveText: {
    color: "#FFFFFF",
    fontWeight: "600",
  },

  inputError: {
    borderColor: "#4294ff",
  },

  errorText: {
    color: "#4294ff",
    fontSize: 12,
    marginTop: 4,
    marginBottom: 6,
  },

  bottomBaralt: {
    position: "absolute",
    bottom: 20,
    left: 0,
    right: 0,
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 50,   // 🔥 kenarlardan boşluk
    alignItems: "center",
  },

  bottomIconalt: {
    width: 60,               // 🔥 eskisi 48 idi
    height: 60,
    resizeMode: "contain",
  },

});
