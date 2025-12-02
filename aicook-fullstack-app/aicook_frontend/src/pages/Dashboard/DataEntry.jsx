import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import ChildSelectModal from "./ChildSelectModal"; // yeni component import

const dataEntries = [
  { label: "Yemek Bilgileri", src: "/yemek.png", path: "/meals" },
  { label: "Uyku Bilgileri", src: "/uyku.png", path: "/sleep" },
  { label: "Fiziksel Gelişim Bilgileri", src: "/fiziksel_gelisim.png", path: "/physical" },
  { label: "Bilişsel Gelişim Bilgileri", src: "/bilissel_gelisim.png", path: "/cognitive" },
  { label: "Duygusal Gelişim Bilgileri", src: "/duygusal_gelisim.png", path: "/emotional" },
  { label: "Motor Gelişim Bilgileri", src: "/motor_gelisim.png", path: "/motor" },
  { label: "Hastalık Bilgileri", src: "/hastalik.png", path: "/illness" },
  { label: "Aşı Takvimi Bilgileri", src: "/asi.png", path: "/vaccine" },
  { label: "Günlük Olay Bilgileri", src: "/olay.png", path: "/daily-event" },
];

const DataEntryModal = ({ open, onClose }) => {
  const navigate = useNavigate();
  const [childModalOpen, setChildModalOpen] = useState(false);
  const [selectedEntry, setSelectedEntry] = useState(null);
  const [selectedChildName, setSelectedChildName] = useState("");

  const handleClose = () => {
    setSelectedChildName(""); // modal kapanınca sıfırla
    onClose();
  };

  const handleDataEntryClick = (entry) => {
    setSelectedEntry(entry);
    setChildModalOpen(true);
  };

  const handleChildSelect = (child) => {
    setChildModalOpen(false);
    handleClose();
    navigate(selectedEntry.path, { state: { selectedChild: child } });
  };

  if (!open) return null;

  return (
    <>
      <div className="fixed inset-0 z-40 bg-black bg-opacity-50 flex items-center justify-center">
        <div className="bg-white p-8 rounded-lg w-full max-w-4xl">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold">Veri Girişi</h2>
            <button onClick={handleClose} className="text-sm text-[#999999] px-3 py-2">Kapat</button>
          </div>

          <input type="hidden" value={selectedChildName} />

          <div className="grid grid-cols-3 gap-6">
            {dataEntries.map((entry) => (
              <div
                key={entry.label}
                onClick={() => handleDataEntryClick(entry)}
                className="flex flex-col items-center justify-center cursor-pointer hover:text-[#FF6600] transition"
              >
                <img src={entry.src} alt={entry.label} className="w-16 h-16 mb-2" />
                <span className="text-sm text-center">{entry.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <ChildSelectModal
        open={childModalOpen}
        onClose={() => setChildModalOpen(false)}
        onSelect={handleChildSelect}
      />
    </>
  );
};

export default DataEntryModal;
