import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet,Image } from 'react-native';
import QuarterCircle from '../shapes/QuarterCircle';

const LoginScreen = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = () => {
    // Here you can implement authentication logic
    console.log('Username:', username);
    console.log('Password:', password);
    // Example: You can use APIs to authenticate user credentials
  };

  return (
    <View style={styles.container}>
      <QuarterCircle style={styles.quarterCircle}/>
      <Image
        source={require('../pictures/lady_login.png')} 
        style={styles.image}
      />
      <Text style={styles.title}>Login</Text>
      <TextInput
        style={styles.input}
        placeholder="Username or Email"
        value={username}
        onChangeText={setUsername}
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        secureTextEntry={true}
        value={password}
        onChangeText={setPassword}
      />
      <Button title="Login" onPress={handleLogin} />
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
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  input: {
    width: '80%',
    height: 40,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: 20,
  },
  image: {
    width: 400, // Adjust width and height as needed
    height: 400,
    position: 'absolute',
    top: 30, 
  },
});

export default LoginScreen;
