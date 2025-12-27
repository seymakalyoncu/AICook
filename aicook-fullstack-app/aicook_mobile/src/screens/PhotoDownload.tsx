import {View, Text, TouchableOpacity, Image, StyleSheet, ScrollView, Alert,} from "react-native";
import { useEffect, useState, useContext } from "react";
import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import Header from "../components/Header";
import { getFridgePhotos } from "../services/fridge_photos";
import { AuthContext } from "../context/AuthContext";

type AppStackParamList = {
  FridgeAnalysis: { photoId: number };
};

type NavigationProp =
  NativeStackNavigationProp<AppStackParamList>;

export default function PhotoDownloadScreen() {
  const navigation = useNavigation<NavigationProp>();
  const { token } = useContext(AuthContext);

  const [photos, setPhotos] = useState<any[]>([]);
  const [openPhotoId, setOpenPhotoId] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchPhotos = async () => {
    try {
      const data = await getFridgePhotos(token!);
      setPhotos(data || []);
    } catch {
      Alert.alert("Hata", "Fotoğraflar alınamadı");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPhotos();
  }, []);

  /* -------- TOGGLE -------- */
  const togglePhoto = (id: number) => {
    setOpenPhotoId((prev) => (prev === id ? null : id));
  };

  /* -------- ANALYZE -------- */
  const handleAnalyze = (photoId: number) => {
    navigation.navigate("FridgeAnalysis", { photoId });
  };

  if (loading) return null;

  return (
    <View style={{ flex: 1, backgroundColor: "#fff" }}>
      <Header />

      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.title}>Yüklenen Fotoğraf Bilgileri</Text>

        <View style={styles.list}>
          {photos.map((photo) => {
            const isOpen = openPhotoId === photo.id;

            return (
              <View key={photo.id} style={styles.card}>
                {/* 🔹 TARİH + AÇ/KAPAT */}
                <View style={styles.headerRow}>
                  <Text style={styles.dateLabel}>
                    <Text style={styles.bold}>Yükleme Tarihi: </Text>
                    {new Date(photo.create_date).toLocaleDateString("tr-TR")}
                  </Text>

                  <TouchableOpacity
                    style={styles.openBtn}
                    onPress={() => togglePhoto(photo.id)}
                  >
                    <Text style={styles.btnText}>
                      {isOpen ? "Kapat" : "Aç"}
                    </Text>
                  </TouchableOpacity>
                </View>

                {/* 📷 FOTO + MALZEME TESPİT */}
                {isOpen && (
                  <>
                    <Image
                      source={{ uri: photo.url }}
                      style={styles.image}
                      resizeMode="cover"
                    />

                    <TouchableOpacity
                      style={styles.analyzeBtn}
                      onPress={() => handleAnalyze(photo.id)}
                    >
                      <Text style={styles.btnText}>
                        Malzeme Tespit Et
                      </Text>
                    </TouchableOpacity>
                  </>
                )}
              </View>
            );
          })}
        </View>
      </ScrollView>
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    padding: 16,
    paddingBottom: 40,
    backgroundColor: "#FFFFFF",
  },
  title: {
    fontSize: 22,
    fontWeight: "600",
    color: "#444444",
    marginBottom: 20,
  },
  list: {
    gap: 16,
  },
  card: {
    borderWidth: 1,
    borderColor: "#DDDDDD",
    borderRadius: 12,
    padding: 14,
    backgroundColor: "#fff",
  },

  /* ÜST SATIR */
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  dateLabel: {
    fontSize: 13,
    color: "#666",
  },
  bold: {
    fontWeight: "600",
    color: "#444",
  },

  /* AÇ / KAPAT */
  openBtn: {
    backgroundColor: "#4294ff",
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 8,
  },
  btnText: {
    color: "#fff",
    fontSize: 13,
    fontWeight: "500",
  },

  /* FOTO */
  image: {
    marginTop: 10,
    width: "100%",
    height: 260,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#DDDDDD",
  },

  /* MALZEME TESPİT */
  analyzeBtn: {
    marginTop: 10,
    backgroundColor: "#1a3752",
    paddingVertical: 10,
    borderRadius: 10,
    alignItems: "center",
  },
});
