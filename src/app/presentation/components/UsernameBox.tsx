import React from 'react'
import { View, Text, StyleSheet } from 'react-native'
import { useTheme } from '../hooks'

interface UsernameBoxProps {
  username: string;
}

export const UsernameBox = ({ username }: UsernameBoxProps) => {
  const { theme } = useTheme();
  return (
    <View style={styles(theme).userSection}>
      <Text style={styles(theme).usernameLabel}>Usuario registrado:</Text>
      <Text style={styles(theme).username}>{username}</Text>
    </View>
  )
}

const styles = (theme: any) => StyleSheet.create({
  userSection: {
    backgroundColor: theme.colors.card,
    borderRadius: theme.borderRadius.medium,
    marginBottom: theme.spacing.lg,
  },
  usernameLabel: {
    fontSize: theme.typography.fontSize.md,
    fontWeight: 'bold',
    color: theme.colors.primary,
    marginBottom: theme.spacing.xs,
  },
  username: {
    fontSize: theme.typography.fontSize.lg,
    fontWeight: 'bold',
    color: theme.colors.text,
  },
})