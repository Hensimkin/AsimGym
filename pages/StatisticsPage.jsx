import React, { useEffect, useState, useCallback } from 'react';
import { View, Alert, Button, Modal, Text, ScrollView, TouchableOpacity, Dimensions } from 'react-native';
import axios from 'axios';
import { Calendar } from 'react-native-calendars';
import { LineChart } from 'react-native-chart-kit';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';

const ExerciseLogScreen = () => {
  const [logs, setLogs] = useState([]);
  const [selectedLogs, setSelectedLogs] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [calendarVisible, setCalendarVisible] = useState(false);
  const [graphModalVisible, setGraphModalVisible] = useState(false);
  const [exerciseModalVisible, setExerciseModalVisible] = useState(false);
  const [uniqueExerciseNames, setUniqueExerciseNames] = useState([]);
  const [selectedExerciseLogs, setSelectedExerciseLogs] = useState([]);

  const fetchExerciseLog = async () => {
    try {
      const useremail = await AsyncStorage.getItem("useremail");
      const response = await axios.post('http://10.0.2.2:8000/api/user/getExerciseLog', {
        email: useremail,
      });
      setLogs(response.data.logs);
      extractUniqueExerciseNames(response.data.logs); // Extract unique exercise names
    } catch (error) {
      console.error(error);
      Alert.alert('Error', 'Failed to fetch exercise logs');
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchExerciseLog();
    }, [])
  );

  const extractUniqueExerciseNames = (logs) => {
    const exerciseNamesSet = new Set();
    logs.forEach(log => {
      exerciseNamesSet.add(log.exerciseName);
    });
    setUniqueExerciseNames(Array.from(exerciseNamesSet));
  };

  const handleDayPress = (day) => {
    const [year, month, date] = day.dateString.split('-');
    const formattedDate = `${parseInt(month)}/${parseInt(date)}/${year}`;
  
    const selectedDateLogs = logs.filter(log => log.date === formattedDate);
    if (selectedDateLogs.length > 0) {
      setSelectedLogs(selectedDateLogs); // Set all logs for the selected date
      setCalendarVisible(false);
      setModalVisible(true);
    } else {
      Alert.alert('No Logs', 'No exercise logs found for the selected date');
    }
  };

  const closeLogModal = () => {
    setModalVisible(false);
    setCalendarVisible(true);
  };

  const handleGraphButtonPress = () => {
    setGraphModalVisible(true);
  };

  const closeGraphModal = () => {
    setGraphModalVisible(false);
  };

  const handleExercisePress = (exerciseName) => {
    const filteredLogs = logs.filter(log => log.exerciseName === exerciseName);
    setSelectedExerciseLogs(filteredLogs);
    setGraphModalVisible(false);
    setExerciseModalVisible(true);
  };

  const closeExerciseModal = () => {
    setExerciseModalVisible(false);
  };

  const renderGraph = (label, data, yAxisSuffix) => {
    return (
      <ScrollView horizontal={true}>
        <LineChart
          data={{
            labels: data.map((_, index) => index + 1),
            datasets: [{ data }],
          }}
          width={Math.max(Dimensions.get('window').width, data.length * 60)} // Adjust width based on data length
          height={220}
          yAxisSuffix={yAxisSuffix}
          chartConfig={{
            backgroundColor: '#e26a00',
            backgroundGradientFrom: '#fb8c00',
            backgroundGradientTo: '#ffa726',
            decimalPlaces: 2,
            color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
            labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
            style: { borderRadius: 16 },
            propsForDots: { r: '6', strokeWidth: '2', stroke: '#ffa726' },
          }}
          style={{ marginVertical: 8, borderRadius: 16 }}
        />
      </ScrollView>
    );
  };

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Button title="Open Calendar" onPress={() => setCalendarVisible(true)} />
      <Button title="Graph Button" onPress={handleGraphButtonPress} />

      <Modal
  animationType="slide"
  transparent={true}
  visible={calendarVisible}
  onRequestClose={() => setCalendarVisible(false)}
>
  <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.5)' }}>
    <View style={{
      backgroundColor: 'white', 
      padding: 20, 
      borderRadius: 10, 
      width: 350, 
      height: 400, // Increased height to ensure the calendar fits well
      justifyContent: 'center', // Center the content vertically
    }}>
      <Calendar
        onDayPress={handleDayPress}
        markedDates={
          logs.reduce((acc, log) => {
            acc[log.date] = { marked: true };
            return acc;
          }, {})
        }
        style={{
          borderRadius: 10, // Rounded corners for the calendar itself
          overflow: 'hidden', // Ensure rounded corners apply correctly
        }}
        theme={{
          todayTextColor: '#00adf5',
          arrowColor: 'blue',
          selectedDayBackgroundColor: '#00adf5',
          selectedDayTextColor: '#ffffff',
          textDayFontWeight: '500',
          textMonthFontWeight: 'bold',
          textDayHeaderFontWeight: 'bold',
          textDayFontSize: 16,
          textMonthFontSize: 18,
          textDayHeaderFontSize: 14,
          backgroundColor: 'transparent', // Transparent background for the calendar
        }}
      />
      <Button title="Close Calendar" onPress={() => setCalendarVisible(false)} />
    </View>
  </View>
