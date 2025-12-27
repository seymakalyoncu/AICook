import { View, Text, TextInput, TouchableOpacity, Alert, Image, StyleSheet,} from "react-native";
import { useContext, useState } from "react";
import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";

import { login } from "../services/auth";
import { AuthContext } from "../context/AuthContext";

/* ---------- NAV TYPE ---------- */
type AuthStackParamList = {
  Login: undefined;
  Register: undefined;
  ResetPassword: undefined;
  Main: undefined;
};

type NavigationProp =
  NativeStackNavigationProp<AuthStackParamList>;

export default function LoginScreen() {
  const { signIn } = useContext(AuthContext);
  const navigation = useNavigation<NavigationProp>();

  const [username, setUserName] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    try {
      const data = { username, password };
      const res = await login(data);

      signIn(res.access); // token dolunca AppNavigator yönlendirir
    } catch {
      Alert.alert("Giriş başarısız");
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Image
          source={require("../assets/images/aicook-logo.png")}
          style={styles.logo}
          resizeMode="contain"
        />
        <Text style={styles.title}>AI Cooking Assistant</Text>
      </View>

      <View style={styles.card}>
        <TextInput
          placeholder="E-posta"
          value={username}
          onChangeText={setUserName}
          style={styles.input}
          autoCapitalize="none"
        />

        <TextInput
          placeholder="Şifre"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          style={styles.input}
        />

        <TouchableOpacity
          style={styles.loginButton}
          onPress={handleLogin}
        >
          <Text style={styles.loginText}>Giriş Yap</Text>
        </TouchableOpacity>

        <View style={styles.links}>
          <TouchableOpacity
            onPress={() => navigation.navigate("Register")}
          >
            <Text style={styles.linkText}>Kayıt Ol</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => navigation.navigate("ResetPassword")}
          >
            <Text style={styles.linkText}>Şifremi Unuttum</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    justifyContent: "center",
    paddingHorizontal: 24,
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
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#DDDDDD",
    borderRadius: 16,
    padding: 24,
  },
  input: {
    borderWidth: 1,
    borderColor: "#DDDDDD",
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginBottom: 16,
    fontSize: 16,
  },
  loginButton: {
    backgroundColor: "#4294ff",
    paddingVertical: 14,
    borderRadius: 16,
    marginTop: 8,
  },
  loginText: {
    color: "#FFFFFF",
    textAlign: "center",
    fontWeight: "600",
    fontSize: 16,
  },
  links: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 24,
  },
  linkText: {
    fontSize: 14,
    color: "#4294ff",
    fontWeight: "500",
  },
});
