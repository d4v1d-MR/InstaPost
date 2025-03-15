import React from 'react';
import { useTheme } from '../../presentation/hooks';
import { BaseToast, ErrorToast, ToastConfig } from 'react-native-toast-message';

export const toastConfig: ToastConfig = {
  success: ({ text1, text2, props }) => {
    const { theme } = useTheme();
    const primaryColor = theme.colors.primary;

    return (
      <BaseToast
        style={{
          borderLeftColor: primaryColor,
          backgroundColor: theme.colors.background,
        }}
        contentContainerStyle={{ paddingHorizontal: 15 }}
        text1Style={{
          fontSize: 16,
          fontWeight: 'bold',
          color: theme.colors.text,
        }}
        text2Style={{
          fontSize: 14,
          color: theme.colors.text,
        }}
        text1={text1}
        text2={text2}
      />
    );
  },
  error: (props) => {
    const { theme } = useTheme();
    return (
      <ErrorToast
        {...props}
        style={{ borderLeftColor: theme.colors.error }}
        text1Style={{ fontSize: 16, fontWeight: 'bold' }}
        text2Style={{ fontSize: 14 }}
      />
    );
  },
  info: (props) => (
    <BaseToast
      {...props}
      style={{ borderLeftColor: '#007BFF', backgroundColor: '#FFFFFF' }}
      contentContainerStyle={{ paddingHorizontal: 15 }}
      text1Style={{ fontSize: 16, fontWeight: 'bold', color: '#007BFF' }}
      text2Style={{ fontSize: 14, color: '#333333' }}
    />
  ),
};