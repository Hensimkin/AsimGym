import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    ActivityIndicator,
    ScrollView,
    KeyboardAvoidingView,
    TouchableWithoutFeedback,
    Keyboard,
    Modal,
    Image,
    useWindowDimensions,
} from 'react-native';
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

    // Use useWindowDimensions to get current screen dimensions
    const { width, height } = useWindowDimensions();

    useEffect(() => {
        const fetchData = async () => {
            try {
                if (data === null) {
                    console.log('getting all exercises');
                    // const response = await axios.get('http://10.0.2.2:8000/api/user/getExercises');
                    // const exercises = response.data.exercises;
                    const response = await AsyncStorage.getItem('listofex');
                    const exercises = JSON.parse(response);
                    setData(exercises);
                }
            } catch (error) {
                console.log('err2');
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
        ? data.filter(
              (exercise) =>
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

    // Styles adjusted to be responsive using dimensions
    const styles = StyleSheet.create({
        container: {
            flex: 1,
            backgroundColor: '#fff',
            padding: width * 0.05, // 5% of screen width
        },
        scrollViewContent: {
            flexGrow: 1,
            alignItems: 'center',
            paddingTop: height * 0.02, // 2% of screen height
        },
        searchFilterContainer: {
            flexDirection: 'row',
            alignItems: 'center',
            marginBottom: height * 0.02, // 2% of screen height
        },
        searchBar: {
            flex: 1,
            height: height * 0.06, // 6% of screen height
            borderColor: '#ccc',
            borderWidth: 1,
            borderRadius: 5,
            paddingLeft: width * 0.03, // 3% of screen width
            fontSize: width * 0.04, // Responsive font size
        },
        filterButton: {
            backgroundColor: '#007bff',
            paddingVertical: height * 0.015, // Adjust padding vertical
            paddingHorizontal: width * 0.03, // Adjust padding horizontal
            borderRadius: 5,
            marginLeft: width * 0.03, // 3% of screen width
            flexDirection: 'row',
            alignItems: 'center',
        },
        filterButtonText: {
            color: '#fff',
            fontSize: width * 0.04, // 4% of screen width
            marginLeft: width * 0.01,
        },
        modalContainer: {
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
        },
        modalContent: {
            backgroundColor: '#fff',
            padding: width * 0.05, // 5% of screen width
            borderRadius: 10,
            width: '80%',
            alignItems: 'center',
            maxHeight: height * 0.8, // Limit modal height to 80% of screen height
        },
        modalScrollViewContent: {
            alignItems: 'center',
            paddingBottom: height * 0.02,
        },
        textContainer: {
            alignItems: 'flex-start',
            width: '100%',
            marginBottom: height * 0.01,
        },
        modalOption: {
            fontSize: width * 0.045, // 4.5% of screen width
            marginBottom: height * 0.01,
        },
        closeButton: {
            marginTop: height * 0.02,
        },
        closeButtonText: {
            color: 'red',
            fontSize: width * 0.04,
        },
        exerciseTitle: {
            fontSize: width * 0.06, // 6% of screen width
            fontWeight: 'bold',
            marginBottom: height * 0.02,
            textAlign: 'center',
        },
        modalText: {
            fontSize: width * 0.04,
            marginBottom: height * 0.01,
        },
        exerciseImage: {
            width: width * 0.5,
            height: width * 0.5,
            marginBottom: height * 0.02,
        },
    });

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
                        <TouchableOpacity
                            onPress={() => setModalVisible(true)}
                            style={styles.filterButton}
                        >
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
                                    <TouchableOpacity
                                        onPress={() => setModalVisible(false)}
                                        style={styles.closeButton}
                                    >
                                        <Text style={styles.closeButtonText}>Close</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        </Modal>

                        {filteredData &&
                            filteredData.slice(0, 10).map((exercise, index) => (
                                <TouchableOpacity
                                    key={index}
                                    onPress={() => handleCardPress(exercise)}
                                >
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
                                    <ScrollView
                                        contentContainerStyle={styles.modalScrollViewContent}
                                    >
                                        <Text style={styles.exerciseTitle}>
                                            {selectedExercise.name}
                                        </Text>
                                        <View style={styles.textContainer}>
                                            <Text style={styles.modalText}>
                                                Body Part: {selectedExercise.bodyPart}
                                            </Text>
                                            <Text style={styles.modalText}>
                                                Equipment: {selectedExercise.equipment}
                                            </Text>
                                            <Text style={styles.modalText}>
                                                Target: {selectedExercise.target}
                                            </Text>
                                            <Text style={styles.modalText}>
                                                Secondary Muscles:{' '}
                                                {selectedExercise.secondaryMuscles}
                                            </Text>
                                        </View>
                                        <Image
                                            source={{ uri: selectedExercise.gifUrl }}
                                            style={styles.exerciseImage}
                                        />
                                        <Text style={styles.modalText}>
                                            Instructions: {selectedExercise.instructions}
                                        </Text>
                                    </ScrollView>
                                    <TouchableOpacity
                                        onPress={closeDetailsModal}
                                        style={styles.closeButton}
                                    >
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
};

export default ExercisePage;
