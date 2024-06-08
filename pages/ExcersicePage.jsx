// // ProfileScreen.js

// import React, { useState, useEffect } from 'react';
// import { View, Text, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
// import AsyncStorage from '@react-native-async-storage/async-storage';
// import { useNavigation } from '@react-navigation/native';
// import axios from 'axios';

// const ExcersicePage = () => {
//     const navigation = useNavigation();
//     const [data, setData] = useState(null);
//     const [loading, setLoading] = useState(true);
//     const [error, setError] = useState(null);

//     useEffect(() => {
//         const fetchData = async () => {
//             try {
//                 console.log("err1")
//                 const response = await axios.get('http://10.0.2.2:8000/api/user/getExercises'); 
//                 const exercises = response.data.exercises;

//                 // for (let i = 0; i < exercises.length; i++) {
//                 //     console.log("Exercise Name: " + exercises[i].name);
//                 //     console.log("Body Part: " + exercises[i].bodyPart);
//                 //     console.log("Equipment: " + exercises[i].equipment);
//                 //     console.log("GIF URL: " + exercises[i].gifUrl);
//                 //     console.log("Instructions: ");
    
//                 //     for (let j = 0; j < exercises[i].instructions.length; j++) {
//                 //         console.log((j + 1) + ". " + exercises[i].instructions[j]);
//                 //     }
    
//                 //     console.log("Secondary Muscles: " + exercises[i].secondaryMuscles.join(", "));
//                 //     console.log("Target: " + exercises[i].target);
//                 //     console.log("\n");  // Add a new line for better readability
//                 // }
                
//             } catch (error) {
//                 console.log("err2")
//                 setError(error);
//             } finally {
//                 setLoading(false);
//             }
//         };

//         fetchData();
//     }, []); // Empty dependency array means this effect runs once when the component mounts

//     if (loading) {
//         return <ActivityIndicator size="large" color="#0000ff" />;
//     }

//     if (error) {
//         return (
//             <View style={styles.container}>
//                 <Text>Error: {error.message}</Text>
//             </View>
//         );
//     }

//     return (
//         <View style={styles.container}>
//             <Text>ExcersicePage</Text>
//             {/* Render your fetched data here */}
//         </View>
//     );
// }

// const styles = StyleSheet.create({
//     container: {
//         flex: 1,
//         justifyContent: 'center',
//         alignItems: 'center',
//         backgroundColor: '#fff',
//     },
// });

// export default ExcersicePage;






import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ActivityIndicator, ScrollView, KeyboardAvoidingView, TouchableWithoutFeedback, Keyboard } from 'react-native';
import axios from 'axios';
import { useNavigation } from '@react-navigation/native';
import Card from '../components/TrainingCard'; // Adjust the import path as necessary

const ExcersicePage = () => {
    const navigation = useNavigation();
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                console.log("err1");
                const response = await axios.get('http://10.0.2.2:8000/api/user/getExercises'); 
                const exercises = response.data.exercises;
                setData(exercises);
            } catch (error) {
                console.log("err2");
                setError(error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []); // Empty dependency array means this effect runs once when the component mounts

    if (loading) {
        return <ActivityIndicator size="large" color="#0000ff" />;
    }

    if (error) {
        return (
            <View style={styles.container}>
                <Text>Error: {error.message}</Text>
            </View>
        );
    }

    return (
        <KeyboardAvoidingView style={{ flex: 1 }} behavior="padding">
            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                <ScrollView contentContainerStyle={styles.scrollViewContent}>
                    <Text style={styles.title}>Exercise Page</Text>
                    {/* {data && data.map((exercise, index) => (
                        <Card
                            key={index}
                            title={exercise.name}
                            description={exercise.bodyPart}
                            image={exercise.gifUrl}
                        />
                    ))} */}

                    {data && data.slice(0, 10).map((exercise, index) => (
                                            <Card
                                                key={index}
                                                title={exercise.name}
                                                description={exercise.bodyPart}
                                                image={exercise.gifUrl}
                                            />
                                        ))}
                </ScrollView>
            </TouchableWithoutFeedback>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    scrollViewContent: {
        flexGrow: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#fff',
        padding: 20,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
    },
});

export default ExcersicePage;
