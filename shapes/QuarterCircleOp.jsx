import React from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';

const QuarterCircle = () => {
  const { width } = Dimensions.get('window');
  const quarterCircleWidth = width;

  return (
    <View style={[styles.quarterCircle, { width: quarterCircleWidth }]}></View>
  );
}

const styles = StyleSheet.create({
  quarterCircle: {
    height: 400,
    backgroundColor: '#00BFFF',
    overflow: 'hidden',
    borderBottomRightRadius: 0,
    borderBottomLeftRadius: 0,
    borderTopRightRadius: 400,
    borderTopLeftRadius: 0,
    position: 'absolute',
    top: 490,
  },
});

export default QuarterCircle;
