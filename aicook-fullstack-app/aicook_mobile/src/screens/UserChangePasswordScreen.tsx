import {View, Text, TextInput, TouchableOpacity, StyleSheet,} from "react-native";
import { useState, useContext } from "react";
import Toast from "react-native-toast-message";
import { changePassword } from "../services/auth";
import { AuthContext } from "../context/AuthContext";
import Header from "../components/Header";

export default function ChangePasswordScreen() {
  const { token, userId } = useContext(AuthContext);

  const [password, setPassword] = useState("");
  const [passwordRepeat, setPasswordRepeat] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!password || !passwordRepeat) {
      Toast.show({
        type: "error",
        text1: "Hata",
        text2: "Tüm alanları doldurun",
        position: "bottom",
      });
      return;
    }

    if (password !== passwordRepeat) {
      Toast.show({
        type: "error",
        text1: "Hata",
        text2: "Şifreler uyuşmuyor",
        position: "bottom",
      });
      return;
    }

    if (!token || !userId) {
      Toast.show({
        type: "error",
        text1: "Oturum Hatası",
        text2: "Oturum bilgisi bulunamadı",
        position: "bottom",
      });
      return;
    }

    try {
      setLoading(true);

      await changePassword(userId, { password }, token);

      Toast.show({
        type: "success",
        text1: "Başarılı",
        text2: "Şifreniz başarıyla güncellendi",
        position: "bottom",
        visibilityTime: 2000,
      });

      setPassword("");
      setPasswordRepeat("");
    } catch {
      Toast.show({
        type: "error",
        text1: "Hata",
        text2: "Şifre güncellenirken bir hata oluştu",
        position: "bottom",
      });
    } finally {
      setLoading(false);
    }
  };

  /* ---------------- UI ---------------- */
  return (
    <View style={{ flex: 1, backgroundColor: "#fff" }}>
      <Header />

      <View style={styles.container}>
        <Text style={styles.title}>Şifre Değiştir</Text>

        <View style={styles.card}>
          <View style={styles.row}>
            <TextInput
              placeholder="Şifre"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
              style={styles.input}
            />

            <TextInput
              placeholder="Şifre Tekrar"
              value={passwordRepeat}
              onChangeText={setPasswordRepeat}
              secureTextEntry
              style={styles.input}
            />
          </View>

          <TouchableOpacity
            style={[styles.button, loading && styles.buttonDisabled]}
            onPress={handleSubmit}
            disabled={loading}
          >
            <Text style={styles.buttonText}>
              {loading ? "Güncelleniyor..." : "Şifreyi Güncelle"}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

/* ---------------- STYLES ---------------- */
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    padding: 24,
  },
  title: {
    fontSize: 22,
    fontWeight: "600",
    color: "#444444",
    marginBottom: 20,
  },
  card: {
    borderWidth: 1,
    borderColor: "#DDDDDD",
    borderRadius: 16,
    padding: 20,
  },
  row: {
    flexDirection: "row",
    gap: 12,
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#DDDDDD",
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginBottom: 16,
  },
  button: {
    backgroundColor: "#4294ff",
    paddingVertical: 14,
    borderRadius: 16,
    alignItems: "center",
    marginTop: 8,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonText: {
    color: "#FFFFFF",
    fontWeight: "600",
    fontSize: 16,
  },
});
