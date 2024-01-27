import { Camera, CameraType, CameraCapturedPicture, Constants, AutoFocus } from "expo-camera";
import { useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  Button,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { Image } from "react-native";
import { S3 } from "aws-sdk";
import { StackNavigationProp } from "@react-navigation/stack";
import { RootStackParamList } from "../types";
import { useRoute, RouteProp } from "@react-navigation/native";


type VerifyRouteProp = RouteProp<RootStackParamList, 'Verify'>;



type VerifyScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  'Verify'
>;



const s3 = new S3({
  accessKeyId: "AKIATGM7VQYHQV5QRK5L",
  secretAccessKey: "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",
  region: "us-east-2",
});





const Verify = ({ navigation,  }: { navigation: VerifyScreenNavigationProp }) => {
  const route = useRoute<VerifyRouteProp>();
  const bus_id = route.params.bus_id; // Access the bus_id parameter


  const [type, setType] = useState(CameraType.back);
  const [permission, requestPermission] = Camera.useCameraPermissions();
  const [step, setStep] = useState(1); // 1 for bus photo, 2 for selfie
  const [busPhoto, setBusPhoto] = useState<CameraCapturedPicture | null>(null);
  const [selfiePhoto, setSelfiePhoto] = useState<CameraCapturedPicture | null>(null);
  const [busPhotoUrl, setBusPhotoUrl] = useState<string | null>(null);
  const [selfiePhotoUrl, setSelfiePhotoUrl] = useState<string | null>(null);
  // const [isLoading, setIsLoading] = useState(false);

  
  const cameraRef = useRef<Camera>(null);

  const mountedRef = useRef(true);

  useEffect(() => {
    // When the component mounts
    mountedRef.current = true;

    // Cleanup function when the component unmounts
    return () => {
      mountedRef.current = false;
    };
  }, []);

  useEffect(() => {
    if (step === 2 && selfiePhoto) {
      uploadBothPhotos();
    }
  }, [selfiePhoto, step]);


  if (!permission) {
    // Camera permissions are still loading
    return <View />;
  }

  async function takePicture() {
    if (cameraRef.current) {
      const options = { quality: 0.5, base64: true };
      const data = await cameraRef.current.takePictureAsync(options);
  
      if (step === 1) {
        setBusPhoto(data);
        setType(CameraType.front); // Flip camera for selfie
        setStep(2); // Move to next step
      } else if (step === 2) {
        setSelfiePhoto(data); // Just set the selfie photo
        // uploadBothPhotos will be called in useEffect
      }
    }
  }
  
  

  async function uploadBothPhotos() {
    // setIsLoading(true);
  
    try {
      if (busPhoto) {
        console.log("Uploading bus photo");
        const busPhotoUrl = await uploadToS3(busPhoto, generatePhotoId());
        setBusPhotoUrl(busPhotoUrl as string | null);
      }
  
      if (selfiePhoto) {
        console.log("Uploading selfie photo");
        const selfiePhotoUrl = await uploadToS3(selfiePhoto, generatePhotoId());
        setSelfiePhotoUrl(selfiePhotoUrl as string | null);
      }
  
      // Navigate to the LocationScreen if both photos have been successfully uploaded
      if (busPhotoUrl && selfiePhotoUrl) {
        navigation.navigate('LocationScreen', {
          bus_id: bus_id,
          bus_url: busPhotoUrl,
          selfie_url: selfiePhotoUrl
        });
      }
    } catch (error) {
      console.error("Error uploading photos:", error);
    } finally {
      // setIsLoading(false);
    }
  }
  
  
  
  
  function generatePhotoId() {
    return Math.floor(Math.random() * 1000000); // Example ID generation
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
        Bucket: "bussn", // Your bucket name
        Key: `photo_${photo_id}.jpg`, // File name
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
            resolve(data.Location); // URL of the uploaded image
          }
        });
      });
    } else {
      console.error("No photo to upload");
    }
  }

  if (!permission.granted) {
    // Camera permissions are not granted yet
    return (
      <View style={styles.container}>
        <Text style={{ textAlign: 'center' }}>We need your permission to show the camera</Text>
        <Button onPress={requestPermission} title="grant permission" />
      </View>
    );
  }

  function toggleCameraType() {
    setType(current => (current === CameraType.back ? CameraType.front : CameraType.back));
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
        {step === 1 ? "Take a photo of the bus" : "Now take a photo of yourself!"}
      </Text>
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.button} onPress={takePicture}>
          <Text style={styles.text}>Take Photo</Text>
        </TouchableOpacity>
      </View>
    </Camera>
    {/* {isLoading && <ActivityIndicator size="large" />} */}
  </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
  },
  camera: {
    flex: 1,
  },
  buttonContainer: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: 'transparent',
    margin: 64,
  },
  button: {
    flex: 1,
    alignSelf: 'flex-end',
    alignItems: 'center',
  },
  text: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
  },
  instructionText: {
    color: 'white',
    fontSize: 18,
    textAlign: 'center',
    margin: 20,
  },
});

export default Verify;