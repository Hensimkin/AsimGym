import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';

const Card = ({ title, description, image }) => {
  return (
    <View style={styles.card}>
      <Image source={{ uri: image }} style={styles.image} />
      <View style={styles.content}>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.description}>Target: {description}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row-reverse', // Set the layout to be row-wise in reverse order
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
  image: {
    width: 80, // Set the width to 80
    height: 80, // Set the height to 80
    borderRadius: 10,
    marginRight: 20, // Add margin to the left for spacing
  },
  content: {
    flex: 1, // Allow the content to take up the remaining space
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 10,
  },
  description: {
    fontSize: 14,
    color: '#777',
    marginTop: 5,
    marginLeft: 10,
  },
});

export default Card;
