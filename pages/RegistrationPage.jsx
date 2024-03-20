import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image ,TouchableHighlight} from 'react-native';
import QuarterCircleOp from '../shapes/QuarterCircleOp';
import Arrow from 'react-native-arrow';
import Icon from 'react-native-vector-icons/FontAwesome'; // Import the eye icon

const RegistrationPage = ({ navigation }) => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [hidePassword, setHidePassword] = useState(true);
  const [buttonPressed, setButtonPressed] = useState(false);

  const handleRegister = () => {
    console.log('Registering...');
    console.log('Username:', username);
    console.log('Email:', email);
    console.log('Password:', password);
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

  const goToLogin = () => {
    navigation.navigate('LoginPage'); // Assuming the screen name for the login page is 'Login'
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.backButton} onPress={() => navigation.navigate('HomePage')}>
        <Arrow name="ios-arrow-back" size={24} color="black" />
      </TouchableOpacity>
      <QuarterCircleOp style={styles.quarterCircleOp} />
      <Image
        source={require('../pictures/man_reg.png')}
        style={styles.image}
      />
      <Text style={styles.title}>Sign Up</Text>
      <TextInput
        style={[styles.input, { top: 270 }]}
        placeholder="Email"
        keyboardType="email-address"
        value={email}
        onChangeText={text => setEmail(text)}
      />

      <TextInput
        style={[styles.input, { top: 320 }]}
        placeholder="Username"
        value={username}
        onChangeText={text => setUsername(text)}
      />

      <View style={[styles.input, { top: 370 }]}>
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

      <TouchableOpacity style={styles.loginLink} onPress={goToLogin}>
        <Text style={styles.loginText}>Already registered?</Text>
      </TouchableOpacity>

      <TouchableHighlight 
        style={[styles.button, buttonPressed && styles.buttonPressed]} 
        onPress={handleRegister}
        underlayColor="#0066cc" // Change background color when pressed
        onPressIn={onPressIn}
        onPressOut={onPressOut}
      >
        <Text style={styles.buttonText}>Register</Text>
      </TouchableHighlight>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 50,
    fontWeight: 'bold',
    marginBottom: 20,
    position: 'absolute',
    top: 150,
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
    top: 450,
    width:'40%',
    transform: [{ scale: 1 }],
  },
  buttonPressed: {
    transform: [{ scale: 1.05 }], // Expand the button when pressed
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
  loginLink: {
    position: 'absolute',
    top: 420, // Adjust position as needed
  },
  loginText: {
    color: '#007bff',
    fontWeight: 'bold',
  },
});

export default RegistrationPage;
