import React, { useEffect, useState, useCallback } from 'react';
import { View, Alert, Button, Modal, Text, ScrollView, TouchableOpacity, Dimensions, Image } from 'react-native';
import axios from 'axios';
import { Calendar } from 'react-native-calendars';
import { LineChart } from 'react-native-chart-kit';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';
import moment from 'moment'; // Import moment.js for date handling

const { width: screenWidth, height: screenHeight } = Dimensions.get('window'); // Get screen dimensions

const ExerciseLogScreen = () => {
  const [logs, setLogs] = useState([]);
  const [selectedLogs, setSelectedLogs] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [calendarVisible, setCalendarVisible] = useState(false);
  const [graphModalVisible, setGraphModalVisible] = useState(false);
  const [exerciseModalVisible, setExerciseModalVisible] = useState(false);
  const [weeklyStatsModalVisible, setWeeklyStatsModalVisible] = useState(false);
  const [uniqueExerciseNames, setUniqueExerciseNames] = useState([]);
  const [selectedExerciseLogs, setSelectedExerciseLogs] = useState([]);
  const [weeklyLogs, setWeeklyLogs] = useState([]); // New state to store weekly logs
  const [markedDates, setMarkedDates] = useState({}); // State to store highlighted dates

  const fetchExerciseLog = async () => {
    try {
      const useremail = await AsyncStorage.getItem("useremail");
      const response = await axios.post('https://asimgymbackend.onrender.com/api/user/getExerciseLog', {
        email: useremail,
      });
      //console.log(response.data)
      console.log('Fetched Logs:', JSON.stringify(response.data, null, 2));
      setLogs(response.data.logs);
      extractUniqueExerciseNames(response.data.logs); // Extract unique exercise names
      filterLogsForCurrentWeek(response.data.logs); // Filter logs for the current week
      highlightExerciseDays(response.data.logs); // Highlight exercise days in the calendar
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

  const filterLogsForCurrentWeek = (logs) => {
    const startOfWeek = moment().startOf('isoWeek').toDate();
    const endOfWeek = moment().endOf('isoWeek').toDate();

    const filteredLogs = logs.filter(log => {
      const logDate = moment(log.date, ['M/D/YYYY', 'DD.MM.YYYY']).toDate();
      return logDate >= startOfWeek && logDate <= endOfWeek;
    });

    setWeeklyLogs(filteredLogs);
  };

  const highlightExerciseDays = (logs) => {
    const markedDates = {};
    logs.forEach(log => {
      const formattedDate = moment(log.date, ['M/D/YYYY', 'DD.MM.YYYY']).format('YYYY-MM-DD');
      markedDates[formattedDate] = {
        marked: true,
        dotColor: 'blue', // Add a blue dot to indicate exercise
        selected: true, // Highlight the day
        selectedColor: 'green', // Change the background color for highlighted days
      };
    });
    setMarkedDates(markedDates);
  };

  const handleDayPress = (day) => {
    const selectedDate = moment(day.dateString, 'YYYY-MM-DD').format('YYYY-MM-DD');

    const selectedDateLogs = logs.filter(log => {
      const logDate = moment(log.date, ['M/D/YYYY', 'DD.MM.YYYY']).format('YYYY-MM-DD');
      return logDate === selectedDate;
    });

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
    console.log('Exercise Logs:', filteredLogs);
  };

  const closeExerciseModal = () => {
    setExerciseModalVisible(false);
  };

  const handleWeeklyStatsButtonPress = () => {
    setWeeklyStatsModalVisible(true);
  };

  const closeWeeklyStatsModal = () => {
    setWeeklyStatsModalVisible(false);
  };

  const renderGraph = (label, data, yAxisSuffix) => {
    return (
      <ScrollView horizontal={true}>
        <LineChart
          data={{
            labels: data.map((_, index) => index + 1),
            datasets: [{ data }],
          }}
          width={Math.max(screenWidth, data.length * 60)} // Adjust width based on data length
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
    <View style={{ flex: 1, justifyContent: 'top', alignItems: 'center', marginVertical: 10 }}>
      <View style={{ width: screenWidth * 0.7, marginVertical: 10, borderRadius: 25 }}>
        <Button title="Calendar stats" onPress={() => setCalendarVisible(true)} />
      </View>

      <View style={{ width: screenWidth * 0.7, marginVertical: 10, borderRadius: 25 }}>
        <Button title="Graph stats" onPress={handleGraphButtonPress} />
      </View>

      <View style={{ width: screenWidth * 0.7, marginVertical: 10, borderRadius: 25 }}>
        <Button title="Weekly Stats" onPress={handleWeeklyStatsButtonPress} />
      </View>

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
            width: screenWidth * 0.9, 
            height: screenHeight * 0.7, 
            justifyContent: 'center', 
          }}>
            <Calendar
              onDayPress={handleDayPress}
              markedDates={markedDates} // Use the markedDates state to highlight exercise days
              style={{
                borderRadius: 10, 
                overflow: 'hidden', 
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
                backgroundColor: 'transparent',
              }}
            />
            <Button title="Close Calendar" onPress={() => setCalendarVisible(false)} />
          </View>
        </View>
      </Modal>

      {/* Log Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={closeLogModal}
      >
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <View style={{ backgroundColor: 'white', padding: 15, borderRadius: 10, width: screenWidth * 0.9, height: screenHeight * 0.7 }}>
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

      {/* Graph Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={graphModalVisible}
        onRequestClose={closeGraphModal}
      >
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <View style={{ backgroundColor: 'white', padding: 20, borderRadius: 10, width: screenWidth * 0.9, height: screenHeight * 0.5 }}>
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

      {/* Exercise Details Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={exerciseModalVisible}
        onRequestClose={closeExerciseModal}
      >
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <View style={{ backgroundColor: 'white', padding: 20, borderRadius: 10, width: screenWidth * 0.9, height: screenHeight * 0.7 }}>
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
                    {selectedExerciseLogs.some(log => log.exercises[exerciseName]?.sets !== undefined) && (
                      <>
                        <Text style={{ fontSize: 14 }}>Sets</Text>
                        {renderGraph(
                          'Sets',
                          selectedExerciseLogs.map(log => parseFloat(log.exercises[exerciseName]?.sets || 0)),
                          ''
                        )}
                      </>
                    )}

                    {/* Reps Graph */}
                    {selectedExerciseLogs.some(log => log.exercises[exerciseName]?.reps !== undefined) && (
                      <>
                        <Text style={{ fontSize: 14 }}>Reps</Text>
                        {renderGraph(
                          'Reps',
                          selectedExerciseLogs.map(log => parseFloat(log.exercises[exerciseName]?.reps || 0)),
                          ''
                        )}
                      </>
                    )}

                    {/* Weight Graph */}
                    {selectedExerciseLogs.some(log => log.exercises[exerciseName]?.weight !== undefined) && (
                      <>
                        <Text style={{ fontSize: 14 }}>Weight</Text>
                        {renderGraph(
                          'Weight',
                          selectedExerciseLogs.map(log => parseFloat(log.exercises[exerciseName]?.weight || 0)),
                          'kg'
                        )}
                      </>
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

      {/* Weekly Stats Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={weeklyStatsModalVisible}
        onRequestClose={closeWeeklyStatsModal}
      >
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <View style={{ backgroundColor: 'white', padding: 20, borderRadius: 10, width: screenWidth * 0.9, height: screenHeight * 0.7 }}>
            <Text style={{ fontSize: 18, marginBottom: 10 }}>Weekly Stats</Text>
            <ScrollView>
              {weeklyLogs.length > 0 ? (
                weeklyLogs.map((log, index) => (
                  <View key={index} style={{ marginBottom: 20 }}>
                    <Text style={{ fontWeight: 'bold' }}>Exercise: {log.exerciseName}</Text>
                    <Text>Duration: {log.duration}</Text>
                    <Text>Start Time: {log.startTime}</Text>
                    <Text>End Time: {log.endTime}</Text>
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
                <Text>No logs available for this week</Text>
              )}
            </ScrollView>
            <View style={{ marginVertical: 20 }}>
              <Button title="Close" onPress={closeWeeklyStatsModal} />
            </View>
          </View>
        </View>
      </Modal>

      <Image
        source={require('../pictures/fitnessstats.png')}
        style={{ width: screenWidth * 0.9, height: screenHeight * 0.5, marginTop: 90 }}
      />
    </View>
  );
};

export default ExerciseLogScreen;
