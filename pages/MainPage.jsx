import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  Switch,
  KeyboardAvoidingView,
  ScrollView,
  TouchableWithoutFeedback,
  Keyboard,
  Dimensions,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import NameCard from "../components/ExcersiceCard";
import axios from "axios";

const { width, height } = Dimensions.get("window");

const MainPage = () => {
  const navigation = useNavigation();
  const [isRegular, setIsRegular] = useState(false);
  const [username, setUsername] = useState("");
  const [buttonLabel, setButtonLabel] = useState("Start");
  const [buttonColor, setButtonColor] = useState("#008000");
  const [exerciseNames, setExerciseNames] = useState([]);

  const fetchUsername = async () => {
    try {
      const storedUsername = await AsyncStorage.getItem("username");
      if (storedUsername) {
        setUsername(storedUsername);
      }
    } catch (error) {
      console.error("Error fetching username from AsyncStorage:", error);
    }
  };

  const fetchExercises = async () => {
    try {
      const storedUserEmail = await AsyncStorage.getItem("useremail");
      const response = await axios.post(
        "https://asimgymbackend.onrender.com/api/user/getExcersicesNames",
        {
          email: storedUserEmail,
        }
      );
      setExerciseNames(response.data.exercisenames);
    } catch (error) {
      console.error("Error fetching data from backend:", error);
    }
  };

  useEffect(() => {
    fetchUsername();
    fetchExercises();
  }, []);

  useFocusEffect(
    useCallback(() => {
      fetchExercises();
    }, [])
  );

  const clearAsyncStorage = async () => {
    try {
      await AsyncStorage.clear();
      console.log("AsyncStorage cleared successfully.");
      navigation.navigate("HomePage");
    } catch (error) {
      console.error("Error clearing AsyncStorage:", error);
    }
  };

  const handleLogoutPress = () => {
    clearAsyncStorage();
  };

  const handleButtonPress = () => {
    navigation.navigate("Training Program");
  };

  const handleCardPress = (name) => {
    navigation.navigate("User Training Page", { exerciseName: name });
  };

  return (
    <KeyboardAvoidingView style={styles.container} behavior="padding">
      <ScrollView contentContainerStyle={styles.scrollView}>
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <View style={styles.inner}>
            {username ? (
              <Text style={styles.username}>Welcome, {username}!</Text>
            ) : null}

            <TouchableOpacity
              style={styles.logoutButton}
              onPress={handleLogoutPress}
            >
              <Text style={styles.logoutButtonText}>Logout</Text>
            </TouchableOpacity>

            <View style={styles.switchContainer}>
              <Text style={styles.label}>AI</Text>
              <Switch
                value={isRegular}
                onValueChange={(value) => setIsRegular(value)}
                thumbColor="#fff"
                trackColor={{ false: "#767577", true: "#81b0ff" }}
              />
              <Text style={styles.label}>Regular</Text>
            </View>

            <TouchableOpacity
              style={[styles.plusButton, { opacity: isRegular ? 1 : 0.5 }]}
              onPress={handleButtonPress}
              disabled={!isRegular}
            >
              <Text style={styles.plusButtonText}>+</Text>
            </TouchableOpacity>

            {isRegular ? (
              // Regular mode: Show regular exercise cards
              exerciseNames.map((name, index) => (
                <TouchableOpacity
                  key={index}
                  style={styles.cardContainer}
                  onPress={() => handleCardPress(name)}
                >
                  <NameCard name={name} />
                </TouchableOpacity>
              ))
            ) : (
              <TouchableOpacity
                style={styles.cardContainer}
                onPress={() => handleCardPress("AI Exercise")}
              >
                <NameCard name="AI Exercise" />
              </TouchableOpacity>
            )}
          </View>
        </TouchableWithoutFeedback>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  scrollView: {
    flexGrow: 1,
  },
  inner: {
    alignItems: "center",
    paddingVertical: height * 0.02,
  },
  username: {
    fontSize: height * 0.03,
    marginBottom: height * 0.02,
    fontWeight: "bold",
  },
  logoutButton: {
    backgroundColor: "#FF0000",
    borderRadius: 5,
    paddingVertical: height * 0.015,
    paddingHorizontal: width * 0.1,
    marginBottom: height * 0.03,
  },
  logoutButtonText: {
    color: "#fff",
    fontSize: height * 0.025,
    fontWeight: "bold",
  },
  switchContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: height * 0.02,
  },
  label: {
    fontSize: height * 0.025,
    marginHorizontal: width * 0.05,
  },
  plusButton: {
    backgroundColor: "#007AFF",
    borderRadius: width * 0.1,
    width: width * 0.2,
    height: width * 0.2,
    justifyContent: "center",
    alignItems: "center",
    marginVertical: height * 0.02,
  },
  plusButtonText: {
    color: "#fff",
    fontSize: height * 0.05,
    fontWeight: "bold",
  },
  cardContainer: {
    width: width * 0.9,
    marginVertical: height * 0.015,
  },
});

export default MainPage;
