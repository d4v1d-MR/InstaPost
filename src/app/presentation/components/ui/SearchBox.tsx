import React from 'react';
import { View, TextInput, TouchableOpacity, StyleSheet, NativeSyntheticEvent, TextInputSubmitEditingEventData } from 'react-native';
import Icon from '@react-native-vector-icons/ionicons';
import { useTheme } from '../../hooks';
import { useSearchBox } from '../../hooks/useSearchBox';

interface Props {
  placeholder?: string;
}

export const SearchBox = ({ placeholder = 'Buscar usuario...' }: Props) => {
  const { theme } = useTheme();
  const { 
    searchText, 
    setSearchText,
    clearSearchText,
    executeSearch
  } = useSearchBox();

  const handleChangeText = (text: string) => {
    setSearchText(text);
  };

  const handleSubmitEditing = () => {
    if (!searchText.trim()) return;
    executeSearch();
  };

  return (
    <View style={styles(theme).searchContainer}>
      <View style={styles(theme).inputContainer}>
        <Icon 
          style={{ marginRight: 2 }} 
          name="search-outline" 
          size={24} 
          color={theme.colors.primary} 
        />
        <TextInput
          style={styles(theme).searchInput}
          placeholder={placeholder}
          placeholderTextColor={theme.colors.secondary}
          value={searchText}
          onChangeText={handleChangeText}
          onSubmitEditing={handleSubmitEditing}
          returnKeyType='search'
        />
        {searchText && (
          <TouchableOpacity onPress={clearSearchText}>
            <Icon 
              name="close-outline" 
              size={24} 
              color={theme.colors.primary} 
            />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

const styles = (theme: any) => StyleSheet.create({
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 10,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.card,
    borderRadius: 20,
    paddingHorizontal: 10,
    width: 300,
    borderWidth: 0,
    borderColor: theme.colors.text,
  },
  searchInput: {
    flex: 1,
    color: theme.colors.text,
    fontSize: 16,
    paddingVertical: 8,
    paddingHorizontal: 5,
  }
});