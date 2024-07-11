import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, ScrollView, Switch, Image, TouchableOpacity, StyleSheet, Button } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import muscleImages from '../data/muscleImages'; // Import the images

const FitnessDetails = () => {
  const [height, setHeight] = useState('160');
  const [weight, setWeight] = useState('70');
  const [gender, setGender] = useState('man');
  const [age, setAge] = useState('');
  const [fitnessLevel, setFitnessLevel] = useState('Beginner');
  const [goal, setGoal] = useState('Lose Weight');
  const [selectedMuscles, setSelectedMuscles] = useState([]);
  const [isFormValid, setIsFormValid] = useState(false);

  const muscleGroups = [
    'all', 'back', 'biceps', 'cardio', 'chest', 'forearms', 'lower_legs', 'neck', 'shoulders', 'triceps','upper_legs','waist'
  ];

  useEffect(() => {
    if (age && selectedMuscles.length > 0 && height && weight) {
      setIsFormValid(true);
    } else {
      setIsFormValid(false);
    }
  }, [age, selectedMuscles, height, weight]);

  const toggleMuscleSelection = (muscle) => {
    if (muscle === 'Full Body') {
      setSelectedMuscles(muscleGroups);
    } else {
      if (selectedMuscles.includes(muscle)) {
        setSelectedMuscles(selectedMuscles.filter(item => item !== muscle));
      } else {
        setSelectedMuscles([...selectedMuscles, muscle]);
      }
    }
  };

  const handleDone = () => {
    // Handle the done action, such as saving data or navigating to another screen
    console.log('Details saved:', { height, weight, gender, age, fitnessLevel, goal, selectedMuscles });
  };

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
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
          <Text>Man</Text>
          <Switch
            value={gender === 'woman'}
            onValueChange={() => setGender(gender === 'man' ? 'woman' : 'man')}
          />
          <Text>Woman</Text>
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
          { backgroundColor: isFormValid ? '#007AFF' : '#A9A9A9' }
        ]}
        onPress={handleDone}
        disabled={!isFormValid}
      >
        <Text style={styles.doneButtonText}>Done</Text>
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

export default FitnessDetails;
