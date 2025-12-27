import { PermissionsAndroid, Platform } from "react-native";

export const requestCameraPermission = async (): Promise<boolean> => {
  if (Platform.OS === "android") {
    const granted = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.CAMERA,
      {
        title: "Kamera izni gerekli",
        message: "Fotoğraf çekebilmek için kamera izni gereklidir",
        buttonPositive: "OK",
      }
    );

    return granted === PermissionsAndroid.RESULTS.GRANTED;
  }

  return true; // iOS
};
