import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  getPhysicalListReport,
  getTotalSleepReport,
  getTotalMealNutritiveListReport
} from '../../services/reports';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';

export default function ReportsPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const [physicalData, setPhysicalData] = useState([]);
  const [sleepData, setSleepData] = useState([]);
  const [mealData, setMealData] = useState([]);

  const selectedChild = location.state?.selectedChild;
  const token = localStorage.getItem("token");

  useEffect(() => {
   
    if (token) {
      getPhysicalListReport(selectedChild.id, token)
        .then(res => setPhysicalData(res.data))
        .catch(err => console.error('Physical Error:', err));

      getTotalSleepReport(selectedChild.id, token)
        .then(res => setSleepData(res.data))
        .catch(err => console.error('Sleep Error:', err));

      getTotalMealNutritiveListReport(selectedChild.id, token)
        .then(res => setMealData(res.data))
        .catch(err => console.error('Meal Error:', err));
    }
  }, [selectedChild, token, navigate]);

  if (!selectedChild) {
    return <p className="text-center mt-10 text-red-500">Lütfen önce bir çocuk seçiniz.</p>;
  }

  return (
    <div className="p-8">
      <h1 className="text-2xl font-semibold text-[#444444] mb-6 leading-snug tracking-wide text-center">
        Gelişim Raporları
      </h1>
        {selectedChild ? (
        <div className="mb-6 text-2xl font-normal text-[#444444] text-center">
          {selectedChild.name} {selectedChild.surname}
        </div>
      ) : (
        <div className="text-[14px] text-[#999999] italic mb-6">
          Seçilen çocuk bilgisi bulunamadı.
        </div>
      )}

      {/* Boy Grafiği */}
      <div className="mb-10 bg-white shadow rounded p-4">
        <h3 className="text-lg font-semibold mb-2">Boy Gelişimi (cm)</h3>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={physicalData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="measurement_date" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="height" stroke="#3B3B1A" name="Boy (cm)" />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Kilo Grafiği */}
      <div className="mb-10 bg-white shadow rounded p-4">
        <h3 className="text-lg font-semibold mb-2">Kilo Gelişimi (kg)</h3>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={physicalData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="measurement_date" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="weight" stroke="#16a34a" name="Kilo (kg)" />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Uyku Süresi Grafiği */}
      <div className="mb-10 bg-white shadow rounded p-4">
        <h3 className="text-lg font-semibold mb-2">Son 30 Günlük Uyku Süresi (saat)</h3>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={sleepData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="sleep_date" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="total_sleep" stroke="#eab308" name="Uyku (saat)" />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Kalori (Besin Değeri) Grafiği */}
      <div className="bg-white shadow rounded p-4">
        <h3 className="text-lg font-semibold mb-2">Son 30 Günlük Kalori Alımı (kcal)</h3>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={mealData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="meal_date" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="total_nutritive" stroke="#f97316" name="Kalori (kcal)" />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
