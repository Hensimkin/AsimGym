import React, { useState } from 'react';
import { View, TouchableHighlight, Text, Image, StyleSheet } from 'react-native';

const CustomButton = ({ title, icon, onPress2, navigation }) => {
  const [pressed, setPressed] = useState(false);

  const handlePressIn = () => {
    setPressed(true);
  };

  const handlePressOut = () => {
    setPressed(false);
  };

  const handlePress= () =>{
    console.log(onPress2);
    if (onPress2 === 'RegistrationPage') {
      navigation.navigate('RegistrationPage');
    } else if (onPress2 === 'LoginPage') {
      navigation.navigate('LoginPage');
    } else {
      // handle other navigation actions if needed
    }
  };

  return (
    <TouchableHighlight
      style={[styles.button, pressed && styles.buttonPressed]}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      underlayColor="#0066cc" // Change color on press
      onPress={handlePress}
    >
      <View style={[styles.buttonContent, !icon && styles.centerText]}>
        <Text style={styles.buttonText}>{title}</Text>
        {icon && <Image source={icon} style={styles.icon} />}
      </View>
    </TouchableHighlight>
  );
};

const styles = StyleSheet.create({
  button: {
    backgroundColor: '#00BFFF',
    borderRadius: 10,
    padding: 10,
    marginBottom: 10,
  },
  buttonPressed: {
    transform: [{ scale: 1.05 }], // Increase scale when pressed
  },
  buttonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  centerText: {
    justifyContent: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    marginRight: 10,
  },
  icon: {
    width: 24,
    height: 24,
  },
});

export default CustomButton;
