import React, { useState, useEffect } from 'react';
import { Platform, Text, View, StyleSheet, TextInput, Button } from 'react-native';
import * as Location from 'expo-location';
import { RootStackParamList } from "../types";
import { useRoute, RouteProp } from "@react-navigation/native";


type LocationRouteProp = RouteProp<RootStackParamList, 'LocationScreen'>;

const LocationScreen = () => {
    const route = useRoute<LocationRouteProp>();
    const bus_id = route.params.bus_id;
    const bus_url = route.params.bus_url;
    const selfie_url = route.params.selfie_url;

    const [location, setLocation] = useState<Location.LocationObject | null>(null);
    const [errorMsg, setErrorMsg] = useState<string | null>(null);
    const [caption, setCaption] = useState('');

    useEffect(() => {
        (async () => {
            let { status } = await Location.requestForegroundPermissionsAsync();
            if (status !== 'granted') {
                setErrorMsg('Permission to access location was denied');
                return;
            }

            let location = await Location.getCurrentPositionAsync({});
            setLocation(location);
        })();
    }, []);

    let text = 'Waiting..';
    if (errorMsg) {
        text = errorMsg;
    } else if (location) {
        text = JSON.stringify(location);
    }

    const sendRequest = async () => {
        if (!location) {
            console.error("Location is not available");
            return;
        }
    
        const requestBody = {
            date_time: new Date().toISOString(),
            bus_id: bus_id,
            user_id: "example", // Replace with actual user ID
            bus_url: bus_url,
            selfie_url: selfie_url,
            caption: caption,
            latitude: location.coords.latitude,
            longitude: location.coords.longitude
        };

        console.log(JSON.stringify(requestBody))

    
        try {
            const response = await fetch('http://localhost:3000/api/endpoint', { // Replace with your server's URL
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(requestBody)
            });
    
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
    
            const data = await response.json();
            console.log('Success:', data);
            // Handle success (e.g., navigate to another screen or show success message)
        } catch (error) {
            console.error('Error:', error);
        }
    };

    return (
        <View style={styles.container}>
            {/* <Text style={styles.paragraph}>{text}</Text> */}
            <TextInput
                style={styles.textInput}
                onChangeText={setCaption}
                value={caption}
                placeholder="Enter caption for the photo"
            />
            <Button title="Submit" onPress={sendRequest} />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        padding: 20,
    },
    paragraph: {
        fontSize: 18,
        textAlign: 'center',
    },
    textInput: {
        height: 40,
        borderColor: 'gray',
        borderWidth: 1,
        width: '100%',
        marginTop: 20,
        padding: 10,
    },
});

export default LocationScreen;
