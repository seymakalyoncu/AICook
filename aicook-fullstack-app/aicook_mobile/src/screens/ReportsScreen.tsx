import React, { useEffect, useState, useContext } from "react";
import {
  View,
  Text,
  ScrollView,
  Dimensions,
  StyleSheet,
} from "react-native";
import {
  LineChart,
  PieChart,
  BarChart,
} from "react-native-chart-kit";

import Header from "../components/Header";
import {
  getHistoryCategoryListReport,
  getHistoryDateReport,
  getHistoryIngredientListReport,
  getHistoryRatingListReport,
} from "../services/reports";
import { AuthContext } from "../context/AuthContext";

/* ---------------- TYPES ---------------- */

type DateReportItem = {
  date: string;
  sayi: number;
};

type CategoryReportItem = {
  category: string;
  sayi: number;
};

type RatingReportItem = {
  category: string;
  category_rating: number;
};

type IngredientReportItem = {
  ingredient: string;
  sayi: number;
};

/* ---------------- CONSTANTS ---------------- */

const SCREEN_WIDTH = Math.max(Dimensions.get("window").width - 32, 300);

const PIE_COLORS = [
  "#1a3752",
  "#232328",
  "#376cfb",
  "#2f5fe8",
  "#1f3fbf",
  "#4294ff",
  "#0f2a44",
];

const chartConfig = {
  backgroundGradientFrom: "#ffffff",
  backgroundGradientTo: "#ffffff",
  decimalPlaces: 0,
  color: (opacity = 1) => `rgba(66,148,255,${opacity})`,
  labelColor: () => "#444444",
  propsForDots: {
    r: "4",
    strokeWidth: "2",
    stroke: "#4294ff",
  },
  paddingLeft: 0,
  paddingRight: 0,
};

