import { StatusBar } from "expo-status-bar";
import {
  StyleSheet,
  Text,
  View,
  Button,
  Image,
  ActivityIndicator,
  Dimensions,
} from "react-native";
import QuarterCircle from "../shapes/QuarterCircle";
import CustomButton from "../components/CustomButton";
import React, { useState, useEffect } from "react";
import axios from "axios";
import * as WebBrowser from "expo-web-browser";
import * as Google from "expo-auth-session/providers/google";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";
import moment from "moment-timezone";

WebBrowser.maybeCompleteAuthSession();

const { width, height } = Dimensions.get("window");

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
  },
  image: {
    width: width * 0.9,
    height: height * 0.5,
    resizeMode: "contain",
    position: "absolute",
    top: height * 0.25,
  },
  Asim_logo: {
    width: width * 0.5,
    height: height * 0.15,
    resizeMode: "contain",
    position: "absolute",
    top: height * 0.05,
  },
  buttonRow: {
    flexDirection: "column",
    position: "absolute",
    bottom: height * 0.1,
  },
  loadingContainer: {
    justifyContent: "center",
    alignItems: "center",
  },
});

export default function App() {
  const [isNoonCentral, setIsNoonCentral] = useState(false);
  const navigation = useNavigation();
  const [userInfo, setUserInfo] = React.useState(null);
  const [request, response, promptAsync] = Google.useAuthRequest({
    androidClientId:
      "955645307335-irmnb2pjm0j6tehi938if1p7vkn28nn4.apps.googleusercontent.com",
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuthentication = async () => {
      try {
        const exresponse = await axios.get(
          "https://asimgymbackend.onrender.com/api/user/getExercises"
        );
        const exercises = exresponse.data.exercises;
        await AsyncStorage.setItem("listofex", JSON.stringify(exercises));

        const token = await AsyncStorage.getItem("accessToken");
        console.log(token);
        if (token) {
          const email = await AsyncStorage.getItem("useremail");
          console.log(email);
          try {
            const response = await axios.post(
              "https://asimgymbackend.onrender.com/api/user/checkverify",
              { email: email }
            );
            console.log(response.data.msg);

            const response2 = await axios.post(
              "https://asimgymbackend.onrender.com/api/user/checkstart",
              { email: email }
            );

            if (response.data.msg === "true") {
              if (response2.data.msg == "true") {
                navigation.navigate("MainPage");
                setLoading(false);
              } else {
                navigation.navigate("FirstSettingsPage");
                setLoading(false);
              }
            } else {
              navigation.navigate("VerificationPage");
              setLoading(false);
            }
          } catch (error) {
            console.error("Error :", error);
          }
        } else {
          setLoading(false); 
        }
      } catch (error) {
        console.error("Error checking authentication:", error);
      }
    };
    checkAuthentication();

    const timeout = setTimeout(() => {
      setLoading(false); 
    }, 60000);

    return () => clearTimeout(timeout);
  }, []);

  useEffect(() => {
    const checkTime = async () => {
      const now = moment();
      const centralTime = now.tz("America/Chicago");
      if (centralTime.format("HH:mm:ss") === "12:00:00") {
        const exresponse = await axios.get(
          "https://asimgymbackend.onrender.com/api/user/getExercises"
        );
        const exercises = exresponse.data.exercises;
        await AsyncStorage.setItem("listofex", JSON.stringify(exercises));
      }
    };

    const interval = setInterval(checkTime, 1000);

    return () => clearInterval(interval);
  }, []);

  if (!loading) {
    return (
      <View style={styles.container}>
        <QuarterCircle style={styles.quarterCircle} />
        <Image
          source={require("../pictures/gym_people.png")}
          style={styles.image}
        />
        <Image
          source={require("../pictures/Asim_logo.png")}
          style={styles.Asim_logo}
        />
        <View style={styles.buttonRow}>
          <CustomButton
            title="Continue with Email"
            icon={require("../pictures/email.png")}
            onPress2="RegistrationPage"
            navigation={navigation}
          />
          <CustomButton
            title="Sign In"
            onPress2="LoginPage"
            navigation={navigation}
          />
        </View>
        <StatusBar style="auto" />
      </View>
    );
  } else {
    return (
      <View style={[styles.container, styles.loadingContainer]}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }
}
