import React, { useState } from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import axios from 'axios';

const App = () => {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchData = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await axios.post('https://asimgymbackend.onrender.com/api/user/getExerciseProgram',{
        email: "haniger22@gmail.com",
        excersicename:"ex1"
    });
      // const result = await response.json();
      // setData(result);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Button title="Fetch Data" onPress={fetchData} />
      {loading && <Text>Loading...</Text>}
      {error && <Text style={styles.error}>Error: {error}</Text>}
      {data && (
        <View style={styles.dataContainer}>
          <Text>Data:</Text>
          <Text>{JSON.stringify(data, null, 2)}</Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  dataContainer: {
    marginTop: 20,
    padding: 20,
    backgroundColor: '#f0f0f0',
    borderRadius: 10,
  },
  error: {
    marginTop: 20,
    color: 'red',
  },
});

export default App;
