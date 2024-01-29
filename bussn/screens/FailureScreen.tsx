import React from 'react';
import { View, StyleSheet } from 'react-native';
import Failurescreen from '../assets/failure.svg';

const FailureScreen = () => {
  return (
    <View style={styles.container}>
        <Failurescreen />
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

export default FailureScreen;
