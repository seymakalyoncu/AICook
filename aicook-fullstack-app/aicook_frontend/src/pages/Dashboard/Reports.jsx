import React, { useEffect, useState } from "react";
import {
  getHistoryCategoryListReport,
  getHistoryDateReport,
  getHistoryIngredientListReport,
  getHistoryRatingListReport,
} from "../../services/reports";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
} from "recharts";

const PIE_COLORS = [
  "#1a3752",
  "#232328",
  "#376cfb",
  "#2f5fe8",
  "#1f3fbf",
  "#4294ff",
  "#0f2a44",
];

const formatDate = (dateStr) =>
  dateStr ? new Date(dateStr).toLocaleDateString("tr-TR") : "";

const CustomTooltip = ({ active, payload, type }) => {
  if (!active || !payload || !payload.length) return null;

  const value = payload[0].value;
  const name = payload[0].name;

  let text = "";

  if (type === "date") text = `Yemek Sayısı: ${value}`;
  if (type === "category") text = `Yemek Sayısı: ${value}`;
  if (type === "rating") text = `Ortalama Puan: ${value}`;
  if (type === "ingredient") text = `Kullanım Sayısı: ${value}`;

  return (
    <div className="px-4 py-2 rounded-xl border border-[#DDDDDD] bg-white text-sm text-[#444444]">
      {(type === "category" || type === "rating") && (
        <div className="font-medium mb-1">{name}</div>
      )}

      <div>{text}</div>
    </div>
  );
};


export default function Reports() {
  const token = localStorage.getItem("token");
  const userId = localStorage.getItem("user_id");

  const [categoryData, setCategoryData] = useState([]);
  const [dateData, setDateData] = useState([]);
  const [ingredientData, setIngredientData] = useState([]);
  const [ratingData, setRatingData] = useState([]);

  useEffect(() => {
    if (!userId || !token) return;

    getHistoryCategoryListReport(userId, token).then(res => setCategoryData(res.data));
    getHistoryDateReport(userId, token).then(res => setDateData(res.data));
    getHistoryIngredientListReport(userId, token).then(res => setIngredientData(res.data));
    getHistoryRatingListReport(userId, token).then(res => setRatingData(res.data));
  }, [userId, token]);

  return (
    <div className="p-6">
      <h2 className="text-2xl font-semibold text-[#444444] mb-6 text-center">
        Yemek Analiz Raporları
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="bg-white border border-[#DDDDDD] rounded-lg p-4">
          <p className="text-[13px] font-medium mb-2">
            (Son 7 Gün) Yemek Yapma Tarihine Göre Yemek Sayısı
          </p>

          <ResponsiveContainer width="100%" height={260}>
            <LineChart data={dateData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                dataKey="date"
                tickFormatter={formatDate}
                tick={{ fontSize: 11 }}
              />
              <YAxis />
              <Tooltip content={<CustomTooltip type="date" />} />
              <Line
                type="monotone"
                dataKey="sayi"
                stroke="#4294ff"
                strokeWidth={2}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white border border-[#DDDDDD] rounded-lg p-4">
          <p className="text-[13px] font-medium mb-2">
            (Son 10 Gün) Yemek Kategorisine Göre Yemek Sayısı
          </p>

          <ResponsiveContainer width="100%" height={260}>
            <PieChart>
              <Pie
                data={categoryData}
                dataKey="sayi"
                nameKey="category"
                outerRadius={90}
              >
                {categoryData.map((_, i) => (
                  <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip type="category" />} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white border border-[#DDDDDD] rounded-lg p-4">
          <p className="text-[13px] font-medium mb-2">
            (Son 10 Gün) Yemek Kategorisine Göre Ortalama Puan
          </p>

          <ResponsiveContainer width="100%" height={260}>
            <PieChart>
              <Pie
                data={ratingData}
                dataKey="category_rating"
                nameKey="category"
                outerRadius={90}
              >
                {ratingData.map((_, i) => (
                  <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip type="rating" />} />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white border border-[#DDDDDD] rounded-lg p-4">
          <p className="text-[13px] font-medium mb-2">
            (Son 7 Gün) (İlk 5 Malzeme) Malzeme Kullanım Sayıları
          </p>

          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={ingredientData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                dataKey="ingredient"
                angle={-90}
                textAnchor="end"
                interval={0}
                height={90}
                tick={{ fontSize: 11 }}
              />
              <YAxis />
              <Tooltip   
                content={<CustomTooltip type="ingredient" />}
                labelFormatter={() => ""}   // 👈 malzeme adı tamamen gider
                cursor={{ fill: "rgba(0,0,0,0.03)" }} />
              <Bar dataKey="sayi" name="" fill="#4294ff" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
