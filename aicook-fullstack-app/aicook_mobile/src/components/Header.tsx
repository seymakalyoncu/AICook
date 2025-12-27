import {View, Text, TouchableOpacity, Image, StyleSheet, Modal, TextInput, ScrollView, Alert,} from "react-native";
import { useEffect, useRef, useState, useContext } from "react";
import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { userInfo } from "../services/auth";
import { sendChatMessage } from "../services/chat";
import { AuthContext } from "../context/AuthContext";
import { ICONS } from "../constants/icons";

/* ---------- NAV TYPE ---------- */
type AuthStackParamList = {
  Main: undefined;
  UserEdit: undefined;
  UserChangePassword: undefined;
  PhotoDownload: undefined;
  ReportsScreen: undefined;
};

type NavigationProp =
  NativeStackNavigationProp<AuthStackParamList>;

export default function Header() {
  const navigation = useNavigation<NavigationProp>();
  const { signOut, token } = useContext(AuthContext);

  const [user, setUser] = useState<any>(null);
  const [leftMenuOpen, setLeftMenuOpen] = useState(false);
  const [chatOpen, setChatOpen] = useState(false);

  const [chatInput, setChatInput] = useState("");
  const [chatMessages, setChatMessages] = useState<any[]>([]);

  const scrollRef = useRef<ScrollView>(null);
  const [accountMenuOpen, setAccountMenuOpen] = useState(false);

  useEffect(() => {
    if (!token) return;
    

    const fetchUser = async () => {
      try {
        const userData = await userInfo(token);
        setUser(userData);
      } catch (e) {
        console.log("USERINFO ERROR:", e);
        Alert.alert("Kullanıcı bilgisi alınamadı");
      }
    };

    fetchUser();
  }, [token]);

const handleSendMessage = async () => {
  if (!chatInput.trim()) return;

  const message = chatInput;
  setChatInput("");

  setChatMessages(prev => [
    ...prev,
    { question: message, answer: "Yazıyor..." },
  ]);

  setTimeout(() => {
    scrollRef.current?.scrollToEnd({ animated: true });
  }, 100);

  try {
    const res = await sendChatMessage(message, token);

    console.log("CHAT RESPONSE:", res.data); // 🔴 BUNU EKLE

    const answer = res.data.answer; // ✅ TEK DOĞRU OKUMA

    if (!answer) {
      throw new Error("Answer boş");
    }

    setChatMessages(prev =>
      prev.map((m, i) =>
        i === prev.length - 1 ? { ...m, answer } : m
      )
    );
  } catch (e) {
    console.log("CHAT ERROR:", e); // 🔴 BUNU EKLE

    setChatMessages(prev =>
      prev.map((m, i) =>
        i === prev.length - 1
          ? { ...m, answer: "Bir hata oluştu" }
          : m
      )
    );
  }
};


  /* -------- LOGOUT -------- */
  const handleLogout = () => {
    signOut();
  };

  return (
    <>
      {/* HEADER BAR */}
      <View style={styles.header}>
        {/* LEFT MENU */}
        <TouchableOpacity onPress={() => setLeftMenuOpen(true)}>
          <Image source={require("../assets/images/menu.png")} style={styles.icon} />
        </TouchableOpacity>

        {/* LOGO */}
        <TouchableOpacity
          style={styles.logoBox}
          onPress={() => navigation.navigate("Main")}
        >
          <Image
            source={require("../assets/images/aicook-logo.png")}
            style={styles.logo}
          />
          <Text style={styles.logoText}>AICOOK</Text>
        </TouchableOpacity>

        {/* CHAT */}
        <TouchableOpacity onPress={() => setChatOpen(true)}>
          <Image source={require("../assets/images/chat.png")} style={styles.icon} />
        </TouchableOpacity>
      </View>

      {/* LEFT MENU MODAL */}
      <Modal transparent visible={leftMenuOpen} animationType="fade">
        <TouchableOpacity
          style={styles.overlay}
          onPress={() => setLeftMenuOpen(false)}
        >
          <View style={styles.menu}>

            {/* HESABIM */}
            <TouchableOpacity
              style={styles.menuItem}
              onPress={() => setAccountMenuOpen(!accountMenuOpen)}
            >
              <Image
                source={require("../assets/images/user.png")}
                style={styles.menuIcon}
              />
              <Text>Hesabım</Text>
            </TouchableOpacity>

            {/* HESABIM ALT MENÜ */}
            {accountMenuOpen && (
              <View style={styles.subMenu}>
                <TouchableOpacity
                  style={styles.subMenuItem}
                  onPress={() => {
                    setLeftMenuOpen(false);
                    setAccountMenuOpen(false);
                    navigation.navigate("UserEdit");
                  }}
                >
                  <Text style={styles.subMenuText}>Kişisel Bilgilerim</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.subMenuItem}
                  onPress={() => {
                    setLeftMenuOpen(false);
                    setAccountMenuOpen(false);
                    navigation.navigate("UserChangePassword");
                  }}
                >
                  <Text style={styles.subMenuText}>Şifremi Güncelle</Text>
                </TouchableOpacity>
              </View>
            )}

            {/* FOTOĞRAFLAR */}
            <MenuItem
              icon="download"
              label="Fotoğraflar"
              onPress={() => navigation.navigate("PhotoDownload")}
            />

            {/* RAPORLAR */}
            <MenuItem
              icon="pie-chart"
              label="Raporlar"
              onPress={() => navigation.navigate("ReportsScreen")}
            />

            {/* ÇIKIŞ */}
            <MenuItem
              icon="logout"
              label="Çıkış Yap"
              onPress={handleLogout}
            />
          </View>
        </TouchableOpacity>
      </Modal>

      {/* CHAT MODAL */}
      <Modal transparent visible={chatOpen} animationType="slide">
        <View style={styles.chatOverlay}>
          <View style={styles.chatBox}>
            <Text style={styles.chatTitle}>Sohbet</Text>

            <ScrollView
              ref={scrollRef}
              style={styles.chatMessages}
            >
              {chatMessages.length === 0 && (
                <Text style={styles.emptyText}>Henüz mesaj yok</Text>
              )}

              {chatMessages.map((msg, i) => (
                <View key={i} style={{ marginBottom: 12 }}>
                  <View style={styles.userMsg}>
                    <Text style={styles.userText}>{msg.question}</Text>
                  </View>

                  <View style={styles.botMsg}>
                    <Text style={styles.botText}>{msg.answer}</Text>
                  </View>
                </View>
              ))}
            </ScrollView>

            <TextInput
              placeholder="Yemek, tarif veya besinlerle ilgili bir soru sorun..."
              value={chatInput}
              onChangeText={setChatInput}
              style={styles.chatInput}
              multiline
              textAlignVertical="top"
            />

            <View style={styles.chatButtons}>
              <ChatBtn text="Temizle" onPress={() => setChatMessages([])} />
              <ChatBtn text="Kapat" onPress={() => setChatOpen(false)} />
              <ChatBtn primary text="Gönder" onPress={handleSendMessage} />
            </View>
          </View>
        </View>
      </Modal>
    </>
  );
}

