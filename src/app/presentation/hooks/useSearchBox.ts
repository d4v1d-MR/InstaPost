import { useContext } from 'react';
import { SearchBoxContext } from '../context/SearchBoxContext';

export const useSearchBox = () => {
  const context = useContext(SearchBoxContext);
  
  if (context === undefined) {
    throw new Error('useSearchBox debe ser usado dentro de un SearchBoxProvider');
  }
  
  return context;
};