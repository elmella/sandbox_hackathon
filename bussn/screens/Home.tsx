import React from 'react';
import CameraButton from '../assets/camera-button.svg';
// import Splashscreen from '../assets/splashscreen.svg';

import { View, StyleSheet, ScrollView, Pressable, TouchableOpacity } from 'react-native';
import BottomNavigationBar from '../components/BottomNavigationBar';
import { RootStackParamList } from "../types";
import { StackNavigationProp } from "@react-navigation/stack";
import { Colors } from "../globalstyles"
import PostBox from "../components/PostBox";
import data from "../home-sample.json";

type HomeScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  'Home'
>;

// load data from json file


const Home = ({ navigation }: { navigation: HomeScreenNavigationProp }) => {

    const handleCameraPress = () => {
        console.log('Camera Button Pressed');
        navigation.navigate('Qrcode');
    };

    return (
        <View style={styles.container}>
            <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
              {data.map((item, index) => (
                
                <PostBox
                  key={index}
                  name={item.name}
                  dateTime={item.date_time}
                  selfieUrl={item.selfie_url}
                  profileUrl={item.profile_url}
                  caption={item.caption}
                />
                
              )
              )}
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
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: Colors.charcoal,
    },
    scrollView: {
        flex: 1,
        marginTop: 20,
      },
      cameraButton: {
        position: 'absolute',
        right: 25,
        bottom: 80, // Adjust this value based on the height of your BottomNavigationBar
    },
});

export default Home;
