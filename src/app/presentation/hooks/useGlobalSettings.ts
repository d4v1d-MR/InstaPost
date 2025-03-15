import { useContext } from 'react';
import { SettingsContext } from '../context';

export const useGlobalSettings = () => {
  const context = useContext(SettingsContext);
  
  if (context === undefined) {
    throw new Error('useGlobalSettings must be used within a SettingsProvider');
  }
  
  return context;
};