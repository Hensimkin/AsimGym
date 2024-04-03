import React, { useState } from 'react';
import { View, Text, TextInput,TouchableHighlight, TouchableOpacity, StyleSheet,Image, KeyboardAvoidingView, ScrollView, TouchableWithoutFeedback,Dimensions } from 'react-native';
import QuarterCircle from '../shapes/QuarterCircle';
import Icon from 'react-native-vector-icons/FontAwesome'; // Import the eye icon
import Arrow from 'react-native-arrow';
import axios from 'axios';

const LoginScreen = ({navigation}) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [hidePassword, setHidePassword] = useState(true);
  const [buttonPressed, setButtonPressed] = useState(false);

  const handleLogin = async () => {
    try {
      const response = await axios.post('http://10.0.2.2:8000/api/user/login', {
        email: email,
        password: password,
      });
      console.log('User login response:', response.data);
      // Assuming you want to navigate to another screen upon successful registration
      navigation.navigate('VerificationPage');
    } catch (error) {
      console.error('Error login user:', error);
    }
  };

  const togglePasswordVisibility = () => {
    setHidePassword(!hidePassword);
  };

  const onPressIn = () => {
    setButtonPressed(true);
  };

  const onPressOut = () => {
    setButtonPressed(false);
  };

  const goToReg = () => {
    navigation.navigate('RegistrationPage'); // Assuming the screen name for the login page is 'Login'
  };

  return (
    <KeyboardAvoidingView style={styles.container} behavior="padding" keyboardVerticalOffset={0}>
      <ScrollView contentContainerStyle={styles.scrollContainer} style={{ width: '100%' }}>
        <TouchableWithoutFeedback>
          
          <View style={styles.insideView}>
            <QuarterCircle style={styles.quarterCircle}/>
            <TouchableOpacity style={styles.backButton} onPress={() => navigation.navigate('HomePage')}>
              <Arrow name="ios-arrow-back" size={24} color="black" />
            </TouchableOpacity>
            <Image
              source={require('../pictures/lady_login.png')} 
              style={styles.image}
            />
            <Text style={styles.title}>Login</Text>
            
            <TextInput
              style={[styles.input, { top: 500 }]}
              placeholder="Email"
              keyboardType="email-address"
              value={email}
              onChangeText={text => setEmail(text)}
            />

            <TouchableOpacity style={styles.loginLink} onPress={goToReg}>
              <Text style={styles.loginText}>Haven't signed yet ?</Text>
            </TouchableOpacity>
                  
            <View style={[styles.input, { top: 550 }]}>
              <TextInput
                placeholder="Password"
                secureTextEntry={hidePassword}
                value={password}
                onChangeText={text => setPassword(text)}
                style={{ flex: 1 }}
              />
              <TouchableOpacity onPress={togglePasswordVisibility} style={styles.passwordVisibilityButton}>
                <Icon name={hidePassword ? 'eye-slash' : 'eye'} size={20} color="#000" />
              </TouchableOpacity>
            </View>
            <TouchableHighlight 
              style={[styles.button, buttonPressed && styles.buttonPressed]} 
              onPress={handleLogin}
              underlayColor="#0066cc" // Change background color when pressed
              onPressIn={onPressIn}
              onPressOut={onPressOut}
            >
              <Text style={styles.buttonText}>Login</Text>
            </TouchableHighlight>
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
  title: {
    fontWeight: 'bold',
    fontSize: 50,
    color: '#ffffff',
    bottom:550
  },
  input: {
    flexDirection: 'row',
    width: '80%',
    height: 40,
    borderColor: 'black',
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: 10,
    position: 'absolute',
    color: 'black',
    fontWeight: 'bold',
    alignItems: 'center',
  },
  inputView: {
    width: '80%',
    backgroundColor: '#465881',
    borderRadius: 25,
    height: 50,
    marginBottom: 20,
    justifyContent: 'center',
    padding: 20,
  },
  inputText: {
    height: 50,
    color: 'white',
  },
  loginBtn: {
    width: '100%',
    backgroundColor: '#fb5b5a',
    borderRadius: 25,
    height: 50,
    bottom:0,
  },
  loginText: {
    color: 'white',
  },
  insideView: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    //backgroundColor: 'black',
    width: '100%',
  },
  image:{
    bottom:110,
    width:400,
    height:400,
  },
  button: {
    backgroundColor: '#00BFFF',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    top: 630,
    width:'40%',
    transform: [{ scale: 1 }],
  },
  buttonPressed: {
    transform: [{ scale: 1.05 }], // Expand the button when pressed
  },
  backButton: {
    top: 60,
    left: 30,
    flexDirection: 'row',
    alignItems: 'center',
    position: 'absolute',
    transform: [{ scaleX: -1 }],
  },
  loginText: {
    color: '#007bff',
    fontWeight: 'bold',
  },
  loginLink: {
    position: 'absolute',
    top: 600, // Adjust position as needed
  },
});

export default LoginScreen;
