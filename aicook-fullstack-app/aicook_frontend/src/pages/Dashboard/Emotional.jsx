import React, { useState, useEffect, useCallback } from 'react';
import toast, { Toaster } from "react-hot-toast";
import { useLocation } from "react-router-dom";
import { getDevelopmentState } from "../../services/development_state";
import { getEmotionalState } from "../../services/emotional_state";
import { addEmotional, getEmotionalByChild, updateEmotional } from "../../services/emotional";

const EmotionalPage = ({ open }) => {
  const location = useLocation();
  const selectedChild = location.state?.selectedChild;
  const today = new Date().toISOString().slice(0, 16);
  const [development_state, setDevelopmentState] = useState([]);
  const [emotional_state, setEmotionalState] = useState([]);
  const [emotional, setEmotional] = useState([]);
  const [selectedEmotionalId, setSelectedEmotionalId] = useState(null);

  const [form, setForm] = useState({
    emotional_state: '',
    social_interaction: '',
    development_state: '',
    observation: '',
    observation_datetime: '',
    comment: '',
  });

  const fetchEmotional = useCallback(async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await getEmotionalByChild(selectedChild.id, token);
        const sortedEmotional = res.data.sort(
        (a, b) => new Date(b.observation_datetime) - new Date(a.observation_datetime)
    );
      setEmotional(sortedEmotional);
    } catch (err) {
      console.error("Duygusal Gelişim alınamadı:", err);
    }
  }, [selectedChild.id]);

  useEffect(() => {
    if (selectedChild?.id) {
      resetForm();
      fetchDevelopmentState();
      fetchEmotionalState();
      fetchEmotional();
    }
  }, [selectedChild?.id, fetchEmotional]);

  const fetchEmotionalState= async () => {
    try {
      const res = await getEmotionalState();
      setEmotionalState(res.data);
    } catch (err) {
      console.error("Duygusal Gelişim tipi alınamadı:", err);
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

  const handleEmotionalSelect = (emotional) => {
    setSelectedEmotionalId(emotional.id);
    setForm({
      emotional_state: emotional.emotional_state.toString(),
      social_interaction: emotional.social_interaction,
      development_state: emotional.development_state.toString(),
      observation: emotional.observation,
      observation_datetime: emotional.observation_datetime?.slice(0, 16),
      comment: emotional.comment || '',
    });
  };

  const handleAddOrUpdate = async () => {
    const token = localStorage.getItem("token");
    const payload = {
      emotional_state: parseInt(form.emotional_state),
      social_interaction: form.social_interaction,
      development_state: parseInt(form.development_state),
      observation: form.observation,
      observation_datetime: form.observation_datetime,
      comment: form.comment,
      child: selectedChild.id,
    };
    if (selectedEmotionalId) {
      payload.updateddate = new Date().toISOString();
    }
    try {
      if (selectedEmotionalId) {
        await updateEmotional(selectedEmotionalId, payload, token);
        console.log("Duygusal Gelişim güncellendi");
      } else {
        await addEmotional(payload, token);
        console.log("Duygusal Gelişim eklendi");
      }

      resetForm();
      fetchEmotional();
    } catch (error) {
      console.error("İşlem hatası:", error);
    }
  };

  const resetForm = () => {
    setSelectedEmotionalId(null);
    setForm({
      emotional_state: '',
      social_interaction: '',
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
        Duygusal Gelişim Bilgileri
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
          name="social_interaction"         
          placeholder="Sosyal Etkileşim"
          value={form.social_interaction}
          onChange={handleChange}
          className="border px-3 py-2 rounded-lg"
        />
      <select
          name="emotional_state"
          value={form.emotional_state}
          onChange={handleChange}
          className="border px-3 py-2 rounded-lg"
        >
          <option value="">Duygusal Gelişim Durumu</option>
          {emotional_state.map((item) => (
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
                toast.error("Duygusal gelişim gözlem tarih ve saati ileri tarih olamaz.");
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
          className="border px-3 py-2 rounded-lg col-span-2"
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
        {selectedEmotionalId && (
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
          {selectedEmotionalId ? "Güncelle" : "Kaydet"}
        </button>
      </div>

      {/* Yemek Listesi Tablosu */}
      <div className="mb-6">
        <h2 className="text-lg font-semibold mb-2">Duygusal Gelişim Listesi</h2>
        {emotional.length === 0 ? (
          <p className="text-sm text-gray-500">Kayıtlı Duygusal Gelişim bulunamadı.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full border border-gray-300 text-sm">
              <thead className="bg-gray-100">
                <tr>
                  <th className="border px-4 py-2 text-center">Gözlem Tarihi</th>
                  <th className="border px-4 py-2 text-center">Sosyal Etkileşim</th>
                  <th className="border px-4 py-2 text-center">Duygusal Gelişim Durumu</th>
                  <th className="border px-4 py-2 text-center">Gelişim Durumu</th>
                  <th className="border px-4 py-2 text-center">Gözlem</th>
                  <th className="border px-4 py-2 text-center">Seç</th>
                </tr>
              </thead>
              <tbody>
                {emotional.map((emotional) => (
                  <tr key={emotional.id} className="hover:bg-gray-50">
                    <td className="border px-4 py-2 text-center">
                      {emotional.observation_datetime?.replace("T", " ").slice(0, 16)}
                    </td>              
                    <td className="border px-4 py-2 text-center">{emotional.social_interaction}</td>           
                    <td className="border px-4 py-2 text-center">
                      {
                        emotional_state.find((type) => type.id === emotional.emotional_state)?.name || "-"
                      }
                    </td>
                    <td className="border px-4 py-2 text-center">
                      {
                        development_state.find((type) => type.id === emotional.development_state)?.name || "-"
                      }
                    </td>
                    <td className="border px-4 py-2 text-center">{emotional.observation}</td>              
                    <td className="border px-4 py-2 text-center">
                      <button
                        onClick={() => handleEmotionalSelect(emotional)}
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

export default EmotionalPage;
