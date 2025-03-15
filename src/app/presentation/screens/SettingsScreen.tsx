import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { useTheme, useLoggedUser } from '../hooks';
import { useGlobalSettings } from '../hooks';
import { GlobalSettings } from '../../interfaces/globalSettings';
import { SwitchOption } from '../components/SwitchOption';
import { ButtonsOption } from '../components/ButtonsOption';
import { UsernameBox } from '../components/UsernameBox';

export const SettingsScreen = () => {
  const { theme, toggleTheme } = useTheme();
  const { showUserLocation, showUserName, saveSettings } = useGlobalSettings();
  const { username } = useLoggedUser();

  const changeShowUserName = (value: string) => {
    const settings: GlobalSettings = {
      showUserName: value,
      showUserLocation
    };
    saveSettings(settings);
  };

  const toggleShowUserLocation = () => {
    const settings: GlobalSettings = {
      showUserName,
      showUserLocation: !showUserLocation
    };
    saveSettings(settings);
  };

  return (
    <View style={styles(theme).container}>
      <ScrollView style={styles(theme).scrollContainer}>
        {showUserName === 'yes' && (
          <UsernameBox username={username!} />
        )}
        <SwitchOption label='Tema Oscuro' value={theme.isDark} onValueChange={toggleTheme} />
        <ButtonsOption label='Mostrar nombre de usuario' showUserName={showUserName} changeShowUserName={changeShowUserName} />
        <SwitchOption label='Ubicación en el mapa' value={showUserLocation} onValueChange={toggleShowUserLocation} />
      </ScrollView>
    </View>
  );
};

const styles = (theme: any) => StyleSheet.create({
  container: {
    flex: 1,
    padding: theme.spacing.md,
    marginVertical: theme.spacing.xs,
    backgroundColor: theme.colors.background,
  },
  scrollContainer: {
    flex: 1,
    padding: theme.spacing.md,
  }
});