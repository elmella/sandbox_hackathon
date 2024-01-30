import React, { useEffect, useState } from "react";
import CameraButton from "../assets/camera-button.svg";

import {
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Text,
} from "react-native";

import BottomNavigationBar from "../components/BottomNavigationBar";
import { RootStackParamList } from "../types";
import { StackNavigationProp } from "@react-navigation/stack";
import { Colors } from "../globalstyles";
import PostBox from "../components/PostBox";

type HomeScreenNavigationProp = StackNavigationProp<RootStackParamList, "Home">;

interface PostData {
  name: string;
  date_time: string;
  selfie_url: string;
  profile_url: string;
  caption: string;
}

const Home = ({ navigation }: { navigation: HomeScreenNavigationProp }) => {
  const [postData, setPostData] = useState<PostData[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          "http://35.168.193.178/commuter/home/example"
        );
        const data = await response.json();
        setPostData(data);
      } catch (error) {
        console.error("Error fetching post data:", error);
      }
    };

    fetchData();
  }, []);

  const handleCameraPress = () => {
    console.log("Camera Button Pressed");
    navigation.navigate("Qrcode");
  };

  if (!postData) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>Loading...</Text>
      </View>
    );
  }

  const profile_url = "https://bussn.s3.us-east-2.amazonaws.com/IMG_7932.JPG";

  return (
    <View style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
      >
        {postData.map((item, index) => (
          <PostBox
            key={index}
            name={item.name}
            dateTime={item.date_time}
            selfieUrl={item.selfie_url}
            profileUrl={profile_url}
            caption={item.caption}
          />
        ))}
      </ScrollView>
      <TouchableOpacity style={styles.cameraButton} onPress={handleCameraPress}>
        <CameraButton width={55} height={55} />
      </TouchableOpacity>
      <BottomNavigationBar navigation={navigation} activeScreen="Home" />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: Colors.charcoal,
  },
  scrollView: {
    flex: 1,
    marginTop: 20,
  },
  cameraButton: {
    position: "absolute",
    right: 25,
    bottom: 100, // Adjust this value based on the height of your BottomNavigationBar
  },
  loadingText: {
    color: Colors.white,
    fontSize: 24,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: Colors.charcoal,
  },
});

export default Home;
