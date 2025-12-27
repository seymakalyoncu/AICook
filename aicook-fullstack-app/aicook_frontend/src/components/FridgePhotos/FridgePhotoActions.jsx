import { useRef, useState } from "react";
import CameraConfirmModal from "./CameraConfirmModal";
import UploadFromDeviceModal from "./UploadFromDeviceModal";

export default function FridgePhotoActions() {
  const lensRef = useRef(null);
  const [lensOpen, setLensOpen] = useState(false);

  const [showUploadModal, setShowUploadModal] = useState(false);
  const [showCameraConfirm, setShowCameraConfirm] = useState(false);

  return (
    <>
      <div className="relative flex flex-col items-center" ref={lensRef}>
        {lensOpen && (
          <div className="flex items-center justify-between w-40 absolute -top-20 animate-fadeIn">
            
            <img
              src="/camera.png"
              alt="camera"
              className="w-15 h-15 cursor-pointer hover:scale-110 transition"
              onClick={() => {
                setLensOpen(false);
                setShowCameraConfirm(true);
              }}
            />

            <img
              src="/folder.png"
              alt="folder"
              className="w-15 h-15 cursor-pointer hover:scale-110 transition"
              onClick={() => {
                setLensOpen(false);
                setShowUploadModal(true);
              }}
            />
          </div>
        )}

        <img
          src="/lens.png"
          alt="lens"
          onClick={() => setLensOpen(!lensOpen)}
          className="w-20 h-20 cursor-pointer hover:scale-110 transition active:scale-95 drop-shadow-xl"
        />
      </div>

      {showUploadModal && (
        <UploadFromDeviceModal
          onClose={() => setShowUploadModal(false)}
        />
      )}

      {showCameraConfirm && (
        <CameraConfirmModal
          onClose={() => setShowCameraConfirm(false)}
        />
      )}
    </>
  );
}
