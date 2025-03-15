import React from 'react'
import { View, Text, StyleSheet } from 'react-native'
import { useTheme } from '../hooks'

interface EmptyDataProps {
  label: string;
  searchQuery?: string;
}

export const EmptyData = ({label, searchQuery = ''}: EmptyDataProps) => {
  const { theme } = useTheme();
  return (
    <View style={styles(theme).noResultsContainer}>
      <Text style={styles(theme).noResultsText}>{label} {searchQuery ? `de ${searchQuery}` : ''}</Text>
    </View>
  )
}

const styles = (theme: any) => StyleSheet.create({  
  noResultsContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  noResultsText: {
    color: theme.colors.text, 
    fontSize: theme.typography.fontSize.md,
  },
});