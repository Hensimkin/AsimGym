import React from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';

const QuarterCircle = () => {
  const { width, height } = Dimensions.get('window');
  const circleSize = width * 1.2; // Adjust the multiplier as needed

  return (
    <View style={[styles.quarterCircle, { width: circleSize, height: circleSize, borderBottomLeftRadius: circleSize }]}></View>
  );
};

const styles = StyleSheet.create({
  quarterCircle: {
    backgroundColor: '#00BFFF',
    position: 'absolute',
    top: -Dimensions.get('window').height * 0.2, // Adjust the position as needed
    left: -Dimensions.get('window').width * 0.1,
  },
});

export default QuarterCircle;
