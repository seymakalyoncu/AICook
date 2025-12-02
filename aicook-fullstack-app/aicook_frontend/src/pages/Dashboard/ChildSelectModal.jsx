import React, { useEffect, useState } from "react";
import { userInfo } from "../../services/accounts";
import { getChildrenByParent } from "../../services/children";
import { getParentById } from "../../services/parents";
import { getBabySitterById } from "../../services/babysitters";

const ChildSelectModal = ({ open, onClose, onSelect }) => {
  const [parentData, setParentData] = useState(null);
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  
 
useEffect(() => {
  const fetchParentData = async () => {
    const token = localStorage.getItem("token");
    const response = await userInfo(token);

    if (response.data.parent_id !== undefined) {
      localStorage.setItem("userType", "SuperUser");
    }

    if (response.data.babysitter_id !== undefined) {
      localStorage.setItem("userType", "Staff");
    }

    const userType = localStorage.getItem("userType");

    if (userType === "SuperUser") {
      const parentId = localStorage.getItem("parent_id");
      const res = await getParentById(parentId, token);
      setParentData(res.data);
    } else if (userType === "Staff") {
      const babysitterId = localStorage.getItem("babysitter_id");
      const bsRes = await getBabySitterById(babysitterId, token);
      const parentId = bsRes.data.parent;
      const parentRes = await getParentById(parentId, token);
      setParentData(parentRes.data);
    }
  };

  if (open) {
    fetchParentData();
  }
}, [open]);

useEffect(() => {
  const fetchChildren = async () => {
    if (!open || !parentData) return;
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const res = await getChildrenByParent(parentData.id, token);
      setResults(res.data || []);
    } catch (err) {
      console.error("Çocukları alırken hata:", err);
    } finally {
      setLoading(false);
    }
  };

  fetchChildren();
}, [open, parentData]);

  if (!open) return null;

  const handleSelect = (child) => {
    onSelect(child);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-40 flex items-center justify-center">
      <div className="bg-white p-6 rounded-2xl w-full max-w-3xl shadow-2xl">
        {/* Başlık ve Kapat */}
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-[#444444]">Çocuk Seçimi</h2>
          <button
            onClick={onClose}
            className="text-sm text-[#999999] hover:text-[#FF6600]"
          >
            Kapat
          </button>
        </div>

        {/* İçerik */}
        {loading ? (
          <p className="text-center text-sm text-[#999999]">Yükleniyor...</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm border border-gray-300"> 
              <thead className="bg-gray-100">
                <tr>
                  <th className="border px-4 py-2 text-center">Adı</th>
                  <th className="border px-4 py-2 text-center">Soyadı</th>
                  <th className="border px-4 py-2 text-center">Doğum Tarihi</th>
                  <th className="border px-4 py-2 text-center">Cinsiyet</th>
                  <th className="border px-4 py-2 text-center">İşlem</th>
                </tr>
              </thead>
              <tbody>
                {results.length > 0 ? (
                  results.map((child) => (
                    <tr key={child.id} className="hover:bg-gray-50">
                      <td className="border px-4 py-2 text-center">
                        {child.name}
                      </td>
                      <td className="border px-4 py-2 text-center">
                        {child.surname}
                      </td>
                      <td className="border px-4 py-2 text-center">
                        {child.birth_day}/{child.birth_month}/{child.birth_year}
                      </td>
                      <td className="border px-4 py-2 text-center">
                        {child.gender_name}
                      </td>
                      <td className="border px-4 py-2 text-center">
                        <button
                          onClick={() => handleSelect(child)}
                          className="bg-[#FF6600] text-white px-4 py-1 rounded-lg text-sm hover:bg-[#e65500]"
                        >
                          Seç
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan="5"
                      className="text-center text-[#999999] italic py-4"
                    >
                      Kayıtlı çocuk bulunamadı.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default ChildSelectModal;
