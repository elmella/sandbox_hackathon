import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import BottomNavigationBar from '../components/BottomNavigationBar';
import RedeemHeader from '../components/RedeemHeader';
import { RootStackParamList } from "../types";
import { StackNavigationProp } from "@react-navigation/stack";
import { Colors } from "../globalstyles"
import SponsorBox from '../components/SponsorBox';
import sponsorData from '../redeem-sample.json';

type RedeemScreenNavigationProp = StackNavigationProp<
    RootStackParamList,
    'Redeem'
>;


const Redeem = ({ navigation }: { navigation: RedeemScreenNavigationProp }) => {
    return (
        <View style={styles.container}>
            <RedeemHeader names={["All", "Restaurants", "Wellness", "Home", "Apparel", "Entertainment", "Travel", "Other"]} />
            <ScrollView style={styles.scrollView}>
              {sponsorData.map((item, index) => (
                <SponsorBox
                  key={index}
                  sponsorName={item.sponsor_name}
                  sponsorLogo={item.sponsor_logo}
                  sponsorUrl={item.sponsor_url}
                  redeemCost={item.redeem_cost}
                />
              ))}
            </ScrollView>
            <BottomNavigationBar navigation={navigation} activeScreen="Redeem" />
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

export default Redeem;
