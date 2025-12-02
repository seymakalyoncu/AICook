import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import toast, { Toaster } from "react-hot-toast";
import { getNationatilies } from "../../services/nationatilies";
import { getGenders } from "../../services/genders";
import { getEducations } from "../../services/educations";
import { getCities } from "../../services/cities";
import { getDistricts } from "../../services/districts";
import { authRegister } from "../../services/accounts";

const RegisterPage = () => {
  const navigate = useNavigate();
  const [nationalities, setNationalities] = useState([]);
  const [genders, setGenders] = useState([]);
  const [educations, setEducations] = useState([]);
  const [cities, setCities] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [form, setForm] = useState({
    first_name: '',
    last_name: '',
    username: '',
    email: '',
    password: '',
    password_again: '',
    city: '',
    district: '',
    birthDate: '',
    gender: '',
    education: '',
    is_staff: false,
    is_superuser: true
  });
  const today = new Date().toISOString().split('T')[0];
  
    const fetchNationatilies = async () => {
      const res = await getNationatilies();
      setNationalities(res.data);
    };

    const fetchGenders = async () => {
      const res = await getGenders();
      setGenders(res.data);
    };

    const fetchEducations = async () => {
      const res = await getEducations();
      setEducations(res.data);
    };

    const fetchCities = async () => {
      const res = await getCities();
      setCities(res.data);
    };

    const fetchDistricts = async (city_id) => {
      const res = await getDistricts(city_id);
      setDistricts(res.data);
    };
  
    useEffect(() => {
      fetchNationatilies();
      fetchGenders();
      fetchEducations();
      fetchCities();
    }, []);

  const handleCityChange = (e) => {
      if(e.target.value !== "")
        fetchDistricts(e.target.value);
      else
        setDistricts([]);

      handleChange(e);
  }

  const handleChange = (e) => {

    console.log(e.target.name + ":", e.target.value);

    

    if(e.target.name === 'email')
    {
      console.log("username :", e.target.value);
      setForm((prevForm) => ({ ...prevForm, [e.target.name]: e.target.value,  username: e.target.value}));
    } 
    else
    {
      setForm({ ...form, [e.target.name]: e.target.value });
    }   
  };
  

  const handleRegister = async (e) => {

    e.preventDefault();

    if(form.password !== form.password_again)
    {
      toast.error("Şifreler uyuşmuyor");
      return;
    }

    // Backend'e gönderilecek veri burada hazırlanır

    await authRegister(form).then(result => {
      if(result.status === 201){ 
        // Başarılı kayıt sonrası login ekranına yönlendir

        toast.success("Kayıt işlemi başarıyla yapılmıştır. 5 saniye sonra giriş sayfasına yönlendirileceksiniz.");
        
        setTimeout(() => {
          navigate('/authentication/login');
        }, 5000); // 10 saniye = 10.000 ms

      }
      else{
        toast.error(result.data.msg);
      } 
    }).catch((reason) => {
      Object.values(reason.response.data).map((value) => (toast.error(value)));
    });
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-[#FFFFFF] text-[#444444] font-sans px-4 py-8">
      <div className="flex flex-col items-center mb-8">
        <img src="/aicook-logo.png" alt="AICOOK Logo" className="h-32"/>
        <h2 className="text-[24px] font-semibold mt-4 text-center">AI Tracking for Kids Development</h2>
      </div>

      {/* Kayıt Formu */}
      <div className="bg-white border border-[#DDDDDD] rounded-2xl shadow p-8 w-full max-w-xl">
        <Toaster />
        <form onSubmit={handleRegister} className="grid grid-cols-2 gap-4">
          <input type="text" name="first_name" placeholder="Ad" onBlur={handleChange} required className="border px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FFB74D]" />
          <input type="text" name="last_name" placeholder="Soyad" onBlur={handleChange} required className="border px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FFB74D]" />
          <input
            type="date"
            name="birthDate"
            value={form.birthDate}
            max={today}
            onChange={(e) => {
              const value = e.target.value;
              if (value > today) {
                toast.error("Doğum tarihi ileri tarih olamaz.");
              } else {
                setForm({ ...form, birthDate: value });
              }
            }}
            required
            className="border px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FFB74D]"
          />
          <select
            id="nationality"
            name="nationality"
            onBlur={handleChange}
            required
            className="border px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FFB74D]"
          >
            <option value="">Uyruk Seçiniz</option>
            {nationalities.map((item) => (
              <option key={item.id} value={item.id}>
                {item.name}
              </option>
            ))}
          </select>
          <select id="gender" name="gender" onBlur={handleChange} required className="border px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FFB74D]">
            <option value="">Cinsiyet Seçiniz</option>
            {
              genders.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.name}
                </option>
              ))
            }
          </select>
          <select id="education" name="education" onBlur={handleChange} required className="border px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FFB74D]">
            <option value="">Eğitim Bilgisi Seçiniz</option>
            {
              educations.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.name}
                </option>
              ))
            }
          </select>
          <select id="city" name="city" onBlur={handleCityChange} required className="border px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FFB74D] mb-8">
            <option value="">İl Seçiniz</option>
            {
              cities.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.name}
                </option>
              ))
            }
          </select>
          <select id="district" name="district" onBlur={handleChange} required className="border px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FFB74D] mb-8">
            <option value="">İlçe Seçiniz</option>
            {
              districts.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.name}
                </option>
              ))
            }
          </select>
          <input type="email" name="email" placeholder="E-posta" onBlur={handleChange} required className="border px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FFB74D] col-span-2" />
          <input type="hidden" name="username" />
          <input type="password" name="password" placeholder="Şifre" onBlur={handleChange} required className="border px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FFB74D]" />
          <input type="password" name="password_again" placeholder="Şifre Tekrar" onBlur={handleChange} required className="border px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FFB74D]" />

          <button type="submit" className="bg-[#FF6600] hover:bg-[#e65c00] text-white font-semibold py-2 rounded-xl transition col-span-2">
            Kayıt Ol
          </button>
        </form>
        <div className="text-[14px] text-[#999999] mt-6 text-center col-span-2">
          Zaten hesabın var mı?{' '}
          <button onClick={() => navigate('/authentication/login')} className="text-[#D95F45] font-medium hover:underline">
            Giriş Yap
          </button>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
