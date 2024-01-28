import React from 'react';
import { View, StyleSheet } from 'react-native';
import Successscreen from '../assets/success.svg';

const SuccessScreen = () => {
  return (
    <View style={styles.container}>
        <Successscreen />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff', // or any color that suits your splash screen
  },
});

export default SuccessScreen;
