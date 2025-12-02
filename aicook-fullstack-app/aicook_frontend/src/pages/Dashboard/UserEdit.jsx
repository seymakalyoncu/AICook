import React, { useState, useEffect } from 'react';
import toast, { Toaster } from "react-hot-toast";
import { getNationatilies } from "../../services/nationatilies";
import { getGenders } from "../../services/genders";
import { getEducations } from "../../services/educations";
import { getCities } from "../../services/cities";
import { getDistricts } from "../../services/districts";
import { getParentById, updateParent } from "../../services/parents"; 
import { updateUser } from '../../services/accounts';

const UserEditPage = () => {
  const [nationalities, setNationalities] = useState([]);
  const [genders, setGenders] = useState([]);
  const [educations, setEducations] = useState([]);
  const [cities, setCities] = useState([]);
  const [districts, setDistricts] = useState([]);
  
  const [formData, setFormData] = useState({
    name: '',
    surname: '',
    username: '',
    email: '',
    city: '',
    district: '',
    birthDate: '',
    gender: '',
    nationality: '',
    education: '',
    user_id: '',
  });

  const token = localStorage.getItem("token");
  const parentId = localStorage.getItem("parent_id");
  const today = new Date().toISOString().split('T')[0];

  useEffect(() => {
    const fetchSelects = async () => {
      try {
        const [nationRes, genderRes, educationRes, cityRes] = await Promise.all([
          getNationatilies(),
          getGenders(),
          getEducations(),
          getCities()
        ]);
        setNationalities(nationRes.data);
        setGenders(genderRes.data);
        setEducations(educationRes.data);
        setCities(cityRes.data);
      } catch (err) {
        toast.error("Seçenekler yüklenirken hata oluştu.");
      }
    };

    fetchSelects();
  }, []);

  useEffect(() => {
    const fetchUserData = async () => {
      if (!parentId) return;
      try {
        const res = await getParentById(parentId, token);
        const user = res.data;

        const birthDate = `${user.birth_year}-${String(user.birth_month).padStart(2, '0')}-${String(user.birth_day).padStart(2, '0')}`;

       setFormData({
        name: user.name || '',
        surname: user.surname || '',
        username: user.username || '',
        email: user.email || '',
        city: user.city || '',
        district: user.districts || '',  // districts alanını kullan
        birthDate: birthDate,
        gender: user.gender?.toString() || '',
        nationality: user.nationality?.toString() || '',
        education: user.education?.toString() || '',
        user_id: user.user_id?.toString() || '', 
        });


        const cityId = user.city_id || user.city;
        if (cityId) {
          const districtRes = await getDistricts(cityId);
          setDistricts(districtRes.data);
        } else {
          setDistricts([]);
        }
      } catch (err) {
        toast.error("Kullanıcı bilgileri yüklenemedi.");
      }
    };

    fetchUserData();
  }, [parentId, token]);

  const handleCityChange = async (e) => {
    const cityId = e.target.value;
    setFormData((prev) => ({ ...prev, city: cityId, district: '' }));

    if (cityId) {
      try {
        const res = await getDistricts(cityId);
        setDistricts(res.data);
      } catch {
        toast.error("İlçeler yüklenirken hata oluştu.");
      }
    } else {
      setDistricts([]);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

    const handleUpdate = async (e) => {
    e.preventDefault();
    try {
        if (!formData.district) {
        toast.error("Lütfen ilçe seçiniz.");
        return;
        }

        const [birth_year, birth_month, birth_day] = formData.birthDate.split('-');

        const parentUpdateData = {
        ...formData,
        birth_year: Number(birth_year),
        birth_month: Number(birth_month),
        birth_day: Number(birth_day),
        user_id: formData.user_id,  
        updateddate: new Date().toISOString(),
        };

        const userUpdateData = {
        first_name: formData.name,
        last_name: formData.surname,
        };

        await updateParent(parentId, parentUpdateData, token);
        await updateUser(formData.user_id, userUpdateData, token);

        toast.success("Kullanıcı bilgileri başarıyla güncellendi.");
    } catch (err) {
        toast.error("Güncelleme işlemi başarısız oldu.");
    }
    };


  return (
    <div className="p-6">
      <Toaster />
      <h1 className="text-2xl font-semibold text-[#444444] mb-6 leading-snug tracking-wide">Kullanıcı Bilgileri</h1>

      <form onSubmit={handleUpdate}>
        <div className="mb-6">
          <div className="grid grid-cols-2 gap-4 mb-4">
            <input
              type="text"
              name="name"
              placeholder="Ad"
              value={formData.name}
              onChange={handleChange}
              className="border px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FFB74D]"
            />
            <input
              type="text"
              name="surname"
              placeholder="Soyad"
              value={formData.surname}
              onChange={handleChange}
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
              name="nationality"
              value={formData.nationality}
              onChange={handleChange}
              className="border px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FFB74D]"
            >
              <option value="">Uyruk Seçiniz</option>
              {nationalities.map((nat) => (
                <option key={nat.id} value={nat.id}>{nat.name}</option>
              ))}
            </select>
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
            <select
              name="education"
              value={formData.education}
              onChange={handleChange}
              className="border px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FFB74D]"
            >
              <option value="">Eğitim Durumu Seçiniz</option>
              {educations.map((edu) => (
                <option key={edu.id} value={edu.id}>{edu.name}</option>
              ))}
            </select>
            <select
              name="city"
              value={formData.city}
              onChange={handleCityChange}
              className="border px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FFB74D]"
            >
              <option value="">İl Seçiniz</option>
              {cities.map((city) => (
                <option key={city.id} value={city.id}>{city.name}</option>
              ))}
            </select>
            <select
              name="district"
              value={formData.district}
              onChange={handleChange}
              className="border px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FFB74D]"
            >
              <option value="">İlçe Seçiniz</option>
              {districts.map((district) => (
                <option key={district.id} value={district.id}>{district.name}</option>
              ))}
            </select>
            <input
              type="email"
              name="email"
              placeholder="E-posta"
              value={formData.email}
              onChange={handleChange}
              className="border px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FFB74D] col-span-2"
              disabled={!!formData.email}
            />
          </div>
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            className="bg-[#FF6600] text-white px-6 py-2 rounded-xl hover:bg-[#e65500]"
          >
            Güncelle
          </button>
        </div>
      </form>
    </div>
  );
};

export default UserEditPage;
