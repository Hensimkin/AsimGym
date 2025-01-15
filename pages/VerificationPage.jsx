import React, { useState } from 'react';
import { View, TextInput, Button, StyleSheet, Image, TouchableOpacity, ScrollView, KeyboardAvoidingView, Dimensions, Text } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { useNavigation } from '@react-navigation/native';

const { width, height } = Dimensions.get('window');

const VerificationPage = () => {
  const navigation = useNavigation();
  const [verificationCode, setVerificationCode] = useState('');
  const [errorMessage, setErrorMessage] = useState(''); // Error message state

  const handleVerify = async () => { //verify
    try {
      console.log("sup", verificationCode)
      const semitoken = await AsyncStorage.getItem('semitoken');
      const semitoken2 = await AsyncStorage.getItem('semitoken');
      console.log('Semi token from localStorage:', semitoken2);
      if (semitoken === verificationCode) {
        console.log("succ")
        const email = await AsyncStorage.getItem('useremail');
        console.log('email', email)
        try {
          console.log("hi")
          const response = await axios.post('https://asimgymbackend.onrender.com/api/user/verify', {
            email: email
          });
          console.log("msgggg", response.data.msg)
          if (response.data.msg === "true") {
            console.log("hi2")
            navigation.navigate('FirstSettingsPage');
          } else {
            setErrorMessage('Verification failed. Please try again.');
            console.log("Verification failed");
          }
        }
        catch (error) {
          console.error('Error :', error);
        }

      } else {
        setErrorMessage('The verification code is incorrect.');
      }
    }
    catch (error) {
      console.error('Error :', error);
    }
  };

  const handleResendCode = async () => { //resend of vercode
    try {
      const email = await AsyncStorage.getItem('useremail');
      console.log('email', email)
      const resendedCode = await axios.post('https://asimgymbackend.onrender.com/api/user/resendMail', {
        email: email,
      })
      const semitoken = resendedCode.data.semitoken;
      console.log(semitoken)
      await AsyncStorage.setItem('semitoken', semitoken);
      const keys = await AsyncStorage.getAllKeys();
      console.log('AsyncStorage Keys:', keys);
    } catch (error) {
      console.error('Error :', error);
    }
  };

  return (
    <KeyboardAvoidingView style={styles.container} behavior="padding" keyboardVerticalOffset={0}>
      <ScrollView contentContainerStyle={styles.scrollContainer} style={{ width: '100%' }}>
        <View style={styles.insideView}>
          <Image
            source={require('../pictures/Authentication.png')}
            style={styles.image}
          />
          <TextInput
            style={styles.input}
            placeholder="Enter code"
            onChangeText={text => setVerificationCode(text)}
          />
          {errorMessage ? ( // Conditionally render error message if it exists
            <Text style={styles.errorText}>{errorMessage}</Text>
          ) : null}
          <View style={styles.buttonContainer}>
            <Button
              title="Verify"
              onPress={handleVerify}
              color="#00BFFF"
            />
            {/* TouchableOpacity for larger "Resend Code" button */}
            <TouchableOpacity style={styles.resendButton} onPress={handleResendCode}>
              <Text style={styles.resendButtonText}>Haven't got the code yet?</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  scrollContainer: {
    flexGrow: 1,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: height,
  },
  insideView: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
  },
  input: {
    flexDirection: 'row',
    width: width * 0.8,
    height: height * 0.05,
    borderColor: 'black',
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: height * 0.02,
    color: 'black',
    fontWeight: 'bold',
    alignItems: 'center',
  },
  image: {
    width: width * 0.9,
    height: height * 0.4,
    marginBottom: height * 0.15,
  },
  buttonContainer: {
    marginTop: height * 0.01,
    alignItems: 'center',
  },
  errorText: {
    color: 'red',
    marginBottom: height * 0.01,
    fontWeight: 'bold',
  },
  resendButton: {
    backgroundColor: '#007BFF',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    marginTop: height * 0.02,
  },
  resendButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});

export default VerificationPage;
