import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Text, TouchableOpacity, ScrollView, TextInput, ActivityIndicator, Modal, Image } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Card from '../components/TrainingCard'; 

const ExerciseDetail = () => {
    const navigation = useNavigation();
    const route = useRoute();
    const { exerciseName } = route.params;
    const [exercises, setExercises] = useState([]);
    const [exerciseDetails, setExerciseDetails] = useState([]);
    const [loading, setLoading] = useState(true);
    const [inputValues, setInputValues] = useState({});
    const [editing, setEditing] = useState(false);
    const [started, setStarted] = useState(false); 
    const [startTime, setStartTime] = useState(null); 
    const [ratingModalVisible, setRatingModalVisible] = useState(false); 
    const [detailsModalVisible, setDetailsModalVisible] = useState(false); 
    const [selectedExercise, setSelectedExercise] = useState(null);
    const [userEmail, setUserEmail] = useState('');
    const [ratings, setRatings] = useState({}); 
    const [keepOrChange, setKeepOrChange] = useState({}); 

    useEffect(() => {
        const sendExerciseData = async () => {
            try {
                const email = await AsyncStorage.getItem("useremail");
                setUserEmail(email);
                
                const response = await axios.post('https://asimgymbackend.onrender.com/api/user/getExerciseProgram', {
                    email: email,
                    excersicename: exerciseName
                });
                const exercises = response.data.exerciseProgram;

                setExercises(exercises);

                const listofex = await AsyncStorage.getItem("listofex");

                const exerciseList = JSON.parse(listofex);

                const detailedExercises = exercises.map(ex => {
                    const filteredExercises = exerciseList.filter(e => e.name === ex.exercise_name);
                    const detailedExercise = filteredExercises.length > 0 ? filteredExercises[0] : undefined;
                    return { ...detailedExercise, reps: ex.reps, weight: ex.weight, sets: ex.sets };
                });

                setExerciseDetails(detailedExercises);
                setInputValues(detailedExercises.reduce((acc, curr) => {
                    acc[curr.name] = { reps: curr.reps, weight: curr.weight, sets: curr.sets };
                    return acc;
                }, {}));
            } catch (error) {
                console.error('Error:', error);
            } finally {
                setLoading(false);
            }
        };

        sendExerciseData();
    }, [exerciseName]);

    const handleInputChange = (exerciseName, field, value) => {
        setInputValues(prevValues => ({
            ...prevValues,
            [exerciseName]: {
                ...prevValues[exerciseName],
                [field]: value === '' || isNaN(value) ? 0 : Number(value),
            },
        }));
    };

    const handleSave = async () => {
        try {
            const excersicename = exerciseName;
            const details = JSON.stringify(inputValues);
            console.log(details);
    
            const payload = {
                useremail: userEmail,
                excersicename: excersicename,
                payload: details,
            };
    
            const url = excersicename === "AI Exercise"
                ? 'https://asimgymbackend.onrender.com/api/user/updateAIExercises'
                : 'https://asimgymbackend.onrender.com/api/user/updateExercises';
    
            const response = await axios.post(url, payload);
            console.log(response);

        } catch (error) {
            console.error('Error saving exercise details:', error);
        }
    };

    const toggleEditing = () => {
        setEditing(!editing);
    };

    const handleSaveAll = async () => {
        if (editing) {
            await handleSave();
        }
        toggleEditing();
    };

    const handleKeepOrChange = (exerciseName, choice) => {
        setKeepOrChange(prev => ({
            ...prev,
            [exerciseName]: choice,
        }));
    };

    const handleStartStop = async () => {
        if (!started) {
            const start = new Date();
            setStartTime(start);
            console.log("Start Time:", start);
        } else {
            const end = new Date();
            const duration = (end - startTime) / 1000; 
            console.log("End Time:", end);
            console.log("Total Duration:", duration, "seconds");

            const exerciseData = {
                exerciseName: exerciseName,
                exercises: exerciseDetails.map(ex => ({
                    name: ex.name,
                    reps: inputValues[ex.name].reps,
                    weight: inputValues[ex.name].weight,
                    sets: inputValues[ex.name].sets,
                })),
                userEmail: userEmail,
                date: startTime.toLocaleDateString(),
                startTime: startTime.toLocaleTimeString(),
                endTime: end.toLocaleTimeString(),
                duration: `${duration} seconds`,
            };

            console.log("Exercise Data:", exerciseData);
            const exerciseDataString = JSON.stringify(exerciseData);
            try {
                await axios.post('https://asimgymbackend.onrender.com/api/user/postExerciseLog', exerciseDataString);
                console.log("Exercise data logged successfully.");
            } catch (error) {
                console.error("Error logging exercise data:", error);
            }

            if (exerciseName === "AI Exercise") {
                setRatingModalVisible(true);
                setDetailsModalVisible(false); 
            }

            setStartTime(null); 
        }
        setStarted(!started);
    };

    const handleCardPress = (exercise) => {
        setSelectedExercise(exercise);
        setDetailsModalVisible(true); // Show the exercise details modal
        setRatingModalVisible(false); 
    };

    const closeDetailsModal = () => {
        setDetailsModalVisible(false);
        setSelectedExercise(null);
    };

    const handleRatingChange = (exerciseName, rating) => {
        setRatings(prevRatings => ({
            ...prevRatings,
            [exerciseName]: rating,
        }));

        // If the user selects rating 3, show Keep or Change options
        if (rating === 3) {
            setKeepOrChange(prev => ({
                ...prev,
                [exerciseName]: null, // reset the choice
            }));
        } else {
            setKeepOrChange(prev => ({
                ...prev,
                [exerciseName]: undefined, // remove the prompt
            }));
        }
    };

    const allRated = () => {
        return exerciseDetails.every(exercise => ratings[exercise.name] && (ratings[exercise.name] !== 3 || keepOrChange[exercise.name]));
    };

    const handleSendRatings = async () => {
        if (!allRated()) {
            alert("Please rate all exercises and choose 'Keep' or 'Change' for exercises rated 3.");
            return;
        }

        try {
            const payload = {
                useremail: userEmail,
                exerciseName: exerciseName,
                ratings: ratings,
                choices: keepOrChange, 
            };
            console.log(payload)
            await axios.post('https://asimgymbackend.onrender.com/api/user/exerciseRatings', payload);
            console.log("Ratings sent successfully.");
            setRatingModalVisible(false);
            setRatings({}); 
            setKeepOrChange({}); 
            navigation.navigate('MainPage');
        } catch (error) {
            console.error("Error sending ratings:", error);
        }
    };

    if (loading) {
        return <ActivityIndicator size="large" color="#0000ff" />;
    }

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.title}>{exerciseName}</Text>
                <TouchableOpacity style={styles.editButton} onPress={handleSaveAll}>
                    <Text style={styles.editButtonText}>{editing ? 'Save' : 'Edit'}</Text>
                </TouchableOpacity>
            </View>
            <ScrollView contentContainerStyle={styles.scrollViewContent}>
                {exerciseDetails.map((exercise, index) => (
                    exercise && (
                        <TouchableOpacity key={index} onPress={() => handleCardPress(exercise)}>
                            <View style={styles.exerciseContainer}>
                                <Card
                                    title={exercise.name}
                                    description={`${exercise.bodyPart}`}
                                    image={exercise.gifUrl} // Replace with actual image URL if available
                                />
                                {editing ? (
                                    <View style={styles.inputContainer}>
                                        <TextInput
                                            style={styles.input}
                                            placeholder="Reps"
                                            keyboardType="numeric"
                                            value={String(inputValues[exercise.name].reps)}
                                            onChangeText={(value) => handleInputChange(exercise.name, 'reps', value)}
                                        />
                                        <TextInput
                                            style={styles.input}
                                            placeholder="Weight"
                                            keyboardType="numeric"
                                            value={String(inputValues[exercise.name].weight)}
                                            onChangeText={(value) => handleInputChange(exercise.name, 'weight', value)}
                                        />
                                        <TextInput
                                            style={styles.input}
                                            placeholder="Sets"
                                            keyboardType="numeric"
                                            value={String(inputValues[exercise.name].sets)}
                                            onChangeText={(value) => handleInputChange(exercise.name, 'sets', value)}
                                        />
                                    </View>
                                ) : (
                                    <View style={styles.displayContainer}>
                                        <Text>Reps: {inputValues[exercise.name].reps}</Text>
                                        <Text>Weight: {inputValues[exercise.name].weight}</Text>
                                        <Text>Sets: {inputValues[exercise.name].sets}</Text>
                                    </View>
                                )}
                            </View>
                        </TouchableOpacity>
                    )
                ))}
            </ScrollView>
            <TouchableOpacity style={[styles.startStopButton, { backgroundColor: started ? '#dc3545' : '#28a745' }]} onPress={handleStartStop}>
                <Text style={styles.startStopButtonText}>{started ? 'Stop' : 'Start'}</Text>
            </TouchableOpacity>

            {/* Modal for AI Exercise Ratings */}
            {exerciseName === "AI Exercise" && (
                <Modal
                    animationType="slide"
                    transparent={true}
                    visible={ratingModalVisible} // Use separate state for rating modal
                    onRequestClose={() => setRatingModalVisible(false)}
                >
                    <View style={styles.modalContainer}>
                        <View style={styles.modalContent}>
                            <Text style={styles.exerciseTitle}>Rate the Exercises</Text>
                            <Text style={styles.instructions}>
                                1 = Very Liked, 2 = Liked, 3 = Medium (Choose Keep or Change), 4 = Not Liked
                            </Text>
                            <ScrollView>
                                {exerciseDetails.map((exercise, index) => (
                                    <View key={index} style={styles.ratingContainer}>
                                        <Text style={styles.modalText}>{exercise.name}</Text>
                                        <View style={styles.ratingOptions}>
                                            {[1, 2, 3, 4].map((rating) => (
                                                <TouchableOpacity
                                                    key={rating}
                                                    style={[
                                                        styles.ratingButton,
                                                        ratings[exercise.name] === rating && styles.selectedRating
                                                    ]}
                                                    onPress={() => handleRatingChange(exercise.name, rating)}
                                                >
                                                    <Text style={styles.ratingButtonText}>{rating}</Text>
                                                </TouchableOpacity>
                                            ))}
                                        </View>
                                        
                                        {/* Show Keep/Change options if rating is 3 */}
                                        {ratings[exercise.name] === 3 && (
                                            <View style={styles.keepChangeContainer}>
                                                <Text>Would you like to keep or change this exercise?</Text>
                                                <View style={styles.keepChangeOptions}>
                                                    <TouchableOpacity
                                                        style={[
                                                            styles.keepChangeButton,
                                                            keepOrChange[exercise.name] === 'Keep' && styles.selectedKeepChange
                                                        ]}
                                                        onPress={() => handleKeepOrChange(exercise.name, 'Keep')}
                                                    >
                                                        <Text style={styles.keepChangeText}>Keep</Text>
                                                    </TouchableOpacity>
                                                    <TouchableOpacity
                                                        style={[
                                                            styles.keepChangeButton,
                                                            keepOrChange[exercise.name] === 'Change' && styles.selectedKeepChange
                                                        ]}
                                                        onPress={() => handleKeepOrChange(exercise.name, 'Change')}
                                                    >
                                                        <Text style={styles.keepChangeText}>Change</Text>
                                                    </TouchableOpacity>
                                                </View>
                                            </View>
                                        )}
                                    </View>
                                ))}
                            </ScrollView>
                            <TouchableOpacity
                                onPress={handleSendRatings}
                                style={[styles.sendButton, { opacity: allRated() ? 1 : 0.5 }]}
                                disabled={!allRated()}
                            >
                                <Text style={styles.sendButtonText}>Send</Text>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => setRatingModalVisible(false)} style={styles.closeButton}>
                                <Text style={styles.closeButtonText}>Close</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </Modal>
            )}

            {/* Modal for Exercise Details */}
            {selectedExercise && (
                <Modal
                    animationType="slide"
                    transparent={true}
                    visible={detailsModalVisible} // Use separate state for details modal
                    onRequestClose={closeDetailsModal}
                >
                    <View style={styles.modalContainer}>
                        <View style={styles.modalContent}>
                            <ScrollView contentContainerStyle={styles.scrollViewContent}>
                                <Text style={styles.exerciseTitle}>{selectedExercise.name}</Text>
                                <View style={styles.textContainer}>
                                    <Text style={styles.modalText}>Body Part: {selectedExercise.bodyPart}</Text>
                                    <Text style={styles.modalText}>Equipment: {selectedExercise.equipment}</Text>
                                    <Text style={styles.modalText}>Target: {selectedExercise.target}</Text>
                                    <Text style={styles.modalText}>Secondary Muscles: {selectedExercise.secondaryMuscles}</Text>
                                </View>
                                <Image source={{ uri: selectedExercise.gifUrl }} style={styles.exerciseImage} />
                                <Text style={styles.modalText}>Instructions: {selectedExercise.instructions}</Text>
                            </ScrollView>
                            <TouchableOpacity onPress={closeDetailsModal} style={styles.closeButton}>
                                <Text style={styles.closeButtonText}>Close</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </Modal>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        padding: 20,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 20,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
    },
    editButton: {
        backgroundColor: '#007bff',
        padding: 10,
        borderRadius: 5,
    },
    editButtonText: {
        color: '#fff',
        fontSize: 18,
    },
    scrollViewContent: {
        flexGrow: 1,
        alignItems: 'center',
    },
    exerciseContainer: {
        width: '100%',
        alignItems: 'center',
        marginBottom: 20,
    },
    inputContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%',
        paddingHorizontal: 20,
        marginTop: 10,
    },
    input: {
        width: '30%',
        borderColor: '#ccc',
        borderWidth: 1,
        borderRadius: 5,
        padding: 10,
        textAlign: 'center',
    },
    displayContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%',
        paddingHorizontal: 20,
        marginTop: 10,
    },
    startStopButton: {
        padding: 15,
        borderRadius: 5,
        alignItems: 'center',
        marginTop: 20,
        width: '80%',
        alignSelf: 'center',
    },
    startStopButtonText: {
        color: '#fff',
        fontSize: 18,
    },
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        paddingTop: 120,
        paddingBottom: 120,

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
    modalText: {
        fontSize: 16, // Setting the same font size for all modal text
        marginBottom: 5,
    },
    exerciseTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 10,
        textAlign: 'center',
    },
    exerciseImage: {
        width: 200,
        height: 200,
        marginBottom: 10,
    },
    ratingContainer: {
        width: '100%',
        marginVertical: 10,
    },
    ratingOptions: {
        flexDirection: 'row',
        justifyContent: 'space-around',
    },
    ratingButton: {
        backgroundColor: '#ccc',
        padding: 10,
        borderRadius: 5,
        width: 40,
        alignItems: 'center',
    },
    selectedRating: {
        backgroundColor: '#007bff',
    },
    ratingButtonText: {
        color: '#fff',
        fontWeight: 'bold',
    },
    sendButton: {
        backgroundColor: '#28a745',
        padding: 15,
        borderRadius: 5,
        marginTop: 20,
        width: '60%',
        alignItems: 'center',
    },
    sendButtonText: {
        color: '#fff',
        fontSize: 18,
    },
    closeButton: {
        marginTop: 20,
    },
    closeButtonText: {
        color: 'red',
        fontSize: 16,
    },
    instructions: {
        fontSize: 16,
        marginBottom: 10,
        textAlign: 'center',
        color: '#555',
    },
    keepChangeContainer: {
        marginTop: 10,
    },
    keepChangeOptions: {
        flexDirection: 'row',
        justifyContent: 'space-around',
    },
    keepChangeButton: {
        backgroundColor: '#ccc',
        padding: 10,
        borderRadius: 5,
        marginHorizontal: 10,
    },
    selectedKeepChange: {
        backgroundColor: '#007bff',
    },
    keepChangeText: {
        color: '#fff',
    },
});

export default ExerciseDetail;
