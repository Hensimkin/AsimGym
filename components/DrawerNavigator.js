import React from 'react';
import { createDrawerNavigator } from '@react-navigation/drawer';
import MainPage from './pages/MainPage';

const Drawer = createDrawerNavigator();

const DrawerNavigator = () => {
  return (
    <Drawer.Navigator initialRouteName="MainPage">
      <Drawer.Screen name="MainPage" component={MainPage} />
    </Drawer.Navigator>
  );
};

export default DrawerNavigator;
