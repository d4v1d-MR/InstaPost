import React, { useState, useCallback } from 'react';
import { View, Text, StyleSheet, Image, ScrollView, FlatList, Dimensions, RefreshControl } from 'react-native';
import { useTheme, useLoggedUser } from '../hooks';
import { Post } from '../layouts/Post';
import { usePosts } from '../hooks/usePosts';
import { useQueryClient } from '@tanstack/react-query';
import { Loading } from '../components/ui/Loading';
import { EmptyData } from '../components/EmptyData';

export const HomeScreen = () => {
  const { theme } = useTheme();
  const { username } = useLoggedUser();
  const { getPostsMostLikes } = usePosts();
  const [refreshing, setRefreshing] = useState(false);
  const queryClient = useQueryClient();
  
  const { 
    data: allPosts = [], 
    isLoading: isLoadingAllPosts, 
    isError: isErrorAllPosts, 
    error: errorAllPosts, 
    refetch: refetchPostsMostLikes 
  } = getPostsMostLikes(username!);

  const renderItem = ({ item }: any) => (
    <View style={styles(theme).postContainer}>
      <Post
        id={item.id}
        description={item.description}
        likes={item.likes}
        fromScreen='Home'
        liked={item.liked}
        author={item.author}
        imageUrl={item.image}
        date={item.date}
        isCurrentUser={item.author === username}
        numberOfLines={2}
      />
    </View>
  );

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    try {
      // Invalidar la caché antes de refrescar
      queryClient.invalidateQueries({ queryKey: ['postsMostLikes', username] });
      
      await refetchPostsMostLikes();
      
      console.log('Refresh completado');
    } catch (error) {
      console.error('Error al refrescar:', error);
    } finally {
      setRefreshing(false);
    }
  }, [username, refetchPostsMostLikes, queryClient]);

  return (
    <ScrollView 
      style={styles(theme).container}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={onRefresh}
          colors={[theme.colors.primary]}
          tintColor={theme.colors.primary}
        />
      }
    >
      <View style={styles(theme).header}>
        <Text style={styles(theme).greeting}>¡Bienvenido, </Text>
        <Text style={styles(theme).greetingUserName}>{username}!</Text>
      </View>

      <Text style={styles(theme).title}>Tus posts con más likes</Text>

      {isLoadingAllPosts ? (
        <Loading />
      ) : isErrorAllPosts ? (
        <Text style={styles(theme).errorText}>Error: {errorAllPosts?.message}</Text>
      ) : allPosts?.length === 0 ? (
        <View style={styles(theme).emptyContainer}>
          <EmptyData label="Todavía no has publicado ningún posts" />
        </View>
      ) : (
        <FlatList
          horizontal
          showsHorizontalScrollIndicator={false}
          data={allPosts}
          renderItem={renderItem}
          keyExtractor={(item: any) => item.id.toString()}
          style={styles(theme).list}
          contentContainerStyle={styles(theme).listContent}
          ItemSeparatorComponent={() => <View style={styles(theme).separator} />}
          />
        )}
    </ScrollView>
  );
};

const styles = (theme: any) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
    marginVertical: theme.spacing.xl,
    padding: theme.spacing.md,
  },
  header: {
    alignItems: 'center',
    marginVertical: theme.spacing.xl,
  },
  greeting: {
    fontSize: 60,
    fontWeight: 'bold',
    color: theme.colors.primary,
    marginBottom: theme.spacing.sm,
    alignSelf: 'flex-start'
  },
  greetingUserName: {
    fontSize: theme.typography.fontSize.xxl,
    fontWeight: 'bold',
    color: theme.colors.primary,
    marginBottom: theme.spacing.sm,
    alignSelf: 'flex-start'
  },
  title: {
    fontSize: theme.typography.fontSize.xxl,
    fontWeight: 'bold',
    color: theme.colors.text,
    marginBottom: theme.spacing.sm,
  },
  subtitle: {
    fontSize: theme.typography.fontSize.md,
    textAlign: 'center',
    color: theme.colors.secondary,
    paddingHorizontal: theme.spacing.lg,
  },
  list: {
    marginTop: theme.spacing.md,
  },
  listContent: {
    paddingRight: theme.spacing.md,
    alignItems: 'center',
  },
  postContainer: {
    width: 350,
    height: 450,
    marginRight: 0,
  },
  separator: {
    width: theme.spacing.md,
  },
  errorText: {
    color: theme.colors.error,
    textAlign: 'center',
    marginTop: theme.spacing.lg,
  },
  emptyContainer: {
    height: 300,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    width: '100%',
  },
});