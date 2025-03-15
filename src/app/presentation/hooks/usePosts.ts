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

  const getPostsMostLikes = (username: string) => {
    return useQuery({
      queryKey: ['postsMostLikes', username],
      queryFn: async () => {
        const response = await api.get<Post[]>(`/posts?author=${username}`);
        
        const sortedData = [...(response.data || [])].sort((a, b) => (b.likes || 0) - (a.likes || 0));
        
        return sortedData.slice(0, 3);
      },
      enabled: !!username,
      staleTime: 0,
      refetchOnWindowFocus: true
    });
  };

  const getRecentPosts = () => {
    return useQuery({
      queryKey: ['recentPosts'],
      queryFn: async () => {
        const response = await api.get<Post[]>('/posts?_sort=date&_order=desc');
        return response.data || [];
      },
    });
  };

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

  const updatePost = () => {
    return useMutation({
      mutationFn: async (updatedPost: Post) => {
        const response = await api.put<Post>(`/posts/${updatedPost.id}`, updatedPost);
        return response.data;
      },
      onSuccess: (data) => {
        queryClient.invalidateQueries({ queryKey: ['posts'] });
        queryClient.invalidateQueries({ queryKey: ['recentPosts'] });
        
        if (data && data.author) {
          queryClient.invalidateQueries({ queryKey: ['postsMostLikes', data.author] });
        } else {
          queryClient.invalidateQueries({ queryKey: ['postsMostLikes'] });
        }
      },
    });
  };

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

  const updatePostLikes = () => {
    return useMutation({
      mutationFn: async ({ postId, likes, liked }: { postId: string | number, likes: number, liked: string[] }) => {
        const response = await api.patch<Post>(`/posts/${postId}`, { 
          likes,
          liked
        });
        
        return response.data;
      },
      onSuccess: (data) => {
        queryClient.invalidateQueries({ queryKey: ['posts'] });
      
        queryClient.invalidateQueries({ queryKey: ['recentPosts'] });
        
        if (data && data.id) {
          queryClient.invalidateQueries({ queryKey: ['posts', data.id] });
        }
        
        if (data && data.author) {
          queryClient.invalidateQueries({ queryKey: ['posts', data.author] });
          
          queryClient.invalidateQueries({ queryKey: ['postsMostLikes', data.author] });
        }
        
        queryClient.invalidateQueries({ 
          predicate: (query) => query.queryKey[0] === 'postsMostLikes'
        });
        
        setTimeout(() => {
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