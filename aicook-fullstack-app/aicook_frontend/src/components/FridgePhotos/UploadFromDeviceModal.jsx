import { useState } from "react";
import { uploadFridgePhoto } from "../../services/fridge_photos";
import { useAuth } from "../../context/AuthContext";

export default function UploadFromDeviceModal({ onClose }) {
  const { token } = useAuth();

  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (!selectedFile) return;

    setFile(selectedFile);
    setPreview(URL.createObjectURL(selectedFile));
  };

  const handleUpload = async () => {
    if (!file) return;

    try {
      setLoading(true);
      await uploadFridgePhoto(file, null, token);
      onClose();
    } catch (err) {
      console.error("Fotoğraf yüklenemedi", err);
      alert("Fotoğraf yüklenemedi");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-xl w-96">
        <h3 className="text-2xl font-semibold text-[#444444] mb-6 leading-snug tracking-wide">Fotoğraf Yükle</h3>

        <label className="block border border-dashed border-gray-300 rounded-lg p-4 text-center cursor-pointer hover:bg-gray-50 transition">
          <input
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleFileChange}
          />
          <span className="text-[14px]">
            Fotoğraf Seç
          </span>
        </label>

        {preview && (
          <img
            src={preview}
            alt="preview"
            className="mt-4 rounded-lg max-h-48 mx-auto object-contain"
          />
        )}

        <div className="flex justify-end gap-2 mt-6">
          <button
            onClick={onClose}
            disabled={loading}
            className="flex-1 px-6 py-2 rounded-xl border border-[#DDDDDD] text-[#444444] hover:bg-[#f5f5f5]"
          >
            İptal
          </button>

          <button
            onClick={async () => {
              if (!file) return;

              try {
                setLoading(true);
                const res = await uploadFridgePhoto(file, null, token);

                window.location.href = `/fridge-analysis/${res.data.id}`;
              } catch (err) {
                console.error("Fotoğraf yüklenemedi veya analiz yapılamadı", err);
                alert("Fotoğraf yüklenemedi veya analiz yapılamadı");
              } finally {
                setLoading(false);
              }
            }}
            disabled={!file || loading}
            className="bg-[#4294ff] text-white px-6 py-2 rounded-lg text-sm hover:bg-[#84cafe]"
          >
            {loading ? "Yükleniyor..." : "Yükle ve Malzeme Tespit Et"}
          </button>
        </div>
      </div>
    </div>
  );
}
