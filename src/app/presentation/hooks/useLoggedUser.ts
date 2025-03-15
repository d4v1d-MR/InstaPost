import { useContext } from 'react';
import { LoggedUserContext } from '../context';

export const useLoggedUser = () => {
  const context = useContext(LoggedUserContext);
  
  if (context === undefined) {
    throw new Error('useLoggedUser must be used within a UseLoggedUserProvider');
  }
  
  return context;
};