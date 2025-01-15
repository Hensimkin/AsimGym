import 'react-native-gesture-handler';
import { createStackNavigator } from '@react-navigation/stack';
import React from 'react';
import HomePage from '../pages/HomePage';
import RegistrationPage from '../pages/RegistrationPage';
import LoginPage from '../pages/LoginPage';
import VerificationPage from '../pages/VerificationPage'
import NavDrawer from '../navigation/DrawerNavigation'
import ProfilePage from '../pages/ProfilePage'
import FirstSettingsPage from '../pages/FirstSettingsPage'
import TrainingProgramPage from '../pages/TrainingProgramPage'
import UserRehearsalsPage from '../pages/UserRehearsalsPage'
import UserTrainingPage from '../pages/UserTrainingPage'
import StatisticsPage from '../pages/StatisticsPage'
import GraphPage from '../pages/GraphPage'
import ForgotPassPage from '../pages/ForgotPassPage'


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
        <Stack.Screen name="Training Program" component={TrainingProgramPage} />
        <Stack.Screen name="UserRehearsalsPage" component={UserRehearsalsPage} />
        <Stack.Screen name="User Training Page" component={UserTrainingPage} />
        <Stack.Screen name="StatisticsPage" component={StatisticsPage} />
        <Stack.Screen name="GraphPage" component={GraphPage} />
        <Stack.Screen name="ForgotPassPage" component={ForgotPassPage} options={{ headerShown: false }}/>
      </Stack.Navigator>
    );
  };
  
  export default AppNavigation;