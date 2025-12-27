import React, { useEffect, useState, useContext } from "react";
import { View, Text, StyleSheet } from "react-native";
import { getDailyRecommendation } from "../services/recommendation";
import { AuthContext } from "../context/AuthContext";

export default function RecommendationStatus() {
  const { token } = useContext(AuthContext);

  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!token) return;

    const fetchRecommendation = async () => {
      try {
        const res = await getDailyRecommendation(token);
        setData(res);
      } catch (e) {
        console.log("Recommendation error:", e);
      } finally {
        setLoading(false);
      }
    };

    fetchRecommendation();
  }, [token]);

  if (loading) {
    return (
      <Text style={styles.loadingText}>
        Öneriler hazırlanıyor...
      </Text>
    );
  }

  if (!data) return null;

  /* ---------------- YETERLİ VERİ YOK ---------------- */
  if (data.not_enough_data) {
    const progressPercent = Math.min(
      (data.unique_day_count / data.required_day_count) * 100,
      100
    );

    return (
      <View style={styles.container}>
        <Text style={styles.title}>Yemek Öneri Sistemi</Text>

        <Text style={styles.infoText}>{data.message}</Text>

        <Text style={styles.subText}>
          Girilen gün sayısı:{" "}
          <Text style={styles.bold}>
            {data.unique_day_count} / {data.required_day_count}
          </Text>
        </Text>

        {/* Progress Bar */}
        <View style={styles.progressBg}>
          <View
            style={[
              styles.progressFill,
              { width: `${progressPercent}%` },
            ]}
          />
        </View>
      </View>
    );
  }

  /* ---------------- ÖNERİ VAR ---------------- */
  const recommendation = data.recommendations?.[0];

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Bugün için önerimiz</Text>

      <Text style={styles.recipeName}>
        {recommendation?.recipe_name}
      </Text>

      <Text style={styles.subText}>
        Geçmiş yemek kayıtların ve favorilerine göre önerildi.
      </Text>
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    padding: 16,
    alignItems: "center",
  },
  title: {
    fontSize: 22,
    fontWeight: "600",
    color: "#444444",
    marginBottom: 12,
    textAlign: "center",
  },
  loadingText: {
    fontSize: 14,
    color: "#999",
    textAlign: "center",
  },
  infoText: {
    fontSize: 15,
    color: "#1a3752",
    fontWeight: "500",
    textAlign: "center",
    marginBottom: 6,
  },
  subText: {
    fontSize: 12,
    color: "#666",
    textAlign: "center",
    marginBottom: 10,
  },
  bold: {
    fontWeight: "600",
    color: "#444",
  },
  progressBg: {
    width: "100%",
    height: 8,
    backgroundColor: "#b8e3fe",
    borderRadius: 8,
    overflow: "hidden",
  },
  progressFill: {
    height: 8,
    backgroundColor: "#4294ff",
    borderRadius: 8,
  },
  recipeName: {
    fontSize: 20,
    fontWeight: "600",
    color: "#1a3752",
    marginBottom: 6,
    textAlign: "center",
  },
});
