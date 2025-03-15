import { NavigationContainer } from "@react-navigation/native";
import { useEffect, useState } from "react";
import { ActivityIndicator, StatusBar, View } from "react-native";
import { createStackNavigator } from "@react-navigation/stack";
import { TabNavigator } from "./TabNavigator";
import { WelcomeScreen } from "../screens/WelcomeScreen";
import { useLoggedUser, useTheme } from "../hooks";
import { DarkTheme, DefaultTheme } from "@react-navigation/native";
import { EditPostScreen } from "../screens/EditPostScreen";

export type RootTabParams = {
  WelcomeScreen: undefined;
  MainScreen: undefined;
  EditPost: { postId?: string };
}

const Stack = createStackNavigator<RootTabParams>();

export const AppNavigator = () => {
  const { theme } = useTheme();
  const { isLoading, username } = useLoggedUser();
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    if (!isLoading) {
      setIsInitialized(true);
    }
  }, [isLoading]);

  const navigationTheme = {
    ...(theme.isDark ? DarkTheme : DefaultTheme),
    colors: {
      ...(theme.isDark ? DarkTheme.colors : DefaultTheme.colors),
      primary: theme.colors.primary,
      background: theme.colors.background,
      text: theme.colors.text,
    },
  };

  if (isLoading || !isInitialized) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: theme.colors.background }}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
      </View>
    );
  }

  return (
    <>
      <StatusBar
        barStyle={theme.isDark ? 'light-content' : 'dark-content'}
        backgroundColor={theme.colors.background}
      />
      <NavigationContainer theme={navigationTheme}>
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          {username === undefined ? (
            <Stack.Screen name="WelcomeScreen" component={WelcomeScreen} />
          ) : (
            <>
              <Stack.Screen 
                name="MainScreen" 
                component={TabNavigator}
              />
              <Stack.Screen 
                name="EditPost" 
                component={EditPostScreen} 
                options={{ headerShown: false }}
              />
            </>
          )}
        </Stack.Navigator>
      </NavigationContainer>
    </>
  );
};