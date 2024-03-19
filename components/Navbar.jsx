import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';

const NavBar = () => {
  return (
    <View style={styles.navBar}>
      <TouchableOpacity style={styles.button}>
        <Text style={styles.buttonText}>Button 1</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.button}>
        <Text style={styles.buttonText}>Button 2</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  navBar: {
    flexDirection: 'row',
    justifyContent: 'flex-start', // Changed justifyContent to 'flex-start'
    alignItems: 'center',
    backgroundColor: '#eee',
    height: 50,
    paddingHorizontal: 20,
  },
  button: {
    paddingVertical: 10,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
});

export default NavBar;
