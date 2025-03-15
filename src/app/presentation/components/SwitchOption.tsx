import React from 'react'
import { View, Text, Switch, StyleSheet } from 'react-native'
import { useTheme } from '../hooks'

interface SwitchOptionProps {
  label: string;
  value: boolean;
  onValueChange: (value: boolean) => void;
}

export const SwitchOption = ({ label, value, onValueChange }: SwitchOptionProps) => {
  const { theme } = useTheme();

  return (
    <View style={styles(theme).settingItem}>
      <Text style={styles(theme).settingLabel}>{label}</Text>
      <View style={styles(theme).settingControl}>
        <Text style={styles(theme).settingText}>{value ? 'Activado' : 'Desactivado'}</Text>
        <Switch
          value={value}
          onValueChange={onValueChange}
          trackColor={{ false: '#767577', true: theme.colors.primary }}
          thumbColor="#f4f3f4"
          ios_backgroundColor="#3e3e3e"
        />
      </View>
    </View>
  )
}

const styles = (theme: any) => StyleSheet.create({
  settingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: theme.spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  settingLabel: {
    fontSize: theme.typography.fontSize.md,
    color: theme.colors.text,
  },
  settingText: {
    marginRight: theme.spacing.sm,
    color: theme.colors.text,
  },
  settingControl: {
    flexDirection: 'row',
    alignItems: 'center',
  },
})