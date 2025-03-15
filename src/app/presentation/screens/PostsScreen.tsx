import React, { useState, useEffect } from 'react'
import { View, Text, FlatList, StyleSheet, RefreshControl } from 'react-native'
import { useLoggedUser, useTheme } from '../hooks'
import { usePosts } from '../hooks/usePosts';
import { Post } from '../layouts/Post';
import { FAB } from '../components/ui/FAB';
import { BottomSheet, FilterOptions } from '../components/ui/BottomSheet';
import { useBottomSheet } from "../hooks/useBottomSheet"
import { StackNavigationProp } from '@react-navigation/stack';
import { useNavigation } from '@react-navigation/native';
import { useSearchBox } from '../hooks/useSearchBox';
import { Loading } from '../components/ui/Loading';
import { Searching } from '../components/Searching';
import { EmptyData } from '../components/EmptyData';

type RootStackParamList = {
  EditPost: { postId?: string, isNewPost?: boolean, fromScreen?: string };
};

type PostsScreenNavigationProp = StackNavigationProp<RootStackParamList, 'EditPost'>;

export const PostsScreen = () => {
  const { theme } = useTheme();
  const { username } = useLoggedUser();
  const navigation = useNavigation<PostsScreenNavigationProp>();
  const { getPosts, getPostByUser, getRecentPosts } = usePosts();
  const { searchQuery, isSearching } = useSearchBox();
  const [refreshing, setRefreshing] = useState(false);
  const [filters, setFilters] = useState<FilterOptions>({
    sortBy: 'recent',
  });

  const { isVisible, hideBottomSheet } = useBottomSheet();

  const {
    data: allPosts = [],
    isLoading: isLoadingAllPosts,
    refetch: refetchAllPosts
  } = getPosts();

  const {
    data: filteredPosts = [],
    isLoading: isLoadingFilteredPosts,
    isError: isErrorFilteredPosts,
    error: errorFilteredPosts,
    refetch: refetchFilteredPosts
  } = getPostByUser(searchQuery, {
    enabled: !!(searchQuery)
  });

  const {
    data: recentPosts = [],
    isLoading: isLoadingRecentPosts,
    refetch: refetchRecentPosts
  } = getRecentPosts();

  const onRefresh = async () => {
    setRefreshing(true);
    try {
      if (searchQuery) {
        await refetchFilteredPosts();
      } else if (filters.sortBy === 'recent') {
        await refetchRecentPosts();
      } else {
        await refetchAllPosts();
      }
    } finally {
      setRefreshing(false);
    }
  };

  const applyFilters = (options: FilterOptions) => {
    setFilters(options);
    onRefresh();
  };

  let postsToShow = allPosts;

  if (searchQuery) {
    postsToShow = filteredPosts ?? [];
  }
  else if (filters.sortBy === 'recent') {
    postsToShow = [...recentPosts].sort((a, b) => {
      const dateA = new Date(a.date).getTime();
      const dateB = new Date(b.date).getTime();
      return dateB - dateA;
    });
  } else if (filters.sortBy === 'oldest') {
    postsToShow = [...recentPosts].sort((a, b) => {
      const dateA = new Date(a.date).getTime();
      const dateB = new Date(b.date).getTime();
      return dateA - dateB;
    });
  } else if (filters.sortBy === 'likes') {
    postsToShow = [...allPosts].sort((a, b) => (b.likes || 0) - (a.likes || 0));
  }

  const isLoading = isLoadingAllPosts ||
    (isLoadingRecentPosts && filters.sortBy === 'recent');
  const isError = isErrorFilteredPosts && !!searchQuery;

  const error = errorFilteredPosts;

  const renderItem = ({ item }: any) => (
    <Post
      id={item.id}
      description={item.description}
      likes={item.likes}
      liked={item.liked}
      author={item.author}
      fromScreen='Posts'
      imageUrl={item.image}
      date={item.date}
      isCurrentUser={item.author === username}
    />
  );

  return (
    <View style={styles(theme).container}>
      {isLoading ? (
        <Loading />
      ) : isError ? (
        <Text style={styles(theme).errorText}>Error: {error?.message}</Text>
      ) : isSearching ? (
        <Searching />
      ) : (searchQuery && filteredPosts?.length === 0) || (!searchQuery && postsToShow.length === 0) ? (
        <EmptyData
          label={searchQuery
            ? "No se encontraron posts"
            : "No hay posts"
          }
          searchQuery={searchQuery}
        />
      ) : (
        <FlatList
          data={postsToShow}
          showsVerticalScrollIndicator={false}
          renderItem={renderItem}
          keyExtractor={(item: any) => item.id.toString()}
          style={styles(theme).list}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              colors={[theme.colors.primary]}
              tintColor={theme.colors.primary}
            />
          }
        />
      )}
      <BottomSheet
        visible={isVisible}
        onClose={() => hideBottomSheet()}
        onApply={applyFilters}
      />
      <FAB
        iconName='add-outline'
        onPress={() => navigation.navigate('EditPost', { isNewPost: true, fromScreen: 'Posts' })}
        style={styles(theme).fab}
      />
    </View>
  );
}

const styles = (theme: any) => StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: theme.spacing.md,
    marginTop: theme.spacing.md,
    backgroundColor: theme.colors.background,
  },
  searchContainer: {
    marginBottom: theme.spacing.md,
  },
  noResultsContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: theme.spacing.lg,
  },
  noResultsText: {
    color: theme.colors.text,
    fontSize: theme.typography.fontSize.md,
    textAlign: 'center',
  },
  errorText: {
    color: theme.colors.error,
    textAlign: 'center',
    marginTop: theme.spacing.lg,
  },
  formContainer: {
    backgroundColor: theme.colors.card,
    padding: theme.spacing.md,
    borderRadius: theme.borderRadius.medium,
    marginBottom: theme.spacing.md,
    ...theme.shadows.small,
  },
  formTitle: {
    fontSize: theme.typography.fontSize.lg,
    fontWeight: 'bold',
    marginBottom: theme.spacing.sm,
    color: theme.colors.text,
  },
  input: {
    backgroundColor: theme.colors.background,
    padding: theme.spacing.sm,
    borderRadius: theme.borderRadius.small,
    marginBottom: theme.spacing.sm,
    color: theme.colors.text,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  contentInput: {
    minHeight: 100,
    textAlignVertical: 'top',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  sectionTitle: {
    fontSize: theme.typography.fontSize.xl,
    fontWeight: 'bold',
    marginBottom: theme.spacing.sm,
    color: theme.colors.text,
  },
  list: {
    flex: 1,
  },
  postItem: {
    backgroundColor: theme.colors.card,
    padding: theme.spacing.md,
    borderRadius: theme.borderRadius.medium,
    marginBottom: theme.spacing.sm,
    ...theme.shadows.small,
  },
  postContent: {
    marginBottom: theme.spacing.sm,
  },
  postTitle: {
    fontSize: theme.typography.fontSize.lg,
    fontWeight: 'bold',
    color: theme.colors.text,
  },
  postBody: {
    marginVertical: theme.spacing.xs,
    color: theme.colors.text,
  },
  postAuthor: {
    fontStyle: 'italic',
    color: theme.colors.secondary,
  },
  fab: {
    position: 'absolute',
    bottom: theme.spacing.lg,
    right: theme.spacing.lg,
  },
});