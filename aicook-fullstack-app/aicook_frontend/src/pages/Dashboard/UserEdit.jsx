import React, { useState, useEffect } from 'react';
import toast, { Toaster } from "react-hot-toast";
import { getGender } from "../../services/gender";
import { getUserById, updateUser } from "../../services/users"; 
import { updateUsers } from '../../services/accounts';

const UserEditPage = () => {
  const [gender, setGender] = useState([]);

  
  const [formData, setFormData] = useState({
    name: '',
    surname: '',
    username: '',
    email: '',  
    birthDate: '',
    gender: '',
    user_id: '',
  });

  const token = localStorage.getItem("token");
  const userId = localStorage.getItem("user_id");
  const today = new Date().toISOString().split('T')[0];

  useEffect(() => {
    const fetchSelects = async () => {
      try {
        const [ genderRes] = await Promise.all([
          getGender()
        ]);      
        setGender(genderRes.data);
      } catch (err) {
        toast.error("Seçenekler yüklenirken hata oluştu.");
      }
    };

    fetchSelects();
  }, []);

  useEffect(() => {
    const fetchUserData = async () => {
      if (!userId) return;
      try {
        const res = await getUserById(userId, token);
        const user = res.data;

        const birthDate = `${user.birth_year}-${String(user.birth_month).padStart(2, '0')}-${String(user.birth_day).padStart(2, '0')}`;

       setFormData({
        name: user.name || '',
        surname: user.surname || '',
        username: user.username || '',
        email: user.email || '',
        birthDate: birthDate,
        gender: user.gender?.toString() || '',
        user_id: user.user_id?.toString() || '', 
        });

      } catch (err) {
        toast.error("Kullanıcı bilgileri yüklenemedi.");
      }
    };

    fetchUserData();
  }, [userId, token]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

    const handleUpdate = async (e) => {
    e.preventDefault();
    try {
        
        const [birth_year, birth_month, birth_day] = formData.birthDate.split('-');

        const userUpdateData = {
        ...formData,
        birth_year: Number(birth_year),
        birth_month: Number(birth_month),
        birth_day: Number(birth_day),
        user_id: formData.user_id,  
        updateddate: new Date().toISOString(),
        };

        const usersUpdateData = {
        first_name: formData.name,
        last_name: formData.surname,
        };

        await updateUser(userId, userUpdateData, token);
        await updateUsers(formData.user_id, usersUpdateData, token);

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
              className="border px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#e6ecff]"
            />
            <input
              type="text"
              name="surname"
              placeholder="Soyad"
              value={formData.surname}
              onChange={handleChange}
              className="border px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#e6ecff]"
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
              className="border px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#e6ecff]"
            />           
            <select
              name="gender"
              value={formData.gender}
              onChange={handleChange}
              className="border px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#e6ecff]"
            >
              <option value="">Cinsiyet Seçiniz</option>
              {gender.map((gender) => (
                <option key={gender.id} value={gender.id}>{gender.name}</option>
              ))}
            </select>         
            <input
              type="email"
              name="email"
              placeholder="E-posta"
              value={formData.email}
              onChange={handleChange}
              className="border px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#e6ecff] col-span-2"
              disabled={!!formData.email}
            />
          </div>
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            className="bg-[#4294ff] text-white px-6 py-2 rounded-xl hover:bg-[#e65500]"
          >
            Güncelle
          </button>
        </div>
      </form>
    </div>
  );
};

export default UserEditPage;
