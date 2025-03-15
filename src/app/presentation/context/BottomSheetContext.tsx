import React, { createContext, useState } from 'react';
import { FilterOptions } from '../components/ui/BottomSheet';

interface BottomSheetContextProps {
  isVisible: boolean;
  filters: FilterOptions;
  showBottomSheet: () => void;
  hideBottomSheet: () => void;
  applyFilters: (filters: FilterOptions) => void;
  resetFilters: () => void;
}

const defaultFilters: FilterOptions = {
  sortBy: 'recent',
  author: '',
};

export const BottomSheetContext = createContext<BottomSheetContextProps>({
  isVisible: false,
  filters: defaultFilters,
  showBottomSheet: () => {},
  hideBottomSheet: () => {},
  applyFilters: () => {},
  resetFilters: () => {},
});

export const BottomSheetProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [filters, setFilters] = useState<FilterOptions>(defaultFilters);

  const showBottomSheet = () => setIsVisible(true);
  const hideBottomSheet = () => setIsVisible(false);
  
  const applyFilters = (newFilters: FilterOptions) => {
    setFilters(newFilters);
    hideBottomSheet();
  };
  
  const resetFilters = () => {
    setFilters(defaultFilters);
  };

  return (
    <BottomSheetContext.Provider 
      value={{
        isVisible,
        filters,
        showBottomSheet,
        hideBottomSheet,
        applyFilters,
        resetFilters
      }}
    >
      {children}
    </BottomSheetContext.Provider>
  );
};