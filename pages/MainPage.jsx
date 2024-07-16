import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Text, TouchableOpacity, Switch, KeyboardAvoidingView, ScrollView, TouchableWithoutFeedback, Keyboard } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import NameCard from '../components/ExcersiceCard'; // Adjust the import path as necessary
import axios from 'axios';

const MainPage = () => {
    const navigation = useNavigation();
    const [isRegular, setIsRegular] = useState(false); // Default mode is 'AI'
    const [username, setUsername] = useState('');
    const [buttonLabel, setButtonLabel] = useState('Start');
    const [buttonColor, setButtonColor] = useState('#008000'); // Green
    const [exerciseNames, setExerciseNames] = useState([]); // State to store exercise names

    useEffect(() => {
        const fetchUsername = async () => {
            try {
                const storedUsername = await AsyncStorage.getItem('username');
                if (storedUsername) {
                    setUsername(storedUsername);
                }
            } catch (error) {
                console.error('Error fetching username from AsyncStorage:', error);
            }
        };

        const fetchExercises = async () => {
            try {
                const storedUserEmail = await AsyncStorage.getItem('useremail');
                console.log(storedUserEmail);
                console.log(storedUserEmail);
                const response = await axios.post('http://10.0.2.2:8000/api/user/getExcersicesNames', {
                    email: storedUserEmail
                });
                console.log(response.data.exercisenames);
                setExerciseNames(response.data.exercisenames); // Store exercise names in state
            } catch (error) {
                console.error('Error fetching data from backend:', error);
            }
        };

        fetchUsername();
        fetchExercises();
    }, []);

    const clearAsyncStorage = async () => {
        try {
            await AsyncStorage.clear();
            console.log('AsyncStorage cleared successfully.');
        } catch (error) {
            console.error('Error clearing AsyncStorage:', error);
        }
    };

    const handleButtonPress = () => {
        // clearAsyncStorage();
        navigation.navigate('TrainingProgram');
    };

    const handleToggleButtonPress = () => {
        if (buttonLabel === 'Start') {
            setButtonLabel('Stop');
            setButtonColor('#FF0000'); // Red
        } else {
            setButtonLabel('Start');
            setButtonColor('#008000'); // Green
        }
    };

    return (
        <KeyboardAvoidingView style={styles.container} behavior="padding">
            <ScrollView contentContainerStyle={styles.scrollView}>
                <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                    <View style={styles.inner}>
                        {username ? <Text style={styles.username}>Welcome, {username}!</Text> : null}

                        <View style={styles.switchContainer}>
                            <Text style={styles.label}>AI</Text>
                            <Switch
                                value={isRegular}
                                onValueChange={(value) => setIsRegular(value)}
                            />
                            <Text style={styles.label}>Regular</Text>
                        </View>

                        <TouchableOpacity
                            style={[styles.plusButton, { opacity: isRegular ? 1 : 0.5 }]}
                            onPress={handleButtonPress}
                            disabled={!isRegular}
                        >
                            <Text style={styles.plusButtonText}>+</Text>
                        </TouchableOpacity>

                        {exerciseNames.map((name, index) => (
                            <NameCard key={index} name={name} />
                        ))}

                    </View>
                </TouchableWithoutFeedback>
                <TouchableOpacity
                    style={[styles.toggleButton, { backgroundColor: buttonColor }]}
                    onPress={handleToggleButtonPress}
                >
                    <Text style={styles.toggleButtonText}>{buttonLabel}</Text>
                </TouchableOpacity>
            </ScrollView>
        </KeyboardAvoidingView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    scrollView: {
        flexGrow: 1,
    },
    inner: {
        alignItems: 'center',
        padding: 20,
    },
    username: {
        fontSize: 20,
        marginBottom: 20,
    },
    switchContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginVertical: 20,
    },
    label: {
        fontSize: 18,
        marginHorizontal: 10,
    },
    plusButton: {
        backgroundColor: '#007AFF',
        borderRadius: 25,
        width: 50,
        height: 50,
        justifyContent: 'center',
        alignItems: 'center',
        marginVertical: 20,
    },
    plusButtonText: {
        color: '#fff',
        fontSize: 24,
    },
    toggleButton: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        
        height: 50,
        justifyContent: 'center',
        alignItems: 'center',
    },
    toggleButtonText: {
        color: '#fff',
        fontSize: 18,
    },
});

export default MainPage;
