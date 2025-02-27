import axios, { AxiosInstance } from 'axios';

const client: AxiosInstance = axios.create();

export const configure = ({ baseURL }: { baseURL: string }) => {
  client.defaults.baseURL = baseURL;
};

export default client;
