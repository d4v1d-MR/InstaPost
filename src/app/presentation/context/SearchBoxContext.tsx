import React, { createContext, useState } from 'react';

interface SearchBoxContextProps {
  searchText: string;
  searchQuery: string;
  isSearching: boolean;
  setSearchText: (text: string) => void;
  clearSearchText: () => void;
  executeSearch: () => void;
  clearSearch: () => void;
}

export const SearchBoxContext = createContext<SearchBoxContextProps>({
  searchText: '',
  searchQuery: '',
  isSearching: false,
  setSearchText: () => {},
  clearSearchText: () => {},
  executeSearch: () => {},
  clearSearch: () => {},
});

export const SearchBoxProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [searchText, setSearchText] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
    
  const clearSearchText = () => {
    setSearchText('');
    if (searchQuery) {
      clearSearch();
    }
  };

  const executeSearch = () => {
    if (searchText.trim()) {
      setIsSearching(true);
      setSearchQuery(searchText);
      setIsSearching(false);
    }
  };

  const clearSearch = () => {
    setSearchQuery('');
  };

  return (
    <SearchBoxContext.Provider 
      value={{
        searchText,
        searchQuery,
        isSearching,
        setSearchText,
        clearSearchText,
        executeSearch,
        clearSearch
      }}
    >
      {children}
    </SearchBoxContext.Provider>
  );
};