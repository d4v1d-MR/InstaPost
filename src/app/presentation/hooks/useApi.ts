import axios, { AxiosRequestConfig, AxiosResponse, AxiosError } from 'axios';
import { useState, useCallback } from 'react';
import { Platform } from 'react-native';
import { API_URL_IOS, API_URL_ANDROID } from '@env';

console.log(API_URL_IOS, API_URL_ANDROID);

const BASE_URL = Platform.OS === 'android' ? API_URL_ANDROID : API_URL_IOS;

const api = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

type ApiResponse<T> = {
  data: T | null;
  isLoading: boolean;
  error: Error | null;
};

type ApiMethods = {
  get: <T>(url: string, config?: AxiosRequestConfig) => Promise<ApiResponse<T>>;
  post: <T>(url: string, data?: any, config?: AxiosRequestConfig) => Promise<ApiResponse<T>>;
  put: <T>(url: string, data?: any, config?: AxiosRequestConfig) => Promise<ApiResponse<T>>;
  patch: <T>(url: string, data?: any, config?: AxiosRequestConfig) => Promise<ApiResponse<T>>;
  delete: <T>(url: string, config?: AxiosRequestConfig) => Promise<ApiResponse<T>>;
};

export const useApi = (): ApiMethods => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);

  const handleRequest = useCallback(async <T>(
    requestPromise: Promise<AxiosResponse<T>>
  ): Promise<ApiResponse<T>> => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await requestPromise;
      return { data: response.data, isLoading: false, error: null };
    } catch (err) {
      const error = err as AxiosError;
      setError(error as Error);
      return { data: null, isLoading: false, error: error as Error };
    } finally {
      setIsLoading(false);
    }
  }, []);

  const get = useCallback(async <T>(
    url: string,
    config?: AxiosRequestConfig
  ): Promise<ApiResponse<T>> => {
    return handleRequest<T>(api.get(url, config));
  }, [handleRequest]);

  const post = useCallback(async <T>(
    url: string,
    data?: any,
    config?: AxiosRequestConfig
  ): Promise<ApiResponse<T>> => {
    return handleRequest<T>(api.post(url, data, config));
  }, [handleRequest]);

  const put = useCallback(async <T>(
    url: string,
    data?: any,
    config?: AxiosRequestConfig
  ): Promise<ApiResponse<T>> => {
    return handleRequest<T>(api.put(url, data, config));
  }, [handleRequest]);

  const patch = useCallback(async <T>(
    url: string,
    data?: any,
    config?: AxiosRequestConfig
  ): Promise<ApiResponse<T>> => {
    return handleRequest<T>(api.patch(url, data, config));
  }, [handleRequest]);

  const del = useCallback(async <T>(
    url: string,
    config?: AxiosRequestConfig
  ): Promise<ApiResponse<T>> => {
    return handleRequest<T>(api.delete(url, config));
  }, [handleRequest]);

  return {
    get,
    post,
    put,
    patch,
    delete: del,
  };
};

export default useApi;