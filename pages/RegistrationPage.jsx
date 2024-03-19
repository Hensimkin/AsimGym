import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet,Image} from 'react-native';
import QuarterCircleOp from '../shapes/QuarterCircleOp';
import Arrow from 'react-native-arrow';




const RegistrationPage = ({navigation}) => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleRegister = () => {
    // You can implement registration logic here
    console.log('Registering...');
    console.log('Username:', username);
    console.log('Email:', email);
    console.log('Password:', password);
    // You can send this data to a server for registration
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
        <Arrow name="ios-arrow-back" size={24} color="black" /> 
      </TouchableOpacity>
      <QuarterCircleOp style={styles.quarterCircleOp}/>
      <Image
        source={require('../pictures/man_reg.png')}
        style={styles.image} 
      />
      <Text style={styles.title}>Sign In</Text>
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
      
      <TextInput
        style={[styles.input, { top: 370 }]}
        placeholder="Password"
        secureTextEntry={true}
        value={password}
        onChangeText={text => setPassword(text)}
      />
      <TouchableOpacity style={styles.button} onPress={handleRegister}>
        <Text style={styles.buttonText}>Register</Text>
      </TouchableOpacity>
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
    top:150
  },
  input: {
    width: '80%',
    height: 40,
    borderColor: 'black',
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: 10,
    position: 'absolute',
    color:"black",
    fontWeight: 'bold',
  },
  button: {
    backgroundColor: '#007bff',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    top: 430,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  image: {
    width: 300, // Adjust width and height as needed
    height: 300,
    position: 'absolute',
    top: 500, 
    
  },
  backButton: {
    top: 60, // Adjust the top position as needed
    left: 30, // Adjust the left position as needed
    flexDirection: 'row', // Align icon and text horizontally
    alignItems: 'center',
    position: 'absolute',
    transform: [{ scaleX: -1 }],
  },
  quarterCircleOp: {
    // Adjust position as needed
    position: 'absolute',
    top: 100, // Adjust the top position

  },
});

export default RegistrationPage;
