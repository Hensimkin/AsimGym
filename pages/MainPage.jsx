import React, { useContext, useEffect, useState } from 'react';
import { View, StyleSheet, Text, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useNavigation} from '@react-navigation/native';
import Card from '../components/TrainingCard'; // Adjust the import path as necessary

const MainPage = () => {
    const navigation = useNavigation();

    
    const clearAsyncStorage = async () => {
        try {
            await AsyncStorage.clear();
            console.log('AsyncStorage cleared successfully.');
        } catch (error) {
            console.error('Error clearing AsyncStorage:', error);
        }
    };

    const handleButtonPress = () => {
        // Navigate to Home page
        navigation.navigate('ProfilePage');
        // Clear AsyncStorage
        // clearAsyncStorage();
    };

    return (
        <View style={styles.container}>
             <Card 
                title="Hello"
                description="Wus"
                image="https://v2.exercisedb.io/image/WXW-MYKoyHFBr4"
            />
            <TouchableOpacity onPress={handleButtonPress}>
                <Text>sup</Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#fff',
    },
    image: {
        // Adjust image styles as needed
    },
});

export default MainPage;
