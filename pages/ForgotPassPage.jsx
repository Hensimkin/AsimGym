import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, KeyboardAvoidingView, ScrollView, Dimensions } from 'react-native';
import axios from 'axios';
import Icon from 'react-native-vector-icons/FontAwesome';
import { useNavigation } from '@react-navigation/native';

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
    if (newPassword !== confirmPassword) {
      Alert.alert('Password Mismatch', 'The new password and confirm password do not match.');
      return;
    }

    try {
      const response = await axios.post('http://10.0.2.2:8000/api/user/forgotPassword', {
        email: email,
        password: newPassword,
      });
      if (response.data.message === 'Password updated successfully') {
        Alert.alert('Password Reset Successful', 'Your password has been reset. You can now log in with your new password.');
        navigation.navigate('LoginPage');
    } else {
        Alert.alert('Reset Failed', 'Unable to reset password. Please try again.');
    }
    } catch (error) {
      console.error('Error resetting password:', error);
      Alert.alert('Error', 'An error occurred while resetting the password. Please try again later.');
    }
  };

  return (
    <KeyboardAvoidingView style={styles.container} behavior="padding" keyboardVerticalOffset={0}>
      <ScrollView contentContainerStyle={styles.scrollContainer} style={{ width: '100%' }}>
        <View style={styles.insideView}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
            <Icon name="arrow-left" size={20} color="#000" />
          </TouchableOpacity>
          
          <Text style={styles.title}>Forgot Password</Text>

          <TextInput
            style={[styles.input, { marginTop: 20 }]}
            placeholder="Email"
            keyboardType="email-address"
            value={email}
            onChangeText={text => setEmail(text)}
          />

          <View style={[styles.input, { marginTop: 20 }]}>
            <TextInput
              placeholder="New Password"
              secureTextEntry={hidePassword}
              value={newPassword}
              onChangeText={text => setNewPassword(text)}
              style={{ flex: 1 }}
            />
            <TouchableOpacity onPress={togglePasswordVisibility} style={styles.passwordVisibilityButton}>
              <Icon name={hidePassword ? 'eye-slash' : 'eye'} size={20} color="#000" />
            </TouchableOpacity>
          </View>

          <View style={[styles.input, { marginTop: 20 }]}>
            <TextInput
              placeholder="Confirm New Password"
              secureTextEntry={hidePassword}
              value={confirmPassword}
              onChangeText={text => setConfirmPassword(text)}
              style={{ flex: 1 }}
            />
            <TouchableOpacity onPress={togglePasswordVisibility} style={styles.passwordVisibilityButton}>
              <Icon name={hidePassword ? 'eye-slash' : 'eye'} size={20} color="#000" />
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
    minHeight: Dimensions.get('window').height,
  },
  insideView: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
  },
  backButton: {
    position: 'absolute',
    top: 70,
    left: 20,
  },
  title: {
    fontWeight: 'bold',
    fontSize: 30,
    marginBottom: 40,
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
    alignItems: 'center',
  },
  passwordVisibilityButton: {
    marginLeft: 10,
  },
  button: {
    backgroundColor: '#00BFFF',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 30,
    width: '40%',
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});

export default ForgotPasswordPage;
