import React, { useState } from 'react';
import { View, TextInput, Button, StyleSheet } from 'react-native';

const VerificationPage = ({ navigation }) => {
  const [verificationCode, setVerificationCode] = useState('');

  const handleVerify = () => {
    // Implement verification logic here
    console.log('Verifying code:', verificationCode);
    // You can replace console.log with your actual verification logic
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Enter code"
        onChangeText={text => setVerificationCode(text)}
        value={verificationCode}
      />
      <Button
        title="Verify"
        onPress={handleVerify}
        disabled={!verificationCode}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
    marginBottom: 20,
    width: '80%',
  },
});

export default VerificationPage;
