import React from "react";
import { View, StyleSheet } from "react-native";
import Splashscreen from "../assets/splashscreen.svg";

const SplashScreen = () => {
  return (
    <View style={styles.container}>
      <Splashscreen />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default SplashScreen;
