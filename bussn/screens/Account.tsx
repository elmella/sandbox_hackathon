import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import BottomNavigationBar from '../components/BottomNavigationBar';
import { RootStackParamList } from "../types";
import { StackNavigationProp } from "@react-navigation/stack";
import { Colors } from "../globalstyles"

type AccountScreenNavigationProp = StackNavigationProp<
    RootStackParamList,
    'Account'
>;

const Account = ({ navigation }: { navigation: AccountScreenNavigationProp }) => {
    return (
        <View style={styles.container}>
            <ScrollView style={styles.scrollView}>
            </ScrollView>
            <BottomNavigationBar navigation={navigation} activeScreen="Account" />
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
      },
});

export default Account;
