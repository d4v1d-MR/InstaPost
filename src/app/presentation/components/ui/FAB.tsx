import Icon from '@react-native-vector-icons/ionicons';
import React from 'react'
import { Pressable, StyleProp, StyleSheet, View, ViewStyle } from 'react-native'
import { useTheme } from '../../hooks';

interface Props {
  iconName: string;
  onPress: () => void
  disabled?: boolean
  style?: StyleProp<ViewStyle>;
}

export const FAB = ({ iconName, onPress, disabled = false, style }: Props) => {
  const { theme } = useTheme();

  return (
    <View style={[styles(theme, disabled).btn, style]}>
      <Pressable
        onPress={onPress}
        disabled={disabled}
      >
        <Icon name={iconName as any} size={30} color={'white'} />
      </Pressable>
    </View>
  )
}
export const styles = (theme: any, disabled: boolean) => StyleSheet.create({
  btn: {
    zIndex: 1,
    position: 'absolute',
    height: 50,
    opacity: !disabled ? 1 : 0.4,
    width: 50,
    borderRadius: 30,
    backgroundColor: theme.colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    shadowOpacity: 0.3,
    shadowOffset: {
      height: 0.27,
      width: 4.5
    },
    elevation: 5
  }
})