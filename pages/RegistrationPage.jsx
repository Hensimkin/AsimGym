import React, { useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
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
} from 'react-native';
import QuarterCircleOp from '../shapes/QuarterCircleOp';
import Arrow from 'react-native-arrow';
import Icon from 'react-native-vector-icons/FontAwesome'; // Import the eye icon
import axios from 'axios';
import { useNavigation } from '@react-navigation/native';

const RegistrationPage = () => {
  const navigation = useNavigation();
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState(''); // New state for confirming password
  const [hidePassword, setHidePassword] = useState(true);
  const [hideConfirmPassword, setHideConfirmPassword] = useState(true); // State for hiding confirm password
  const [buttonPressed, setButtonPressed] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [errorMessage2, setErrorMessage2] = useState('');
  const [acceptedPrivacyPolicy, setAcceptedPrivacyPolicy] = useState(false); // State for privacy policy acceptance
  const [modalVisible, setModalVisible] = useState(false); // State for modal visibility

  const handleRegister = async () => {
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const passwordPattern = /^[a-zA-Z0-9]{8,}$/;

    if (password !== confirmPassword) {
      setErrorMessage2('Passwords do not match.');
    } else if (!emailPattern.test(email) || !passwordPattern.test(password)) {
      if (!emailPattern.test(email)) {
        setErrorMessage('Invalid email format. Please enter a valid email address.');
      }
      if (!passwordPattern.test(password)) {
        setErrorMessage2('Password must be at least 8 characters long and contain only English letters.');
      }
    } else {
      try {
        const exresponse = await axios.get('http://10.0.2.2:8000/api/user/getExercises');
        const exercises = exresponse.data.exercises;
        await AsyncStorage.setItem('listofex', JSON.stringify(exercises));

        const response = await axios.post('http://10.0.2.2:8000/api/user/create', {
          name: username,
          email: email,
          password: password,
        });

        if (response.data.message === 'User already exists') {
          setErrorMessage('User already exists. Please try a different email.');
        } else {
          await AsyncStorage.setItem('accessToken', response.data.token); // users token for session
          await AsyncStorage.setItem('username', response.data.username); // users name
          await AsyncStorage.setItem('semitoken', response.data.semitoken); // for user verification
          await AsyncStorage.setItem('useremail', response.data.useremail); // users email
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
    <View style={styles.container}>
      <TouchableOpacity style={styles.backButton} onPress={() => navigation.navigate('HomePage')}>
        <Arrow name="ios-arrow-back" size={24} color="black" />
      </TouchableOpacity>
      <QuarterCircleOp style={styles.quarterCircleOp} />
      <Image source={require('../pictures/man_reg.png')} style={styles.image} />
      <Text style={styles.title}>Sign Up</Text>
      {errorMessage ? <Text style={styles.errorText}>{errorMessage}</Text> : null}
      {errorMessage2 ? <Text style={styles.errorText2}>{errorMessage2}</Text> : null}

      <TextInput
        style={[styles.input, { top: 230 }]}
        placeholder="Email"
        keyboardType="email-address"
        value={email}
        onChangeText={text => setEmail(text)}
      />

      <TextInput
        style={[styles.input, { top: 280 }]}
        placeholder="Username"
        value={username}
        onChangeText={text => setUsername(text)}
      />

      <View style={[styles.input, { top: 330 }]}>
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

      {/* Confirm Password Input */}
      <View style={[styles.input, { top: 380 }]}>
        <TextInput
          placeholder="Confirm Password"
          secureTextEntry={hideConfirmPassword}
          value={confirmPassword}
          onChangeText={text => setConfirmPassword(text)}
          style={{ flex: 1 }}
        />
        <TouchableOpacity onPress={toggleConfirmPasswordVisibility} style={styles.passwordVisibilityButton}>
          <Icon name={hideConfirmPassword ? 'eye-slash' : 'eye'} size={20} color="#000" />
        </TouchableOpacity>
      </View>

      {/* Link Container for Already Registered and Privacy Policy */}
      <View style={styles.linkContainer}>
        <TouchableOpacity style={styles.loginLink} onPress={goToLogin}>
          <Text style={styles.loginText}>Already registered?</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.privacyPolicyButton} onPress={() => setModalVisible(true)}>
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

      {/* Privacy Policy Modal */}
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
  );
};

const styles = StyleSheet.create({
  // ... [existing styles remain unchanged]
  buttonDisabled: {
    backgroundColor: '#A9A9A9', // grey color for disabled button
  },
  linkContainer: {
    flexDirection: 'row',
    position: 'absolute',
    top: 430, // adjust position as needed
    justifyContent: 'center',
    alignItems: 'center',
  },
  loginLink: {
    marginRight: 20, // spacing between the two links
  },
  loginText: {
    color: '#007bff',
    fontWeight: 'bold',
  },
  privacyPolicyButton: {
    // marginLeft: 20, // if needed
  },
  privacyPolicyButtonText: {
    color: '#007bff',
    fontWeight: 'bold',
  },
  modalContainer: {
    flex: 1,
    backgroundColor: '#fff',
  },
  modalContent: {
    padding: 20,
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  modalText: {
    fontSize: 16,
    marginBottom: 20,
  },
  acceptButton: {
    backgroundColor: '#00BFFF',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    alignSelf: 'center',
  },
  acceptButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  // ... [other styles remain unchanged]
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  errorText: {
    color: 'red',
    marginBottom: 20,
    position: 'absolute',
    top: 175,
    fontWeight: 'bold',
  },
  errorText2: {
    color: 'red',
    marginBottom: 20,
    position: 'absolute',
    top: 190,
    fontWeight: 'bold',
  },
  title: {
    fontSize: 50,
    fontWeight: 'bold',
    marginBottom: 20,
    position: 'absolute',
    top: 110,
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
  button: {
    backgroundColor: '#00BFFF',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    top: 460,
    width: '40%',
    transform: [{ scale: 1 }],
  },
  buttonPressed: {
    transform: [{ scale: 1.05 }],
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  image: {
    width: 300,
    height: 300,
    position: 'absolute',
    top: 500,
  },
  backButton: {
    top: 60,
    left: 30,
    flexDirection: 'row',
    alignItems: 'center',
    position: 'absolute',
    transform: [{ scaleX: -1 }],
  },
  quarterCircleOp: {
    position: 'absolute',
    top: 100,
  },
  passwordVisibilityButton: {
    padding: 5,
  },
});

export default RegistrationPage;
