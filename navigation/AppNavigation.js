import 'react-native-gesture-handler';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import React from 'react';
import HomePage from '../pages/HomePage';
import RegistrationPage from '../pages/RegistrationPage';
import LoginPage from '../pages/LoginPage';
// import MainPage from '../pages/MainPage';
import VerificationPage from '../pages/VerificationPage'
import NavDrawer from '../navigation/DrawerNavigation'
import ProfilePage from '../pages/ProfilePage'
import FirstSettingsPage from '../pages/FirstSettingsPage'
import TrainingProgramPage from '../pages/TrainingProgramPage'
import UserRehearsalsPage from '../pages/UserRehearsalsPage'
import UserTrainingPage from '../pages/UserTrainingPage'
import StatisticsPage from '../pages/StatisticsPage'
import GraphPage from '../pages/GraphPage'


const Stack = createStackNavigator();


const AppNavigation = () => {
    return (
      <Stack.Navigator initialRouteName='HomePage'>
        <Stack.Screen name="HomePage" component={HomePage} options={{ headerShown: false }} />
        <Stack.Screen name="RegistrationPage" component={RegistrationPage} options={{ headerShown: false }} />
        <Stack.Screen name="LoginPage" component={LoginPage} options={{ headerShown: false }} />
        <Stack.Screen name="MainPage" component={NavDrawer} options={{ headerShown: false }} />
        <Stack.Screen name="VerificationPage" component={VerificationPage} options={{ headerShown: false }} />
        <Stack.Screen name="ProfilePage" component={ProfilePage} options={{ headerShown: false }} />
        <Stack.Screen name="FirstSettingsPage" component={FirstSettingsPage} options={{ headerShown: false }} />
        <Stack.Screen name="TrainingProgram" component={TrainingProgramPage} />
        <Stack.Screen name="UserRehearsalsPage" component={UserRehearsalsPage} />
        <Stack.Screen name="UserTrainingPage" component={UserTrainingPage} />
        <Stack.Screen name="StatisticsPage" component={StatisticsPage} />
        <Stack.Screen name="GraphPage" component={GraphPage} />
      </Stack.Navigator>
    );
  };
  
  export default AppNavigation;