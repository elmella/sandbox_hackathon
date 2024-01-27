import React from 'react';
import { View, Text, Image, StyleSheet, Dimensions } from 'react-native';
import { Colors } from '../globalstyles';

const screenWidth = Dimensions.get('window').width;

interface SponsorBoxProps {
  sponsorName: string;
  sponsorLogo: string;
  sponsorUrl: string;
  redeemCost: number;
}

const SponsorBox: React.FC<SponsorBoxProps> = ({ sponsorName, sponsorLogo, sponsorUrl, redeemCost }) => {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Image source={{ uri: sponsorLogo }} style={styles.logo} />
        <Text style={styles.name}>{sponsorName}</Text>
        <Text style={styles.redeemCost}>{`${redeemCost} points`}</Text>
      </View>
      <Image source={{ uri: sponsorUrl }} style={styles.sponsorImage} />
      <View style={styles.divider} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.charcoal,
    borderRadius: 10,
    margin: 10,
    width: screenWidth * 0.9,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 10,
  },
  logo: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 10,
  },
  name: {
    flex: 1,
    fontWeight: 'bold',
    color: Colors.white,
  },
  redeemCost: {
    fontWeight: 'bold',
    color: Colors.white,
  },
  sponsorImage: {
    width: '95%',
    height: 200,
    alignSelf: 'center',
    borderRadius: 10,
  },
  divider: {
    height: 3,
    backgroundColor: Colors.grey,
    width: '100%',
    marginTop: 15,
  },
});

export default SponsorBox;
