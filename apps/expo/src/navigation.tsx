import {
  BottomTabScreenProps,
  createBottomTabNavigator,
} from "@react-navigation/bottom-tabs";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import React from "react";
import { FixturesScreen } from "./screens/fixtures/list";
import { HomeScreen } from "./screens/home";
import { Ionicons } from "@expo/vector-icons";
import { FixtureDetailsScreen } from "./screens/fixtures/details";

const AppStack = createNativeStackNavigator<{
  tabs: undefined;
  "game-details": {
    fixtureId: string;
  };
}>();

type AppTabParamList = {
  home: undefined;
  fixtures: undefined;
};

type Props = BottomTabScreenProps<AppTabParamList>;

const AppTab = createBottomTabNavigator<AppTabParamList>();

type IconProps = {
  focused: boolean;
  size: number;
  color: string;
};

const HomeIcon = ({ focused, size, color }: IconProps) => {
  if (focused) return <Ionicons name="ios-home" size={size} color={color} />;
  return <Ionicons name="ios-home-outline" size={size} color={color} />;
};

const SettingsIcons = ({ focused, size, color }: IconProps) => {
  if (focused)
    return <Ionicons name="ios-calendar" size={size} color={color} />;
  return <Ionicons name="ios-calendar-outline" size={size} color={color} />;
};

function TabsScreen() {
  return (
    <AppTab.Navigator
      screenOptions={({ route }: Props) => ({
        headerShown: false,
        headerShadowVisible: false,
        tabBarActiveTintColor: "#c8554f",
        tabBarShowLabel: false,
        tabBarStyle: {
          height: "10%",
          borderTopWidth: 0,
        },
        tabBarIcon: ({ focused, color, size }) => {
          if (route.name === "home") {
            return <HomeIcon focused={focused} color={color} size={size} />;
          } else if (route.name === "fixtures") {
            return (
              <SettingsIcons focused={focused} color={color} size={size} />
            );
          }

          return <HomeIcon focused={focused} color={color} size={size} />;
        },
      })}
    >
      <AppTab.Screen name="home" component={HomeScreen} />
      <AppTab.Screen name="fixtures" component={FixturesScreen} />
    </AppTab.Navigator>
  );
}

export function AppScreens() {
  return (
    <AppStack.Navigator
      screenOptions={{ headerShown: false, headerShadowVisible: false }}
    >
      <AppStack.Screen
        name="tabs"
        component={TabsScreen}
        options={{
          title: "Tabs",
        }}
      />
      <AppStack.Screen
        name="game-details"
        component={FixtureDetailsScreen}
        options={{
          title: "Details",
        }}
      />
    </AppStack.Navigator>
  );
}
