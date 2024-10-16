import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  KeyboardAvoidingView,
  ScrollView,
  Dimensions,
} from 'react-native';
import axios from 'axios';
import Icon from 'react-native-vector-icons/FontAwesome';
import Arrow from 'react-native-arrow';
import { useNavigation } from '@react-navigation/native';

const { height, width } = Dimensions.get('window');

const ForgotPasswordPage = () => {
  const navigation = useNavigation();
  const [email, setEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [hidePassword, setHidePassword] = useState(true);

  const togglePasswordVisibility = () => {
    setHidePassword(!hidePassword);
  };

  const handleForgotPassword = async () => {
    const passwordPattern = /^[A-Za-z0-9]+$/;
    if (newPassword !== confirmPassword) {
      Alert.alert(
        'Password Mismatch',
        'The new password and confirm password do not match.'
      );
      return;
    }

    if (!passwordPattern.test(newPassword)) {
      Alert.alert(
        'Invalid Password',
        'Password can only contain lowercase letters, uppercase letters, and numbers.'
      );
      return;
    }
  
    if (newPassword.length < 8) {
      Alert.alert(
        'Password Too Short',
        'Password must be at least 8 characters long.'
      );
      return;
    }

    try {
      const response = await axios.post(
        'https://asimgymbackend.onrender.com/api/user/forgotPassword',
        {
          email: email,
          password: newPassword,
        }
      );
      if (response.data.message === 'Password updated successfully') {
        Alert.alert(
          'Password Reset Successful',
          'Your password has been reset. You can now log in with your new password.'
        );
        navigation.navigate('LoginPage');
      } else {
        Alert.alert('Reset Failed', response.data.message);
      }
    } catch (error) {
      console.error('Error resetting password:', error);
      Alert.alert(
        'Error',
        'An error occurred while resetting the password. Please try again later.'
      );
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior="padding"
      keyboardVerticalOffset={0}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContainer}
        style={{ width: '100%' }}
      >
        <View style={styles.insideView}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Arrow name="ios-arrow-back" size={24} color="black" />
          </TouchableOpacity>

          <Text style={styles.title}>Forgot Password</Text>

          <TextInput
            style={[styles.input, { marginTop: height * 0.02 }]}
            placeholder="Email"
            keyboardType="email-address"
            value={email}
            onChangeText={(text) => setEmail(text.toLowerCase())}
          />

          <View style={[styles.input, { marginTop: height * 0.02 }]}>
            <TextInput
              placeholder="New Password"
              secureTextEntry={hidePassword}
              value={newPassword}
              onChangeText={(text) => setNewPassword(text)}
              style={{ flex: 1 }}
            />
            <TouchableOpacity
              onPress={togglePasswordVisibility}
              style={styles.passwordVisibilityButton}
            >
              <Icon
                name={hidePassword ? 'eye-slash' : 'eye'}
                size={20}
                color="#000"
              />
            </TouchableOpacity>
          </View>

          <View style={[styles.input, { marginTop: height * 0.02 }]}>
            <TextInput
              placeholder="Confirm New Password"
              secureTextEntry={hidePassword}
              value={confirmPassword}
              onChangeText={(text) => setConfirmPassword(text)}
              style={{ flex: 1 }}
            />
            <TouchableOpacity
              onPress={togglePasswordVisibility}
              style={styles.passwordVisibilityButton}
            >
              <Icon
                name={hidePassword ? 'eye-slash' : 'eye'}
                size={20}
                color="#000"
              />
            </TouchableOpacity>
          </View>

          <TouchableOpacity style={styles.button} onPress={handleForgotPassword}>
            <Text style={styles.buttonText}>Reset Password</Text>
          </TouchableOpacity>
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
    minHeight: height,  // Using Dimensions for screen height
  },
  insideView: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
  },
  backButton: {
    position: 'absolute',
    top: height * 0.06,
    left: width * 0.05,
    transform: [{ scaleX: -1 }],
    zIndex: 1,
  },
  title: {
    fontWeight: 'bold',
    fontSize: width * 0.08, // Font size based on screen width
    marginBottom: height * 0.15, // Margin adjusted using height
  },
  input: {
    flexDirection: 'row',
    width: '80%',
    height: height * 0.06, // Height of input field relative to screen height
    borderColor: 'black',
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: width * 0.03, // Padding based on screen width
    marginBottom: height * 0.015, // Margin based on screen height
    alignItems: 'center',
  },
  passwordVisibilityButton: {
    marginLeft: width * 0.02, // Margin left adjusted by screen width
  },
  button: {
    backgroundColor: '#00BFFF',
    paddingVertical: height * 0.02, // Button padding adjusted using height
    paddingHorizontal: width * 0.1, // Button padding adjusted using width
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: height * 0.04, // Margin top adjusted by screen height
    width: '60%', // Width relative to screen width
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: width * 0.045, // Font size adjusted by screen width
  },
});

export default ForgotPasswordPage;
