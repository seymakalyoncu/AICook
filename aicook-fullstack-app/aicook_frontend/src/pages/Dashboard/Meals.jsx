import React, { useState, useEffect, useCallback } from 'react';
import toast, { Toaster } from "react-hot-toast";
import { useLocation } from "react-router-dom";
import { getMealTimes } from "../../services/meal_times";
import { addMeal, getMealsByChild, updateMeal } from "../../services/meals";

const MealsPage = ({ open }) => {
  const location = useLocation();
  const selectedChild = location.state?.selectedChild;
  const today = new Date().toISOString().slice(0, 16);
  const [meal_times, setMealTimes] = useState([]);
  const [meals, setMeals] = useState([]);
  const [selectedMealId, setSelectedMealId] = useState(null);

  const [form, setForm] = useState({
    meal_name: '',
    nutritive_value: '',
    meal_datetime: '',
    meal_type: '',
    comment: '',
  });

  const fetchMeals = useCallback(async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await getMealsByChild(selectedChild.id, token);
      const sortedMeal = res.data.sort(
        (a, b) => new Date(b.meal_datetime) - new Date(a.meal_datetime)
    );
    setMeals(sortedMeal);
    } catch (err) {
      console.error("Yemekler alınamadı:", err);
    }
  }, [selectedChild.id]);

  useEffect(() => {
    if (selectedChild?.id) {
      resetForm();
      fetchMealTimes();
      fetchMeals();
    }
  }, [selectedChild?.id, fetchMeals]);

  const fetchMealTimes = async () => {
    try {
      const res = await getMealTimes();
      setMealTimes(res.data);
    } catch (err) {
      console.error("Yemek türleri alınamadı:", err);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleMealSelect = (meal) => {
    setSelectedMealId(meal.id);
    setForm({
      meal_name: meal.meal_name,
      nutritive_value: meal.nutritive_value,
      meal_datetime: meal.meal_datetime?.slice(0, 16),
      meal_type: meal.meal_type.toString(),
      comment: meal.comment || '',
    });
  };

  const handleAddOrUpdate = async () => {
    const token = localStorage.getItem("token");
    const payload = {
      meal_name: form.meal_name,
      nutritive_value: form.nutritive_value,
      meal_datetime: form.meal_datetime,
      meal_type: parseInt(form.meal_type),
      comment: form.comment,
      child: selectedChild.id,
    };
    if (selectedMealId) {
      payload.updateddate = new Date().toISOString();
    }
    try {
      if (selectedMealId) {
        await updateMeal(selectedMealId, payload, token);
        console.log("Yemek güncellendi");
      } else {
        await addMeal(payload, token);
        console.log("Yemek eklendi");
      }

      resetForm();
      fetchMeals();
    } catch (error) {
      console.error("İşlem hatası:", error);
    }
  };

  const resetForm = () => {
    setSelectedMealId(null);
    setForm({
      meal_name: '',
      nutritive_value: '',
      meal_datetime: '',
      meal_type: '',
      comment: '',
    });
  };

  return (
    <div className="p-6 bg-white min-h-screen">
      <Toaster />
      <h1 className="text-2xl font-semibold text-[#444444] mb-6 leading-snug tracking-wide">
        Yemek Bilgileri
      </h1>

      {selectedChild ? (
        <div className="mb-6 text-2xl text-[#444444] font-normal">
          {selectedChild.name} {selectedChild.surname}
        </div>
      ) : (
        <div className="text-[14px] text-[#999999] italic mb-6">
          Seçilen çocuk bilgisi bulunamadı.
        </div>
      )}

      {/* Form */}
      <div className="grid grid-cols-2 gap-4 mb-4">
        <input
          type="text"
          name="meal_name"
          placeholder="Yemek Adı"
          value={form.meal_name}
          onChange={handleChange}
          className="border px-3 py-2 rounded-lg"
        />
        <input
          type="text"
          name="nutritive_value"
          placeholder="Besin Değeri"
          value={form.nutritive_value}
          onChange={handleChange}
          className="border px-3 py-2 rounded-lg"
        />
        <input
          type="datetime-local"
          name="meal_datetime"
          value={form.meal_datetime}
          max={today}
            onChange={(e) => {
              const value = e.target.value;
              if (value > today) {
                toast.error("Yemek tarih ve saati ileri tarih olamaz.");
                console.log(value);
              } else {
                setForm({ ...form,meal_datetime: value });
              }
            }}
          className="border px-3 py-2 rounded-lg"
        />
        <select
          name="meal_type"
          value={form.meal_type}
          onChange={handleChange}
          className="border px-3 py-2 rounded-lg"
        >
          <option value="">Yemek Türü</option>
          {meal_times.map((item) => (
            <option key={item.id} value={item.id}>
              {item.name}
            </option>
          ))}
        </select>
        <input
          type="text"
          name="comment"
          placeholder="Açıklama"
          value={form.comment}
          onChange={handleChange}
          className="col-span-2 border px-3 py-6 rounded-lg"
        />
      </div>

      <div className="flex justify-end gap-2">
        {selectedMealId && (
          <button
            onClick={resetForm}
            className="bg-gray-300 px-6 py-2 rounded-xl text-gray-700 hover:bg-gray-400"
          >
            Yeni Kayıt
          </button>
        )}
        <button
          onClick={handleAddOrUpdate}
          className="bg-[#FF6600] text-white px-6 py-2 rounded-xl hover:bg-[#e65500]"
        >
          {selectedMealId ? "Güncelle" : "Kaydet"}
        </button>
      </div>

      {/* Yemek Listesi Tablosu */}
      <div className="mb-6">
        <h2 className="text-lg font-semibold mb-2">Yemek Listesi</h2>
        {meals.length === 0 ? (
          <p className="text-sm text-gray-500">Kayıtlı yemek bulunamadı.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full border border-gray-300 text-sm rounded-xl">
              <thead className="bg-gray-100">
                <tr>
                  <th className="border px-4 py-2 text-center">Öğün Tarih ve Saati</th>
                  <th className="border px-4 py-2 text-center">Yemek Türü</th>
                  <th className="border px-4 py-2 text-center">Yemek Adı</th>
                  <th className="border px-4 py-2 text-center">Besin Değeri</th>
                  <th className="border px-4 py-2 text-center">Seç</th>
                </tr>
              </thead>
              <tbody>
                {meals.map((meal) => (
                  <tr key={meal.id} className="hover:bg-gray-50">
                    <td className="border px-4 py-2 text-center">
                      {meal.meal_datetime?.replace("T", " ").slice(0, 16)}
                    </td>
                    <td className="border px-4 py-2 text-center">
                      {
                        meal_times.find((type) => type.id === meal.meal_type)?.name || "-"
                      }
                    </td>
                    <td className="border px-4 py-2 text-center">{meal.meal_name}</td>
                    <td className="border px-4 py-2 text-center">{meal.nutritive_value}</td>
                    <td className="border px-4 py-2 text-center">
                      <button
                        onClick={() => handleMealSelect(meal)}
                        className="bg-[#FF6600] hover:bg-[#e65500] text-white px-3 py-1 rounded-md text-sm"
                      >
                        Seç
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default MealsPage;
