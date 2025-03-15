// app/hooks/usePosts.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import useApi from './useApi';

export type Post = {
  id?: string;
  description: string;
  author: string;
  image: string;
  likes: number;
  date: string;
  liked: string[];
};

export const usePosts = () => {
  const api = useApi();
  const queryClient = useQueryClient();

  // Obtener todos los posts ordenados por fecha (más recientes primero)
  const getPosts = () => {
    return useQuery({
      queryKey: ['posts'],
      queryFn: async () => {
        const response = await api.get<Post[]>('/posts?_sort=date&_order=desc');
        return response.data || [];
      },
      staleTime: 30 * 1000
    });
  };

  // Obtener los posts con más likes del usuario registrado
  const getPostsMostLikes = (username: string) => {
    return useQuery({
      queryKey: ['postsMostLikes', username],
      queryFn: async () => {
        // Obtener todos los posts del usuario sin límite ni ordenación en la API
        const response = await api.get<Post[]>(`/posts?author=${username}`);
        
        // Ordenar manualmente los posts por número de likes (de mayor a menor)
        const sortedData = [...(response.data || [])].sort((a, b) => (b.likes || 0) - (a.likes || 0));
        
        // Devolver solo los 3 primeros posts (los que tienen más likes)
        return sortedData.slice(0, 3);
      },
      enabled: !!username,
      staleTime: 0, // Cambiar a 0 para que siempre se refresque al hacer refetch
      refetchOnWindowFocus: true // Refrescar cuando la ventana obtiene el foco
    });
  };

  // Obtener los posts más recientes
  const getRecentPosts = () => {
    return useQuery({
      queryKey: ['recentPosts'],
      queryFn: async () => {
        const response = await api.get<Post[]>('/posts?_sort=date&_order=desc');
        return response.data || [];
      },
    });
  };

  // Obtener un post por ID
  const getPost = (id: string) => {
    return useQuery({
      queryKey: ['posts', id],
      queryFn: async () => {
        const response = await api.get<Post>(`/posts/${id}`);
        return response.data;
      },
      enabled: !!id,
    });
  };

  // Obtener un post por usuario
  const getPostByUser = (username: string, options = {}) => {
    return useQuery({
      queryKey: ['posts', username],
      queryFn: async () => {
        const response = await api.get<Post[]>(`/posts?author=${username}&_sort=date&_order=desc`);
        return response.data;
      },
      enabled: !!username,
      ...options
    });
  };

  // Crear un nuevo post
  const createPost = () => {
    return useMutation({
      mutationFn: async (newPost: Post) => {
        const response = await api.post<Post>('/posts', newPost);
        return response.data;
      },
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['posts'] });
      },
    });
  };

  // Actualizar un post existente
  const updatePost = () => {
    return useMutation({
      mutationFn: async (updatedPost: Post) => {
        const response = await api.put<Post>(`/posts/${updatedPost.id}`, updatedPost);
        return response.data;
      },
      onSuccess: (data) => {
        // Invalidar todas las queries relacionadas con posts para asegurar que los cambios se reflejen en todas las vistas
        queryClient.invalidateQueries({ queryKey: ['posts'] });
        queryClient.invalidateQueries({ queryKey: ['recentPosts'] });
        
        // Invalidar específicamente la query de postsMostLikes para el autor del post
        if (data && data.author) {
          queryClient.invalidateQueries({ queryKey: ['postsMostLikes', data.author] });
        } else {
          queryClient.invalidateQueries({ queryKey: ['postsMostLikes'] });
        }
      },
    });
  };

  // Eliminar un post
  const deletePost = () => {
    return useMutation({
      mutationFn: async (id: string) => {
        await api.delete(`/posts/${id}`);
        return id;
      },
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['posts'] });
      },
    });
  };

  // Actualizar los likes de un post
  const updatePostLikes = () => {
    return useMutation({
      mutationFn: async ({ postId, likes, liked }: { postId: string | number, likes: number, liked: string[] }) => {
        // Actualizamos solo el campo de likes
        const response = await api.patch<Post>(`/posts/${postId}`, { 
          likes,
          liked
        });
        
        return response.data;
      },
      onSuccess: (data) => {
        // Invalidar TODAS las consultas relacionadas con posts para asegurar actualización en todas las vistas
        
        // Invalidar consultas generales de posts
        queryClient.invalidateQueries({ queryKey: ['posts'] });
        
        // Invalidar consultas de posts recientes
        queryClient.invalidateQueries({ queryKey: ['recentPosts'] });
        
        // Invalidar consulta específica del post actualizado
        if (data && data.id) {
          queryClient.invalidateQueries({ queryKey: ['posts', data.id] });
        }
        
        // Invalidar consultas de posts por usuario
        if (data && data.author) {
          // Invalidar posts del autor
          queryClient.invalidateQueries({ queryKey: ['posts', data.author] });
          
          // Invalidar posts con más likes del autor
          queryClient.invalidateQueries({ queryKey: ['postsMostLikes', data.author] });
        }
        
        // Invalidar todas las consultas de postsMostLikes (para todos los usuarios)
        queryClient.invalidateQueries({ 
          predicate: (query) => query.queryKey[0] === 'postsMostLikes'
        });
        
        // Forzar una actualización de la UI
        setTimeout(() => {
          // Refrescar explícitamente todas las consultas de posts después de un breve retraso
          // para asegurar que la UI se actualice
          queryClient.refetchQueries({ queryKey: ['posts'] });
          queryClient.refetchQueries({ queryKey: ['recentPosts'] });
          queryClient.refetchQueries({ 
            predicate: (query) => query.queryKey[0] === 'postsMostLikes'
          });
        }, 100);
      },
    });
  };

  return {
    getPosts,
    getPostsMostLikes,
    getRecentPosts,
    getPost,
    getPostByUser,
    createPost,
    updatePost,
    deletePost,
    updatePostLikes
  };
};