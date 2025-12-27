import { useEffect, useRef, useState, useContext } from "react";
import { View, Text, Modal, TouchableOpacity, Image, ActivityIndicator, StyleSheet, Alert,} from "react-native";
import { Camera, useCameraDevice, useCameraPermission,} from "react-native-vision-camera";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useNavigation } from "@react-navigation/native";
import { uploadFridgePhoto } from "../services/fridge_photos";
import { AuthContext } from "../context/AuthContext";
import { requestCameraPermission } from "../utils/permissions";

type Props = {
  visible: boolean;
  onClose: () => void;
};

type AppStackParamList = {
  FridgeAnalysis: { photoId: number };
};

type NavigationProp =
  NativeStackNavigationProp<AppStackParamList>;

export default function CameraConfirmModal({ visible, onClose }: Props) {
  const { token } = useContext(AuthContext);
  const navigation = useNavigation<NavigationProp>();
  const cameraRef = useRef<Camera>(null);
  const device = useCameraDevice("back");

  const [step, setStep] = useState<"confirm" | "camera" | "preview">("confirm");
  const [photo, setPhoto] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (visible) setStep("confirm");
  }, [visible]);

  const openCamera = async () => {

    const hasPermission = await requestCameraPermission();

    if (!hasPermission) {
      Alert.alert("Kamera izni verilmedi");
      onClose();
      return;
    }

    setStep("camera");
  };

  const takePhoto = async () => {
    if (!cameraRef.current) return;

    const result = await cameraRef.current.takePhoto({
      flash: "off",
    });

    setPhoto(result);
    setStep("preview");
  };

  const handleUpload = async () => {
    if (!photo) return null;

    try {
      setLoading(true);

      const file = {
        uri: "file://" + photo.path,
        name: "camera-photo.jpg",
        type: "image/jpeg",
      } as any;

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

    onClose(); // modal kapansın

    navigation.navigate("FridgeAnalysis", {
      photoId: data.id, // backend ne döndürüyorsa
    });
  };


  if (!visible) return null;

  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={styles.overlay}>
        <View style={styles.box}>
          {step === "confirm" && (
            <>
              <Text style={styles.text}>
                Kamerayı açmak istiyor musunuz?
              </Text>

              <View style={styles.row}>
                <TouchableOpacity style={styles.outlineBtn} onPress={onClose}>
                  <Text style={styles.outlineText}>Hayır</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.primaryBtn}
                  onPress={openCamera}
                >
                  <Text style={styles.primaryText}>Evet</Text>
                </TouchableOpacity>
              </View>
            </>
          )}

          {step === "camera" && device && (
            <>
              <View style={styles.cameraWrapper}>
                <Camera
                  ref={cameraRef}
                  style={styles.camera}
                  device={device}
                  isActive
                  photo
                />
              </View>
              <View style={styles.row}>
                <TouchableOpacity style={styles.outlineBtn} onPress={onClose}>
                  <Text style={styles.outlineText}>İptal</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.primaryBtnTakePhoto} onPress={takePhoto}>
                  <Text style={styles.primaryText}>Fotoğraf Çek</Text>
                </TouchableOpacity>
              </View>
            </>
          )}

          {step === "preview" && (
            <>
              <Image
                source={{ uri: "file://" + photo.path }}
                style={styles.preview}
              />

              <View style={styles.row}>
                <TouchableOpacity
                  style={styles.outlineBtn}
                  onPress={onClose}
                >
                  <Text style={styles.cancelText}>İptal</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.primaryBtn}
                  onPress={handleAnalyze}
                  disabled={loading}
                >
                  {loading ? (
                    <ActivityIndicator color="#fff" />
                  ) : (
                    <Text style={styles.uploadText}>
                      Yükle ve Malzeme Tespit Et
                    </Text>
                  )}
                </TouchableOpacity>
              </View>
            </>
          )}
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.6)",
    justifyContent: "center",
    padding: 16,
  },
  box: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 16,
  },
  text: {
    fontSize: 16,
    color: "#444",
    marginBottom: 20,
    textAlign: "center",
  },
  camera: {
    width: "100%",
    height: 360,
    borderRadius: 16,
    marginBottom: 16,
  },
  preview: {
    width: "100%",
    height: 300,
    borderRadius: 16,
    marginBottom: 16,
  },
  row: {
    flexDirection: "row",
    gap: 12,
  },
  outlineBtn: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#ddd",
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: "center",
  },
  outlineText: {
    color: "#444",
  },
  primaryBtn: {
    flex: 1.5,
    backgroundColor: "#4294ff",
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: "center",
    zIndex: 20,        // 🔥 iOS
    elevation: 20,     // 🔥 Android
  },
  primaryBtnTakePhoto: {
    flex: 1,
    backgroundColor: "#4294ff",
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: "center",
    zIndex: 20,        // 🔥 iOS
    elevation: 20,     // 🔥 Android
  },
  primaryText: {
    color: "#fff",
    fontWeight: "500"
  },
  cameraWrapper: {
    width: "100%",
    height: 360,
    borderRadius: 16,
    overflow: "hidden", // 🔥 BU OLMADAN OLMAZ
    marginBottom: 16,
  },
  uploadText: {
    color: "#FFFFFF",
    fontWeight: "600",
    fontSize: 14,
    textAlign: "center",
  },
  cancelText: {
    color: "#444",
    fontWeight: "500",
  },
});
