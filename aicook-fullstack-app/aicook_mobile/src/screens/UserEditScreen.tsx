import {View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, Alert,} from "react-native";
import { useEffect, useState, useContext } from "react";
import { Picker } from "@react-native-picker/picker";
import Header from "../components/Header";
import { getGender } from "../services/gender";
import { getUserById, updateUser } from "../services/users";
import { updateUsers } from "../services/auth";
import { AuthContext } from "../context/AuthContext";
import Toast from "react-native-toast-message";

export default function UserEditScreen() {
  const { token, userId, loading: authLoading } = useContext(AuthContext);

  const [genderList, setGenderList] = useState<any[]>([]);
  const [pageLoading, setPageLoading] = useState(true);

  const [formData, setFormData] = useState({
    name: "",
    surname: "",
    email: "",
    birthDate: "", // DD-MM-YYYY
    gender: "",
    usersId: 0,
    authUserId: 0,
  });

  /* ---------------- CINSIYET ---------------- */
  useEffect(() => {
    getGender()
      .then((res) => setGenderList(res.data))
      .catch(() =>
        Alert.alert("Hata", "Cinsiyet bilgileri alınamadı")
      );
  }, []);

  /* ---------------- USER DATA ---------------- */
  useEffect(() => {
    // Auth context hâlâ yükleniyorsa bekle
    if (authLoading) return;

    // Auth bitti ama login yok
    if (!token || !userId) {
      setPageLoading(false);
      return;
    }

    const fetchUser = async () => {
      try {
        const user = await getUserById(userId, token);

        const birthDate = `${String(user.birth_day).padStart(2, "0")}-${String(
          user.birth_month
        ).padStart(2, "0")}-${user.birth_year}`;

        setFormData({
          name: user.name || "",
          surname: user.surname || "",
          email: user.email || "",
          birthDate,
          gender: user.gender?.toString() || "",
          usersId: user.id,
          authUserId: user.user_id,
        });
      } catch (e) {
        console.log("FETCH USER ERROR:", e);
        Alert.alert("Hata", "Kullanıcı bilgileri yüklenemedi");
      } finally {
        setPageLoading(false); // 🔥 HER DURUMDA KAPANIR
      }
    };

    fetchUser();
  }, [authLoading, token, userId]);

  /* ---------------- UPDATE ---------------- */
  const handleUpdate = async () => {
    try {
      const dateRegex = /^\d{2}-\d{2}-\d{4}$/;
      if (!dateRegex.test(formData.birthDate)) {
        Alert.alert("Hata", "Doğum tarihi GG-AA-YYYY formatında olmalıdır");
        return;
      }

      const [day, month, year] = formData.birthDate.split("-");

      const profileData: any = {
        name: formData.name,          
        surname: formData.surname,
        birth_day: Number(day),
        birth_month: Number(month),
        birth_year: Number(year),
      };

      if (formData.gender) {
        profileData.gender = Number(formData.gender);
      };

      await updateUser(formData.usersId, profileData, token);

      const authData = {
        fisrt_name: formData.name,
        last_name: formData.surname,
      };

      await updateUsers(formData.authUserId, authData, token);

      Toast.show({
        type: "success",
        text1: "Güncellendi",
        text2: "Kullanıcı bilgileri başarıyla kaydedildi",
        position: "bottom",
        visibilityTime: 2000,
      });
    } catch {
      Toast.show({
        type: "error",
        text1: "Hata",
        text2: "Güncelleme sırasında bir sorun oluştu",
        position: "bottom",
      });
    }
  };

  /* ---------------- LOADING ---------------- */
  if (authLoading || pageLoading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Text>Yükleniyor...</Text>
      </View>
    );
  }

  /* ---------------- UI ---------------- */
  return (
    <View style={{ flex: 1, backgroundColor: "#fff" }}>
      <Header />

      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.title}>Kullanıcı Bilgileri</Text>

        <View style={styles.card}>
          <View style={styles.row}>
            <TextInput
              style={styles.input}
              placeholder="Ad"
              value={formData.name}
              onChangeText={(v) =>
                setFormData({ ...formData, name: v })
              }
            />

            <TextInput
              style={styles.input}
              placeholder="Soyad"
              value={formData.surname}
              onChangeText={(v) =>
                setFormData({ ...formData, surname: v })
              }
            />
          </View>

          <TextInput
            style={styles.input}
            placeholder="GG-AA-YYYY"
            keyboardType="number-pad"
            value={formData.birthDate}
            onChangeText={(v) =>
              setFormData({ ...formData, birthDate: v })
            }
          />

          <View style={styles.pickerWrapper}>
            <Picker
              selectedValue={formData.gender}
              onValueChange={(v) =>
                setFormData({ ...formData, gender: v })
              }
            >
              <Picker.Item label="Cinsiyet Seçiniz" value="" />
              {genderList.map((g) => (
                <Picker.Item
                  key={g.id}
                  label={g.name}
                  value={String(g.id)}
                />
              ))}
            </Picker>
          </View>

          <TextInput
            style={[styles.input, styles.disabledInput]}
            value={formData.email}
            editable={false}
          />

          <TouchableOpacity style={styles.button} onPress={handleUpdate}>
            <Text style={styles.buttonText}>Güncelle</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}

/* ---------------- STYLES ---------------- */
const styles = StyleSheet.create({
  container: {
    padding: 24,
  },
  title: {
    fontSize: 22,
    fontWeight: "600",
    color: "#444",
    marginBottom: 20,
  },
  card: {
    borderWidth: 1,
    borderColor: "#DDD",
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
    borderColor: "#DDD",
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginBottom: 14,
  },
  disabledInput: {
    backgroundColor: "#f2f2f2",
    color: "#999",
  },
  pickerWrapper: {
    borderWidth: 1,
    borderColor: "#DDD",
    borderRadius: 12,
    marginBottom: 14,
    overflow: "hidden",
  },
  button: {
    backgroundColor: "#4294ff",
    paddingVertical: 14,
    borderRadius: 16,
    alignItems: "center",
    marginTop: 8,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 16,
  },
});
