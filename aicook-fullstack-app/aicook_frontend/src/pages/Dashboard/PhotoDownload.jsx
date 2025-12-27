import React, { useState, useEffect } from "react";
import { getFridgePhotos } from "../../services/fridge_photos";
import { useNavigate } from "react-router-dom";

const PhotoDownload = () => {
  const [recipes, setRecipes] = useState([]);
  const [openPhotoId, setOpenPhotoId] = useState(null);

  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  const fetchHistories = async () => {
    try {
      const res = await getFridgePhotos(token);
      setRecipes(res.data || []);
    } catch (e) {
      console.error("Fotoğraflar alınamadı", e);
    }
  };

  useEffect(() => {
    fetchHistories();
  }, []);

  const togglePhoto = (id) => {
    setOpenPhotoId((prev) => (prev === id ? null : id));
  };

  const handleAnalyze = (photoId) => {
    navigate(`/fridge-analysis/${photoId}`);
  };

  return (
    <div className="p-4 pb-24">
      <h1 className="text-2xl font-semibold text-[#444444] mb-6">
        Yüklenen Fotoğraf Bilgileri
      </h1>

      <div className="space-y-4">
        {recipes.map((mh) => (
          <div key={mh.id} className="border rounded-lg p-4 shadow-sm">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-[13px] text-gray-500">
                  <span className="font-semibold text-gray-700">
                    Yükleme Tarihi:
                  </span>{" "}
                  {new Date(mh.create_date).toLocaleDateString("tr-TR")}
                </p>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => togglePhoto(mh.id)}
                  className="bg-[#4294ff] text-white px-6 py-2 rounded-lg text-sm hover:bg-[#84cafe]"
                >
                  {openPhotoId === mh.id ? "Kapat" : "Aç"}
                </button>

                {openPhotoId === mh.id && (
                  <button
                    onClick={() => handleAnalyze(mh.id)}
                    className="bg-[#1a3752] text-white px-6 py-2 rounded-lg text-sm hover:bg-[#84cafe]"
                  >
                    Malzeme Tespit Et
                  </button>
                )}
              </div>
            </div>

            {openPhotoId === mh.id && (
              <img
                src={mh.url}
                alt="Fridge"
                className="mt-3 p-2 rounded-xl border object-cover max-h-[300px]"
              />
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default PhotoDownload;
