import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, Button, Image, ActivityIndicator, Dimensions } from 'react-native';
import QuarterCircle from '../shapes/QuarterCircle';
import CustomButton from '../components/CustomButton';
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import * as WebBrowser from 'expo-web-browser';
import * as Google from 'expo-auth-session/providers/google';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import moment from 'moment-timezone';

WebBrowser.maybeCompleteAuthSession();

// Moved width and height outside the component
const { width, height } = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    // Remove justifyContent if using absolute positioning
  },
  image: {
    width: width * 0.9, // 90% of screen width
    height: height * 0.5, // 50% of screen height
    resizeMode: 'contain',
    position: 'absolute',
    top: height * 0.25, // Adjust as needed
  },
  Asim_logo: {
    width: width * 0.5, // 50% of screen width
    height: height * 0.15, // 15% of screen height
    resizeMode: 'contain',
    position: 'absolute',
    top: height * 0.05, // Adjust as needed
  },
  buttonRow: {
    flexDirection: 'column',
    position: 'absolute',
    bottom: height * 0.1, // 10% from the bottom
  },
  loadingContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default function App() {
  const [isNoonCentral, setIsNoonCentral] = useState(false);
  const navigation = useNavigation();
  const [userInfo, setUserInfo] = React.useState(null);
  const [request, response, promptAsync] = Google.useAuthRequest({
    androidClientId: '955645307335-irmnb2pjm0j6tehi938if1p7vkn28nn4.apps.googleusercontent.com',
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuthentication = async () => {
      try {
        const exresponse = await axios.get(
          'https://asimgymbackend.onrender.com/api/user/getExercises'
        );
        const exercises = exresponse.data.exercises;
        await AsyncStorage.setItem('listofex', JSON.stringify(exercises));

        const token = await AsyncStorage.getItem('accessToken');
        console.log(token);
        if (token) {
          const email = await AsyncStorage.getItem('useremail');
          console.log(email);
          try {
            const response = await axios.post(
              'https://asimgymbackend.onrender.com/api/user/checkverify',
              { email: email }
            );
            console.log(response.data.msg);

            const response2 = await axios.post(
              'https://asimgymbackend.onrender.com/api/user/checkstart',
              { email: email }
            );

            if (response.data.msg === 'true') {
              // verified
              if (response2.data.msg == 'true') {
                // started
                navigation.navigate('MainPage');
                setLoading(false);
              } else {
                navigation.navigate('FirstSettingsPage');
                setLoading(false);
              }
            } else {
              navigation.navigate('VerificationPage');
              setLoading(false);
            }
          } catch (error) {
            console.error('Error :', error);
          }
        } else {
          setLoading(false); // Set loading to false if token is null
        }
      } catch (error) {
        console.error('Error checking authentication:', error);
      }
    };
    checkAuthentication();

    const timeout = setTimeout(() => {
      setLoading(false); // Stop loading after 1 minute
    }, 60000);

    return () => clearTimeout(timeout);

  }, []);

  useEffect(() => {
    const checkTime = async () => {
      const now = moment();
      const centralTime = now.tz('America/Chicago'); // Central Time
      // Check if the current time in Central Time zone is 12:00 PM
      if (centralTime.format('HH:mm:ss') === '12:00:00') {
        const exresponse = await axios.get(
          'https://asimgymbackend.onrender.com/api/user/getExercises'
        );
        const exercises = exresponse.data.exercises;
        await AsyncStorage.setItem('listofex', JSON.stringify(exercises));
      }
    };

    const interval = setInterval(checkTime, 1000); // Check every second

    return () => clearInterval(interval); // Clean up on component unmount
  }, []);

  const YOUR_CLIENT_ID =
    '955645307335-dq3jk2dpiuu1jvemhn31tgjm87uhmfc5.apps.googleusercontent.com';
  const YOUR_REDIRECT_URI =
    'https://8c44-2a10-8012-5-aa62-c4c2-85a0-b50c-2b08.ngrok-free.app/LoginPage';

  const handlePress = async () => {
    const result = await WebBrowser.openAuthSessionAsync(
      `https://accounts.google.com/o/oauth2/v2/auth?response_type=code&client_id=${YOUR_CLIENT_ID}&redirect_uri=${YOUR_REDIRECT_URI}&scope=https://www.googleapis.com/auth/userinfo.email%20https://www.googleapis.com/auth/userinfo.profile&access_type=offline&state=1234_purpleGoogle&prompt=consent`,
      YOUR_REDIRECT_URI
    );

    if (result.type === 'success') {
      console.log('suc');
      // get back the params from the url
      const params = Linking.parse(result.url);

      const { email, name } = params.queryParams;

      // Pass in all the user data in an object...
      const user = {
        email,
        name,
      };
    }
    console.log('fail');
    // Navigate to the HomeScreen and pass the user object
  };

  const handlePress2 = async () => {
    const hello = await AsyncStorage.getItem('accessToken');
    console.log(hello);
  };

  if (!loading) {
    // Render the main content when loading is false
    return (
      <View style={styles.container}>
        <QuarterCircle style={styles.quarterCircle} />
        <Image source={require('../pictures/gym_people.png')} style={styles.image} />
        <Image source={require('../pictures/Asim_logo.png')} style={styles.Asim_logo} />
        <View style={styles.buttonRow}>
          <CustomButton
            title="Continue with Email"
            icon={require('../pictures/email.png')}
            onPress2="RegistrationPage"
            navigation={navigation}
          />
          <CustomButton title="Sign In" onPress2="LoginPage" navigation={navigation} />
        </View>
        <StatusBar style="auto" />
      </View>
    );
  } else {
    // Render the loading indicator when loading is true
    return (
      <View style={[styles.container, styles.loadingContainer]}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }
}
