import React, { useState, useEffect } from 'react'
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native'
import Icon from '@react-native-vector-icons/ionicons';
import { useLoggedUser, useTheme } from '../hooks';
import { PostButtons } from '../components/PostButtons';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { usePosts } from '../hooks/usePosts';
import { getTimeAgo } from '../../config/helpers/getTimeAgo';
import { useQueryClient } from '@tanstack/react-query';

type RootStackParamList = {
  EditPost: { postId?: string, fromScreen: string };
};

type PostNavigationProp = StackNavigationProp<RootStackParamList, 'EditPost'>;

interface PostProps {
  id: number;
  description: string;
  author: string;
  imageUrl: string;
  date?: string;
  isCurrentUser?: boolean;
  likes?: number;
  liked?: string[];
  numberOfLines?: number;
  fromScreen: string;
}

export const Post = ({
  id,
  description,
  author,
  imageUrl,
  date = '',
  isCurrentUser = false,
  likes = 0,
  liked = [],
  numberOfLines,
  fromScreen
}: PostProps) => {
  const { theme } = useTheme();
  const navigation = useNavigation<PostNavigationProp>();
  const [likeCount, setLikeCount] = useState(likes);
  const {username} = useLoggedUser();
  const [isLiked, setIsLiked] = useState(liked.includes(username!));
  const { updatePostLikes } = usePosts();
  const { mutate: updateLikes } = updatePostLikes();
  const queryClient = useQueryClient();

  // Actualizar el estado local cuando cambian las props
  useEffect(() => {
    setLikeCount(likes);
    setIsLiked(liked.includes(username!));
  }, [likes, liked, username]);

  const handlePostPress = () => {
    navigation.navigate('EditPost', { postId: id.toString(), fromScreen: fromScreen});
  };

  const handleLikePress = (e: React.TouchEvent<HTMLElement> | any) => {
    e.stopPropagation();
    
    // Actualizar estado local inmediatamente para UI responsiva
    const newIsLiked = !isLiked;
    setIsLiked(newIsLiked);
    const newLikeCount = newIsLiked ? likeCount + 1 : likeCount - 1;
    setLikeCount(newLikeCount);

    // Preparar los datos actualizados
    const updatedLiked = newIsLiked 
      ? [...liked, username!] 
      : liked.filter(name => name !== username!);

    // Actualizar en el servidor
    updateLikes({ 
      postId: id, 
      likes: newLikeCount,
      liked: updatedLiked,
    }, {
      onSuccess: () => {
        // Invalidar TODAS las consultas relacionadas con posts
        queryClient.invalidateQueries({ queryKey: ['posts'] });
        
        // Invalidar consultas específicas
        queryClient.invalidateQueries({ queryKey: ['posts', id.toString()] });
        queryClient.invalidateQueries({ queryKey: ['recentPosts'] });
        
        // Invalidar consultas por autor
        if (author) {
          queryClient.invalidateQueries({ queryKey: ['posts', author] });
          queryClient.invalidateQueries({ queryKey: ['postsMostLikes', author] });
        }
        
        // Invalidar todas las consultas de postsMostLikes
        queryClient.invalidateQueries({ 
          predicate: (query) => query.queryKey[0] === 'postsMostLikes'
        });
        
        // Forzar refetch inmediato de todas las consultas relevantes
        setTimeout(() => {
          queryClient.refetchQueries({ queryKey: ['posts'] });
          queryClient.refetchQueries({ queryKey: ['recentPosts'] });
          queryClient.refetchQueries({ 
            predicate: (query) => query.queryKey[0] === 'postsMostLikes'
          });
        }, 50);
      },
      // En caso de error, revertir los cambios locales
      onError: () => {
        setIsLiked(!newIsLiked);
        setLikeCount(likeCount);
      }
    });
  };

  return (
    <TouchableOpacity 
      style={styles(theme).container}
      onPress={handlePostPress}
      activeOpacity={0.9}
    >
      <Image 
        source={{ uri: imageUrl }} 
        style={styles(theme).image}
        resizeMode='cover'
      />
      
      <View style={styles(theme).content}>
        <View style={styles(theme).interactionButtons}>
          <TouchableOpacity 
            style={styles(theme).interactionButton}
            onPress={handleLikePress}
            activeOpacity={0.7}
          >
            <Icon 
              name={isLiked ? 'heart' : 'heart-outline'} 
              size={24} 
              color={isLiked ? theme.colors.error : theme.colors.text} 
            />
            <Text style={styles(theme).interactionText}>{likeCount}</Text>
          </TouchableOpacity>
          <Text style={styles(theme).dateText}>{getTimeAgo(date)}</Text>
        </View>
        <View style={styles(theme).authorContainer}>
          <Text numberOfLines={numberOfLines} style={styles(theme).contentText}>
            <Text style={styles(theme).authorName}>{author}</Text> {description}
          </Text>
        </View>
      </View>
      
    </TouchableOpacity>
  );
};

const styles = (theme: any) => StyleSheet.create({
  container: {
    backgroundColor: theme.colors.card,
    borderRadius: 20,
    marginBottom: theme.spacing.md,
    padding: 0,
    borderColor: theme.colors.text,
    borderWidth: 1,
    overflow: 'hidden',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.md,
    position: 'absolute',
    top: 0,
    right: 0,
    zIndex: 1,
    padding: theme.spacing.sm,
  },
  authorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  authorName: {
    fontWeight: 'bold',
    color: theme.colors.text,
    paddingRight: 5,
    fontSize: theme.typography.fontSize.md,
  },
  content: {
    marginBottom: theme.spacing.md,
    paddingHorizontal: theme.spacing.md,
  },
  contentText: {
    fontSize: theme.typography.fontSize.md,
    color: theme.colors.text,
    lineHeight: 22,
  },
  image: {
    width: '100%',
    height: 250,
    borderRadius: 0,
    marginBottom: 0,
  },
  interactionButtons: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  interactionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 5,
    marginRight: 15
  },
  interactionText: {
    color: theme.colors.text,
    marginLeft: 4,
    fontWeight: '600',
  },
  dateText: {
    color: theme.colors.text,
    fontSize: theme.typography.fontSize.sm,
  },
});
