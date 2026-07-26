import axios from 'axios';
import * as SecureStore from "expo-secure-store";

const api = axios.create({
    baseURL: "http://localhost:5001",
    headers: {
        'Content-Type': 'application/json'
    }
});

// Automatically add token to request if it exists
api.interceptors.request.use(async (config) => {
  const token = await SecureStore.getItemAsync("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;