import React, { useState, useEffect, useCallback } from 'react';
import toast, { Toaster } from "react-hot-toast";
import { useLocation } from "react-router-dom";
import { addPhysical, getPhysicalByChild, updatePhysical } from "../../services/physical";

const PhysicalPage = ({ open }) => {
  const location = useLocation();
  const selectedChild = location.state?.selectedChild;
  const today = new Date().toISOString().slice(0, 16);
  const [physical, setPhysical] = useState([]);
  const [selectedPhysicalId, setSelectedPhysicalId] = useState(null);

  const [form, setForm] = useState({
    height_field: '',
    weight: '',
    head_circumference: '',
    measurement_datetime: '',
    comment: '',
  });

  const fetchPhysical = useCallback(async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await getPhysicalByChild(selectedChild.id, token);
      const sortedPhysical = res.data.sort(
        (a, b) => new Date(b.measurement_datetime) - new Date(a.measurement_datetime)
    );
      setPhysical(sortedPhysical);
    } catch (err) {
      console.error("Fiziksel gelişim alınamadı:", err);
    }
  }, [selectedChild.id]);

  useEffect(() => {
    if (selectedChild?.id) {
      resetForm();
      fetchPhysical();
    }
  }, [selectedChild?.id, fetchPhysical]);


  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handlePhysicalSelect = (physical) => {
    setSelectedPhysicalId(physical.id);
    setForm({
      height_field: physical.height_field,
      weight: physical.weight,
      head_circumference: physical.head_circumference,
      measurement_datetime: physical.measurement_datetime?.slice(0, 16),
      comment: physical.comment || '',
    });
  };

  const handleAddOrUpdate = async () => {
    const token = localStorage.getItem("token");
    const payload = {
      height_field: form.height_field,
      weight: form.weight,
      head_circumference: parseFloat(form.head_circumference),
      measurement_datetime: form.measurement_datetime,
      comment: form.comment,
      child: selectedChild.id,
    };
    if (selectedPhysicalId) {
      payload.updateddate = new Date().toISOString();
    }
    try {
      if (selectedPhysicalId) {
        await updatePhysical(selectedPhysicalId, payload, token);
        console.log("Fiziksel gelişim güncellendi");
      } else {
        await addPhysical(payload, token);
        console.log("Fiziksel gelişim eklendi");
      }

      resetForm();
      fetchPhysical();
    } catch (error) {
      console.error("İşlem hatası:", error);
    }
  };

  const resetForm = () => {
    setSelectedPhysicalId(null);
    setForm({
      height_field: '',
      weight: '',
      head_circumference: '',
      measurement_datetime: '',
      comment: '',
    });
  };

  return (
    <div className="p-6 bg-white min-h-screen">
      <Toaster />
      <h1 className="text-2xl font-semibold text-[#444444] mb-6 leading-snug tracking-wide">
        Fiziksel Gelişim Bilgileri
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
          name="height_field"
          placeholder="Boy"
          value={form.height_field}
          onChange={handleChange}
          className="border px-3 py-2 rounded-lg"
        />
        <input
          type="text"
          name="weight"
          placeholder="Kilo"
          value={form.weight}
          onChange={handleChange}
          className="border px-3 py-2 rounded-lg"
        />
        <input
          type="text"
          name="head_circumference"         
          placeholder="Baş Çevresi"
          value={form.head_circumference}
          onChange={handleChange}
          className="border px-3 py-2 rounded-lg"
        />
        <input
          type="datetime-local"
          name="measurement_datetime"    
          value={form.measurement_datetime}
          max={today}
          onChange={(e) => {
              const value = e.target.value;
              if (value > today) {
                toast.error("Fiziksel gelişim tarih ve saati ileri tarih olamaz.");
                console.log(value);
              } else {
                setForm({ ...form, measurement_datetime: value });
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
        {selectedPhysicalId && (
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
          {selectedPhysicalId ? "Güncelle" : "Kaydet"}
        </button>
      </div>

      {/* Yemek Listesi Tablosu */}
      <div className="mb-6">
        <h2 className="text-lg font-semibold mb-2">Fiziksel Gelişim Listesi</h2>
        {physical.length === 0 ? (
          <p className="text-sm text-gray-500">Kayıtlı fiziksel gelişim bulunamadı.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full border border-gray-300 text-sm">
              <thead className="bg-gray-100">
                <tr>
                  <th className="border px-4 py-2 text-center">Ölçüm Tarihi</th>
                  <th className="border px-4 py-2 text-center">Boy</th>
                  <th className="border px-4 py-2 text-center">Kilo</th>
                  <th className="border px-4 py-2 text-center">Baş Çevresi</th>
                  <th className="border px-4 py-2 text-center">Seç</th>
                </tr>
              </thead>
              <tbody>
                {physical.map((physical) => (
                  <tr key={physical.id} className="hover:bg-gray-50">
                    <td className="border px-4 py-2 text-center">
                      {physical.measurement_datetime?.replace("T", " ").slice(0, 16)}
                    </td>
                    <td className="border px-4 py-2 text-center">{physical.height_field}</td>
                    <td className="border px-4 py-2 text-center">{physical.weight}</td>
                    <td className="border px-4 py-2 text-center">{physical.head_circumference}</td>                
                    <td className="border px-4 py-2 text-center">
                      <button
                        onClick={() => handlePhysicalSelect(physical)}
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

export default PhysicalPage;
