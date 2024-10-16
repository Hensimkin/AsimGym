import React from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';

const QuarterCircle = () => {
  const { width, height } = Dimensions.get('window');
  const circleSize = width * 1.2; // Adjust size if needed

  return (
    <View
      style={[
        styles.quarterCircle,
        {
          width: circleSize,
          height: circleSize,
          borderTopRightRadius: circleSize, // Ensures the curve is in the top-right of the circle
        },
      ]}
    />
  );
};

const styles = StyleSheet.create({
  quarterCircle: {
    backgroundColor: '#00BFFF',
    position: 'absolute',
    bottom: -Dimensions.get('window').height * 0.2, // Adjust to position the circle at the bottom
    left: -Dimensions.get('window').width * 0.1,  // Adjust for the left side placement
  },
});

export default QuarterCircle;
