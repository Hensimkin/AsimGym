import React from 'react';
import { View, StyleSheet} from 'react-native';

const MainPage = ({ navigation }) => {
    return (
        <View style={styles.container}>
            {/* Your component content goes here */}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#fff',
      },
});

export default MainPage;