</Modal>

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={closeLogModal}
      >
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <View style={{ backgroundColor: 'white', padding: 15, borderRadius: 10, width: 350, height: 400 }}>
            <ScrollView>
              {selectedLogs.length > 0 ? (
                selectedLogs.map((log, index) => (
                  <View key={index} style={{ marginBottom: 20 }}>
                    <Text style={{ fontWeight: 'bold' }}>Exercise: {log.exerciseName}</Text>
                    <Text>Duration: {log.duration}</Text>
                    <Text>Start Time: {log.startTime}</Text>
                    <Text>End Time: {log.endTime}</Text>
                    {/* Displaying exercises details */}
                    {Object.keys(log.exercises).map((exerciseName, index) => (
                      <View key={index}>
                        <Text>Exercise: {exerciseName}</Text>
                        <Text>Reps: {log.exercises[exerciseName].reps}</Text>
                        <Text>Weight: {log.exercises[exerciseName].weight}</Text>
                        <Text>Sets: {log.exercises[exerciseName].sets}</Text>
                      </View>
                    ))}
                  </View>
                ))
              ) : (
                <Text>No logs available</Text>
              )}
              <View style={{ marginVertical: 20 }}>
                <Button title="Close" onPress={closeLogModal} />
              </View>
            </ScrollView>
          </View>
        </View>
      </Modal>

      <Modal
        animationType="slide"
        transparent={true}
        visible={graphModalVisible}
        onRequestClose={closeGraphModal}
      >
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <View style={{ backgroundColor: 'white', padding: 20, borderRadius: 10, width: 350, height: 300 }}>
            <Text style={{ marginBottom: 10 }}>Select an Exercise:</Text>
            <ScrollView>
              {uniqueExerciseNames.map((exerciseName, index) => (
                <TouchableOpacity key={index} style={{ marginVertical: 5 }} onPress={() => handleExercisePress(exerciseName)}>
                  <Text style={{ fontSize: 18, color: 'blue' }}>{exerciseName}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
            <View style={{ marginVertical: 20 }}>
              <Button title="Close" onPress={closeGraphModal} />
            </View>
          </View>
        </View>
      </Modal>

      <Modal
        animationType="slide"
        transparent={true}
        visible={exerciseModalVisible}
        onRequestClose={closeExerciseModal}
      >
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <View style={{ backgroundColor: 'white', padding: 20, borderRadius: 10, width: 350, height: 400 }}>
            <ScrollView>
              {selectedExerciseLogs.length > 0 && (
                <>
                  <Text style={{ fontSize: 18, marginBottom: 10 }}>Graphs for {selectedExerciseLogs[0].exerciseName}</Text>

                  {/* Duration Graph */}
                  <Text style={{ fontSize: 16, marginTop: 10 }}>Duration (Time)</Text>
                  {renderGraph(
                    'Duration',
                    selectedExerciseLogs.map(log => parseFloat(log.duration)),
                    's'
                  )}

                  {/* Graphs for each exercise (sets, reps, weight) */}
                  {Object.keys(selectedExerciseLogs[0].exercises).map((exerciseName, index) => (
                    <View key={index}>
                      <Text style={{ fontSize: 16, marginTop: 10 }}>{exerciseName}</Text>

                      {/* Sets Graph */}
                      <Text style={{ fontSize: 14 }}>Sets</Text>
                      {renderGraph(
                        'Sets',
                        selectedExerciseLogs.map(log => parseFloat(log.exercises[exerciseName].sets)),
                        ''
                      )}

                      {/* Reps Graph */}
                      <Text style={{ fontSize: 14 }}>Reps</Text>
                      {renderGraph(
                        'Reps',
                        selectedExerciseLogs.map(log => parseFloat(log.exercises[exerciseName].reps)),
                        ''
                      )}

                      {/* Weight Graph */}
                      <Text style={{ fontSize: 14 }}>Weight</Text>
                      {renderGraph(
                        'Weight',
                        selectedExerciseLogs.map(log => parseFloat(log.exercises[exerciseName].weight)),
                        'kg'
                      )}
                    </View>
                  ))}
                </>
              )}
              <View style={{ marginVertical: 20 }}>
                <Button title="Close" onPress={closeExerciseModal} />
              </View>
            </ScrollView>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default ExerciseLogScreen;
