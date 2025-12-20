import { useEffect, useRef, useState } from "react";
import { uploadFridgePhoto } from "../../services/fridge_photos";
import { useAuth } from "../../context/AuthContext";

export default function CameraConfirmModal({ onClose }) {
  const { token } = useAuth();

  const videoRef = useRef(null);
  const canvasRef = useRef(null);

  const [step, setStep] = useState("confirm"); // confirm | camera | preview
  const [stream, setStream] = useState(null);
  const [imageBlob, setImageBlob] = useState(null);
  const [loading, setLoading] = useState(false);

  // 📸 Kamera aç
  const openCamera = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: true,
      });
      setStream(mediaStream);
      setStep("camera");
    } catch (err) {
      alert("Kameraya erişilemedi");
      onClose();
    }
  };

  // 🎥 Stream → Video bağla (ÇOK KRİTİK)
  useEffect(() => {
    if (step === "camera" && videoRef.current && stream) {
      videoRef.current.srcObject = stream;
    }
  }, [step, stream]);

  // 📷 Fotoğraf çek
  const capturePhoto = () => {
    const video = videoRef.current;
    const canvas = canvasRef.current;

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    const ctx = canvas.getContext("2d");
    ctx.drawImage(video, 0, 0);

    canvas.toBlob((blob) => {
      setImageBlob(blob);
      stopCamera();
      setStep("preview");
    }, "image/jpeg");
  };

  // 🛑 Kamera kapat
  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
    }
  };

  // ⬆️ Upload
  const handleUpload = async () => {
    if (!imageBlob) return;

    const file = new File([imageBlob], "camera-photo.jpg", {
      type: "image/jpeg",
    });

    try {
      setLoading(true);
      await uploadFridgePhoto(file, null, token);
      onClose();
    } catch (err) {
      alert("Fotoğraf yüklenemedi");
    } finally {
      setLoading(false);
    }
  };

  // Modal kapanınca kamera kapansın
  useEffect(() => {
    return () => stopCamera();
  }, []);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-xl w-96 text-center">
        <canvas ref={canvasRef} className="hidden" />
        {/* STEP 1 – CONFIRM */}
        {step === "confirm" && (
          <>
            <p className="text-[16px] text-[#444444] mb-8 mt-2">
              Kamerayı açmak istiyor musunuz?
            </p>

            <div className="flex gap-4">
              <button
                onClick={onClose}
                className="flex-1 py-2 rounded-xl border border-[#DDDDDD] text-[#444444] hover:bg-[#f5f5f5]"
              >
                Hayır
              </button>

              <button
                onClick={openCamera}
                className="flex-1 py-2 rounded-xl bg-[#4294ff] text-white hover:bg-[#84cafe]"
              >
                Evet
              </button>
            </div>
          </>
        )}

        {/* STEP 2 – CAMERA */}
        {step === "camera" && (
          <>
            <video
              ref={videoRef}
              autoPlay
              muted
              playsInline
              className="rounded-xl w-full mb-6"
            />

            <div className="flex gap-4">
              <button
                onClick={() => {
                  stopCamera();
                  onClose();
                }}
                className="flex-1 py-2 rounded-xl border border-[#DDDDDD] text-[#444444] hover:bg-[#f5f5f5]"
              >
                İptal
              </button>

              <button
                onClick={capturePhoto}
                className="flex-1 py-2 rounded-xl bg-[#4294ff] text-white hover:bg-[#84cafe]"
              >
                Fotoğraf Çek
              </button>
            </div>
          </>
        )}

        {/* STEP 3 – PREVIEW */}
        {step === "preview" && (
          <>
            <canvas ref={canvasRef} className="hidden" />

            <img
              src={URL.createObjectURL(imageBlob)}
              alt="preview"
              className="rounded-lg mb-4 max-h-60 mx-auto"
            />

            <div className="flex gap-4">
              <button
                onClick={onClose}
                className="flex-1 py-2 rounded-xl border border-[#DDDDDD] text-[#444444] hover:bg-[#f5f5f5]"
              >
                İptal
              </button>

              <button
                onClick={handleUpload}
                disabled={loading}
                className="flex-1 py-2 rounded-xl bg-[#4294ff] text-white hover:bg-[#84cafe]"
              >
                {loading ? "Yükleniyor..." : "Yükle"}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
