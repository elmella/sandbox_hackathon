import React, { useState } from "react";
import {
  View,
  ScrollView,
  TouchableOpacity,
  Text,
  StyleSheet,
} from "react-native";
import { Colors } from "../globalstyles";

interface RedeemHeaderProps {
  names: string[];
}

const RedeemHeader: React.FC<RedeemHeaderProps> = ({ names }) => {
  const [selected, setSelected] = useState(0);
  const [selectedTab, setSelectedTab] = useState("Coupons"); // State to track the selected tab

  return (
    <View>
      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={styles.tabButton}
          onPress={() => setSelectedTab("Coupons")}
        >
          <Text
            style={
              selectedTab === "Coupons"
                ? styles.selectedTabText
                : styles.tabText
            }
          >
            Coupons
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.tabButton}
          onPress={() => setSelectedTab("Marketplace")}
        >
          <Text
            style={
              selectedTab === "Marketplace"
                ? styles.selectedTabText
                : styles.tabText
            }
          >
            Marketplace
          </Text>
        </TouchableOpacity>
      </View>
      <View style={styles.header}>
        <ScrollView
          horizontal={true}
          contentContainerStyle={styles.scrollViewContent}
          showsHorizontalScrollIndicator={false}
        >
          {names.map((name, index) => (
            <TouchableOpacity
              key={index}
              style={styles.button}
              onPress={() => setSelected(index)}
            >
              <Text
                style={
                  index === selected
                    ? styles.selectedButtonText
                    : styles.buttonText
                }
              >
                {name}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  tabContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginTop: 10,
  },
  tabButton: {
    padding: 10,
  },
  tabText: {
    color: "white",
    fontSize: 16,
  },
  selectedTabText: {
    color: Colors.gold,
    fontSize: 16,
  },
  header: {
    marginLeft: 20,
    marginTop: 10,
    marginBottom: 10,
    justifyContent: "flex-start",
    flexDirection: "row",
  },
  scrollViewContent: {
    alignItems: "center",
  },
  button: {
    padding: 10,
    backgroundColor: Colors.charcoal,
    borderRadius: 5,
  },
  buttonText: {
    color: "white",
    fontSize: 20,
    fontWeight: "bold",
  },
  selectedButtonText: {
    color: Colors.gold,
    fontSize: 20,
    fontWeight: "bold",
  },
});

export default RedeemHeader;
