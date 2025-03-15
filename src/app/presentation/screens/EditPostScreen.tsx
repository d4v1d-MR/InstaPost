import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, StyleSheet, ScrollView, TouchableOpacity, Image, ActivityIndicator, Dimensions, Alert } from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { useLoggedUser, useTheme, useForm } from '../hooks';
import { usePosts, Post } from '../hooks/usePosts';
import Icon from '@react-native-vector-icons/ionicons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { PostButtons } from '../components/PostButtons';
import { getTimeAgo } from '../../config/helpers/getTimeAgo';
import { useQueryClient } from '@tanstack/react-query';
import Toast from 'react-native-toast-message';

const { width, height } = Dimensions.get('window');

type RootStackParamList = {
  EditPost: { postId?: string, isNewPost?: boolean, fromScreen: string };
  Posts: undefined;
  MainScreen: { screen: 'Posts' };
};

type EditPostScreenRouteProp = RouteProp<RootStackParamList, 'EditPost'>;
type EditPostScreenNavigationProp = StackNavigationProp<RootStackParamList>;

interface FormValues {
  description: string;
  image: string;
}

interface FormErrors {
  description?: string;
}

export const EditPostScreen = () => {
  const { theme } = useTheme();
  const { username } = useLoggedUser();
  const navigation = useNavigation<EditPostScreenNavigationProp>();
  const route = useRoute<EditPostScreenRouteProp>();
  const { postId, isNewPost, fromScreen } = route.params || {};
  const { top } = useSafeAreaInsets();

  const randomImageId = Math.floor(Math.random() * 555);
  const initialImage = `https://picsum.photos/id/${randomImageId}/400/400`;

  const { getPost, createPost, updatePost, deletePost, updatePostLikes } = usePosts();
  const { data: post, isLoading } = getPost(postId!);
  const createPostMutation = createPost();
  const updatePostMutation = updatePost();
  const deletePostMutation = deletePost();

  const isCurrentUserAuthor = post ? post.author === username : true;
  const isEditing = !!postId && isCurrentUserAuthor;
  const [isEdit, setIsEdit] = useState<boolean>(false);
  const [likeCount, setLikeCount] = useState<number | undefined>(post?.likes);
  const [isLiked, setIsLiked] = useState(!!post?.liked?.includes(username!));
  const { mutate: updateLikes } = updatePostLikes();
  const queryClient = useQueryClient();

  // Configuración del formulario con useForm
  const {
    values,
    errors,
    handleChange,
    handleSubmit,
    setValues,
    isSubmitting
  } = useForm<FormValues>({
    initialValues: {
      description: '',
      image: initialImage
    },
    validate: (values) => {
      const formErrors: FormErrors = {};
      if (!values.description.trim()) {
        formErrors.description = 'La descripción es obligatoria';
      }
      return formErrors;
    },
    onSubmit: async (values) => {
      try {
        if (isEditing && postId) {
          // Para actualización, preservar datos originales importantes
          await updatePostMutation.mutateAsync({
            id: postId,
            description: values.description,
            author: post!.author, // Preservar autor original
            image: values.image,
            likes: post!.likes || 0, // Preservar likes
            date: post!.date, // Preservar fecha original
            liked: post!.liked // Preservar likes
          });
          Toast.show({
            type: 'success',
            text1: 'Post actualizado',
            text2: 'Tu post se ha actualizado correctamente',
            position: 'bottom',
            visibilityTime: 3000,
            swipeable: true
          });
        } else {
          // Para creación, usar datos nuevos
          const postData: Post = {
            description: values.description,
            author: username!,
            image: values.image,
            likes: 0,
            date: new Date().toISOString(),
            liked: []
          };
          await createPostMutation.mutateAsync(postData);
          Toast.show({
            type: 'success',
            text1: 'Post creado',
            text2: 'Tu post se ha publicado correctamente',
            position: 'bottom',
            visibilityTime: 3000,
            swipeable: true
          });
        }

        navigation.reset({
          index: 0,
          routes: [
            {
              name: 'MainScreen',
              params: { screen: fromScreen }
            }
          ],
        });
      } catch (error) {
        Toast.show({
          type: 'error',
          text1: 'Error',
          text2: 'Hubo un problema al guardar el post',
          position: 'bottom',
          visibilityTime: 3000,
          swipeable: true
        });
        console.error(error);
      }
    }
  });

  const handleDeletePost = () => {
    Alert.alert('Eliminar Post', '¿Estás seguro de eliminar este post?', [
      {
        text: 'Cancelar',
        onPress: () => {},
        style: 'cancel',
      },
      {
        text: 'Eliminar',
          onPress: async () => {
            try {
              await deletePostMutation.mutateAsync(postId!);
              Toast.show({
                type: 'success',
                text1: 'Post eliminado',
                text2: 'Tu post se ha eliminado correctamente',
                position: 'bottom',
                visibilityTime: 3000,
                swipeable: true
              });
              navigation.reset({
                index: 0,
                routes: [
                  {
                    name: 'MainScreen',
                    params: { screen: fromScreen }
                  }
                ],
              });
            } catch (error) {
              Toast.show({
                type: 'error',
                text1: 'Error',
                text2: 'Hubo un problema al eliminar el post',
                position: 'bottom',
                visibilityTime: 3000,
                swipeable: true
              });
              console.error(error);
            }
          }
      }
    ]);
  };

  useEffect(()=>{
    if(!isLoading){
      setLikeCount(post?.likes);
      setIsLiked(!!post?.liked?.includes(username!));
    }
  }, [isLoading])

  // Cargar datos del post si estamos editando
  useEffect(() => {
    if (post) {
      setValues({
        description: post.description || '',
        image: post.image || initialImage
      });
    }
  }, [post, setValues]);

  const handleLikePress = (e: React.TouchEvent<HTMLElement> | any) => {
    e.stopPropagation();
    const newIsLiked = !isLiked;
    setIsLiked(newIsLiked);
    const newLikeCount = newIsLiked ? (likeCount! + 1) : (likeCount! - 1);
    setLikeCount(newLikeCount);

    // Preparar los datos actualizados de likes
    const updatedLiked = newIsLiked 
      ? [...(post?.liked || []), username!] 
      : (post?.liked || []).filter(name => name !== username!);

    // Actualizar en el servidor
    updateLikes({ 
      postId: postId!, 
      likes: newLikeCount,
      liked: updatedLiked,
    }, {
      onSuccess: () => {
        // Invalidar TODAS las consultas relacionadas con posts
        // const queryClient = updatePostMutation.client;
        
        // Invalidar consultas generales
        queryClient.invalidateQueries({ queryKey: ['posts'] });
        queryClient.invalidateQueries({ queryKey: ['recentPosts'] });
        
        // Invalidar consulta específica del post
        queryClient.invalidateQueries({ queryKey: ['posts', postId] });
        
        // Invalidar consultas por autor
        if (post?.author) {
          queryClient.invalidateQueries({ queryKey: ['posts', post.author] });
          queryClient.invalidateQueries({ queryKey: ['postsMostLikes', post.author] });
        }
        
        // Invalidar todas las consultas de postsMostLikes
        queryClient.invalidateQueries({ 
          predicate: (query: any) => query.queryKey[0] === 'postsMostLikes'
        });
        
        // Forzar refetch inmediato
        setTimeout(() => {
          queryClient.refetchQueries({ queryKey: ['posts'] });
          queryClient.refetchQueries({ queryKey: ['recentPosts'] });
          queryClient.refetchQueries({ 
            predicate: (query: any) => query.queryKey[0] === 'postsMostLikes'
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

  const getRandomImage = () => {
    const randomImageId = Math.floor(Math.random() * 555);
    const newImageUrl = `https://picsum.photos/id/${randomImageId}/400/400`;
    handleChange('image', newImageUrl);
  };

  if (isLoading && isEditing) {
    return (
      <View style={[styles.container, { backgroundColor: theme.colors.background, marginTop: top }]}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
      </View>
    );
  }

  return (
    <ScrollView style={[styles.container, { backgroundColor: theme.colors.background, marginTop: top }]}>
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButton}
        >
          <Icon name="arrow-back" size={24} color={theme.colors.primary} />
        </TouchableOpacity>

        {(isEdit || isNewPost) && (
          <Text style={[styles.headerTitle, { color: theme.colors.text }]}>
            {isEdit ? 'Editar Post' : isNewPost ? 'Nuevo Post' : ''}
          </Text>
        )}
        {isNewPost && (
          <View style={styles.spacer} /> 
        )} 
        {username === post?.author && (
          <PostButtons
            onEdit={() => setIsEdit(!isEdit)}
            isEdit={isEdit}
            onDelete={handleDeletePost}
          />
        )}
      </View>


      <View style={styles.formContainer}>
        <View style={styles.imageContainer}>
          <Image
            source={{ uri: values.image }}
            style={styles.previewImage}
            resizeMode="cover"
          />
          {(isEdit || isNewPost) && (
            <TouchableOpacity
              style={[styles.randomImageButton, { backgroundColor: theme.colors.primary }]}
              onPress={getRandomImage}
            >
              <Icon name="shuffle-outline" size={30} color="#fff" />
            </TouchableOpacity>
          )}
        </View>

        <View style={{
          marginBottom: theme.spacing.xs
        }}>
          <View style={styles.interactionButtons}>
            {!isNewPost && (
              <TouchableOpacity
                style={styles.interactionButton}
                onPress={handleLikePress}
                activeOpacity={0.7}
              >
                <Icon
                  name={isLiked ? 'heart' : 'heart-outline'}
                  size={24}
                  color={isLiked ? theme.colors.error : theme.colors.text}
                />
                <Text style={[styles.interactionText, { color: theme.colors.text }]}>{likeCount}</Text>
              </TouchableOpacity>
            )}
            {post?.date && (
              <Text style={{ color: theme.colors.text, fontSize: theme.typography.fontSize.sm }}>{getTimeAgo(post.date)}</Text>
            )}
          </View>
        </View>

        <Text style={[styles.label, { color: theme.colors.text }]}>{isNewPost ? 'Descripción' : post?.author}</Text>
        <TextInput
          style={[
            styles.textArea,
            {
              color: theme.colors.text,
              backgroundColor: theme.colors.background,
              borderColor: errors.description ? theme.colors.error : theme.colors.text
            }
          ]}
          editable={isNewPost || isEdit}
          value={values.description}
          onChangeText={(text) => handleChange('description', text)}
          placeholder="¿Qué estás pensando?"
          placeholderTextColor={theme.colors.secondary}
          multiline
          numberOfLines={5}
          textAlignVertical="top"
        />
        {errors.description && <Text style={styles.errorText}>{errors.description}</Text>}

        {(isNewPost || isEdit) && (
          <TouchableOpacity
            style={[
              styles.submitButton,
              {
                backgroundColor: theme.colors.primary,
                opacity: isSubmitting ? 0.7 : 1
              }
            ]}
            onPress={handleSubmit}
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <ActivityIndicator size="small" color="#fff" />
            ) : (
              <Text style={styles.submitButtonText}>
                {isEdit ? 'Actualizar' : isNewPost ? 'Publicar' : ''}
              </Text>
            )}
          </TouchableOpacity>
        )}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  spacer: {
    width: 40,
  },
  formContainer: {
    padding: 16,
  },
  label: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 8,
  },
  textArea: {
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 16,
    marginBottom: 16,
    minHeight: 120,
  },
  errorText: {
    color: 'red',
    marginTop: -12,
    marginBottom: 16,
    fontSize: 14,
  },
  imageContainer: {
    width: width,
    alignSelf: 'center',
    marginBottom: 5,
    position: 'relative',
  },
  previewImage: {
    width: width,
    height: height * 0.4,
  },
  randomImageButton: {
    position: 'absolute',
    bottom: 16,
    right: 16,
    paddingHorizontal: 5,
    paddingVertical: 5,
    borderRadius: 15,
  },
  submitButton: {
    borderRadius: 8,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 8,
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
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
    marginLeft: 4,
    fontWeight: '600',
  }
});