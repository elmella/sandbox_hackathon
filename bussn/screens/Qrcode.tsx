import { Camera } from "expo-camera";
import { BarCodeScanner } from "expo-barcode-scanner";
import { useState, useEffect } from "react";
import { Button, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { RootStackParamList } from "../types";
import { StackNavigationProp } from "@react-navigation/stack";

type QrcodeScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  "Qrcode"
>;

const Qrcode = ({ navigation }: { navigation: QrcodeScreenNavigationProp }) => {
  const [permission, requestPermission] = Camera.useCameraPermissions();
  const [scanned, setScanned] = useState(false);
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);

  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === "granted");
    })();
  }, []);

  const handleBarCodeScanned = ({ data }: { type: string; data: string }) => {
    setScanned(true);

    navigation.navigate("Verify", { bus_id: data });
  };

  const handleTakeAnotherPicture = () => {
    setScanned(false);
  };
  if (!permission) {
    return <View />;
  }

  if (!permission.granted) {
    return (
      <View style={styles.container}>
        <Text style={{ textAlign: "center" }}>
          We need your permission to show the camera
        </Text>
        <Button onPress={requestPermission} title="grant permission" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Camera
        style={styles.camera}
        autoFocus={Camera.Constants.AutoFocus}
        focusDepth={0}
        barCodeScannerSettings={{
          barCodeTypes: [BarCodeScanner.Constants.BarCodeType.qr],
        }}
        onBarCodeScanned={scanned ? undefined : handleBarCodeScanned}
      >
        <View style={styles.overlay}>
          <View style={styles.qrCodeBox} />
        </View>
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={styles.button}
            onPress={handleTakeAnotherPicture}
          >
            <Text style={styles.text}>scan again</Text>
          </TouchableOpacity>
        </View>
      </Camera>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  camera: {
    flex: 1,
    width: "100%",
  },
  overlay: {
    position: "absolute",
    flex: 1,
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    alignItems: "center",
    justifyContent: "center",
    // backgroundColor: 'rgba(0, 0, 0, 0.7)',
  },
  qrCodeBox: {
    width: 300,
    height: 300,
    borderWidth: 2,
    borderColor: "white",
    backgroundColor: "transparent",
  },
  buttonContainer: {
    position: "absolute",
    bottom: 20, // Adjust as needed
    left: 0,
    right: 0,
    flexDirection: "row",
    justifyContent: "center",
  },
  button: {
    padding: 10,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    marginHorizontal: 10,
  },
  text: {
    fontSize: 18,
    color: "white",
  },
});

export default Qrcode;
