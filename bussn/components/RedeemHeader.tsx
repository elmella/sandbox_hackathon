import React from "react";
import { View, ScrollView, TouchableOpacity, Text, StyleSheet } from "react-native";
import { Colors } from "../globalstyles";

interface RedeemHeaderProps {
  names: string[];
}

const RedeemHeader: React.FC<RedeemHeaderProps> = ({ names }) => {
  const [selected, setSelected] = React.useState(0);

  return (
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
            <Text style={index === selected ? styles.selectedButtonText : styles.buttonText}>
              {name}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    marginLeft: 20,
    marginTop: 10,
    marginBottom: 10,
    justifyContent: "flex-start",
    flexDirection: "row",
  },
  scrollViewContent: {
    alignItems: "center",
    // padding: 20,
  },
  button: {
    // marginRight: 10,
    padding: 10,
    backgroundColor: Colors.charcoal,
    borderRadius: 5,
  },
  buttonText: {
    color: "white",
    fontSize: 20,
    fontWeight: 'bold', // Optional: add bold for selected item
  },
  selectedButtonText: {
    color: Colors.gold,
    fontSize: 20,
    fontWeight: 'bold', // Optional: add bold for selected item
  },
});

export default RedeemHeader;
