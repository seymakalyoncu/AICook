import React, { useState, useEffect, useCallback } from 'react';
import { useLocation } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";
import { getSleepQualityState } from "../../services/sleep_quality_state";
import { addSleep, getSleepByChild, updateSleep } from "../../services/sleep";

const SleepPage = ({ open }) => {
  const location = useLocation();
  const selectedChild = location.state?.selectedChild;
  const today = new Date().toISOString().slice(0, 16);
  const [sleep_quality, setSleepQualityState] = useState([]);
  const [sleep, setSleep] = useState([]);
  const [selectedSleepId, setSelectedSleepId] = useState(null);

  const [form, setForm] = useState({
    sleep_start_datetime: '',
    sleep_end_datetime: '',
    total_time: '',
    sleep_quality: '',
    comment: '',
  });

  const fetchSleep = useCallback(async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await getSleepByChild(selectedChild.id, token);
      const sortedSleep = res.data.sort(
        (a, b) => new Date(b.sleep_start_datetime) - new Date(a.sleep_start_datetime)
    );
    setSleep(sortedSleep);
    } catch (err) {
      console.error("Uykular alınamadı:", err);
    }
  },[selectedChild.id]);

  useEffect(() => {
    if (selectedChild?.id) {
      resetForm();
      fetchSleepQualityState();
      fetchSleep();
    }
  }, [selectedChild?.id, fetchSleep]);

  useEffect(() => {
  const { sleep_start_datetime, sleep_end_datetime } = form;

  if (sleep_start_datetime && sleep_end_datetime) {
    const start = new Date(sleep_start_datetime);
    const end = new Date(sleep_end_datetime);

    if (!isNaN(start) && !isNaN(end) && end > start) {
      const diffMs = end - start;
      const diffMinutes = Math.floor(diffMs / 1000 / 60);
      setForm((prev) => ({ ...prev, total_time: diffMinutes }));
    }
  }
}, [form.sleep_start_datetime, form.sleep_end_datetime]);

  const fetchSleepQualityState= async () => {
    try {
      const res = await getSleepQualityState();
      setSleepQualityState(res.data);
    } catch (err) {
      console.error("Uyku Kalitesi alınamadı:", err);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSleepSelect = (sleep) => {
    setSelectedSleepId(sleep.id);
    setForm({
      sleep_start_datetime: sleep.sleep_start_datetime?.slice(0, 16),
      sleep_end_datetime: sleep.sleep_end_datetime?.slice(0, 16),
      total_time: sleep.total_time,
      sleep_quality: sleep.sleep_quality.toString(),
      comment: sleep.comment || '',
    });
  };

  const handleAddOrUpdate = async () => {
    const token = localStorage.getItem("token");
    const payload = {
      sleep_start_datetime: form.sleep_start_datetime,
      sleep_end_datetime: form.sleep_end_datetime,
      total_time: form.total_time,
      sleep_quality: parseInt(form.sleep_quality),
      comment: form.comment,
      child: selectedChild.id,
    };
    if (selectedSleepId) {
      payload.updateddate = new Date().toISOString();
    }
    try {
      if (selectedSleepId) {
        await updateSleep(selectedSleepId, payload, token);
        console.log("Uyku güncellendi");
      } else {
        await addSleep(payload, token);
        console.log("Uyku eklendi");
      }

      resetForm();
      fetchSleep();
    } catch (error) {
      console.error("İşlem hatası:", error);
    }
  };

  const resetForm = () => {
    setSelectedSleepId(null);
    setForm({
      sleep_start_datetime: '',
      sleep_end_datetime: '',
      total_time: '',
      sleep_quality: '',
      comment: '',
    });
    
  };

  return (
    <div className="p-6 bg-white min-h-screen">
      <Toaster />
      <h1 className="text-2xl font-semibold text-[#444444] mb-6 leading-snug tracking-wide">
        Uyku Bilgileri
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
          type="datetime-local"
          name="sleep_start_datetime"
          value={form.sleep_start_datetime}
          max={today}
          onChange={(e) => {
              const value = e.target.value;
              if (value > today) {
                toast.error("Uyku başlangıç tarih ve saati ileri tarih olamaz.");
                console.log(value);
              } else {
                setForm({ ...form, sleep_start_datetime: value });
              }
            }}
          className="border px-3 py-2 rounded-lg"
        />
        <input
          type="datetime-local"
          name="sleep_end_datetime"
          value={form.sleep_end_datetime}
          max={today}
          onChange={(e) => {
              const value = e.target.value;
              if (value > today) {
                toast.error("Uyku bitiş tarih ve saati ileri tarih olamaz.");
                console.log(value);
              } else {
                setForm({ ...form, sleep_end_datetime: value });
              }
            }}
          className="border px-3 py-2 rounded-lg"
        />
        <input
          type="text"
          name="total_time"         
          placeholder="Uyku Süresi (Dakika)"
          value={form.total_time}
          readOnly
          className="border px-3 py-2 rounded-lg"
        />
        <select
          name="sleep_quality"
          value={form.sleep_quality}
          onChange={handleChange}
          className="border px-3 py-2 rounded-lg"
        >
          <option value="">Uyku Kalitesi</option>
          {sleep_quality.map((item) => (
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
        {selectedSleepId && (
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
          {selectedSleepId ? "Güncelle" : "Kaydet"}
        </button>
      </div>

      {/* Yemek Listesi Tablosu */}
      <div className="mb-6">
        <h2 className="text-lg font-semibold mb-2">Uyku Listesi</h2>
        {sleep.length === 0 ? (
          <p className="text-sm text-gray-500">Kayıtlı uyku bulunamadı.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full border border-gray-300 text-sm">
              <thead className="bg-gray-100">
                <tr>
                  <th className="border px-4 py-2 text-center">Uyku Süresi</th>
                  <th className="border px-4 py-2 text-center">Uyku Kalitesi</th>
                  <th className="border px-4 py-2 text-center">Uyku Başlangıç Tarihi</th>
                  <th className="border px-4 py-2 text-center">Uyku Bitiş Tarihi</th>
                  <th className="border px-4 py-2 text-center">Seç</th>
                </tr>
              </thead>
              <tbody>
                {sleep.map((sleep) => (
                  <tr key={sleep.id} className="hover:bg-gray-50">
                    <td className="border px-4 py-2 text-center">{sleep.total_time}</td>
                    <td className="border px-4 py-2 text-center">
                      {
                        sleep_quality.find((type) => type.id === sleep.sleep_quality)?.name || "-"
                      }
                    </td>
                    <td className="border px-4 py-2 text-center">
                      {sleep.sleep_start_datetime?.replace("T", " ").slice(0, 16)}
                    </td>
                    <td className="border px-4 py-2 text-center">
                      {sleep.sleep_end_datetime?.replace("T", " ").slice(0, 16)}
                    </td>                 
                    <td className="border px-4 py-2 text-center">
                      <button
                        onClick={() => handleSleepSelect(sleep)}
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

export default SleepPage;
