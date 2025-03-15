import React from 'react'
import { ActivityIndicator, StyleSheet } from 'react-native'
import { useTheme } from '../../hooks';

export const Loading = () => {
  const {theme} = useTheme();
  
  return (
    <ActivityIndicator size={30} color={theme.colors.primary} />
  )
}