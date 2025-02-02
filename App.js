import 'react-native-gesture-handler';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import React from 'react';
import HomePage from './pages/HomePage';
import RegistrationPage from './pages/RegistrationPage';
import LoginPage from './pages/LoginPage';
import MainPage from './pages/MainPage';
import VerificationPage from './pages/VerificationPage'
import NavDrawer from './navigation/DrawerNavigation'
import AppNavigation from './navigation/AppNavigation'



const Stack = createStackNavigator();

const App = () => {
  return (
    <NavigationContainer>
      {/* <Stack.Navigator initialRouteName='HomePage'>
      <Stack.Screen name="HomePage" component={HomePage} options={{ headerShown: false }} />
      <Stack.Screen name="RegistrationPage" component={RegistrationPage} options={{ headerShown: false }} />
      <Stack.Screen name="LoginPage" component={LoginPage} options={{ headerShown: false }} />
      <Stack.Screen name="MainPage" component={NavDrawer} options={{ headerShown: false }} />
      <Stack.Screen name="VerificationPage" component={VerificationPage} options={{ headerShown: false }} />
      </Stack.Navigator> */}
      <AppNavigation/>
    </NavigationContainer>
  );
};



export default App;
