import axios, { AxiosInstance } from 'axios';

const client: AxiosInstance = axios.create();

export const configure = ({ baseURL }: { baseURL: string }) => {
  client.interceptors.request.use((config) => {
    config.baseURL = baseURL;

    return config;
  });
};

export default client;
