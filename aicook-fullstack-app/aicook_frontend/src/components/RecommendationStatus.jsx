import React, { useEffect, useState } from "react";
import { getDailyRecommendation } from "../services/recommendation";

const RecommendationStatus = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  const token = localStorage.getItem("token");

  useEffect(() => {
    if (!token) return;

    getDailyRecommendation(token)
      .then((res) => setData(res.data))
      .finally(() => setLoading(false));
  }, [token]);

  if (loading) {
    return (
      <p className="text-sm text-gray-500">
        Öneriler hazırlanıyor...
      </p>
    );
  }

  if (!data) return null;

  if (data.not_enough_data) {
    const progressPercent = Math.min(
      (data.unique_day_count / data.required_day_count) * 100,
      100
    );

    return (
      <div className="space-y-3 text-center">
        <h1 className="text-2xl font-semibold text-[#444444] mb-6">
          Yemek Öneri Sistemi
        </h1>

        <p className="font-medium text-[#1a3752]">
          {data.message}
        </p>

        <p className="text-xs text-gray-600">
          Girilen gün sayısı:{" "}
          <span className="font-medium">
            {data.unique_day_count} / {data.required_day_count}
          </span>
        </p>


        <div className="w-full bg-[#b8e3fe] rounded-full h-2">
          <div
            className="bg-[#4294ff] h-2 rounded-full transition-all"
            style={{ width: `${progressPercent}%` }}
          />
        </div>

      </div>
    );
  }

  const recommendation = data.recommendations?.[0];

  return (
    <div className="space-y-2 text-center">
      <h1 className="text-2xl font-semibold text-[#444444] mb-6">
        Bugün için önerimiz
      </h1>

      <p className="font-medium text-[#1a3752] text-2xl">
        {recommendation?.recipe_name}
      </p>

      <p className="text-xs text-gray-600">
        Geçmiş yemek kayıtların ve favorilerine göre önerildi.
      </p>

    </div>
  );
};

export default RecommendationStatus;
