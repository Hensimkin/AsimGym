import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, Button, Image, ActivityIndicator } from 'react-native';
import QuarterCircle from '../shapes/QuarterCircle';
import CustomButton from '../components/CustomButton'
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import * as WebBrowser from "expo-web-browser";
import * as Google from "expo-auth-session/providers/google";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {useNavigation} from '@react-navigation/native';

//955645307335-irmnb2pjm0j6tehi938if1p7vkn28nn4.apps.googleusercontent.com

WebBrowser.maybeCompleteAuthSession();

export default function App() {
  const navigation = useNavigation();
  const [userInfo, setUserInfo] = React.useState(null);
  const [request, response, promptAsync] = Google.useAuthRequest({
    androidClientId: '955645307335-irmnb2pjm0j6tehi938if1p7vkn28nn4.apps.googleusercontent.com'
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuthentication = async () => {
      try {
        const token = await AsyncStorage.getItem('accessToken');
        console.log(token)
        if (token) {
          const email = await AsyncStorage.getItem('useremail');
          console.log(email)
          try {
            const response = await axios.post('http://10.0.2.2:8000/api/user/checkverify', {email: email});
            console.log(response.data.msg)

            const response2 = await axios.post('http://10.0.2.2:8000/api/user/checkstart', {email: email});

            if (response.data.msg === "true") { //verified
              //navigation.navigate('MainPage');
              if(response2.data.msg=="true") // started
              {
                navigation.navigate('MainPage');
              }
              else{
                navigation.navigate('FirstSettingsPage');
              }
            } else {
              navigation.navigate('VerificationPage');
            }
          }
          catch (error) {
            console.error('Error :', error);
          }
        }
        else {
          setLoading(false); // Set loading to false if token is null //change to false
        }
      } catch (error) {
        console.error('Error checking authentication:', error);
      }

    };
    checkAuthentication();
  }, []);


  const YOUR_CLIENT_ID = "955645307335-dq3jk2dpiuu1jvemhn31tgjm87uhmfc5.apps.googleusercontent.com"
  const YOUR_REDIRECT_URI = "https://8c44-2a10-8012-5-aa62-c4c2-85a0-b50c-2b08.ngrok-free.app/LoginPage"

  const handlePress = async () => {

    const result = await WebBrowser.openAuthSessionAsync(
      `https://accounts.google.com/o/oauth2/v2/auth?response_type=code&client_id=${YOUR_CLIENT_ID}&redirect_uri=${YOUR_REDIRECT_URI}&scope=https://www.googleapis.com/auth/userinfo.email%20https://www.googleapis.com/auth/userinfo.profile&access_type=offline&state=1234_purpleGoogle&prompt=consent`,
      YOUR_REDIRECT_URI
    );


    if (result.type === "success") {
      console.log("suc")
      // get back the params from the url
      const params = Linking.parse(result.url);

      const { email, name } = params.queryParams;

      //pass in all the user data in an object...
      const user = {
        email,
        name,
      };
    }
    console.log("fail")
    // navigate to the HomeScreen and pass the user object 
  };

  const handlePress2 = async () => {
    const hello = await AsyncStorage.getItem('accessToken');
    console.log(hello);
  };

  if (!loading) { // Render the main content when loading is false
    return (

      <View style={styles.container}>
        <QuarterCircle style={styles.quarterCircle} />
        <Image
          source={require('../pictures/gym_people.png')}
          style={styles.image}
        />
        <Image
          source={require('../pictures/Asim_logo.png')}
          style={styles.Asim_logo}
        />
        <View style={styles.buttonRow}>
          <CustomButton
            title="Continue with Email"
            icon={require('../pictures/email.png')}
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
  } else { // Render the loading indicator when loading is true
    return (
      <View style={[styles.container, styles.loadingContainer]}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  image: {
    width: 400, // Adjust width and height as needed
    height: 400,
    position: 'absolute',
    top: 200,
  },
  Asim_logo: {
    width: 200, // Adjust width and height as needed
    height: 130,
    position: 'absolute', // Set the position to absolute
    top: 70, // Adjust the top position as needed
  },
  buttonRow: {
    flexDirection: 'column',
    position: 'absolute', // Set the position to absolute
    bottom: 100,
  },
  buttonWrapper: {
    marginVertical: 5, // Adjust margin as needed for vertical separation
  },
  loadingContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.5)', // Semi-transparent background to dim the UI
  },
});
