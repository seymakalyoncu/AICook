import React, { useState } from 'react';
import toast, { Toaster } from 'react-hot-toast';
import { changePassword } from '../../services/accounts';

const ChangePasswordFormPage = () => {
  const token = localStorage.getItem("token");
  const user_id = localStorage.getItem("user_id");
  console.log(user_id);
  const [password, setPassword] = useState('');
  const [passwordRepeat, setPasswordRepeat] = useState('');
  
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (password !== passwordRepeat) {
      toast.error('Şifreler uyuşmuyor.');
      return;
    }

    try {
      await changePassword(user_id, token, { password });
      toast.success('Şifreniz başarıyla güncellendi.');
      setPassword('');
      setPasswordRepeat('');
    } catch (err) {
      toast.error('Şifre güncellenirken bir hata oluştu.');
    }
  };

  return (
    <div className="p-6">
      <Toaster />
      <h1 className="text-2xl font-semibold text-[#444444] mb-6 leading-snug tracking-wide">
        Şifre Değiştir
      </h1>

      <form onSubmit={handleSubmit}>
        <div className="mb-6">
          <div className="grid grid-cols-2 gap-4 mb-4">
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full border px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FFB74D]"
              placeholder="Şifre"
            />
            <input
              type="password"
              value={passwordRepeat}
              onChange={(e) => setPasswordRepeat(e.target.value)}
              required
              className="w-full border px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FFB74D]"
              placeholder="Şifre Tekrar"
            />
          </div>
        </div>


        <div className="flex justify-end">
          <button
            type="submit"
            className="bg-[#FF6600] text-white px-6 py-2 rounded-xl hover:bg-[#e65500] transition-colors"
          >
            Şifreyi Güncelle
          </button>
        </div>
      </form>
    </div>
  );
};

export default ChangePasswordFormPage;
