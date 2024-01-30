import React from "react";
import { StyleSheet, View, Pressable } from "react-native";
import { NavigationProp, ParamListBase } from "@react-navigation/native";
import HomeIcon from "../assets/home.svg";
import HomeActiveIcon from "../assets/home-active.svg";
import RedeemIcon from "../assets/redeem.svg";
import RedeemActiveIcon from "../assets/redeem-active.svg";
import AccountIcon from "../assets/account.svg";
import AccountActiveIcon from "../assets/account-active.svg";
import { Colors } from "../globalstyles";

type BottomNavigationBarProps = {
  navigation: NavigationProp<ParamListBase>;
  activeScreen: "Home" | "Redeem" | "Account";
};

const BottomNavigationBar = ({
  navigation,
  activeScreen,
}: BottomNavigationBarProps) => {
  const navigateTo = (screenName: string) => {
    navigation.navigate(screenName);
  };

  console.log(activeScreen);

  return (
    <View style={styles.bottomBar}>
      <Pressable onPress={() => navigateTo("Home")}>
        {activeScreen === "Home" ? (
          <HomeActiveIcon width={55} height={55} />
        ) : (
          <HomeIcon width={55} height={55} />
        )}
      </Pressable>
      <Pressable onPress={() => navigateTo("Redeem")}>
        {activeScreen === "Redeem" ? (
          <RedeemActiveIcon width={65} height={65} />
        ) : (
          <RedeemIcon width={75} height={75} />
        )}
      </Pressable>
      <Pressable onPress={() => navigateTo("Account")}>
        {activeScreen === "Account" ? (
          <AccountActiveIcon width={55} height={55} />
        ) : (
          <AccountIcon width={55} height={55} />
        )}
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  bottomBar: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 5,
    marginBottom: 10,
    paddingHorizontal: 40,
    backgroundColor: Colors.charcoal,
    width: "100%",
  },
});

export default BottomNavigationBar;
