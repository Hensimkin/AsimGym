// ProfileScreen.js

import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, ScrollView, Switch, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import muscleImages from '../data/muscleImages'; // Import the images
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { useNavigation } from '@react-navigation/native';

const ProfileScreen = () => {
    const navigation = useNavigation();
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [height, setHeight] = useState('160');
    const [weight, setWeight] = useState('70');
    const [gender, setGender] = useState('male');
    const [age, setAge] = useState('');
    const [fitnessLevel, setFitnessLevel] = useState('Beginner');
    const [goal, setGoal] = useState('Lose Weight');
    const [selectedMuscles, setSelectedMuscles] = useState([]);
    const [isFormValid, setIsFormValid] = useState(false);

    const muscleGroups = [
        'fullbody', 'back', 'biceps', 'cardio', 'chest', 'forearms', 'lower_legs', 'neck', 'shoulders', 'triceps', 'upper_legs', 'waist'
    ];

    // useEffect(() => {
    //     // Load user data from AsyncStorage
    //     const loadUserData = async () => {
    //         const storedEmail = await AsyncStorage.getItem('useremail');
    //         setEmail(storedEmail);
    //         // Fetch user details from API
    //         try {
    //             const response = await axios.get(`http://10.0.2.2:8000/api/user/${storedEmail}`);
    //             const userData = response.data;
    //             setName(userData.name);
    //             setHeight(userData.height);
    //             setWeight(userData.weight);
    //             setGender(userData.gender);
    //             setAge(userData.age);
    //             setFitnessLevel(userData.fitnessLevel);
    //             setGoal(userData.goal);
    //             setSelectedMuscles(userData.selectedMuscles);
    //         } catch (error) {
    //             console.error('Error loading user data:', error);
    //         }
    //     };
    //     loadUserData();
    // }, []);

    useEffect(() => {
        if (age && selectedMuscles.length > 0 && height && weight && name && password) {
            setIsFormValid(true);
        } else {
            setIsFormValid(false);
        }
    }, [age, selectedMuscles, height, weight, name, password]);

    const toggleMuscleSelection = (muscle) => {
        let updatedMuscles;

        if (muscle === 'fullbody') {
            if (selectedMuscles.includes('fullbody')) {
                updatedMuscles = [];
            } else {
                updatedMuscles = muscleGroups;
            }
        } else {
            if (selectedMuscles.includes(muscle)) {
                updatedMuscles = selectedMuscles.filter(item => item !== muscle);
            } else {
                updatedMuscles = [...selectedMuscles, muscle];
            }

            if (updatedMuscles.length < muscleGroups.length - 1) {
                updatedMuscles = updatedMuscles.filter(item => item !== 'fullbody');
            }

            if (selectedMuscles.includes('fullbody')) {
                updatedMuscles = updatedMuscles.filter(item => item !== 'fullbody');
            }

            if (updatedMuscles.length === muscleGroups.length - 1) {
                updatedMuscles = [...updatedMuscles, 'fullbody'];
            }
        }

        setSelectedMuscles(updatedMuscles);
    };

    const handleSave = async () => {
        const details = { email, name, password, height, weight, gender, age, fitnessLevel, goal, selectedMuscles };
        try {
            const response = await axios.post('http://10.0.2.2:8000/api/user/updateProfile', details);
            if (response.data.msg === 'success') {
                navigation.navigate('MainPage');
            }
        } catch (error) {
            console.error('Error saving details:', error);
        }
    };

    return (
        <View style={styles.container}>
            <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
                <Text style={styles.label}>Name</Text>
                <TextInput
                    style={styles.textInput}
                    value={name}
                    onChangeText={setName}
                />

                <Text style={styles.label}>Password</Text>
                <TextInput
                    style={styles.textInput}
                    secureTextEntry
                    value={password}
                    onChangeText={setPassword}
                />

                <Text style={styles.label}>Height (cm)</Text>
                <TextInput
                    style={styles.textInput}
                    keyboardType="numeric"
                    value={height}
                    onChangeText={setHeight}
                />

                <Text style={styles.label}>Weight (kg)</Text>
                <TextInput
                    style={styles.textInput}
                    keyboardType="numeric"
                    value={weight}
                    onChangeText={setWeight}
                />

                <Text style={styles.label}>Gender</Text>
                <View style={styles.switchContainer}>
                    <Text>Male</Text>
                    <Switch
                        value={gender === 'female'}
                        onValueChange={() => setGender(gender === 'male' ? 'female' : 'male')}
                        trackColor={{ false: "#767577", true: "#767577" }}
                        thumbColor={gender === 'male' ? '#007AFF' : '#FF1493'}
                    />
                    <Text>Female</Text>
                </View>

                <Text style={styles.label}>Age</Text>
                <TextInput
                    style={styles.textInput}
                    keyboardType="numeric"
                    value={age}
                    onChangeText={setAge}
                />

                <Text style={styles.label}>Fitness Level</Text>
                <Picker
                    selectedValue={fitnessLevel}
                    onValueChange={(itemValue) => setFitnessLevel(itemValue)}
                    style={styles.picker}
                >
                    <Picker.Item label="Beginner" value="Beginner" />
                    <Picker.Item label="Intermediate" value="Intermediate" />
                    <Picker.Item label="Advanced" value="Advanced" />
                </Picker>

                <Text style={styles.label}>Goal</Text>
                <Picker
                    selectedValue={goal}
                    onValueChange={(itemValue) => setGoal(itemValue)}
                    style={styles.picker}
                >
                    <Picker.Item label="Lose Weight" value="Lose Weight" />
                    <Picker.Item label="Build Muscle" value="Build Muscle" />
                    <Picker.Item label="Improve Endurance" value="Improve Endurance" />
                </Picker>

                <Text style={styles.label}>Muscle Groups</Text>
                <View style={styles.muscleContainer}>
                    {muscleGroups.map((muscle) => (
                        <TouchableOpacity key={muscle} onPress={() => toggleMuscleSelection(muscle)}>
                            <Image
                                source={muscleImages[muscle]}
                                style={[
                                    styles.muscleImage,
                                    selectedMuscles.includes(muscle) ? styles.selectedMuscle : null
                                ]}
                            />
                            <Text>{muscle}</Text>
                        </TouchableOpacity>
                    ))}
                </View>
            </ScrollView>
            <TouchableOpacity
                style={[
                    styles.doneButtonContainer,
                    // { backgroundColor: isFormValid ? '#007AFF' : '#A9A9A9' }
                    { backgroundColor: '#007AFF' }
                ]}
                onPress={handleSave}
            >
                <Text style={styles.doneButtonText}>Save</Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    scrollView: {
        flex: 1,
    },
    scrollContent: {
        padding: 20,
        paddingBottom: 100, // Add padding to ensure the content does not overlap with the button
    },
    label: {
        fontSize: 18,
        marginVertical: 10,
    },
    textInput: {
        borderBottomWidth: 1,
        borderBottomColor: '#000',
        marginVertical: 10,
        paddingHorizontal: 5,
    },
    switchContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    picker: {
        height: 50,
        width: '100%',
        marginVertical: 10,
    },
    muscleContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
    },
    muscleImage: {
        width: 100,
        height: 100,
        margin: 5,
    },
    selectedMuscle: {
        borderColor: 'blue',
        borderWidth: 2,
    },
    doneButtonContainer: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        padding: 15,
        alignItems: 'center',
    },
    doneButtonText: {
        color: '#fff',
        fontSize: 18,
    },
});

export default ProfileScreen;
