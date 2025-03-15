import React from 'react'
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native'
import { useTheme } from '../hooks';

interface ButtonsOptionProps {
  label: string;
  showUserName: string;
  changeShowUserName: (value: string) => void;
}

export const ButtonsOption = ({ label, showUserName, changeShowUserName }: ButtonsOptionProps) => {
  const { theme } = useTheme();

  return (
    <View style={styles(theme).settingItem}>
      <Text style={styles(theme).settingLabel}>{label}</Text>
      <View style={styles(theme).languageButtons}>
        <TouchableOpacity
          style={[
            styles(theme).languageButton,
            showUserName === 'yes' && styles(theme).activeLanguage,
          ]}
          onPress={() => changeShowUserName('yes')}
        >
          <Text style={[
            styles(theme).buttonText,
            showUserName === 'yes' && styles(theme).activeText
          ]}>
            Si
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles(theme).languageButton,
            showUserName === 'no' && styles(theme).activeLanguage,
          ]}
          onPress={() => changeShowUserName('no')}
        >
          <Text style={[
            styles(theme).buttonText,
            showUserName === 'no' && styles(theme).activeText
          ]}>
            No
          </Text>
        </TouchableOpacity>
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
  languageButtons: {
    flexDirection: 'row',
  },
  languageButton: {
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    marginLeft: theme.spacing.sm,
    borderRadius: theme.borderRadius.medium,
    borderWidth: 1,
    borderColor: theme.colors.border,
    backgroundColor: theme.colors.card,
  },
  buttonText: {
    color: theme.colors.text,
  },
  activeLanguage: {
    backgroundColor: theme.colors.primary,
    borderColor: theme.colors.primary,
  },
  activeText: {
    color: 'white',
  }
})