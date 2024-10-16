import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
  TouchableHighlight,
  Modal,
  ScrollView,
  Dimensions,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import QuarterCircleOp from '../shapes/QuarterCircleOp';
import Arrow from 'react-native-arrow';
import Icon from 'react-native-vector-icons/FontAwesome';
import axios from 'axios';
import { useNavigation } from '@react-navigation/native';

const { width, height } = Dimensions.get('window');

const RegistrationPage = () => {
  const navigation = useNavigation();
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [hidePassword, setHidePassword] = useState(true);
  const [hideConfirmPassword, setHideConfirmPassword] = useState(true);
  const [buttonPressed, setButtonPressed] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [errorMessage2, setErrorMessage2] = useState('');
  const [acceptedPrivacyPolicy, setAcceptedPrivacyPolicy] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);

  const handleRegister = async () => {
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const passwordPattern = /^[a-zA-Z0-9]{8,}$/;

    setErrorMessage('');
    setErrorMessage2('');

    if (password !== confirmPassword) {
      setErrorMessage2('Passwords do not match.');
    } else if (!emailPattern.test(email) || !passwordPattern.test(password)) {
      if (!emailPattern.test(email)) {
        setErrorMessage('Invalid email format. Please enter a valid email address.');
      }
      if (!passwordPattern.test(password)) {
        setErrorMessage2('Password must be at least 8 characters long and contain only English letters.');
      }
      if (!username) {
        setErrorMessage('Please enter a username.');
      }
    } else {
      try {
        const exresponse = await axios.get('https://asimgymbackend.onrender.com/api/user/getExercises');
        const exercises = exresponse.data.exercises;
        await AsyncStorage.setItem('listofex', JSON.stringify(exercises));

        const response = await axios.post('https://asimgymbackend.onrender.com/api/user/create', {
          name: username,
          email: email,
          password: password,
        });

        if (response.data.message === 'User already exists') {
          setErrorMessage('User already exists. Please try a different email.');
        } else {
          await AsyncStorage.setItem('accessToken', response.data.token);
          await AsyncStorage.setItem('username', response.data.username);
          await AsyncStorage.setItem('semitoken', response.data.semitoken);
          await AsyncStorage.setItem('useremail', response.data.useremail);
          navigation.navigate('VerificationPage');
        }
      } catch (error) {
        console.error('Error registering user:', error);
      }
    }
  };

  const togglePasswordVisibility = () => {
    setHidePassword(!hidePassword);
  };

  const toggleConfirmPasswordVisibility = () => {
    setHideConfirmPassword(!hideConfirmPassword);
  };

  const onPressIn = () => {
    setButtonPressed(true);
  };

  const onPressOut = () => {
    setButtonPressed(false);
  };

  const goToLogin = () => {
    navigation.navigate('LoginPage');
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      style={styles.container}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : -200}
    >
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.innerContainer}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.navigate('HomePage')}
          >
            <Arrow name="ios-arrow-back" size={24} color="black" />
          </TouchableOpacity>
          <QuarterCircleOp style={styles.quarterCircleOp} />
          <Text style={styles.title}>Sign Up</Text>
          {errorMessage ? <Text style={styles.errorText}>{errorMessage}</Text> : null}
          {errorMessage2 ? <Text style={styles.errorText2}>{errorMessage2}</Text> : null}

          <TextInput
            style={styles.input}
            placeholder="Email"
            keyboardType="email-address"
            value={email}
            onChangeText={(text) => setEmail(text.toLowerCase())}
          />

          <TextInput
            style={styles.input}
            placeholder="Username"
            value={username}
            onChangeText={(text) => setUsername(text)}
          />

          <View style={styles.input}>
            <TextInput
              placeholder="Password"
              secureTextEntry={hidePassword}
              value={password}
              onChangeText={(text) => setPassword(text)}
              style={{ flex: 1 }}
            />
            <TouchableOpacity
              onPress={togglePasswordVisibility}
              style={styles.passwordVisibilityButton}
            >
              <Icon name={hidePassword ? 'eye-slash' : 'eye'} size={20} color="#000" />
            </TouchableOpacity>
          </View>

          <View style={styles.input}>
            <TextInput
              placeholder="Confirm Password"
              secureTextEntry={hideConfirmPassword}
              value={confirmPassword}
              onChangeText={(text) => setConfirmPassword(text)}
              style={{ flex: 1 }}
            />
            <TouchableOpacity
              onPress={toggleConfirmPasswordVisibility}
              style={styles.passwordVisibilityButton}
            >
              <Icon name={hideConfirmPassword ? 'eye-slash' : 'eye'} size={20} color="#000" />
            </TouchableOpacity>
          </View>

          <View style={styles.linkContainer}>
            <TouchableOpacity style={styles.loginLink} onPress={goToLogin}>
              <Text style={styles.loginText}>Already registered?</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.privacyPolicyButton}
              onPress={() => setModalVisible(true)}
            >
              <Text style={styles.privacyPolicyButtonText}>Privacy Policy</Text>
            </TouchableOpacity>
          </View>

          <TouchableHighlight
            style={[
              styles.button,
              buttonPressed && styles.buttonPressed,
              !acceptedPrivacyPolicy && styles.buttonDisabled,
            ]}
            onPress={handleRegister}
            underlayColor="#0066cc"
            onPressIn={onPressIn}
            onPressOut={onPressOut}
            disabled={!acceptedPrivacyPolicy}
          >
            <Text style={styles.buttonText}>Register</Text>
          </TouchableHighlight>

          {/* Added hint text below the Register button */}
          {!acceptedPrivacyPolicy && (
            <Text style={styles.hintText}>Please accept the privacy policy</Text>
          )}

          <Image source={require('../pictures/man_reg.png')} style={styles.image} />

          <Modal
            animationType="slide"
            transparent={false}
            visible={modalVisible}
            onRequestClose={() => {
              setModalVisible(!modalVisible);
            }}
          >
            <View style={styles.modalContainer}>
              <ScrollView contentContainerStyle={styles.modalContent}>
                <Text style={styles.modalTitle}>Privacy Policy</Text>
                <Text style={styles.modalText}>
                  {/* Privacy Policy Text */}
                  {`Privacy Policy for AsimGym App

AsimGym ("we", "us", or "our") is committed to protecting your privacy. This Privacy Policy explains how your personal information is collected, used, and disclosed by AsimGym.

This Privacy Policy applies to our application named AsimGym, which uses artificial intelligence to provide fitness-related services.

By accessing or using our Service, you signify that you have read, understood, and agree to our collection, storage, use, and disclosure of your personal information as described in this Privacy Policy.

**Information We Collect:**

1. **Personal Information:**
   - Name
   - Email address
   - Age
   - Gender
   - Fitness goals
   - Health data (e.g., weight, height, activity level)

2. **Usage Data:**
   - Log data
   - Device information
   - IP address
   - Cookies and similar tracking technologies

3. **AI Usage:**
   - Data input into the AI algorithms for personalized fitness recommendations.

**How We Use Your Information:**

- To personalize your experience.
- To provide and maintain our Service.
- To improve our Service.
- To monitor usage of our Service.
- To detect, prevent, and address technical issues.

**Data Security:**

We value your trust in providing us your Personal Information, thus we strive to use commercially acceptable means of protecting it.

**Data Sharing:**

We do not share your personal information with third parties except as described in this Privacy Policy.

**Your Choices:**

- You can access and update your personal information within the app.
- You can opt-out of receiving promotional emails.

**Children's Privacy:**

Our Service does not address anyone under the age of 13.

**Changes to This Privacy Policy:**

We may update our Privacy Policy from time to time.

**Contact Us:**

If you have any questions or suggestions about our Privacy Policy, do not hesitate to contact us at support@asimgym.com.`}
                </Text>
                <TouchableOpacity
                  style={styles.acceptButton}
                  onPress={() => {
                    setAcceptedPrivacyPolicy(true);
                    setModalVisible(false);
                  }}
                >
                  <Text style={styles.acceptButtonText}>Accept</Text>
                </TouchableOpacity>
              </ScrollView>
            </View>
          </Modal>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  scrollContainer: {
    flexGrow: 1,
  },
  innerContainer: {
    alignItems: 'center',
    paddingVertical: height * 0.05,
  },
  backButton: {
    alignSelf: 'flex-start',
    marginLeft: width * 0.05,
    marginBottom: height * 0.02,
    transform: [{ scaleX: -1 }],
  },
  quarterCircleOp: {
    marginBottom: height * 0.02,
  },
  title: {
    fontSize: height * 0.05,
    fontWeight: 'bold',
    marginBottom: height * 0.02,
  },
  errorText: {
    color: 'red',
    fontWeight: 'bold',
    marginBottom: height * 0.01,
  },
  errorText2: {
    color: 'red',
    fontWeight: 'bold',
    marginBottom: height * 0.01,
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
  passwordVisibilityButton: {
    padding: 5,
  },
  linkContainer: {
    flexDirection: 'row',
    width: '80%',
    justifyContent: 'space-between',
    marginTop: height * 0.015,
    marginBottom: height * 0.02,
  },
  loginText: {
    color: '#007bff',
    fontWeight: 'bold',
  },
  privacyPolicyButtonText: {
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
    width: '40%',
    marginTop: height * 0.02,
    transform: [{ scale: 1 }],
  },
  buttonPressed: {
    transform: [{ scale: 1.05 }],
  },
  buttonDisabled: {
    backgroundColor: '#A9A9A9',
  },
  buttonText: {
    color: '#fff',
    fontSize: height * 0.025,
    fontWeight: 'bold',
  },
  hintText: {
    color: 'red',
    fontSize: height * 0.02,
    marginTop: height * 0.01,
    textAlign: 'center',
  },
  image: {
    width: width * 0.7,
    height: height * 0.35,
    marginTop: height * 0.03,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: '#fff',
  },
  modalContent: {
    padding: width * 0.05,
  },
  modalTitle: {
    fontSize: height * 0.035,
    fontWeight: 'bold',
    marginBottom: height * 0.02,
  },
  modalText: {
    fontSize: height * 0.022,
    marginBottom: height * 0.02,
  },
  acceptButton: {
    backgroundColor: '#00BFFF',
    paddingVertical: height * 0.015,
    paddingHorizontal: width * 0.1,
    borderRadius: 5,
    alignSelf: 'center',
    marginTop: height * 0.02,
  },
  acceptButtonText: {
    color: '#fff',
    fontSize: height * 0.025,
    fontWeight: 'bold',
  },
});

export default RegistrationPage;
