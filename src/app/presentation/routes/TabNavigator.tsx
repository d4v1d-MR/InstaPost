import { createBottomTabNavigator } from "@react-navigation/bottom-tabs"
import { HomeScreen } from "../screens/HomeScreen"
import { PostsScreen } from "../screens/PostsScreen"
import { MapScreen } from "../screens/MapScreen"
import { SettingsScreen } from "../screens/SettingsScreen"
import Icon from '@react-native-vector-icons/ionicons';
import { useLoggedUser, useTheme } from "../hooks"
import { StyleSheet, TextInput, TouchableOpacity, View } from "react-native"
import { useState } from "react"
import { useBottomSheet } from "../hooks/useBottomSheet"
import { SearchBox } from "../components/ui/SearchBox"

export type RootTabParams = {
  Home: undefined;
  Posts: undefined;
  Map: undefined;
  Settings: undefined;
}

const Tab = createBottomTabNavigator<RootTabParams>()

export const TabNavigator = () => {
  const { theme } = useTheme();
  const { logout } = useLoggedUser();
  const { showBottomSheet } = useBottomSheet();

  return (
    <>
      <Tab.Navigator>
        <Tab.Screen
          options={{
            headerShown: false,
            tabBarIcon: ({ color }) => <Icon name="home" size={25} color={color} />
          }}
          name="Home"
          component={HomeScreen}
        />
        <Tab.Screen
          options={{
            tabBarIcon: ({ color }) => <Icon name="newspaper-outline" size={25} color={color} />,
            headerRight: () => (
              <TouchableOpacity onPress={() => showBottomSheet()}>
                <Icon style={{ marginRight: 10 }} name="filter-outline" size={30} color={theme.colors.primary} />
              </TouchableOpacity>
            ),
            headerTitle: '',
            headerLeft: () => (
              <SearchBox />
            )
          }}
          name="Posts"
          component={PostsScreen}
        />
        <Tab.Screen
          options={{
            headerShown: false,
            tabBarIcon: ({ color }) => <Icon name="map" size={25} color={color} />
          }}
          name="Map"
          component={MapScreen} />
        <Tab.Screen
          options={{
            headerShown: true,
            title: 'Configuración',
            headerRight: () => (
              <TouchableOpacity onPress={logout}>
                <Icon style={{ marginRight: 10 }} name="log-out-outline" size={35} color={theme.colors.primary} />
              </TouchableOpacity>
            ),
            tabBarIcon: ({ color }) => <Icon name="settings" size={25} color={color} />
          }}
          name="Settings"
          component={SettingsScreen}
        />
      </Tab.Navigator>
    </>
  )
}