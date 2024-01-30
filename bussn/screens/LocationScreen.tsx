import React, { useState, useEffect } from "react";
import {
  Text,
  View,
  StyleSheet,
  TextInput,
  Pressable,
} from "react-native";
import * as Location from "expo-location";
import { RootStackParamList } from "../types";
import { useRoute, RouteProp } from "@react-navigation/native";
import { Colors } from "../globalstyles";

type LocationRouteProp = RouteProp<RootStackParamList, "LocationScreen">;

const LocationScreen = ({ navigation }: { navigation: any }) => {
  const route = useRoute<LocationRouteProp>();
  const bus_id = route.params.bus_id;
  const bus_url = route.params.bus_url;
  const selfie_url = route.params.selfie_url;

  const [location, setLocation] = useState<Location.LocationObject | null>(
    null
  );
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [caption, setCaption] = useState("");

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        setErrorMsg("Permission to access location was denied");
        return;
      }

      let location = await Location.getCurrentPositionAsync({});
      setLocation(location);
    })();
  }, []);

  const sendRequest = async () => {
    if (!location) {
      console.error("Location is not available");
      return;
    }

    const requestBody = {
      date_time: new Date().toISOString(),
      bus_id: bus_id,
      user_id: "example", // Replace with actual user ID
      bus_url: bus_url,
      selfie_url: selfie_url,
      caption: caption,
      location:
        "(" + location.coords.latitude + ", " + location.coords.longitude + ")",
    };

    console.log(JSON.stringify(requestBody));

    try {
      const response = await fetch("http://35.168.193.178/commuter/rides/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      if (data.status === "Location verification failed") {
        console.log("Location verification failed");
        navigation.navigate("FailureScreen");
        setTimeout(() => {
          navigation.navigate("Home");
        }, 3000);
      } else {
        console.log("Success:", data);

        navigation.navigate("SuccessScreen");

        setTimeout(() => {
          navigation.navigate("Home");
        }, 3000);
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const handlePress = () => {
    if (location) {
      sendRequest();
    }
  };

  const isButtonDisabled = !location;

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.textInput}
        onChangeText={setCaption}
        value={caption}
        placeholder="Enter caption for the photo"
      />
      <Pressable
        style={[styles.button, isButtonDisabled && styles.buttonDisabled]}
        onPress={handlePress}
        disabled={isButtonDisabled}
      >
        <Text style={styles.text}>Submit</Text>
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "flex-start",
    paddingTop: 50, 
    paddingHorizontal: 20,
    backgroundColor: Colors.charcoal,
  },
  textInput: {
    height: 40,
    borderColor: Colors.gold,
    borderWidth: 1,
    width: "100%",
    marginTop: 20,
    padding: 10,
    color: Colors.white,
  },
  button: {
    alignItems: "center",
    padding: 10,
    width: "100%",
    marginTop: 20,
  },
  text: {
    color: "white",
    fontSize: 20,
  },
  buttonDisabled: {
    backgroundColor: Colors.grey,
  },
});

export default LocationScreen;
