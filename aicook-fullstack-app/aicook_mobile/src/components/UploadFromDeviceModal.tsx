import { useState, useContext } from "react";
import { View, Text, Modal, TouchableOpacity, Image, ActivityIndicator, StyleSheet, Alert,} from "react-native";
import { launchImageLibrary } from "react-native-image-picker";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useNavigation } from "@react-navigation/native";
import { uploadFridgePhoto } from "../services/fridge_photos";
import { AuthContext } from "../context/AuthContext";

type Props = {
  visible: boolean;
  onClose: () => void;
};

type AppStackParamList = {
  FridgeAnalysis: { photoId: number };
};
type NavigationProp =
  NativeStackNavigationProp<AppStackParamList>;

export default function UploadFromDeviceModal({ visible, onClose }: Props) {
  const { token } = useContext(AuthContext);
  const navigation = useNavigation<NavigationProp>();
  const [image, setImage] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  /* 🔄 STATE RESET */
  const resetState = () => {
    setImage(null);
    setLoading(false);
  };

  /* 📂 GALERİ */
  const pickImage = async () => {
    const res = await launchImageLibrary({
      mediaType: "photo",
      quality: 0.8,
    });

    if (res.didCancel) return;
    if (res.errorCode) {
      Alert.alert("Fotoğraf seçilemedi");
      return;
    }

    setImage(res.assets?.[0]);
  };

  const handleUpload = async () => {
    if (!image) return null;

    try {
      setLoading(true);

      const file = {
        uri: image.uri,
        type: image.type || "image/jpeg",
        name: image.fileName || "photo.jpg",
      };

      const res = await uploadFridgePhoto(file, null, token);


      return res;

    } catch (e) {
      Alert.alert("Fotoğraf yüklenemedi");
      return null;
    } finally {
      setLoading(false);
    }
  };

  const handleAnalyze = async () => {
    const data = await handleUpload();

    if (!data) return;

    resetState();
    onClose();

    navigation.navigate("FridgeAnalysis", {
      photoId: data.id,
    });
  };

  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={styles.overlay}>
        <View style={styles.modalBox}>
          <Text style={styles.modalTitle}>Fotoğraf Yükle</Text>

          {/* FOTO SEÇ */}
          <TouchableOpacity
            style={styles.selectArea}
            onPress={pickImage}
            activeOpacity={0.8}
          >
            <Text style={styles.selectText}>
              {image ? "Fotoğrafı Değiştir" : "Fotoğraf Seç"}
            </Text>
          </TouchableOpacity>

          {/* PREVIEW */}
          {image && (
            <Image
              source={{ uri: image.uri }}
              style={styles.preview}
              resizeMode="contain"
            />
          )}

          {/* BUTONLAR */}
          <View style={styles.footerRow}>
            <TouchableOpacity
              style={styles.cancelBtn}
              onPress={() => {
                resetState();
                onClose();
              }}
              disabled={loading}
            >
              <Text style={styles.cancelText}>İptal</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.uploadBtn,
                !image && styles.uploadBtnDisabled,
              ]}
              disabled={!image || loading}
              onPress={handleAnalyze}
            >
              {loading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.uploadText} numberOfLines={2}>
                  Yükle ve Malzeme Tespit Et
                </Text>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}
const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "center",
    padding: 16,
  },

  modalBox: {
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 20,
  },

  modalTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#444",
    marginBottom: 16,
  },

  selectArea: {
    borderWidth: 1,
    borderStyle: "dashed",
    borderColor: "#CCCCCC",
    borderRadius: 12,
    paddingVertical: 18,
    alignItems: "center",
    backgroundColor: "#FAFAFA",
  },

  selectText: {
    color: "#666",
    fontSize: 14,
  },

  preview: {
    width: "100%",
    height: 180,
    marginTop: 14,
    borderRadius: 12,
    backgroundColor: "#F5F5F5",
  },

  footerRow: {
    flexDirection: "row",
    gap: 12,
    marginTop: 20,
  },

  cancelBtn: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#DDDDDD",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
  },

  cancelText: {
    color: "#444",
    fontWeight: "500",
  },

  uploadBtn: {
    flex: 1.5,
    backgroundColor: "#4294ff", // 🔥 TEK MAVİ
    borderRadius: 14,
    paddingVertical: 12,
    alignItems: "center",
    justifyContent: "center",
  },

  uploadBtnDisabled: {
    elevation: 0,
    borderWidth: 1,
    borderColor: "#AFCBFF", // ❌ opacity yok
  },

  uploadText: {
    color: "#FFFFFF",
    fontWeight: "600",
    fontSize: 14,
    textAlign: "center",
  },
});
