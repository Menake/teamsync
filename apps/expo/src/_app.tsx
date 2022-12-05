import { StatusBar } from "expo-status-bar";
import React from "react";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { TRPCProvider } from "./utils/trpc";

import { AppScreens } from "./navigation";
import { NavigationContainer, DefaultTheme } from "@react-navigation/native";

const theme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    background: "#fff",
    primary: "#cf7785",
  },
};

export const App = () => {
  return (
    <NavigationContainer theme={theme}>
      <TRPCProvider>
        <SafeAreaProvider>
          <AppScreens />
          <StatusBar />
        </SafeAreaProvider>
      </TRPCProvider>
    </NavigationContainer>
  );
};
