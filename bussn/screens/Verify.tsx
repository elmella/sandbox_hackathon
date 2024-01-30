import {
  Camera,
  CameraType,
  CameraCapturedPicture,
  AutoFocus,
} from "expo-camera";
import { useEffect, useRef, useState } from "react";
import {
  Button,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { S3 } from "aws-sdk";
import { StackNavigationProp } from "@react-navigation/stack";
import { RootStackParamList } from "../types";
import { useRoute, RouteProp } from "@react-navigation/native";
import awsConfig from "../awsConfig";
import { Colors } from "../globalstyles";

type VerifyRouteProp = RouteProp<RootStackParamList, "Verify">;

type VerifyScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  "Verify"
>;

const s3 = new S3({
  accessKeyId: awsConfig.accessKeyId,
  secretAccessKey: awsConfig.secretAccessKey,
  region: awsConfig.region,
});

const Verify = ({ navigation }: { navigation: VerifyScreenNavigationProp }) => {
  const route = useRoute<VerifyRouteProp>();
  const bus_id = route.params.bus_id;

  const [type, setType] = useState(CameraType.back);
  const [permission, requestPermission] = Camera.useCameraPermissions();
  const [step, setStep] = useState(1);
  const [busPhoto, setBusPhoto] = useState<CameraCapturedPicture | null>(null);
  const [selfiePhoto, setSelfiePhoto] = useState<CameraCapturedPicture | null>(
    null
  );
  const [busPhotoUrl, setBusPhotoUrl] = useState<string | null>(null);
  const [selfiePhotoUrl, setSelfiePhotoUrl] = useState<string | null>(null);

  const cameraRef = useRef<Camera>(null);

  const mountedRef = useRef(true);

  useEffect(() => {
    mountedRef.current = true;

    return () => {
      mountedRef.current = false;
    };
  }, []);

  useEffect(() => {
    if (busPhoto && selfiePhoto) {
      uploadBothPhotos();
    }
  }, [busPhoto, selfiePhoto]);

  useEffect(() => {
    if (busPhotoUrl && selfiePhotoUrl) {
      navigation.navigate("LocationScreen", {
        bus_id: bus_id,
        bus_url: busPhotoUrl,
        selfie_url: selfiePhotoUrl,
      });
    }
  }, [busPhotoUrl, selfiePhotoUrl]);

  if (!permission) {
    return <View />;
  }

  async function takePicture() {
    if (cameraRef.current) {
      const options = { quality: 0.5, base64: true };
      const data = await cameraRef.current.takePictureAsync(options);

      if (step === 1) {
        setBusPhoto(data);
        setType(CameraType.front);
        setStep(2);
      } else if (step === 2) {
        setSelfiePhoto(data);
      }
    }
  }

  async function uploadBothPhotos() {
    if (busPhoto && !busPhotoUrl) {
      console.log("Uploading bus photo");
      const uploadedBusPhotoUrl = await uploadToS3(busPhoto, generatePhotoId());
      setBusPhotoUrl(uploadedBusPhotoUrl as string | null);
    }

    if (selfiePhoto && !selfiePhotoUrl) {
      console.log("Uploading selfie photo");
      const uploadedSelfiePhotoUrl = await uploadToS3(
        selfiePhoto,
        generatePhotoId()
      );
      setSelfiePhotoUrl(uploadedSelfiePhotoUrl as string | null);
    }
  }

  function generatePhotoId() {
    return Math.floor(Math.random() * 1000000);
  }

  async function uploadToS3(
    photoData: CameraCapturedPicture | null,
    photo_id: number
  ) {
    if (photoData) {
      console.log("Uploading photo to S3");
      const response = await fetch(photoData.uri);
      const blob = await response.blob();

      const params = {
        Bucket: "bussn",
        Key: `photo_${photo_id}_${Date.now()}.jpg`,
        Body: blob,
        ContentType: "image/jpeg",
      };

      return new Promise((resolve, reject) => {
        s3.upload(params, (err: Error, data: S3.ManagedUpload.SendData) => {
          if (err) {
            console.error("Error uploading photo:", err);
            reject(err);
          } else {
            console.log("Successfully uploaded photo:", data);
            resolve(data.Location);
          }
        });
      });
    } else {
      console.error("No photo to upload");
    }
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
        type={type}
        ref={cameraRef}
        autoFocus={AutoFocus.on}
      >
        <Text style={styles.instructionText}>
          {step === 1
            ? "Take a photo of the bus"
            : "Now take a photo of yourself!"}
        </Text>
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.button} onPress={takePicture}>
            <Text style={styles.text}>Take Photo</Text>
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
  },
  camera: {
    flex: 1,
  },
  buttonContainer: {
    flex: 1,
    flexDirection: "row",
    backgroundColor: "transparent",
    margin: 64,
  },
  button: {
    flex: 1,
    alignSelf: "flex-end",
    alignItems: "center",
  },
  text: {
    fontSize: 24,
    fontWeight: "bold",
    color: Colors.white,
  },
  instructionText: {
    color: Colors.white,
    fontSize: 18,
    textAlign: "center",
    margin: 20,
  },
});

export default Verify;