export default function ReportsScreen() {
  const { token, userId } = useContext(AuthContext);

  const [dateData, setDateData] = useState<{ label: string; value: number }[]>([]);
  const [categoryData, setCategoryData] = useState<any[]>([]);
  const [ratingData, setRatingData] = useState<any[]>([]);
  const [ingredientData, setIngredientData] = useState<{ label: string; value: number }[]>([]);

  useEffect(() => {
    if (!token || !userId) return;

    /* 📈 DATE */
    getHistoryDateReport(userId, token).then((res) => {

      if (!Array.isArray(res)) return;

      const safe = (res as DateReportItem[])
        .filter(i => i?.date && Number(i.sayi) > 0)
        .map(i => ({
          label: new Date(i.date).toLocaleDateString("tr-TR"),
          value: Number(i.sayi),
        }));
        console.log(safe); 
      setDateData(safe);
    });

    /* 🥧 CATEGORY */
    getHistoryCategoryListReport(userId, token).then((res) => {
      if (!Array.isArray(res)) return;

      const safe = (res as CategoryReportItem[])
        .filter(i => i?.category && Number(i.sayi) > 0)
        .map((i, idx) => ({
          name: i.category,
          population: Number(i.sayi),
          color: PIE_COLORS[idx % PIE_COLORS.length],
          legendFontColor: "#444",
          legendFontSize: 12,
        }));

      setCategoryData(safe);
    });

    /* ⭐ RATING */
    getHistoryRatingListReport(userId, token).then((res) => {
      if (!Array.isArray(res)) return;

      const safe = (res as RatingReportItem[])
        .filter(i => i?.category && Number(i.category_rating) > 0)
        .map((i, idx) => ({
          name: i.category,
          population: Number(i.category_rating),
          color: PIE_COLORS[idx % PIE_COLORS.length],
          legendFontColor: "#444",
          legendFontSize: 12,
        }));

      setRatingData(safe);
    });

    /* 📊 INGREDIENT */
    getHistoryIngredientListReport(userId, token).then((res) => {
      if (!Array.isArray(res)) return;

      const safe = (res as IngredientReportItem[])
        .filter(i => i?.ingredient && Number(i.sayi) > 0)
        .map(i => ({
          label: i.ingredient,
          value: Number(i.sayi),
        }));

      setIngredientData(safe);
    });

  }, [token, userId]);

  return (
    <View style={{ flex: 1, backgroundColor: "#fff" }}>
      <Header />

      <ScrollView style={{ flex: 1 }} contentContainerStyle={styles.container}>
        <Text style={styles.title}>Yemek Analiz Raporları</Text>

        {/* 📈 DATE */}
        {dateData.length > 0 && (
          <View style={styles.card}>
            <Text style={styles.cardTitle}>
              Tarihe Göre Yemek Sayısı
            </Text>

            <LineChart
              data={{
                labels: dateData.map(i => {
                const [day, month] = i.label.split(".");
                return `${day}.${month}`;
              }),
                datasets: [{ data: dateData.map(i => i.value) }],
              }}
              width={SCREEN_WIDTH-15}
              height={170}
              chartConfig={chartConfig}
              bezier
              verticalLabelRotation={-35}
              horizontalLabelRotation={0}
              style={{
                alignSelf: "center",
                marginLeft: -13,   // <-- kritik değer
              }}
              renderDotContent={({ x, y, index }) => (
              <Text
                key={index}
                style={{
                  position: "absolute",
                  top: y - 18,     
                  left: x - 6,    
                  fontSize: 12,
                  color: "#444",
                  fontWeight: "600",
                }}
              >
                {dateData[index].value}
              </Text>
            )}       
            />
          </View>
        )}

        {/* 🥧 CATEGORY */}
        {categoryData.length > 0 && (
          <View style={styles.card}>
            <Text style={styles.cardTitle}>
              Kategoriye Göre Yemek Sayısı
            </Text>

            <PieChart
              data={categoryData}
              width={SCREEN_WIDTH-10}
              height={220}
              accessor="population"
              backgroundColor="transparent"
              chartConfig={chartConfig}
              paddingLeft="16"
            />
          </View>
        )}

        {/* ⭐ RATING */}
        {ratingData.length > 0 && (
          <View style={styles.card}>
            <Text style={styles.cardTitle}>
              Kategoriye Göre Ortalama Puan
            </Text>

            <PieChart
              data={ratingData}
              width={SCREEN_WIDTH-15}
              height={220}
              accessor="population"
              backgroundColor="transparent"
              chartConfig={chartConfig}
              paddingLeft="16"
            />
          </View>
        )}

        {/* 📊 INGREDIENT */}
        {ingredientData.length > 0 && (
          <View style={styles.card}>
            <Text style={styles.cardTitle}>
              Malzeme Kullanım Sayıları
            </Text>

            <BarChart
              data={{
                labels: ingredientData.map(() => ""),
                datasets: [{ data: ingredientData.map(i => i.value) }],
              }}
              width={SCREEN_WIDTH-20}
              height={170}
              fromZero
              yAxisLabel=""
              yAxisSuffix=""
              chartConfig={chartConfig}
              showValuesOnTopOfBars
              withInnerLines={false}
              verticalLabelRotation={0}
            />
            <View
              style={{
                flexDirection: "row",
                width: SCREEN_WIDTH - 20,
                justifyContent: "space-between",
                paddingHorizontal: 8,
                marginTop: 6,
              }}
            >
              {ingredientData.map((item, index) => (
                <Text
                  key={index}
                  style={{
                    transform: [{ rotate: "-35deg" }],
                    fontSize: 11,
                    color: "#666",
                    width: (SCREEN_WIDTH - 40) / ingredientData.length,
                    textAlign: "right",
                  }}
                  numberOfLines={2}
                >
                  {item.label}
                </Text>
              ))}
            </View>


          </View>
        )}

      </ScrollView>
    </View>
  );
}


const styles = StyleSheet.create({
  container: {
    padding: 16,
    paddingBottom: 40,
  },
  title: {
    fontSize: 22,
    fontWeight: "600",
    color: "#444",
    marginBottom: 16,
    textAlign: "center",
  },
  card: {
    borderWidth: 1,
    borderColor: "#DDDDDD",
    borderRadius: 16,
    padding: 12,
    marginBottom: 20,
  },
  cardTitle: {
    fontSize: 13,
    fontWeight: "600",
    color: "#444",
    marginBottom: 8,
  },
});
