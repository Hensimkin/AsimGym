import React, { useState } from 'react';
import { View, TextInput, Button, StyleSheet, Image, TouchableWithoutFeedback, ScrollView, KeyboardAvoidingView, Dimensions, Text } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import {useNavigation} from '@react-navigation/native';

const VerificationPage = () => {
  const navigation = useNavigation();
  const [verificationCode, setVerificationCode] = useState('');

  const handleVerify = async ()  => { //verify
    try{
      console.log("sup",verificationCode)
      const semitoken = await AsyncStorage.getItem('semitoken');
      const semitoken2 = await AsyncStorage.getItem('semitoken');
      console.log('Semi token from localStorage:', semitoken2);  
      if (semitoken===verificationCode)
      {
        console.log("succ")
        const email = await AsyncStorage.getItem('useremail');
        console.log('email',email)
        try{
          console.log("hi")
          const response = await axios.post('https://asimgymbackend.onrender.com/api/user/verify', {
            email: email});
            console.log("msgggg",response.data.msg)
            if (response.data.msg === "true") {
              console.log("hi2")
              navigation.navigate('FirstSettingsPage');
            } else {
              navigation.navigate('VerificationPage');
            }
        }
        catch{
          console.error('Error :', error);
        }
        
      }
    }
    catch{
      console.error('Error :', error);
    }
  };

  const handleResendCode = async() => { //resend of vercode
    try{
      const email = await AsyncStorage.getItem('userEmail');
      const resendedCode = await axios.post('https://asimgymbackend.onrender.com/api/user/resendMail',{
        email: email,})
      const semitoken = resendedCode.data.semitoken;
      console.log(semitoken)
      await AsyncStorage.setItem('semitoken', semitoken);
      const keys = await AsyncStorage.getAllKeys();
        console.log('AsyncStorage Keys:', keys);
    }catch{
      console.error('Error :', error);
    }
  };

  //cleaning async storage
  const clearAsyncStorage = async () => {
    try {
      await AsyncStorage.clear();
      console.log('AsyncStorage cleared successfully.');
    } catch (error) {
      console.error('Error clearing AsyncStorage:', error);
    }
  };

  return (
    <KeyboardAvoidingView style={styles.container} behavior="padding" keyboardVerticalOffset={0}>
      <ScrollView contentContainerStyle={styles.scrollContainer} style={{ width: '100%' }}>
        <TouchableWithoutFeedback>
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
            <View style={styles.buttonContainer}>
              <Button
                title="Verify"
                onPress={handleVerify}
                color="#00BFFF"
              />
              <Text style={styles.resendText} onPress={handleResendCode}>Haven't got the code yet?</Text>
            </View>
          </View>
        </TouchableWithoutFeedback>
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
    minHeight: Dimensions.get('window').height,
  },

  insideView: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
  },
  input: {
    flexDirection: 'row',
    width: '80%',
    height: 40,
    borderColor: 'black',
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: 20, // Adjusted marginBottom
    color: 'black',
    fontWeight: 'bold',
    alignItems: 'center',
  },
  image: {
    bottom: 180,
    width: 350,
    height: 350,
    marginBottom:-150,
  },
  resendText: {
    marginTop: 10,
    color: 'blue',
  },
  buttonContainer: {
    marginTop: 10, // Adjusted marginTop
    alignItems: 'center', // Center the button horizontally
  },
});

export default VerificationPage;
