import React, { useState, useEffect, useCallback } from 'react';
import toast, { Toaster } from "react-hot-toast";
import { useLocation } from "react-router-dom";
import { getDevelopmentState } from "../../services/development_state";
import { getMotorDevelopmentType } from "../../services/motor_development_type";
import { getFineGrossMotorType, getFineGrossMotorTypeByMotor } from "../../services/fine_gross_motor_type";
import { addMotor, getMotorByChild, updateMotor } from "../../services/motor";

const MotorPage = ({ open }) => {
  const location = useLocation();
  const selectedChild = location.state?.selectedChild;
  const today = new Date().toISOString().slice(0, 16);
  const [development_state, setDevelopmentState] = useState([]);
  const [motor_development_type, setMotorDevelopmentType] = useState([]);
  const [fine_gross_motor_type, setAllFineGrossMotorTypes] = useState([]); 
  const [filteredFineGrossMotorTypes, setFilteredFineGrossMotorTypes] = useState([]); 
  const [motor, setMotor] = useState([]);
  const [selectedMotorId, setSelectedMotorId] = useState(null);

  const [form, setForm] = useState({
    motor_development_type: '',
    fine_gross_motor_type: '',
    development_state: '',
    observation: '',
    observation_datetime: '',
    comment: '',
  });

  const fetchMotor = useCallback(async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await getMotorByChild(selectedChild.id, token);
        const sortedMotor = res.data.sort(
        (a, b) => new Date(b.observation_datetime) - new Date(a.observation_datetime)
    );
      setMotor(sortedMotor);
    } catch (err) {
      console.error("Motor Gelişim alınamadı:", err);
    }
  }, [selectedChild.id]);

  useEffect(() => {
    if (selectedChild?.id) {
      resetForm();
      fetchDevelopmentState();
      fetchMotorDevelopmentType();
      fetchAllFineGrossMotorTypes();
      fetchMotor();
    }
  }, [selectedChild?.id, fetchMotor]);

    useEffect(() => {
      if (form.motor_development_type) {
        fetchFilteredFineGrossMotorTypes(form.motor_development_type);
      } else {
        setFilteredFineGrossMotorTypes([]);
      }
    }, [form.motor_development_type]);

  const fetchMotorDevelopmentType= async () => {
    try {
      const res = await getMotorDevelopmentType();
      setMotorDevelopmentType(res.data);
    } catch (err) {
      console.error("Motor Gelişim tipi alınamadı:", err);
    }
  };

    const fetchAllFineGrossMotorTypes = async () => {
      try {
        const res = await getFineGrossMotorType();
        setAllFineGrossMotorTypes(res.data);
      } catch (err) {
        console.error("Motor Gelişim alt tipi alınamadı:", err);
      }
    };

    const fetchFilteredFineGrossMotorTypes = async (motorDevelopmentTypeId) => {
      try {
        const res = await getFineGrossMotorTypeByMotor(motorDevelopmentTypeId);
        setFilteredFineGrossMotorTypes(res.data);
      } catch (err) {
        console.error("Alt türler alınamadı:", err);
      }
    };

  const fetchDevelopmentState= async () => {
    try {
      const res = await getDevelopmentState();
      setDevelopmentState(res.data);
    } catch (err) {
      console.error("Gelişim durumu alınamadı:", err);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleMotorSelect = async (motor) => {
    setSelectedMotorId(motor.id);
    setForm({
      motor_development_type: motor.motor_development_type.toString(),
      fine_gross_motor_type: motor.fine_gross_motor_type.toString(),
      development_state: motor.development_state.toString(),
      observation: motor.observation,
      observation_datetime: motor.observation_datetime?.slice(0, 16),
      comment: motor.comment || '',
    });
    try {
      const res = await getFineGrossMotorTypeByMotor(motor.motor_development_type);
      setFilteredFineGrossMotorTypes(res.data);
    } catch (error) {
      console.error("Alt türler alınamadı:", error);
      setFilteredFineGrossMotorTypes([]);
    }
  };

  const handleAddOrUpdate = async () => {
    const token = localStorage.getItem("token");
    const payload = {
      motor_development_type: parseInt(form.motor_development_type),
      fine_gross_motor_type: parseInt(form.fine_gross_motor_type),
      development_state: parseInt(form.development_state),
      observation: form.observation,
      observation_datetime: form.observation_datetime,
      comment: form.comment,
      child: selectedChild.id,
    };
    if (selectedMotorId) {
      payload.updateddate = new Date().toISOString();
    }
    try {
      if (selectedMotorId) {
        await updateMotor(selectedMotorId, payload, token);
        console.log("Motor Gelişim güncellendi");
      } else {
        await addMotor(payload, token);
        console.log("Motor Gelişim eklendi");
      }

      resetForm();
      fetchMotor();
    } catch (error) {
      console.error("İşlem hatası:", error);
    }
  };

  const resetForm = () => {
    setSelectedMotorId(null);
    setForm({
      motor_development_type: '',
      fine_gross_motor_type: '',
      development_state: '',
      observation: '',
      observation_datetime: '',
      comment: '',
    });
  };

  return (
    <div className="p-6 bg-white min-h-screen">
      <Toaster />
      <h1 className="text-2xl font-semibold text-[#444444] mb-6 leading-snug tracking-wide">
        Motor Gelişim Bilgileri
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
          name="motor_development_type"
          value={form.motor_development_type}
          onChange={handleChange}
          className="border px-3 py-2 rounded-lg"
        >
          <option value="">Motor Gelişim Türü</option>
          {motor_development_type.map((item) => (
            <option key={item.id} value={item.id}>
              {item.name}
            </option>
          ))}
        </select>
        <select
          name="fine_gross_motor_type"
          value={form.fine_gross_motor_type}
          onChange={handleChange}
          className="border px-3 py-2 rounded-lg"
        >
          <option value="">Motor Gelişim Alt Türü</option>
          {filteredFineGrossMotorTypes.map((item) => (
            <option key={item.id} value={item.id}>
              {item.name}
            </option>
          ))}
        </select>
        <select
          name="development_state"
          value={form.development_state}
          onChange={handleChange}
          className="border px-3 py-2 rounded-lg"
        >
          <option value="">Gelişim Durumu</option>
          {development_state.map((item) => (
            <option key={item.id} value={item.id}>
              {item.name}
            </option>
          ))}
        </select>
        <input
          type="datetime-local"
          name="observation_datetime"
          value={form.observation_datetime}
          max={today}
          onChange={(e) => {
              const value = e.target.value;
              if (value > today) {
                toast.error("Motor gelişim gözlem tarih ve saati ileri tarih olamaz.");
                console.log(value);
              } else {
                setForm({ ...form, observation_datetime: value });
              }
            }}
          className="border px-3 py-2 rounded-lg"
        />
        <input
          type="text"
          name="observation"         
          placeholder="Gözlem"
          value={form.observation}
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
        {selectedMotorId && (
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
          {selectedMotorId ? "Güncelle" : "Kaydet"}
        </button>
      </div>

      {/* Yemek Listesi Tablosu */}
      <div className="mb-6">
        <h2 className="text-lg font-semibold mb-2">Motor Gelişim Listesi</h2>
        {motor.length === 0 ? (
          <p className="text-sm text-gray-500">Kayıtlı Motor Gelişim bulunamadı.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full border border-gray-300 text-sm">
              <thead className="bg-gray-100">
                <tr>
                  <th className="border px-4 py-2 text-center">Gözlem Tarihi</th>
                  <th className="border px-4 py-2 text-center">Motor Gelişim Türü</th>
                  <th className="border px-4 py-2 text-center">Motor Gelişim Alt Türü</th>
                  <th className="border px-4 py-2 text-center">Gelişim Durumu</th>
                  <th className="border px-4 py-2 text-center">Gözlem</th>
                  <th className="border px-4 py-2 text-center">Seç</th>
                </tr>
              </thead>
              <tbody>
                {motor.map((motor) => (
                  <tr key={motor.id} className="hover:bg-gray-50">
                    <td className="border px-4 py-2 text-center">
                      {motor.observation_datetime?.replace("T", " ").slice(0, 16)}
                    </td>                    
                    <td className="border px-4 py-2 text-center">
                      {
                        motor_development_type.find((type) => type.id === motor.motor_development_type)?.name || "-"
                      }
                    </td>
                    <td className="border px-4 py-2 text-center">
                      {
                        fine_gross_motor_type.find((type) => type.id === motor.fine_gross_motor_type)?.name || "-"
                      }
                    </td>
                    <td className="border px-4 py-2 text-center">
                      {
                        development_state.find((type) => type.id === motor.development_state)?.name || "-"
                      }
                    </td>
                    <td className="border px-4 py-2 text-center">{motor.observation}</td>              
                    <td className="border px-4 py-2 text-center">
                      <button
                        onClick={() => handleMotorSelect(motor)}
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

export default MotorPage;
