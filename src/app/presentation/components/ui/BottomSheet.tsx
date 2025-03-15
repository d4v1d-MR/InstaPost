import React, { useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  Animated,
  Dimensions,
  TouchableWithoutFeedback,
  ScrollView,
  TextInput
} from 'react-native';
import Icon from '@react-native-vector-icons/ionicons';
import { useTheme } from '../../hooks';

interface Props {
  visible: boolean;
  onClose: () => void;
  onApply: (filters: FilterOptions) => void;
}

export interface FilterOptions {
  sortBy: 'recent' | 'oldest' | 'likes';
  // author: string;
}

export const BottomSheet = ({ visible, onClose, onApply }: Props) => {
  const { theme } = useTheme();
  const [sortBy, setSortBy] = React.useState<'recent' | 'oldest' | 'likes'>('recent');
  // const [filterByAuthor, setFilterByAuthor] = React.useState('');
  
  // Animación para el bottom sheet
  const bottomSheetAnim = useRef(new Animated.Value(0)).current;
  
  useEffect(() => {
    if (visible) {
      Animated.timing(bottomSheetAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }).start();
    } else {
      Animated.timing(bottomSheetAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start();
    }
  }, [visible]);
  
  const translateY = bottomSheetAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [Dimensions.get('window').height, 0],
  });

  const handleApply = () => {
    onApply({
      sortBy
      // author: filterByAuthor
    });
    onClose();
  };

  const handleReset = () => {
    setSortBy('recent');
    // setFilterByAuthor('');
  };

  return (
    <Modal
      transparent={true}
      visible={visible}
      animationType="none"
      onRequestClose={onClose}
    >
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={styles(theme).modalOverlay}>
          <TouchableWithoutFeedback>
            <Animated.View 
              style={[
                styles(theme).bottomSheetContainer,
                { transform: [{ translateY }] }
              ]}
            >
              <View style={styles(theme).bottomSheetHeader}>
                <Text style={styles(theme).bottomSheetTitle}>Filtrar Posts</Text>
                <TouchableOpacity onPress={onClose}>
                  <Icon name="close-outline" size={24} color={theme.colors.text} />
                </TouchableOpacity>
              </View>
              
              <ScrollView style={styles(theme).bottomSheetContent}>
                <Text style={styles(theme).filterSectionTitle}>Ordenar por</Text>
                
                <TouchableOpacity 
                  style={[
                    styles(theme).filterOption,
                    sortBy === 'recent' && styles(theme).selectedFilterOption
                  ]}
                  onPress={() => setSortBy('recent')}
                >
                  <Text 
                    style={[
                      styles(theme).filterOptionText,
                      sortBy === 'recent' && styles(theme).selectedFilterOptionText
                    ]}
                  >
                    Más recientes primero
                  </Text>
                  {sortBy === 'recent' && (
                    <Icon name="checkmark" size={20} color={theme.colors.primary} />
                  )}
                </TouchableOpacity>
                
                <TouchableOpacity 
                  style={[
                    styles(theme).filterOption,
                    sortBy === 'oldest' && styles(theme).selectedFilterOption
                  ]}
                  onPress={() => setSortBy('oldest')}
                >
                  <Text 
                    style={[
                      styles(theme).filterOptionText,
                      sortBy === 'oldest' && styles(theme).selectedFilterOptionText
                    ]}
                  >
                    Más antiguos primero
                  </Text>
                  {sortBy === 'oldest' && (
                    <Icon name="checkmark" size={20} color={theme.colors.primary} />
                  )}
                </TouchableOpacity>
                
                <TouchableOpacity 
                  style={[
                    styles(theme).filterOption,
                    sortBy === 'likes' && styles(theme).selectedFilterOption
                  ]}
                  onPress={() => setSortBy('likes')}
                >
                  <Text 
                    style={[
                      styles(theme).filterOptionText,
                      sortBy === 'likes' && styles(theme).selectedFilterOptionText
                    ]}
                  >
                    Más likes
                  </Text>
                  {sortBy === 'likes' && (
                    <Icon name="checkmark" size={20} color={theme.colors.primary} />
                  )}
                </TouchableOpacity>
                
                {/* <Text style={styles(theme).filterSectionTitle}>Filtrar por usuario</Text>
                <View style={styles(theme).authorFilterContainer}>
                  <TextInput
                    style={styles(theme).authorFilterInput}
                    placeholder="Nombre del usuario"
                    placeholderTextColor={theme.colors.secondary}
                    value={filterByAuthor}
                    onChangeText={setFilterByAuthor}
                  />
                </View> */}
              </ScrollView>
              
              <View style={styles(theme).bottomSheetFooter}>
                <TouchableOpacity 
                  style={styles(theme).resetButton}
                  onPress={handleReset}
                >
                  <Text style={styles(theme).resetButtonText}>Restablecer</Text>
                </TouchableOpacity>
                
                <TouchableOpacity 
                  style={styles(theme).applyButton}
                  onPress={handleApply}
                >
                  <Text style={styles(theme).applyButtonText}>Aplicar</Text>
                </TouchableOpacity>
              </View>
            </Animated.View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

const styles = (theme: any) => StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  bottomSheetContainer: {
    backgroundColor: theme.colors.background,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingTop: 16,
    paddingHorizontal: 16,
    paddingBottom: 30,
    maxHeight: Dimensions.get('window').height * 0.7,
  },
  bottomSheetHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  bottomSheetTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: theme.colors.text,
  },
  bottomSheetContent: {
    marginBottom: 20,
  },
  filterSectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: theme.colors.text,
    marginTop: 16,
    marginBottom: 8,
  },
  filterOption: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    marginBottom: 8,
  },
  selectedFilterOption: {
    backgroundColor: `${theme.colors.primary}20`,
  },
  filterOptionText: {
    fontSize: 16,
    color: theme.colors.text,
  },
  selectedFilterOptionText: {
    color: theme.colors.primary,
    fontWeight: '500',
  },
  authorFilterContainer: {
    marginTop: 8,
  },
  authorFilterInput: {
    backgroundColor: theme.colors.background,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    color: theme.colors.text,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  bottomSheetFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 16,
  },
  resetButton: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: theme.colors.border,
    flex: 1,
    marginRight: 8,
    alignItems: 'center',
  },
  resetButtonText: {
    color: theme.colors.text,
    fontWeight: '500',
  },
  applyButton: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    backgroundColor: theme.colors.primary,
    flex: 1,
    marginLeft: 8,
    alignItems: 'center',
  },
  applyButtonText: {
    color: 'white',
    fontWeight: '500',
  },
});