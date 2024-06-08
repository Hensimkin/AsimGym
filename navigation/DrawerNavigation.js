// import 'react-native-gesture-handler';
// import {createDrawerNavigator} from '@react-navigation/drawer';
// import MainPage from '../pages/MainPage';

// const Drawer = createDrawerNavigator();

// function DrawerNavigator() {
//   return (
//     <NavigationContainer>
//       <Drawer.Navigator
//         // drawerContent={props => <CustomDrawer {...props} />}
//         screenOptions={{
//           headerShown: false,
//           drawerActiveBackgroundColor: COLORS.primary,
//           drawerActiveTintColor: COLORS.white,
//           drawerLabelStyle: {
//             marginLeft: -20,
//           },
//         }}>
//         <Drawer.Screen
//           name='HomePage'
//           component={MainPage}
//         />
//       </Drawer.Navigator>
//      </NavigationContainer>
//   );
// }

// export default DrawerNavigator;

import React from 'react';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { NavigationContainer } from '@react-navigation/native';
import MainPage from '../pages/MainPage';
import ProfilePage from '../pages/ProfilePage';
import ExcersicePage from '../pages/ExcersicePage';

const Drawer = createDrawerNavigator();

const DrawerNavigator = () => {
  return (

      <Drawer.Navigator initialRouteName="MainPage" >
        <Drawer.Screen name="MainPage" component={MainPage} />
        <Drawer.Screen name="ProfilePage" component={ProfilePage} />
        <Drawer.Screen name="ExcersicePage" component={ExcersicePage} />
      </Drawer.Navigator>

  );
};

export default DrawerNavigator;
