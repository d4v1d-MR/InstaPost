import React from 'react'
import { View, ActivityIndicator, Text, StyleSheet } from 'react-native'
import { useTheme } from '../hooks'

export const Searching = () => {
  const { theme } = useTheme();
  return (
    <View style={styles(theme).loadingContainer}>
      <ActivityIndicator size="small" color={theme.colors.primary} />
      <Text style={styles(theme).searchingText}>Buscando...</Text>
    </View>
  )
}

const styles = (theme: any) => StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  searchingText: {
    marginTop: theme.spacing.sm,
    color: theme.colors.text,
    fontSize: theme.typography.fontSize.md,
  },
});
