import React, { useState, useEffect, useCallback } from 'react';
import toast, { Toaster } from "react-hot-toast";
import { useLocation } from "react-router-dom";
import { getDiseaseTypes } from "../../services/disease_type";
import { addIllness, getIllnessByChild, updateIllness } from "../../services/illness";

const IllnessPage = ({ open }) => {
  const location = useLocation();
  const selectedChild = location.state?.selectedChild;
  const today = new Date().toISOString().slice(0, 16);
  const [disease_type, setDiseaseTypes] = useState([]);
  const [illness, setIllness] = useState([]);
  const [selectedIllnessId, setSelectedIllnessId] = useState(null);

  const [form, setForm] = useState({
    disease_type: '',
    disease_name: '',
    disease_datetime: '',
    disease_treatment: '',
    doctor_name: '',
    medicine: '',
    comment: '',
  });

  const fetchIllness = useCallback(async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await getIllnessByChild(selectedChild.id, token);
        const sortedIllness = res.data.sort(
        (a, b) => new Date(b.disease_datetime) - new Date(a.disease_datetime)
    );
      setIllness(sortedIllness);
    } catch (err) {
      console.error("Hastalık alınamadı:", err);
    }
  }, [selectedChild.id]);

  useEffect(() => {
    if (selectedChild?.id) {
      resetForm();
      fetchDiseaseTypes();
      fetchIllness();
    }
  }, [selectedChild?.id, fetchIllness]);

  const fetchDiseaseTypes = async () => {
    try {
      const res = await getDiseaseTypes();
      setDiseaseTypes(res.data);
    } catch (err) {
      console.error("Hastalık türleri alınamadı:", err);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleIllnessSelect = (illness) => {
    setSelectedIllnessId(illness.id);
    setForm({
      disease_type: illness.disease_type.toString(),
      disease_name: illness.disease_name,
      disease_datetime: illness.disease_datetime?.slice(0, 16),
      disease_treatment: illness.disease_treatment,
      doctor_name: illness.doctor_name,
      medicine: illness.medicine,
      comment: illness.comment || '',
    });
  };

  const handleAddOrUpdate = async () => {
    const token = localStorage.getItem("token");
    const payload = {
      disease_type: parseInt(form.disease_type),
      disease_name: form.disease_name,
      disease_datetime: form.disease_datetime,
      disease_treatment: form.disease_treatment,
      doctor_name: form.doctor_name,
      medicine: form.medicine,
      comment: form.comment,
      child: selectedChild.id,
    };
    if (selectedIllnessId) {
      payload.updateddate = new Date().toISOString();
    }
    try {
      if (selectedIllnessId) {
        await updateIllness(selectedIllnessId, payload, token);
        console.log("Hastalık güncellendi");
      } else {
        await addIllness(payload, token);
        console.log("Hastalık eklendi");
      }

      resetForm();
      fetchIllness();
    } catch (error) {
      console.error("İşlem hatası:", error);
    }
  };

  const resetForm = () => {
    setSelectedIllnessId(null);
    setForm({
      disease_type: '',
      disease_name: '',
      disease_datetime: '',
      disease_treatment: '',
      doctor_name: '',
      medicine: '',
      comment: '',
    });
  };

  return (
    <div className="p-6 bg-white min-h-screen">
      <Toaster />
      <h1 className="text-2xl font-semibold text-[#444444] mb-6 leading-snug tracking-wide">
        Hastalık Bilgileri
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
          name="disease_type"
          value={form.disease_type}
          onChange={handleChange}
          className="border px-3 py-2 rounded-lg"
        >
          <option value="">Hastalık Türü</option>
          {disease_type.map((item) => (
            <option key={item.id} value={item.id}>
              {item.name}
            </option>
          ))}
        </select>
        <input
          type="text"
          name="disease_name"
          placeholder="Hastalık Adı"
          value={form.disease_name}
          onChange={handleChange}
          className="border px-3 py-2 rounded-lg"
        />
        <input
          type="datetime-local"
          name="disease_datetime"
          value={form.disease_datetime}
          max={today}
          onChange={(e) => {
              const value = e.target.value;
              if (value > today) {
                toast.error("Hastalık tarih ve saati ileri tarih olamaz.");
                console.log(value);
              } else {
                setForm({ ...form, disease_datetime: value });
              }
            }}
          className="border px-3 py-2 rounded-lg"
        />
        <input
          type="text"
          name="disease_treatment"
          placeholder="Hastalık Tedavisi"
          value={form.disease_treatment}
          onChange={handleChange}
          className="border px-3 py-2 rounded-lg"
        />
        <input
          type="text"
          name="doctor_name"
          placeholder="Doktor Adı-Soyadı"
          value={form.doctor_name}
          onChange={handleChange}
          className="border px-3 py-2 rounded-lg"
        />
        <input
          type="text"
          name="medicine"
          placeholder="Hastane Adı"
          value={form.medicine}
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
        {selectedIllnessId && (
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
          {selectedIllnessId ? "Güncelle" : "Kaydet"}
        </button>
      </div>

      {/* Yemek Listesi Tablosu */}
      <div className="mb-6">
        <h2 className="text-lg font-semibold mb-2">Hastalık Listesi</h2>
        {illness.length === 0 ? (
          <p className="text-sm text-gray-500">Kayıtlı yemek bulunamadı.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full border border-gray-300 text-sm rounded-xl">
              <thead className="bg-gray-100">
                <tr>
                  <th className="border px-4 py-2 text-center">Hastalık Tarihi</th>
                  <th className="border px-4 py-2 text-center">Hastalık Türü</th>
                  <th className="border px-4 py-2 text-center">Hastalık Adı</th>
                  <th className="border px-4 py-2 text-center">Hastalık Tedavisi</th>
                  <th className="border px-4 py-2 text-center">Doktor Adı-Soyadı</th>
                  <th className="border px-4 py-2 text-center">Hastane Adı</th>
                  <th className="border px-4 py-2 text-center">Seç</th>
                </tr>
              </thead>
              <tbody>
                {illness.map((illness) => (
                  <tr key={illness.id} className="hover:bg-gray-50">
                    <td className="border px-4 py-2 text-center">
                      {illness.disease_datetime?.replace("T", " ").slice(0, 16)}
                    </td>
                    <td className="border px-4 py-2 text-center">
                      {
                        disease_type.find((type) => type.id === illness.disease_type)?.name || "-"
                      }
                    </td>
                    <td className="border px-4 py-2 text-center">{illness.disease_name}</td>
                    <td className="border px-4 py-2 text-center">{illness.disease_treatment}</td>
                    <td className="border px-4 py-2 text-center">{illness.doctor_name}</td>
                    <td className="border px-4 py-2 text-center">{illness.medicine}</td>
                    <td className="border px-4 py-2 text-center">
                      <button
                        onClick={() => handleIllnessSelect(illness)}
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

export default IllnessPage;