const MenuItem = ({
  icon,
  label,
  onPress,
}: {
  icon: keyof typeof ICONS;
  label: string;
  onPress: () => void;
}) => (
  <TouchableOpacity style={styles.menuItem} onPress={onPress}>
    <Image source={ICONS[icon]} style={styles.menuIcon} />
    <Text>{label}</Text>
  </TouchableOpacity>
);


const ChatBtn = ({ text, onPress, primary }: any) => (
  <TouchableOpacity
    style={[styles.chatBtn, primary && styles.chatBtnPrimary]}
    onPress={onPress}
  >
    <Text style={{ color: primary ? "#fff" : "#444" }}>{text}</Text>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  header: {
    height: 90,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderColor: "#DDDDDD",
    backgroundColor: "#fff",
  },
  icon: { width: 36, height: 36 },
  logoBox: { flexDirection: "row", alignItems: "center" },
  logo: { width: 40, height: 40 },
  logoText: {
    marginLeft: 8,
    fontSize: 18,
    fontWeight: "700",
    color: "#444",
  },
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "flex-start",
  },
  menu: {
    width: 240,
    backgroundColor: "#fff",
    paddingVertical: 12,
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: 14,
    gap: 12,
  },
  menuIcon: { width: 20, height: 20 },
  chatOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "center",
    padding: 16,
  },
  chatBox: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 16,
    maxHeight: "90%",
  },
  chatTitle: {
    fontSize: 20,
    fontWeight: "600",
    marginBottom: 12,
  },
  chatMessages: {
    borderWidth: 1,
    borderColor: "#DDDDDD",
    borderRadius: 12,
    padding: 10,
    marginBottom: 10,
  },
  emptyText: { color: "#999999", fontSize: 14 },
  userMsg: { alignItems: "flex-end" },
  userText: {
    backgroundColor: "#4294ff",
    color: "#fff",
    padding: 10,
    borderRadius: 12,
    maxWidth: "80%",
  },
  botMsg: { alignItems: "flex-start", marginTop: 4 },
  botText: {
    backgroundColor: "#DDDDDD",
    color: "#444",
    padding: 10,
    borderRadius: 12,
    maxWidth: "80%",
  },
  chatInput: {
    borderWidth: 1,
    borderColor: "#DDDDDD",
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingTop: 10,        
    paddingBottom: 10,
    minHeight: 90,          
    marginBottom: 10,
    textAlignVertical: "top",
    fontSize: 14,
  },
  chatButtons: {
    flexDirection: "row",
    gap: 8,
  },
  chatBtn: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#DDDDDD",
    borderRadius: 12,
    padding: 10,
    alignItems: "center",
  },
  chatBtnPrimary: {
    backgroundColor: "#4294ff",
    borderColor: "#4294ff",
  },
  subMenu: {
  marginLeft: 24,
  borderLeftWidth: 1,
  borderColor: "#DDDDDD",
  marginBottom: 8,
},

subMenuItem: {
  paddingVertical: 10,
  paddingHorizontal: 16,
},

subMenuText: {
  fontSize: 14,
  color: "#444444",
},
});
