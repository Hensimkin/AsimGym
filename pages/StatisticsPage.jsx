import React, { useEffect, useState } from 'react';
import { View, Alert, Button, Modal } from 'react-native';
import axios from 'axios';
import { Calendar } from 'react-native-calendars';

const ExerciseLogScreen = () => {
  const [logs, setLogs] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);

  useEffect(() => {
    const fetchExerciseLog = async () => {
      try {
        const response = await axios.post('http://10.0.2.2:8000/api/user/getExerciseLog', {
          email: 'haniger22@gmail.com',
        });
        setLogs(response.data);
        console.log(response.data);
      } catch (error) {
        console.error(error);
        Alert.alert('Error', 'Failed to fetch exercise logs');
      }
    };

    fetchExerciseLog();
  }, []); // Empty dependency array means this effect runs once when the component mounts

  const handleDayPress = (day) => {
    // Handle day press, for example by showing logs for the selected day
    Alert.alert('Selected Date', `You selected ${day.dateString}`);
  };

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Button title="Open Calendar" onPress={() => setModalVisible(true)} />

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <View style={{ backgroundColor: 'white', padding: 20, borderRadius: 10, width: 300, height: 400 }}>
            <Calendar
              onDayPress={handleDayPress}
              markedDates={{
                // Add logic to mark dates where there are logs
              }}
            />
            <Button title="Close" onPress={() => setModalVisible(false)} />
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default ExerciseLogScreen;
