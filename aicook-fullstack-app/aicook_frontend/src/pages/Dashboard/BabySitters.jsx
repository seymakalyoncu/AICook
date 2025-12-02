import React, { useState, useEffect, useCallback } from 'react';
import toast, { Toaster } from "react-hot-toast";
import { addBabySitter, getBabySitterByParent, updateBabySitter } from "../../services/babysitters";
import { getGenders } from "../../services/genders";
import { getNationatilies } from "../../services/nationatilies";
import { getEducations } from "../../services/educations";
import { userInfo, changeUserStatus } from "../../services/accounts";

const BabysitterPage = () => {
  const [babysitters, setBabysitters] = useState([]);
  const [selectedBabysitter, setSelectedBabysitter] = useState(null);
  const [userStatusMap, setUserStatusMap] = useState({});
  const [formData, setFormData] = useState({
    name: '',
    surname: '',
    birthDate: '',
    gender: '',
    nationality: '',
    education: '',
    email: '',
    parent: '',
    user_id: ''
  });
  const [genders, setGenders] = useState([]);
  const [nationalities, setNationalities] = useState([]);
  const [educations, setEducations] = useState([]);
  const [token] = useState(localStorage.getItem("token"));
  const today = new Date().toISOString().split('T')[0];
  const [isEditMode, setIsEditMode] = useState(false);
  const parentId = localStorage.getItem("parent_id");

  const fetchBabysitters = useCallback(async () => {
    if (!parentId) return;
    try {
      const token = localStorage.getItem("token");
      const res = await getBabySitterByParent(parentId, token);
      setBabysitters(res.data);
    } catch (err) {
      console.error("Bakıcı alınamadı", err);
    }
  }, [parentId, token]);

  const fetchGenders = useCallback(async () => {
    try {
      const res = await getGenders();
      setGenders(res.data);
    } catch (err) {
      console.error("Error fetching genders:", err);
    }
  }, []);

  const fetchNationalities = useCallback(async () => {
    try {
      const res = await getNationatilies();
      setNationalities(res.data);
    } catch (err) {
      console.error("Error fetching nationalities:", err);
    }
  }, []);

  const fetchEducations = useCallback(async () => {
    try {
      const res = await getEducations();
      setEducations(res.data);
    } catch (err) {
      console.error("Error fetching educations:", err);
    }
  }, []);

  useEffect(() => {
    if (parentId) {
      fetchBabysitters();
      fetchGenders();
      fetchNationalities();
      fetchEducations();
    }
  }, [parentId, fetchBabysitters, fetchGenders, fetchNationalities, fetchEducations]);

  useEffect(() => {
          const fetchUserStatuses = async () => {
      const statusMap = {};
      for (const babysitter of babysitters) {
        if (babysitter.user_id) {
          try {
            const res = await userInfo(token, babysitter.user_id);
            console.log(res);
            statusMap[babysitter.user_id] = res.data?.is_active; // true/false
          } catch (err) {
            console.error("İşlem hatası:", err);
            statusMap[babysitter.user_id] = null;
          }
        }
      }
      console.log(statusMap);
      setUserStatusMap(statusMap);
    };

    if (babysitters.length > 0) {
      fetchUserStatuses();
    }

  }, [babysitters])

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

    const handleBlur = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddOrUpdate = async () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    
    if (!emailRegex.test(formData.email)) {
    toast.error("Geçerli bir e-posta adresi giriniz.");
    return;
  }
    const birthDate = new Date(formData.birthDate);  
    console.log(parentId);
    const payload = {
      name: formData.name,
      surname: formData.surname,
      birth_day: birthDate.getDate(),
      birth_month: birthDate.getMonth() + 1,
      birth_year: birthDate.getFullYear(),
      gender: parseInt(formData.gender),
      nationality: parseInt(formData.nationality),
      education: parseInt(formData.education),
      email: formData.email,
      parent: parentId,
    };
    if (selectedBabysitter) {
      payload.updateddate = new Date().toISOString();
    }
    try {
      if (selectedBabysitter !== null && selectedBabysitter.id > 0) {
        await updateBabySitter(selectedBabysitter.id, payload, token);
        console.log("Bakıcı güncellendi");
      } else {
        await addBabySitter(payload, token);
        console.log("Bakıcı eklendi");
      }
      resetForm();
      fetchBabysitters();
    }
    catch (error) {
      console.error('Hata:', error);
      alert('Bir hata oluştu!');
    }
  };

  const handleChangeBabysitterStatus = async (user_id, status) =>{
      await changeUserStatus(user_id, status, token);
      fetchBabysitters();
  }
    
  const resetForm = () => {
    setIsEditMode(false);
    setSelectedBabysitter(null);
    setFormData({
      name: '',
      surname: '',
      birthDate: '',
      gender: '',
      nationality: '',  // Fix the typo here
      education: '',
      email: '',
      parent: '',
    });
  };

  const handleSelectBabysitter = (babysitter) => {
    setIsEditMode(true);
    console.log(isEditMode);
    setSelectedBabysitter(babysitter);
    setFormData({
      name: babysitter.name,
      surname: babysitter.surname,
      birthDate: `${babysitter.birth_year}-${String(babysitter.birth_month).padStart(2, '0')}-${String(babysitter.birth_day).padStart(2, '0')}`,
      gender: babysitter.gender,
      nationality: babysitter.nationality,
      education: babysitter.education,
      email: babysitter.email,
      parent: babysitter.parentId,
      user_id:babysitter.user_id
    });
  };
  

  return (
    <div className="p-6">
      <Toaster />
      <h1 className="text-2xl font-semibold text-[#444444] mb-6 leading-snug tracking-wide">Bakıcı Bilgileri</h1>

      <div className="mb-6">
        <div className="grid grid-cols-2 gap-4 mb-4">
          <input
            type="text"
            name="name"
            placeholder="Ad"
            value={formData.name}
            onChange={handleChange}
            onBlur={handleBlur}
            className="border px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FFB74D]"
          />
          <input
            type="text"
            name="surname"
            placeholder="Soyad"
            value={formData.surname}
            onChange={handleChange}
            onBlur={handleBlur}
            className="border px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FFB74D]"
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
                setFormData({ ...formData, birthDate: value });
              }
            }}
            className="border px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FFB74D]"
          />         
          <select
            name="gender"
            value={formData.gender}
            onChange={handleChange}
            onBlur={handleBlur}
            className="border px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FFB74D]"
          >
            <option value="">Cinsiyet Seçiniz</option>
            {genders.map((gender) => (
              <option key={gender.id} value={gender.id}>{gender.name}</option>
            ))}
          </select>
          <select
            name="nationality"
            value={formData.nationality}
            onChange={handleChange}
            onBlur={handleBlur}
            className="border px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FFB74D]"
          >
            <option value="">Uyruk Seçiniz</option>
            {nationalities.map((nationality) => (
              <option key={nationality.id} value={nationality.id}>{nationality.name}</option>
            ))}
          </select>
          <select
            name="education"
            value={formData.education}
            onChange={handleChange}
            onBlur={handleBlur}
            className="border px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FFB74D]"
          >
            <option value="">Eğitim Durumu Seçiniz</option>
            {educations.map((education) => (
              <option key={education.id} value={education.id}>{education.name}</option>
            ))}
          </select>
          <input
            type="email"
            name="email"
            placeholder="E-posta"
            value={formData.email}
            onChange={handleChange}
            onBlur={handleBlur}
            className="border px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FFB74D] col-span-2"
            disabled={!!formData.email && isEditMode}
          />
        </div>

        <div className="flex justify-end gap-2">
        {selectedBabysitter && (
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
          {selectedBabysitter ? "Güncelle" : "Kaydet"}
        </button>
      </div>
      </div>

      {/* Bakıcılar Tablosu */}
      <div className="mb-6">
        <h2 className="text-lg font-semibold mb-2">Bakıcı Listesi</h2>
        {babysitters.length === 0 ? (
          <p className="text-sm text-gray-500">Kayıtlı bakıcı bulunamadı.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full border border-gray-300 text-sm">
              <thead className="bg-gray-100">
                <tr>
                  <th className="border px-4 py-2 text-center">Ad</th>
                  <th className="border px-4 py-2 text-center">Soyad</th>
                  <th className="border px-4 py-2 text-center">Doğum Tarihi</th>
                  <th className="border px-4 py-2 text-center">Cinsiyet</th>
                  <th className="border px-4 py-2 text-center">Uyruk</th>
                  <th className="border px-4 py-2 text-center">Eğitim Durumu</th>
                  <th className="border px-4 py-2 text-center">E-posta</th>
                  <th className="border px-4 py-2 text-center">Seç</th>
                </tr>
              </thead>
              <tbody>
                {babysitters.map((babysitter) => (
                  <tr key={babysitter.id} className="hover:bg-gray-50">
                    <td className="border px-4 py-2 text-center">{babysitter.name}</td>
                    <td className="border px-4 py-2 text-center">{babysitter.surname}</td>
                    <td className="border px-4 py-2 text-center">{babysitter.birth_day}/{babysitter.birth_month}/{babysitter.birth_year}</td>
                    <td className="border px-4 py-2 text-center">
                      {
                        genders.find((type) => type.id === babysitter.gender)?.name || "-"
                      }
                      </td>
                    <td className="border px-4 py-2 text-center">
                      {
                        nationalities.find((type) => type.id === babysitter.nationality)?.name || "-"
                      }
                    </td>
                    <td className="border px-4 py-2 text-center">
                      {
                        educations.find((type) => type.id === babysitter.education)?.name || "-"
                      }
                    </td>
                    <td className="border px-4 py-2 text-center">{babysitter.email}</td>
                    <td className="border px-4 py-2 text-left">
                      <button onClick={() => handleSelectBabysitter(babysitter)} className="bg-[#FF6600] hover:bg-[#e65500] text-white px-3 py-1 rounded-md text-sm">Seç</button>
                      &nbsp;&nbsp;&nbsp;
                        {
                          babysitter.user_id
                            ? userStatusMap[babysitter.user_id] === true ? (
                                <button onClick={() => handleChangeBabysitterStatus(babysitter.user_id, false)} className="bg-[#00ff00] hover:bg-[#7be600] text-white px-3 py-1 rounded-md text-sm">Aktif</button>
                              ) : userStatusMap[babysitter.user_id] === false ? (
                                <button onClick={() => handleChangeBabysitterStatus(babysitter.user_id, true)} className="bg-[#ff002b] hover:bg-[#e60000] text-white px-3 py-1 rounded-md text-sm">Pasif</button>
                              ) : (
                                <span className="text-gray-500 text-sm">Yükleniyor...</span>
                              )
                            : <span className="text-red-900 text-sm">Mail Doğrulama bekleniyor</span>
                        }
                      
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

export default BabysitterPage;
