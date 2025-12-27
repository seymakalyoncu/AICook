import { useState } from "react";
import { View, TouchableOpacity, Image, StyleSheet,} from "react-native";

import CameraConfirmModal from "./CameraConfirmModal";
import UploadFromDeviceModal from "./UploadFromDeviceModal";

export default function FridgePhotoActions() {
  const [lensOpen, setLensOpen] = useState(false);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [showCameraConfirm, setShowCameraConfirm] = useState(false);

  return (
    <>
      <View style={styles.container}>
        {/* Açılan ikonlar */}
        {lensOpen && (
          <View style={styles.actionsRow}>
            {/* Kamera */}
            <TouchableOpacity
              onPress={() => {
                setLensOpen(false);
                setShowCameraConfirm(true);
              }}
              activeOpacity={0.8}
            >
              <Image
                source={require("../assets/images/camera.png")}
                style={styles.actionIcon}
              />
            </TouchableOpacity>

            {/* Galeri */}
            <TouchableOpacity
              onPress={() => {
                setLensOpen(false);
                setShowUploadModal(true);
              }}
              activeOpacity={0.8}
            >
              <Image
                source={require("../assets/images/folder.png")}
                style={styles.actionIcon}
              />
            </TouchableOpacity>
          </View>
        )}

        {/* Lens */}
        <TouchableOpacity
          onPress={() => setLensOpen(!lensOpen)}
          activeOpacity={0.8}
        >
          <Image
            source={require("../assets/images/lens.png")}
            style={styles.lensIcon}
          />
        </TouchableOpacity>
      </View>

      {/* Upload Modal */}
      <UploadFromDeviceModal
        visible={showUploadModal}
        onClose={() => setShowUploadModal(false)}
      />

      {/* Camera Confirm Modal */}
      <CameraConfirmModal
        visible={showCameraConfirm}
        onClose={() => setShowCameraConfirm(false)}
      />
    </>
  );
}
const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "center",
  },

  actionsRow: {
    position: "absolute",
    bottom: 90,          // lens üstünde dursun
    flexDirection: "row",
    gap: 24,
  },

  actionIcon: {
    width: 56,
    height: 56,
  },

  lensIcon: {
    width: 72,
    height: 72,
  },
});
