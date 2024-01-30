import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  ScrollView,
} from "react-native";
import BottomNavigationBar from "../components/BottomNavigationBar";
import { RootStackParamList } from "../types";
import { StackNavigationProp } from "@react-navigation/stack";
import { Colors } from "../globalstyles";
import SettingsSvg from "../assets/settings.svg";
import Calendar from "../components/Calendar";

type AccountScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  "Account"
>;
interface ProfileData {
  profile_url: string;
  points: number;
  ride_dates: string[];
}

const Account = ({
  navigation,
}: {
  navigation: AccountScreenNavigationProp;
}) => {
  const [profileData, setProfileData] = useState<ProfileData | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          "http://35.168.193.178/commuter/account/example"
        );
        const data = await response.json();
        setProfileData(data);
      } catch (error) {
        console.error("Error fetching profile data:", error);
      }
    };

    fetchData();
  }, []);

  if (!profileData) {
    return (
        <View style={styles.loadingContainer}>
            <Text style={styles.loadingText}>Loading...</Text>
        </View>
        );
  }

  const profile_url = "https://bussn.s3.us-east-2.amazonaws.com/IMG_7932.JPG";
  return (
    <View style={styles.container}>
      <View style={styles.profileHeader}>
        {profileData && (
          <Image source={{ uri: profile_url }} style={styles.profilePic} />
        )}
        <SettingsSvg width={45} height={45} style={{ margin: 20 }} />
      </View>
      <Text style={styles.pointsText}>My Points: {profileData.points}</Text>
      <Text style={styles.pointsText}>Sponsor Account: $35</Text>

      <Text style={styles.calendarText}>Travel days</Text>
      <ScrollView style={styles.scrollView}>
        <Calendar rideDates={profileData.ride_dates} />
      </ScrollView>
      <BottomNavigationBar navigation={navigation} activeScreen="Account" />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "flex-start",
    alignItems: "center",
    backgroundColor: Colors.charcoal,
  },
  profileHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
    // padding: 10,
  },
  profilePic: {
    width: 70,
    height: 70,
    borderRadius: 100,
    margin: 20,
    borderColor: "white",
    borderWidth: 1,
  },
  pointsText: {
    fontSize: 28,
    color: "white",
    margin: 10,
    alignSelf: "flex-start",
  },
  calendarText: {
    fontSize: 24,
    color: "white",
    margin: 10,
    alignSelf: "center",
  },
  scrollView: {
    flex: 1,
    width: "100%",
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

export default Account;
