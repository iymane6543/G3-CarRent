import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { StatusBar } from "expo-status-bar";
import { Image, StyleSheet } from "react-native";
import HomeScreen from "./src/HomeScreen";
import MapScreen from "./src/MapScreen";
import SettingsScreen from "./src/SettingsScreen";
import SavedScreen from "./src/SavedScreen";
import InfoScreen from "./src/InfoScreen";
import LoginScreen from "./src/LoginScreen";
import RegisterScreen from "./src/RegisterScreen";
import AddCarScreen from "./src/AddCarScreen";
import { SessionProvider } from './src/SessionContext';

const homeIcon_active = require("./src/assets/icons/home-active.png");
const homeIcon = require("./src/assets/icons/home.png");
const compass_active = require("./src/assets/icons/compass-active.png");
const compass = require("./src/assets/icons/compass.png");
const savedIcon_active = require("./src/assets/icons/saved-active.png");
const savedIcon = require("./src/assets/icons/saved.png");
const settingsIcon_active = require("./src/assets/icons/settings-active.png");
const settingsIcon = require("./src/assets/icons/settings.png");
const addIcon = require("./src/assets/icons/add.png");
const addIcon_active = require("./src/assets/icons/add-active.png");

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

function HomeStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false
      }}
    >
      <Stack.Screen name="Initial" component={HomeScreen} />
      <Stack.Screen name="Info" component={InfoScreen} />
    </Stack.Navigator>
  );
}

function AuthStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false
      }}
    >
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Register" component={RegisterScreen} />
      <Stack.Screen name="AddCar" component={AddCarScreen} />
    </Stack.Navigator>
  );
}

export default function App() {
  return (
    <SessionProvider>
      <StatusBar style="auto" />
      <NavigationContainer>
        <Tab.Navigator
          screenOptions={({ route }) => ({
            headerShown: false,
            tabBarIcon: ({ focused }) => {
              let iconName;

              if (route.name === "Home") {
                iconName = focused ? homeIcon_active : homeIcon;
              } else if (route.name === "Map") {
                iconName = focused ? compass_active : compass;
              } else if (route.name === "Saved") {
                iconName = focused ? savedIcon_active : savedIcon;
              } else if (route.name === "Settings") {
                iconName = focused ? settingsIcon_active : settingsIcon;
              } else if (route.name === "Auth") {
                iconName = focused ? addIcon_active : addIcon;
              }

              return (
                <Image source={iconName} resizeMode="contain" style={styles.footerIcon} />
              );
            },
            tabBarShowLabel: false,
            tabBarStyle: {
              position: "absolute",
              bottom: 0,
              left: 0,
              right: 0,
              height: 60,
              padding: 10,
              backgroundColor: 'black',
              borderTopStartRadius: 20,
              borderTopEndRadius: 20,
            }
          })}
        >
          <Tab.Screen name="Home" component={HomeStack} />
          <Tab.Screen name="Auth" component={AuthStack} />
          <Tab.Screen name="Map" component={MapScreen} />
          <Tab.Screen name="Saved" component={SavedScreen} />
          <Tab.Screen name="Settings" component={SettingsScreen} />
        </Tab.Navigator>
      </NavigationContainer>
    </SessionProvider>
  );
}

const styles = StyleSheet.create({
  footerIcon: {
    width: 25,
    height: 25,
  }
});