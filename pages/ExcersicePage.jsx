import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ActivityIndicator, ScrollView, KeyboardAvoidingView, TouchableWithoutFeedback, Keyboard, Modal, Image } from 'react-native';
import axios from 'axios';
import { useNavigation } from '@react-navigation/native';
import Card from '../components/TrainingCard'; // Adjust the import path as necessary
import { Icon } from 'react-native-elements';
import AsyncStorage from '@react-native-async-storage/async-storage';

const ExercisePage = () => {
    const navigation = useNavigation();
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [filter, setFilter] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [modalVisible, setModalVisible] = useState(false);
    const [selectedExercise, setSelectedExercise] = useState(null);
    const [detailsModalVisible, setDetailsModalVisible] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            try {
                if (data===null)
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

    const handleCardPress = (exercise) => {
        setSelectedExercise(exercise);
        setDetailsModalVisible(true);
    };

    const closeDetailsModal = () => {
        setDetailsModalVisible(false);
        setSelectedExercise(null);
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
                            <TouchableOpacity key={index} onPress={() => handleCardPress(exercise)}>
                                <Card
                                    title={exercise.name}
                                    description={exercise.bodyPart}
                                    image={exercise.gifUrl}
                                />
                            </TouchableOpacity>
                        ))}
                    </ScrollView>

                    {selectedExercise && (
                        <Modal
                            animationType="slide"
                            transparent={true}
                            visible={detailsModalVisible}
                            onRequestClose={closeDetailsModal}
                        >
                            <View style={styles.modalContainer}>
                                <View style={styles.modalContent}>
                                    <Text style={styles.exerciseTitle}>{selectedExercise.name}</Text>
                                    <View style={styles.textContainer}>
                                        <Text style={styles.modalText}>Body Part: {selectedExercise.bodyPart}</Text>
                                        <Text style={styles.modalText}>Equipment: {selectedExercise.equipment}</Text>
                                        <Text style={styles.modalText}>Target: {selectedExercise.target}</Text>
                                        <Text style={styles.modalText}>Secondary Muscles: {selectedExercise.secondaryMuscles}</Text>
                                    </View>
                                    <Image source={{ uri: selectedExercise.gifUrl }} style={styles.exerciseImage} />
                                    <Text style={styles.modalText}>Instructions: {selectedExercise.instructions}</Text>
                                    <TouchableOpacity onPress={closeDetailsModal} style={styles.closeButton}>
                                        <Text style={styles.closeButtonText}>Close</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        </Modal>
                    )}
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
    textContainer: {
        alignItems: 'flex-start',
        width: '100%',
        marginBottom: 10,
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
    exerciseTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 10,
        textAlign: 'center',
    },
    modalText: {
        fontSize: 16, // Setting the same font size for all modal text
        marginBottom: 5,
    },
    exerciseImage: {
        width: 200,
        height: 200,
        marginBottom: 10,
    },
});

export default ExercisePage;

