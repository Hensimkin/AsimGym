import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Card from '../components/TrainingCard'; // Adjust the import path as necessary
import { useNavigation } from '@react-navigation/native';
import axios from 'axios';

const ExerciseDetailPage = () => {
  const navigation = useNavigation();
  const [exercises, setExercises] = useState([]);
  const [exerciseDetails, setExerciseDetails] = useState({});

  useEffect(() => {
    const fetchExercises = async () => {
      try {
        const storedExercises = await AsyncStorage.getItem('newcustomexcersice');
        if (storedExercises) {
          setExercises(JSON.parse(storedExercises));
        }
      } catch (error) {
        console.error('Error fetching exercises:', error);
      }
    };

    fetchExercises();
  }, []);

  const handleInputChange = (exerciseName, field, value) => {
    setExerciseDetails((prevDetails) => ({
      ...prevDetails,
      [exerciseName]: {
        ...prevDetails[exerciseName],
        [field]: value,
      },
    }));
  };

  const handleSave = async () => {
    try {
      const userEmail = await AsyncStorage.getItem("useremail");
      const excersicename = await AsyncStorage.getItem("excersicename");
      
      // Set default values for empty fields
      const updatedExerciseDetails = { ...exerciseDetails };
      Object.keys(updatedExerciseDetails).forEach((exerciseName) => {
        const details = updatedExerciseDetails[exerciseName];
        updatedExerciseDetails[exerciseName] = {
          reps: details.reps || '0',
          weight: details.weight || '0',
          sets: details.sets || '0',
        };
      });

      const details = JSON.stringify(updatedExerciseDetails);
      console.log(details);
      const payload = {
        useremail: userEmail,
        excersicename: excersicename,
        payload: details,
      };

      const response = await axios.post('http://10.0.2.2:8000/api/user/updateExercises', payload);
      console.log(response);
      navigation.navigate("MainPage");
    } catch (error) {
      console.error('Error saving exercise details:', error);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {exercises.map((exercise, index) => (
        <View key={index} style={styles.exerciseContainer}>
          <Card title={exercise.name} description={exercise.bodyPart} image={exercise.gifUrl} />
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              placeholder="Reps"
              keyboardType="numeric"
              onChangeText={(value) => handleInputChange(exercise.name, 'reps', value)}
            />
            <TextInput
              style={styles.input}
              placeholder="Weight"
              keyboardType="numeric"
              onChangeText={(value) => handleInputChange(exercise.name, 'weight', value)}
            />
            <TextInput
              style={styles.input}
              placeholder="Sets"
              keyboardType="numeric"
              onChangeText={(value) => handleInputChange(exercise.name, 'sets', value)}
            />
          </View>
        </View>
      ))}
      <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
        <Text style={styles.saveButtonText}>Save</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
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
  saveButton: {
    backgroundColor: '#28a745',
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 20,
    width: '80%',
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 18,
  },
});

export default ExerciseDetailPage;
