import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const NameCard = ({ name }) => {
  return (
    <View style={styles.card}>
      <Text style={styles.name}>{name}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    borderRadius: 10,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
    marginVertical: 10,
    marginHorizontal: 20,
    width: '90%', // Adjust the width to be almost full-width
    padding: 10, // Add padding for spacing
    alignItems: 'center', // Center items vertically
  },
  name: {
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default NameCard;
