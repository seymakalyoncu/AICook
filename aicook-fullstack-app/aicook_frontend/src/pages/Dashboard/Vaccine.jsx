import React, { useState, useEffect, useCallback } from 'react';
import toast, { Toaster } from "react-hot-toast";
import { useLocation } from "react-router-dom";
import { getVaccineTypes } from "../../services/vaccine_type";
import { addVaccine, getVaccineByChild, updateVaccine } from "../../services/vaccine";

const VaccinePage = ({ open }) => {
  const location = useLocation();
  const selectedChild = location.state?.selectedChild;
  const today = new Date().toISOString().slice(0, 16);
  const [vaccine_type, setVaccineTypes] = useState([]);
  const [vaccine_record, setVaccine] = useState([]);
  const [selectedVaccineId, setSelectedVaccineId] = useState(null);

  const [form, setForm] = useState({
    vaccine_type: '',
    vaccine_datetime: '',
    doctor_name: '',
    comment: '',
  });

  const fetchVaccine = useCallback(async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await getVaccineByChild(selectedChild.id, token);
        const sortedVaccine = res.data.sort(
        (a, b) => new Date(b.vaccine_datetime) - new Date(a.vaccine_datetime)
    );
      setVaccine(sortedVaccine);
    } catch (err) {
      console.error("Aşı alınamadı:", err);
    }
  }, [selectedChild.id]);

  useEffect(() => {
    if (selectedChild?.id) {
      resetForm();
      fetchVaccineTypes();
      fetchVaccine();
    }
  }, [selectedChild?.id, fetchVaccine]);

  const fetchVaccineTypes = async () => {
    try {
      const res = await getVaccineTypes();
      setVaccineTypes(res.data);
    } catch (err) {
      console.error("Aşı türleri alınamadı:", err);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleVaccineSelect = (vaccine_record) => {
    setSelectedVaccineId(vaccine_record.id);
    setForm({
      vaccine_type: vaccine_record.vaccine.toString(),
      vaccine_datetime: vaccine_record.vaccine_datetime?.slice(0, 16),
      doctor_name: vaccine_record.doctor_name,
      comment: vaccine_record.comment || '',
    });
  };

  const handleAddOrUpdate = async () => {
    const token = localStorage.getItem("token");
    const payload = {
      vaccine: parseInt(form.vaccine_type),
      vaccine_datetime: form.vaccine_datetime,
      doctor_name: form.doctor_name,
      comment: form.comment,
      child: selectedChild.id,
    };
    if (selectedVaccineId) {
      payload.updateddate = new Date().toISOString();
    }
    try {
      if (selectedVaccineId) {
        await updateVaccine(selectedVaccineId, payload, token);
        console.log("Aşı güncellendi");
      } else {
        await addVaccine(payload, token);
        console.log("Aşı eklendi");
      }

      resetForm();
      fetchVaccine();
    } catch (error) {
      console.error("İşlem hatası:", error);
    }
  };

  const resetForm = () => {
    setSelectedVaccineId(null);
    setForm({
      vaccine_type: '',
      vaccine_datetime: '',
      doctor_name: '',
      comment: '',
    });
  };

  return (
    <div className="p-6 bg-white min-h-screen">
      <Toaster />
      <h1 className="text-2xl font-semibold text-[#444444] mb-6 leading-snug tracking-wide">
        Aşı Bilgileri
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
          name="vaccine_type"
          value={form.vaccine_type}
          onChange={handleChange}
          className="border px-3 py-2 rounded-lg"
        >
          <option value="">Aşı Türü</option>
          {vaccine_type.map((item) => (
            <option key={item.id} value={item.id}>
              {item.name}
            </option>
          ))}
        </select>
        <input
          type="datetime-local"
          name="vaccine_datetime"
          value={form.vaccine_datetime}
          max={today}
            onChange={(e) => {
              const value = e.target.value;
              if (value > today) {
                toast.error("Aşı tarih ve saati ileri tarih olamaz.");
                console.log(value);
              } else {
                setForm({ ...form,vaccine_datetime: value });
              }
            }}
          className="border px-3 py-2 rounded-lg"
        />
        <input
          type="text"
          name="doctor_name"
          placeholder="Doktor Adı-Soyadı"
          value={form.doctor_name}
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
        {selectedVaccineId && (
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
          {selectedVaccineId ? "Güncelle" : "Kaydet"}
        </button>
      </div>

      {/* Yemek Listesi Tablosu */}
      <div className="mb-6">
        <h2 className="text-lg font-semibold mb-2">Aşı Listesi</h2>
        {vaccine_record.length === 0 ? (
          <p className="text-sm text-gray-500">Kayıtlı aşı bulunamadı.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full border border-gray-300 text-sm rounded-xl">
              <thead className="bg-gray-100">
                <tr>
                  <th className="border px-4 py-2 text-center">Aşı Tarihi</th>
                  <th className="border px-4 py-2 text-center">Aşı Türü</th>
                  <th className="border px-4 py-2 text-center">Doktor Adı-Soyadı</th>
                  <th className="border px-4 py-2 text-center">Seç</th>
                </tr>
              </thead>
              <tbody>
                {vaccine_record.map((vaccine_record) => (
                  <tr key={vaccine_record.id} className="hover:bg-gray-50">
                    <td className="border px-4 py-2 text-center">
                      {vaccine_record.vaccine_datetime?.replace("T", " ").slice(0, 16)}
                    </td>
                    <td className="border px-4 py-2 text-center">
                      {
                        vaccine_type.find((type) => type.id === vaccine_record.vaccine)?.name || "-"
                      }
                    </td>
                    <td className="border px-4 py-2 text-center">{vaccine_record.doctor_name}</td>
                    <td className="border px-4 py-2 text-center">
                      <button
                        onClick={() => handleVaccineSelect(vaccine_record)}
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

export default VaccinePage;
