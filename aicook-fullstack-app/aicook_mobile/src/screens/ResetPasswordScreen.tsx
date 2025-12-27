import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  Image,
  StyleSheet,
} from "react-native";
import { useState } from "react";
import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { requestPasswordReset } from "../services/auth";
import Toast from "react-native-toast-message";

type AuthStackParamList = {
  Login: undefined;
  ResetPasswordRequest: undefined;
};

type NavigationProp = NativeStackNavigationProp<AuthStackParamList>;

export default function ResetPasswordScreen() {
  const navigation = useNavigation<NavigationProp>();
  const [email, setEmail] = useState("");

  const handleResetPassword = async () => {
    if (!email) {
      Alert.alert("Hata", "E-posta giriniz");
      return;
    }

    try {
      await requestPasswordReset({ email });

      Toast.show({
        type: "success",
        text1: "Başarılı",
        text2: "Şifreniz başarıyla güncellendi",
        position: "bottom",
        visibilityTime: 2000,
      });

      navigation.navigate("Login");
    } catch (error: any) {
      Alert.alert("Hata", "Şifre sıfırlama isteği başarısız");
    }
  };

  return (
    <View style={styles.container}>
      {/* HEADER */}
      <View style={styles.header}>
        <Image
          source={require("../assets/images/aicook-logo.png")}
          style={styles.logo}
        />
        <Text style={styles.title}>AI Cooking Assistant</Text>
      </View>

      {/* FORM */}
      <View style={styles.card}>
        <TextInput
          placeholder="E-posta"
          style={styles.input}
          autoCapitalize="none"
          keyboardType="email-address"
          value={email}
          onChangeText={setEmail}
        />

        <TouchableOpacity
          style={styles.button}
          onPress={handleResetPassword}
        >
          <Text style={styles.buttonText}>Şifre Sıfırla</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => navigation.navigate("Login")}>
          <Text style={styles.backText}>Geri Dön</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    justifyContent: "center",
    padding: 24,
  },
  header: {
    alignItems: "center",
    marginBottom: 32,
  },
  logo: {
    width: 128,
    height: 128,
  },
  title: {
    fontSize: 24,
    fontWeight: "600",
    marginTop: 16,
    color: "#444444",
    textAlign: "center",
  },
  card: {
    borderWidth: 1,
    borderColor: "#DDDDDD",
    borderRadius: 16,
    padding: 24,
  },
  input: {
    borderWidth: 1,
    borderColor: "#DDDDDD",
    borderRadius: 12,
    padding: 12,
    marginBottom: 16,
    fontSize: 16,
  },
  button: {
    backgroundColor: "#4294ff",
    paddingVertical: 14,
    borderRadius: 16,
  },
  buttonText: {
    color: "#FFFFFF",
    textAlign: "center",
    fontWeight: "600",
    fontSize: 16,
  },
  backText: {
    marginTop: 20,
    textAlign: "center",
    color: "#4294ff",
    fontSize: 14,
    fontWeight: "500",
  },
});
