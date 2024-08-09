import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ActivityIndicator, ScrollView, KeyboardAvoidingView, TouchableWithoutFeedback, Keyboard, Modal } from 'react-native';
import axios from 'axios';
import { useNavigation } from '@react-navigation/native';
import Card from '../components/TrainingCard'; // Adjust the import path as necessary
import { Icon } from 'react-native-elements';
import AsyncStorage from '@react-native-async-storage/async-storage';

const SelectExercisePage = () => {
    const navigation = useNavigation();
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [filter, setFilter] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [modalVisible, setModalVisible] = useState(false);
    const [selectedExercises, setSelectedExercises] = useState([]);
    const [name, setName] = useState('');
    const [isButtonDisabled, setIsButtonDisabled] = useState(true);
    const [nameError, setNameError] = useState(''); // New state for name error message

    useEffect(() => {
        const fetchData = async () => {
            try {
                if(data===null)
                {
                    console.log("getting all exercises");
                    // const response = await axios.get('http://10.0.2.2:8000/api/user/getExercises');
                    // const exercises = response.data.exercises;
                    const response=await AsyncStorage.getItem("listofex")
                    const exercises=JSON.parse(response)
                    setData(exercises);
                }
            } catch (error) {
                console.log("err2");
                setError(error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []); // Empty dependency array means this effect runs once when the component mounts

    useEffect(() => {
        setIsButtonDisabled(!(name && selectedExercises.length > 0));
    }, [name, selectedExercises]);

    const applyFilter = (bodyPart) => {
        setFilter(bodyPart);
        setModalVisible(false);
    };

    const filteredData = data
        ? data.filter(exercise =>
            (!filter || exercise.bodyPart === filter) &&
            exercise.name.toLowerCase().includes(searchQuery.toLowerCase())
        )
        : [];

    const handleExerciseSelect = (exercise) => {
        setSelectedExercises(prevSelected =>
            prevSelected.includes(exercise)
                ? prevSelected.filter(e => e !== exercise)
                : [...prevSelected, exercise]
        );
    };

    const handleDone = async () => {
        try {
            AsyncStorage.setItem("newcustomexcersice", JSON.stringify(selectedExercises)); // saves the 
            const g = await AsyncStorage.getItem("newcustomexcersice");
            const parsedG = JSON.parse(g);
            console.log(parsedG);

            AsyncStorage.setItem("excersicename", name);

            const userEmail = await AsyncStorage.getItem("useremail");
            const selectedExerciseNames = selectedExercises.map(exercise => exercise.name);
            const payload = {
                name: name,
                exercises: selectedExerciseNames,
                userEmail: userEmail
            };
            console.log(payload);
            const response = await axios.post('http://10.0.2.2:8000/api/user/saveExercises', payload);
            if(response.data.message === 'ChangeName')
            {
                setNameError('Name already exists');
            } else {
                setNameError('');
                console.log('Response:', response.data);
                navigation.navigate('UserRehearsalsPage');
            }
        } catch (error) {
            console.log('Error:', error);
            // Handle error appropriately
        }
    };

    if (loading) {
        return <ActivityIndicator size="large" color="#0000ff" />;
    }

    if (error) {
        return (
            <View style={styles.container}>
                <Text>Error: {error.message}</Text>
            </View>
        );
    }

    return (
        <KeyboardAvoidingView style={{ flex: 1 }} behavior="padding">
            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                <View style={styles.container}>
                    <TextInput
                        style={styles.nameInput}
                        placeholder="Enter your name"
                        value={name}
                        onChangeText={setName}
                    />
                    {nameError ? <Text style={styles.errorText}>{nameError}</Text> : null}
                    <View style={styles.searchFilterContainer}>
                        <TextInput
                            style={styles.searchBar}
                            placeholder="Search exercises..."
                            value={searchQuery}
                            onChangeText={setSearchQuery}
                        />
                        <TouchableOpacity onPress={() => setModalVisible(true)} style={styles.filterButton}>
                            <Icon name="filter-list" type="material" color="#fff" />
                            <Text style={styles.filterButtonText}>Filter</Text>
                        </TouchableOpacity>
                    </View>
                    <ScrollView contentContainerStyle={styles.scrollViewContent}>
                        <Modal
                            animationType="slide"
                            transparent={true}
                            visible={modalVisible}
                            onRequestClose={() => setModalVisible(false)}
                        >
                            <View style={styles.modalContainer}>
                                <View style={styles.modalContent}>
                                    <TouchableOpacity onPress={() => applyFilter(null)}>
                                        <Text style={styles.modalOption}>All</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity onPress={() => applyFilter('back')}>
                                        <Text style={styles.modalOption}>Back</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity onPress={() => applyFilter('waist')}>
                                        <Text style={styles.modalOption}>Waist</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity onPress={() => applyFilter('legs')}>
                                        <Text style={styles.modalOption}>Legs</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity onPress={() => applyFilter('chest')}>
                                        <Text style={styles.modalOption}>Chest</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity onPress={() => setModalVisible(false)} style={styles.closeButton}>
                                        <Text style={styles.closeButtonText}>Close</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        </Modal>

                        {filteredData && filteredData.slice(0, 10).map((exercise, index) => (
                            <TouchableOpacity key={index} onPress={() => handleExerciseSelect(exercise)} style={styles.exerciseItem}>
                                <Icon
                                    name={selectedExercises.includes(exercise) ? "check-circle" : "radio-button-unchecked"}
                                    type="material"
                                    color={selectedExercises.includes(exercise) ? "#00ff00" : "#ccc"}
                                    containerStyle={styles.checkIcon}
                                />
                                <View style={styles.cardContainer}>
                                    <Card
                                        title={exercise.name}
                                        description={exercise.bodyPart}
                                        image={exercise.gifUrl}
                                    />
                                </View>
                            </TouchableOpacity>
                        ))}
                    </ScrollView>
                    <TouchableOpacity
                        onPress={handleDone}
                        style={[styles.doneButton, isButtonDisabled && styles.doneButtonDisabled]}
                        disabled={isButtonDisabled}
                    >
                        <Text style={styles.doneButtonText}>Done</Text>
                    </TouchableOpacity>
                </View>
            </TouchableWithoutFeedback>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        padding: 20,
    },
    scrollViewContent: {
        flexGrow: 1,
        alignItems: 'center',
        paddingTop: 10, // Ensure items start from the top
    },
    searchFilterContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 20,
    },
    nameInput: {
        height: 40,
        borderColor: '#ccc',
        borderWidth: 1,
        borderRadius: 5,
        paddingLeft: 10,
        marginBottom: 5,
    },
    searchBar: {
        flex: 1,
        height: 40,
        borderColor: '#ccc',
        borderWidth: 1,
        borderRadius: 5,
        paddingLeft: 10,
    },
    filterButton: {
        backgroundColor: '#007bff',
        padding: 10,
        borderRadius: 5,
        marginLeft: 10,
        flexDirection: 'row',
        alignItems: 'center',
    },
    filterButtonText: {
        color: '#fff',
        fontSize: 16,
        marginLeft: 5,
    },
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalContent: {
        backgroundColor: '#fff',
        padding: 20,
        borderRadius: 10,
        width: '80%',
        alignItems: 'center',
    },
    modalOption: {
        fontSize: 18,
        marginBottom: 10,
    },
    closeButton: {
        marginTop: 20,
    },
    closeButtonText: {
        color: 'red',
        fontSize: 16,
    },
    exerciseItem: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 10,
        width: '100%',
    },
    checkIcon: {
        marginRight: 10,
    },
    cardContainer: {
        flex: 1,
        marginLeft: -10, // Adjust this value to move the card to the left
    },
    doneButton: {
        backgroundColor: '#28a745',
        padding: 15,
        borderRadius: 5,
        alignItems: 'center',
        marginTop: 10,
    },
    doneButtonDisabled: {
        backgroundColor: '#ccc',
    },
    doneButtonText: {
        color: '#fff',
        fontSize: 18,
    },
    errorText: {
        color: 'red',
        fontSize: 14,
        marginBottom: 10,
    },
});

export default SelectExercisePage;
