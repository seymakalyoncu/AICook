import React, { useState, useEffect, useCallback } from 'react';
import toast, { Toaster } from "react-hot-toast";
import { getGenders } from "../../services/genders";
import { addChild, updateChild, getChildrenByParent } from "../../services/children";

const ChildrenPage = () => {
  const [children, setChildren] = useState([]);
  const [selectedChildren, setSelectedChildren] = useState(null);
  const [genders, setGenders] = useState([]);
  const [formData, setForm] = useState({
    name: '',
    surname: '',
    birthDate: '',
    gender: '',
    parent: ''
  });
  const today = new Date().toISOString().split('T')[0];
  const parentId = localStorage.getItem("parent_id");


    const fetchChildren = useCallback(async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await getChildrenByParent(parentId, token);
        setChildren(res.data);
      } catch (err) {
        console.error("Çocuklar alınamadı:", err);
      }
    }, []);

    useEffect(() => {
        if (parentId) {
          resetForm();
          fetchChildren();
          fetchGenders();
        }
    }, [parentId, fetchChildren]);

  const fetchGenders = async () => {
    const res = await getGenders();
    setGenders(res.data);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

    const handleChildrenSelect = (children) => {
    setSelectedChildren(children.id);
    setForm({
      name: children.name,
      surname: children.surname,
      birthDate: `${children.birth_year}-${String(children.birth_month).padStart(2, '0')}-${String(children.birth_day).padStart(2, '0')}`,
      gender: children.gender.toString(),
    });
  };

    const handleAddOrUpdate = async () => {
    const token = localStorage.getItem("token");
    const birthDate = new Date(formData.birthDate);  
    const payload = {
      name: formData.name,
      surname: formData.surname,
      birth_day: birthDate.getDate(),
      birth_month: birthDate.getMonth() + 1,
      birth_year: birthDate.getFullYear(),
      gender: parseInt(formData.gender),
      parent: parentId,
    };
    if (selectedChildren) {
      payload.updateddate = new Date().toISOString();
    }
      try {
        if (selectedChildren) {
          await updateChild(selectedChildren, payload, token);
          console.log("Çocuk Bilgisi güncellendi");
        } else {
          await addChild(payload, token);
          console.log("Çocuk Bilgisi eklendi");
        }
  
        resetForm();
        fetchChildren();
      } catch (error) {
        console.error("İşlem hatası:", error);
      }
    };

  const resetForm = () => {
    setSelectedChildren(null);
    setForm({
      name: '',
      surname: '',
      birthDate: '',
      gender: '',
    });
  };

return (
    <div className="p-6 bg-white min-h-screen">
      <Toaster />
      <h1 className="text-2xl font-semibold text-[#444444] mb-6 leading-snug tracking-wide">
        Çocuk Bilgileri
      </h1>

      {/* Form */}
      <div className="grid grid-cols-2 gap-4 mb-4">
        <input
          type="text"
          name="name"         
          placeholder="Adı"
          value={formData.name}
          onChange={handleChange}
          className="border px-3 py-2 rounded-lg"
        />
        <input
          type="text"
          name="surname"         
          placeholder="Soyadı"
          value={formData.surname}
          onChange={handleChange}
          className="border px-3 py-2 rounded-lg"
        />
        <input
            type="date"
            name="birthDate"
            value={formData.birthDate}
            max={today}
            onChange={(e) => {
              const value = e.target.value;
              if (value > today) {
                toast.error("Doğum tarihi ileri tarih olamaz.");
                console.log(value);
              } else {
                setForm({ ...formData, birthDate: value });
              }
            }}
            required
            className="border px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FFB74D]"
          />         
          <select
            name="gender"
            value={formData.gender}
            onChange={handleChange}
            className="border px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FFB74D]"
          >
            <option value="">Cinsiyet Seçiniz</option>
            {genders.map((gender) => (
              <option key={gender.id} value={gender.id}>{gender.name}</option>
            ))}
          </select>
      </div>

      <div className="flex justify-end gap-2">
        {selectedChildren && (
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
          {selectedChildren ? "Güncelle" : "Kaydet"}
        </button>
      </div>

      {/* Yemek Listesi Tablosu */}
      <div className="mb-6">
        <h2 className="text-lg font-semibold mb-2">Çocuk Listesi</h2>
        {children.length === 0 ? (
          <p className="text-sm text-gray-500">Kayıtlı Çocuk bulunamadı.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full border border-gray-300 text-sm">
              <thead className="bg-gray-100">
                <tr>
                  <th className="border px-4 py-2 text-center">Adı</th>
                  <th className="border px-4 py-2 text-center">Soyadı</th>
                  <th className="border px-4 py-2 text-center">Doğum Tarihi</th>
                  <th className="border px-4 py-2 text-center">Cinsiyeti</th>
                  <th className="border px-4 py-2 text-center">Seç</th>
                </tr>
              </thead>
              <tbody>
                {children.map((children) => (
                  <tr key={children.id} className="hover:bg-gray-50">
                    <td className="border px-4 py-2 text-center">{children.name}</td>
                    <td className="border px-4 py-2 text-center">{children.surname}</td>
                    <td className="border px-4 py-2 text-center">{children.birth_day}/{children.birth_month}/{children.birth_year}</td>
                    <td className="border px-4 py-2 text-center">
                      {
                        genders.find((type) => type.id === children.gender)?.name || "-"
                      }
                      </td>      
                    <td className="border px-4 py-2 text-center">
                      <button
                        onClick={() => handleChildrenSelect(children)}
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

export default ChildrenPage;
