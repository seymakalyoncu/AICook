import React, { useState, useEffect, useCallback } from 'react';
import toast, { Toaster } from "react-hot-toast";
import { useLocation } from "react-router-dom";
import { getDevelopmentState } from "../../services/development_state";
import { getCognitiveDevelopmentType } from "../../services/cognitive_development_type";
import { addCognitive, getCognitiveByChild, updateCognitive } from "../../services/cognitive";

const CognitivePage = ({ open }) => {
  const location = useLocation();
  const selectedChild = location.state?.selectedChild;
  const today = new Date().toISOString().slice(0, 16);
  const [development_state, setDevelopmentState] = useState([]);
  const [cognitive_development_type, setCognitiveDevelopmentType] = useState([]);
  const [cognitive, setCognitive] = useState([]);
  const [selectedCognitiveId, setSelectedCognitiveId] = useState(null);

  const [form, setForm] = useState({
    cognitive_development_type: '',
    development_state: '',
    observation: '',
    observation_datetime: '',
    comment: '',
  });

  const fetchCognitive = useCallback(async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await getCognitiveByChild(selectedChild.id, token);
        const sortedCognitive = res.data.sort(
        (a, b) => new Date(b.observation_datetime) - new Date(a.observation_datetime)
    );
      setCognitive(sortedCognitive);
    } catch (err) {
      console.error("Bilişsel Gelişim alınamadı:", err);
    }
  }, [selectedChild.id]);

  useEffect(() => {
    if (selectedChild?.id) {
      resetForm();
      fetchDevelopmentState();
      fetchCognitiveDevelopmentType();
      fetchCognitive();
    }
  }, [selectedChild?.id, fetchCognitive]);

  const fetchCognitiveDevelopmentType= async () => {
    try {
      const res = await getCognitiveDevelopmentType();
      setCognitiveDevelopmentType(res.data);
    } catch (err) {
      console.error("Bilişsel Gelişim tipi alınamadı:", err);
    }
  };

  const fetchDevelopmentState= async () => {
    try {
      const res = await getDevelopmentState();
      setDevelopmentState(res.data);
    } catch (err) {
      console.error("Gelişim durumu alınamadı:", err);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleCognitiveSelect = (cognitive) => {
    setSelectedCognitiveId(cognitive.id);
    setForm({
      cognitive_development_type: cognitive.cognitive_development_type.toString(),
      development_state: cognitive.development_state.toString(),
      observation: cognitive.observation,
      observation_datetime: cognitive.observation_datetime?.slice(0, 16),
      comment: cognitive.comment || '',
    });
  };

  const handleAddOrUpdate = async () => {
    const token = localStorage.getItem("token");
    const payload = {
      cognitive_development_type: parseInt(form.cognitive_development_type),
      development_state: parseInt(form.development_state),
      observation: form.observation,
      observation_datetime: form.observation_datetime,
      comment: form.comment,
      child: selectedChild.id,
    };
    if (selectedCognitiveId) {
      payload.updateddate = new Date().toISOString();
    }
    try {
      if (selectedCognitiveId) {
        await updateCognitive(selectedCognitiveId, payload, token);
        console.log("Bilişsel Gelişim güncellendi");
      } else {
        await addCognitive(payload, token);
        console.log("Bilişsel Gelişim eklendi");
      }

      resetForm();
      fetchCognitive();
    } catch (error) {
      console.error("İşlem hatası:", error);
    }
  };

  const resetForm = () => {
    setSelectedCognitiveId(null);
    setForm({
      cognitive_development_type: '',
      development_state: '',
      observation: '',
      observation_datetime: '',
      comment: '',
    });
  };

  return (
    <div className="p-6 bg-white min-h-screen">
      <Toaster />
      <h1 className="text-2xl font-semibold text-[#444444] mb-6 leading-snug tracking-wide">
        Bilişsel Gelişim Bilgileri
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
      <select
          name="cognitive_development_type"
          value={form.cognitive_development_type}
          onChange={handleChange}
          className="border px-3 py-2 rounded-lg"
        >
          <option value="">Bilişsel Gelişim Türü</option>
          {cognitive_development_type.map((item) => (
            <option key={item.id} value={item.id}>
              {item.name}
            </option>
          ))}
        </select>
        <select
          name="development_state"
          value={form.development_state}
          onChange={handleChange}
          className="border px-3 py-2 rounded-lg"
        >
          <option value="">Gelişim Durumu</option>
          {development_state.map((item) => (
            <option key={item.id} value={item.id}>
              {item.name}
            </option>
          ))}
        </select>
        <input
          type="datetime-local"
          name="observation_datetime"
          value={form.observation_datetime}
          max={today}
          onChange={(e) => {
              const value = e.target.value;
              if (value > today) {
                toast.error("Bilişsel gelişim gözlem tarih ve saati ileri tarih olamaz.");
                console.log(value);
              } else {
                setForm({ ...form, observation_datetime: value });
              }
            }}
          className="border px-3 py-2 rounded-lg"
        />
        <input
          type="text"
          name="observation"         
          placeholder="Gözlem"
          value={form.observation}
          onChange={handleChange}
          className="border px-3 py-2 rounded-lg"
        />
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
        {selectedCognitiveId && (
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
          {selectedCognitiveId ? "Güncelle" : "Kaydet"}
        </button>
      </div>

      {/* Yemek Listesi Tablosu */}
      <div className="mb-6">
        <h2 className="text-lg font-semibold mb-2">Bilişsel Gelişim Listesi</h2>
        {cognitive.length === 0 ? (
          <p className="text-sm text-gray-500">Kayıtlı Bilişsel Gelişim bulunamadı.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full border border-gray-300 text-sm">
              <thead className="bg-gray-100">
                <tr>
                  <th className="border px-4 py-2 text-center">Gözlem Tarihi</th>
                  <th className="border px-4 py-2 text-center">Bilişsel Gelişim Türü</th>
                  <th className="border px-4 py-2 text-center">Gelişim Durumu</th>
                  <th className="border px-4 py-2 text-center">Gözlem</th>
                  <th className="border px-4 py-2 text-center">Seç</th>
                </tr>
              </thead>
              <tbody>
                {cognitive.map((cognitive) => (
                  <tr key={cognitive.id} className="hover:bg-gray-50">
                    <td className="border px-4 py-2 text-center">
                      {cognitive.observation_datetime?.replace("T", " ").slice(0, 16)}
                    </td>                    
                    <td className="border px-4 py-2 text-center">
                      {
                        cognitive_development_type.find((type) => type.id === cognitive.cognitive_development_type)?.name || "-"
                      }
                    </td>
                    <td className="border px-4 py-2 text-center">
                      {
                        development_state.find((type) => type.id === cognitive.development_state)?.name || "-"
                      }
                    </td>
                    <td className="border px-4 py-2 text-center">{cognitive.observation}</td>              
                    <td className="border px-4 py-2 text-center">
                      <button
                        onClick={() => handleCognitiveSelect(cognitive)}
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

export default CognitivePage;
