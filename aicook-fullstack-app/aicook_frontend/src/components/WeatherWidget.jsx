import React, { useEffect, useState } from "react";

const weatherIcons = {
    Clear: "☀️ Açık",
    Clouds: "☁️ Bulutlu",
    Rain: "🌧️ Yağmurlu",
    Drizzle: "🌦️ Çiseleyen Yağmur",
    Thunderstorm: "⛈️ Fırtına",
    Snow: "❄️ Karlı",
    Mist: "🌫️ Sisli",
};

const WeatherWidget = ({ city }) => {
  const [weather, setWeather] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const apiKey = "d74aba0562b9547aed1a9707c31d16e1"; // kendi API anahtarını buraya yaz

    if (!city) return;

    const url = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(city)}&appid=${apiKey}&lang=tr&units=metric`;

    fetch(url)
      .then((res) => {
        if (!res.ok) throw new Error("API isteği başarısız oldu");
        return res.json();
      })
      .then((data) => setWeather(data))
      .catch((err) => setError(err.message));
  }, [city]);

  if (error) return <div className="p-4 text-red-500">Hata: {error}</div>;
  if (!weather) return <div className="p-4">Yükleniyor...</div>;

  const icon = weather.weather[0].main;
  const temp = Math.round(weather.main.temp);

  return (
    <div className="p-4 bg-white border border-borderGray rounded-xl shadow w-56 flex space-x-2">
        <div className="flex flex-col items-center">
        <span style={{ fontSize: "2.5rem", lineHeight: 0.7 }}>{weatherIcons[icon] ? weatherIcons[icon].split(" ")[0] : "❓"}</span>
        <span className="text-sm mt-1">{weatherIcons[icon] ? weatherIcons[icon].split(" ").slice(1).join(" ") : ""}</span>
        </div>
        <div className="flex flex-col justify-center">
        <div className="font-semibold">{city}</div>
        <div className="text-lg font-medium">{temp}°C</div>
        </div>
    </div>
    );
};

export default WeatherWidget;
