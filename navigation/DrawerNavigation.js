import React from "react";
import { createDrawerNavigator } from "@react-navigation/drawer";
import MainPage from "../pages/MainPage";
import ProfilePage from "../pages/ProfilePage";
import ExcersicePage from "../pages/ExcersicePage";
import EquipmentPage from "../pages/EquipmentPage";

import StatisticsPage from "../pages/StatisticsPage";

const Drawer = createDrawerNavigator();

const DrawerNavigator = () => {
  return (
    <Drawer.Navigator initialRouteName="MainPage">
      <Drawer.Screen name="Main Page" component={MainPage} />
      <Drawer.Screen name="Profile Page" component={ProfilePage} />
      <Drawer.Screen name="Excersice Page" component={ExcersicePage} />
      <Drawer.Screen name="Equipment Page" component={EquipmentPage} />
      <Drawer.Screen name="Statistics Page" component={StatisticsPage} />
    </Drawer.Navigator>
  );
};

export default DrawerNavigator;
