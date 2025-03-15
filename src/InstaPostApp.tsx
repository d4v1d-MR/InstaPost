import React from 'react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AppNavigator } from './app/presentation/routes/AppNavigator';
import { ThemeProvider, LoggedUserProvider, SettingsProvider } from './app/presentation/context';
import { BottomSheetProvider } from './app/presentation/context/BottomSheetContext';
import { SearchBoxProvider } from './app/presentation/context/SearchBoxContext';
import Toast from 'react-native-toast-message';
import { toastConfig } from './app/config/helpers/toastConfig';

export const InstaPostApp = () => {
  const queryClient = new QueryClient();

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <LoggedUserProvider>
          <SettingsProvider>
            <BottomSheetProvider>
              <SearchBoxProvider>
                <AppNavigator />
                <Toast config={toastConfig}/>
              </SearchBoxProvider>
            </BottomSheetProvider>
          </SettingsProvider>
        </LoggedUserProvider>
      </ThemeProvider>
    </QueryClientProvider>
  )
}