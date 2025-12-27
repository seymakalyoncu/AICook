import {View, Text, TextInput, TouchableOpacity, Alert, Image, StyleSheet, ScrollView, Platform,} from "react-native";
import { useEffect, useState } from "react";
import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { Picker } from "@react-native-picker/picker";
import DateTimePicker, { DateTimePickerEvent } from "@react-native-community/datetimepicker";
import Toast from "react-native-toast-message";

import DatePickerInput from "../components/DatePickerInput";

import { getGender } from "../services/gender";
import { register } from "../services/auth";

type AuthStackParamList = {
  Login: undefined;
  Register: undefined;
};

type NavigationProp = NativeStackNavigationProp<AuthStackParamList>;

export default function RegisterScreen() {
  const navigation = useNavigation<NavigationProp>();
  
  const today = new Date();
  
  const [genderList, setGenderList] = useState<any[]>([]);
  const [form, setForm] = useState({
    first_name: "",
    last_name: "",
    username: "",
    email: "",
    password: "",
    password_again: "",
    birthDate: "", // DD-MM-YYYY
    gender: "",
    is_staff: false,
    is_superuser: true,
  });

  /* -------- GENDER -------- */
  useEffect(() => {
    const fetchGender = async () => {
      try {
        const res = await getGender();
        setGenderList(res.data);
      } catch {
        Alert.alert("Cinsiyet bilgileri alınamadı");
      }
    };
    fetchGender();
  }, []);

  /* -------- CHANGE -------- */
  const handleChange = (name: string, value: string) => {
    if (name === "email") {
      setForm((prev) => ({
        ...prev,
        email: value,
        username: value,
      }));
    } else {
      setForm((prev) => ({ ...prev, [name]: value }));
    }
  };

  /* -------- DATE VALIDATION -------- */
  const isValidDate = (date: string) => {
    const regex = /^\d{4}-\d{2}-\d{2}$/;
    return regex.test(date);
  };

  /* -------- REGISTER -------- */
  const handleRegister = async () => {
    if (!isValidDate(form.birthDate)) {
      Alert.alert("Hata", "Doğum tarihi GG-AA-YYYY formatında olmalıdır");
      return;
    }

    if (form.password !== form.password_again) {
      Alert.alert("Hata", "Şifreler uyuşmuyor");
      return;
    }

    try {
      await register(form);

      Toast.show({
        type: "success",
        text1: "Başarılı",
        text2: "Şifreniz başarıyla güncellendi",
        position: "bottom",
        visibilityTime: 2000,
      });

      setTimeout(() => {
        navigation.navigate("Login");
      }, 2000);
    } catch (error: any) {
      if (error?.response?.data) {
        Object.values(error.response.data).forEach((msg: any) =>
          Alert.alert("Hata", String(msg))
        );
      } else {
        Alert.alert("Hata", "Kayıt başarısız");
      }
    }
  };

  /* -------- UI -------- */
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.header}>
        <Image
          source={require("../assets/images/aicook-logo.png")}
          style={styles.logo}
        />
        <Text style={styles.title}>AI Cooking Assistant</Text>
      </View>

      <View style={styles.card}>
        <View style={styles.row}>
          <TextInput
            placeholder="Ad"
            style={styles.input}
            onChangeText={(v) => handleChange("first_name", v)}
          />
          <TextInput
            placeholder="Soyad"
            style={styles.input}
            onChangeText={(v) => handleChange("last_name", v)}
          />
        </View>

        <DatePickerInput
            value={form.birthDate}
            placeholder="Doğum Tarihi"
            maximumDate={new Date()}
            onChange={(date) =>
              setForm((prev) => ({
                ...prev,
                birthDate: date,
              }))
            }
          />

        {/* CİNSİYET DROPDOWN */}
        <View style={styles.pickerWrapper}>
          <Picker
            selectedValue={form.gender}
            onValueChange={(value) => handleChange("gender", value)}
          >
            <Picker.Item label="Cinsiyet Seçiniz" value="" />
            {genderList.map((item) => (
              <Picker.Item
                key={item.id}
                label={item.name}
                value={String(item.id)}
              />
            ))}
          </Picker>
        </View>

        <TextInput
          placeholder="E-posta"
          style={styles.input}
          autoCapitalize="none"
          keyboardType="email-address"
          onChangeText={(v) => handleChange("email", v)}
        />

        <TextInput
          placeholder="Şifre"
          secureTextEntry
          style={styles.input}
          onChangeText={(v) => handleChange("password", v)}
        />

        <TextInput
          placeholder="Şifre Tekrar"
          secureTextEntry
          style={styles.input}
          onChangeText={(v) => handleChange("password_again", v)}
        />

        <TouchableOpacity style={styles.registerButton} onPress={handleRegister}>
          <Text style={styles.registerText}>Kayıt Ol</Text>
        </TouchableOpacity>

        {/* ZATEN HESABIN VAR MI */}
        <Text style={styles.bottomText}>
          Zaten hesabın var mı?{" "}
          <Text
            style={styles.loginLink}
            onPress={() => navigation.navigate("Login")}
          >
            Giriş Yap
          </Text>
        </Text>
      </View>
    </ScrollView>
  );
}
const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: "#FFFFFF",
    justifyContent: "center",
    padding: 24,
  },
  header: {
    alignItems: "center",
    marginBottom: 24,
  },
  logo: {
    width: 120,
    height: 120,
  },
  title: {
    fontSize: 24,
    fontWeight: "600",
    marginTop: 12,
    color: "#444444",
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
    marginBottom: 14,
  },
  pickerWrapper: {
    borderWidth: 1,
    borderColor: "#DDDDDD",
    borderRadius: 12,
    marginBottom: 14,
    overflow: "hidden",
  },
  registerButton: {
    backgroundColor: "#4294ff",
    paddingVertical: 14,
    borderRadius: 16,
    marginTop: 8,
  },
  registerText: {
    color: "#FFFFFF",
    textAlign: "center",
    fontWeight: "600",
    fontSize: 16,
  },
  bottomText: {
    marginTop: 24,
    textAlign: "center",
    fontSize: 14,
    color: "#999999",
  },
  loginLink: {
    color: "#4294ff",
    fontWeight: "500",
  },
});
