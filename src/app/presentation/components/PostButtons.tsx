import Icon from '@react-native-vector-icons/ionicons'
import React from 'react'
import { StyleSheet, TouchableOpacity, View } from 'react-native'
import { useTheme } from '../hooks'

interface PostButtonsProps {
  onEdit: () => void;
  onDelete: () => void;
  isEdit: boolean;
}

export const PostButtons = ({ onEdit, onDelete, isEdit }: PostButtonsProps) => {
  const { theme } = useTheme();
  return (
    <View style={styles(theme).actionButtons}>
      {!isEdit ? (
        <TouchableOpacity
          style={styles(theme).actionButton}
          onPress={onEdit}
        >
          <Icon name="create-outline" size={25} color={theme.colors.primary} />
        </TouchableOpacity>
      ) : (
        <TouchableOpacity
          style={styles(theme).actionButton}
          onPress={onEdit}
        >
          <Icon name="close-outline" size={25} color={theme.colors.primary} />
        </TouchableOpacity>
      )}
      <TouchableOpacity
        style={styles(theme).actionButton}
        onPress={onDelete}
      >
        <Icon name="trash-outline" size={25} color={theme.colors.error} />
      </TouchableOpacity>
    </View>
  )
}

const styles = (theme: any) => StyleSheet.create({
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    padding: theme.spacing.sm,
  },
  actionButton: {
    padding: theme.spacing.xs,
    marginLeft: theme.spacing.sm,
  },
});