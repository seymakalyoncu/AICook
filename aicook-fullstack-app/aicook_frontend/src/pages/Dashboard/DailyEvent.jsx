import React, { useState, useEffect, useCallback } from 'react';
import toast, { Toaster } from "react-hot-toast";
import { useLocation } from "react-router-dom";
import { getDailyEventTypes } from "../../services/daily_event_type";
import { addDailyEvent, getDailyEventByChild, updateDailyEvent } from "../../services/dailyEvent";

const DailyEventPage = ({ open }) => {
  const location = useLocation();
  const selectedChild = location.state?.selectedChild;
  const today = new Date().toISOString().slice(0, 16);
  const [daily_event_type, setDailyEventTypes] = useState([]);
  const [dailyEvent, setDailyEvent] = useState([]);
  const [selectedDailyEventId, setSelectedDailyEventId] = useState(null);

  const [form, setForm] = useState({
    daily_event_type: '',
    comment: '',
    event_datetime: '',
  });

  const fetchDailyEvent = useCallback(async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await getDailyEventByChild(selectedChild.id, token);
        const sortedDailyEvent = res.data.sort(
        (a, b) => new Date(b.event_datetime) - new Date(a.event_datetime)
    );
      setDailyEvent(sortedDailyEvent);
    } catch (err) {
      console.error("Günlük Olay alınamadı:", err);
    }
  }, [selectedChild.id]);

  useEffect(() => {
    if (selectedChild?.id) {
      resetForm();
      fetchDailyEventTypes();
      fetchDailyEvent();
    }
  }, [selectedChild?.id, fetchDailyEvent]);

  const fetchDailyEventTypes = async () => {
    try {
      const res = await getDailyEventTypes();
      setDailyEventTypes(res.data);
    } catch (err) {
      console.error("Günlük olay türleri alınamadı:", err);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleDailyEventSelect = (dailyEvent) => {
    setSelectedDailyEventId(dailyEvent.id);
    setForm({
      daily_event_type: dailyEvent.daily_event_type.toString(),
      comment: dailyEvent.comment || '',
      event_datetime: dailyEvent.event_datetime?.slice(0, 16),
    });
  };

  const handleAddOrUpdate = async () => {
    const token = localStorage.getItem("token");
    const payload = {
      daily_event_type: parseInt(form.daily_event_type),
      comment: form.comment,
      event_datetime: form.event_datetime,
      child: selectedChild.id,
    };
    if (selectedDailyEventId) {
      payload.updateddate = new Date().toISOString();
    }
    try {
      if (selectedDailyEventId) {
        await updateDailyEvent(selectedDailyEventId, payload, token);
        console.log("Günlük olay güncellendi");
      } else {
        await addDailyEvent(payload, token);
        console.log("Günlük olay eklendi");
      }

      resetForm();
      fetchDailyEvent();
    } catch (error) {
      console.error("İşlem hatası:", error);
    }
  };

  const resetForm = () => {
    setSelectedDailyEventId(null);
    setForm({
      daily_event_type: '',
      comment: '',
      event_datetime: '',
    });
  };

  return (
    <div className="p-6 bg-white min-h-screen">
      <Toaster />
      <h1 className="text-2xl font-semibold text-[#444444] mb-6 leading-snug tracking-wide">
        Günlük Olay Bilgileri
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
          name="daily_event_type"
          value={form.daily_event_type}
          onChange={handleChange}
          className="border px-3 py-2 rounded-lg"
        >
          <option value="">Günlük Olay Türü</option>
          {daily_event_type.map((item) => (
            <option key={item.id} value={item.id}>
              {item.name}
            </option>
          ))}
        </select>
        <input
          type="datetime-local"
          name="event_datetime"
          value={form.event_datetime}
          max={today}
            onChange={(e) => {
              const value = e.target.value;
              if (value > today) {
                toast.error("Günlük olay tarih ve saati ileri tarih olamaz.");
                console.log(value);
              } else {
                setForm({ ...form,event_datetime: value });
              }
            }}
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
        {selectedDailyEventId && (
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
          {selectedDailyEventId ? "Güncelle" : "Kaydet"}
        </button>
      </div>

      {/* Yemek Listesi Tablosu */}
      <div className="mb-6">
        <h2 className="text-lg font-semibold mb-2">Günlük Olay Listesi</h2>
        {dailyEvent.length === 0 ? (
          <p className="text-sm text-gray-500">Kayıtlı günlük olay bulunamadı.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full border border-gray-300 text-sm rounded-xl">
              <thead className="bg-gray-100">
                <tr>
                  <th className="border px-4 py-2 text-center">Günlük Olay Tarihi</th>
                  <th className="border px-4 py-2 text-center">Günlük Olay Tipi</th>
                  <th className="border px-4 py-2 text-center">Açıklama</th>
                  <th className="border px-4 py-2 text-center">Seç</th>
                </tr>
              </thead>
              <tbody>
                {dailyEvent.map((dailyEvent) => (
                  <tr key={dailyEvent.id} className="hover:bg-gray-50">
                    <td className="border px-4 py-2 text-center">
                      {dailyEvent.event_datetime?.replace("T", " ").slice(0, 16)}
                    </td>
                    <td className="border px-4 py-2 text-center">
                      {
                        daily_event_type.find((type) => type.id === dailyEvent.daily_event_type)?.name || "-"
                      }
                    </td>
                    <td className="border px-4 py-2 text-center">{dailyEvent.comment}</td>
                    <td className="border px-4 py-2 text-center">
                      <button
                        onClick={() => handleDailyEventSelect(dailyEvent)}
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

export default DailyEventPage;
