import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View ,Button,Image} from 'react-native';
import QuarterCircle from '../shapes/QuarterCircle';
import CustomButton from '../components/CustomButton'

export default function App({ navigation }) {
  return (
    <View style={styles.container}>
      <QuarterCircle style={styles.quarterCircle}/>
      <Image
        source={require('../pictures/gym_people.png')} 
        style={styles.image}
      />
      <Image
        source={require('../pictures/Asim_logo.png')} 
        style={styles.Asim_logo}
      />
     <View style={styles.buttonRow}>
        <CustomButton
          title="Continue with Google"
          icon={require('../pictures/google.png')}
          onPress2="google"
          navigation={navigation}
        />
        <CustomButton
          title="Continue with Email"
          icon={require('../pictures/email.png')}
          onPress2="RegistrationPage"
          navigation={navigation}
        />
        <CustomButton
          title="Sign In"
          onPress2="LoginPage"
          navigation={navigation}
        />
      </View>
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  image: {
    width: 400, // Adjust width and height as needed
    height: 400,
    position: 'absolute',
    top: 200, 
  },
  Asim_logo:{
    width: 200, // Adjust width and height as needed
    height: 130,
    position: 'absolute', // Set the position to absolute
    top: 70, // Adjust the top position as needed
  },
  buttonRow: {
    flexDirection: 'column',
    position: 'absolute', // Set the position to absolute
    bottom: 100,
  },
  buttonWrapper: {
    marginVertical: 5, // Adjust margin as needed for vertical separation
  },
});
