import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableHighlight,
  TouchableOpacity,
  StyleSheet,
  Image,
  KeyboardAvoidingView,
  ScrollView,
  TouchableWithoutFeedback,
  Dimensions,
  Alert,
} from 'react-native';
import QuarterCircle from '../shapes/QuarterCircle';
import Icon from 'react-native-vector-icons/FontAwesome';
import Arrow from 'react-native-arrow';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';

const { width, height } = Dimensions.get('window');

const LoginScreen = () => {
  const navigation = useNavigation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [hidePassword, setHidePassword] = useState(true);
  const [buttonPressed, setButtonPressed] = useState(false);

  const handleLogin = async () => {
    try {
      const exresponse = await axios.get('https://asimgymbackend.onrender.com/api/user/getExercises');
      const exercises = exresponse.data.exercises;
      await AsyncStorage.setItem('listofex', JSON.stringify(exercises));

      const response = await axios.post('https://asimgymbackend.onrender.com/api/user/login', {
        email: email,
        password: password,
      });
      console.log(response.data.message);
      if (response.data.message !== 'true') {
        console.log(response.data.message);
        Alert.alert('Login Failed', 'Incorrect email or password. Please try again.');
        return;
      }
      await AsyncStorage.setItem('username', response.data.user_name);
      await AsyncStorage.setItem('useremail', email);
      console.log('User login response:', response.data);
      console.log(email);

      const accessToken = await axios.get(
        `https://asimgymbackend.onrender.com/api/user/getToken?email=${encodeURIComponent(email)}`
      );
      console.log(accessToken.data.accesstoken);
      await AsyncStorage.setItem('accessToken', accessToken.data.accesstoken);

      const checkVerifiedUser = await axios.post('https://asimgymbackend.onrender.com/api/user/checkverify', {
        email: email,
      });

      const response3 = await axios.post('https://asimgymbackend.onrender.com/api/user/checkstart', {
        email: email,
      });

      if (checkVerifiedUser.data.msg === 'true') {
        if (response3.data.msg == 'true') {
          navigation.navigate('MainPage');
        } else {
          navigation.navigate('FirstSettingsPage');
        }
      } else {
        navigation.navigate('VerificationPage');
      }
    } catch (error) {
      console.error('Error logging in user:', error);
      Alert.alert('Login Error', 'An error occurred during login. Please try again later.');
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
    navigation.navigate('RegistrationPage');
  };

  return (
    <KeyboardAvoidingView style={styles.container} behavior="padding" keyboardVerticalOffset={0}>
      <ScrollView contentContainerStyle={styles.scrollContainer} style={{ width: '100%' }}>
        <TouchableWithoutFeedback>
          <View style={styles.insideView}>
            <QuarterCircle style={styles.quarterCircle} />
            <TouchableOpacity style={styles.backButton} onPress={() => navigation.navigate('HomePage')}>
              <Arrow name="ios-arrow-back" size={24} color="black" />
            </TouchableOpacity>
            <Image source={require('../pictures/lady_login.png')} style={styles.image} />
            <Text style={styles.title}>Login</Text>

            <TextInput
              style={[styles.input, styles.emailInput]}
              placeholder="Email"
              keyboardType="email-address"
              value={email}
              onChangeText={text => setEmail(text.toLowerCase())}
            />

            <View style={styles.loginOptionsContainer}>
              <TouchableOpacity style={styles.loginLink} onPress={goToReg}>
                <Text style={styles.loginText}>Haven't signed up yet?</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.forgotPasswordLink}
                onPress={() => navigation.navigate('ForgotPassPage')}
              >
                <Text style={styles.forgotPasswordText}>Forgot password?</Text>
              </TouchableOpacity>
            </View>

            <View style={[styles.input, styles.passwordInput]}>
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
              underlayColor="#0066cc"
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
  },
  scrollContainer: {
    flexGrow: 1,
    minHeight: height,
  },
  insideView: {
    flex: 1,
    alignItems: 'center',
    width: '100%',
  },
  backButton: {
    position: 'absolute',
    top: height * 0.06,
    left: width * 0.05,
    transform: [{ scaleX: -1 }],
    zIndex: 1,
  },
  quarterCircle: {
    position: 'absolute',
    top: height * 0.1,
  },
  image: {
    width: width * 0.75,
    height: height * 0.45,
    position: 'absolute',
    top: height * 0.15,
    alignSelf: 'center',
  },
  title: {
    fontWeight: 'bold',
    fontSize: height * 0.06,
    color: '#ffffff',
    position: 'absolute',
    top: height * 0.06,
    alignSelf: 'center',
  },
  input: {
    flexDirection: 'row',
    width: '80%',
    height: height * 0.06,
    borderColor: 'black',
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    alignItems: 'center',
    marginBottom: height * 0.015,
  },
  emailInput: {
    position: 'absolute',
    top: height * 0.5,
    alignSelf: 'center',
  },
  passwordInput: {
    position: 'absolute',
    top: height * 0.58,
    alignSelf: 'center',
  },
  passwordVisibilityButton: {
    padding: 5,
  },
  loginOptionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '80%',
    position: 'absolute',
    top: height * 0.66,
  },
  loginLink: {},
  loginText: {
    color: '#007bff',
    fontWeight: 'bold',
  },
  forgotPasswordLink: {},
  forgotPasswordText: {
    color: '#007bff',
    fontWeight: 'bold',
  },
  button: {
    backgroundColor: '#00BFFF',
    paddingVertical: height * 0.015,
    paddingHorizontal: width * 0.1,
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    top: height * 0.74,
    alignSelf: 'center',
    width: '40%',
    transform: [{ scale: 1 }],
  },
  buttonPressed: {
    transform: [{ scale: 1.05 }],
  },
});

export default LoginScreen;
