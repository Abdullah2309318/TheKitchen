import axios from "axios";
import { useAuth0 } from "@auth0/auth0-react";

export function useApi() {
  const { getAccessTokenSilently, isAuthenticated } = useAuth0();

  const instance = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
    withCredentials: false,
  });

  instance.interceptors.request.use(async (config) => {
    if (isAuthenticated) {
      const token = await getAccessTokenSilently({
        authorizationParams: { audience: import.meta.env.VITE_AUTH0_AUDIENCE },
      });
      config.headers = config.headers ?? {};
      (config.headers as any).Authorization = `Bearer ${token}`;
    }
    return config;
  });

  return instance;
}
