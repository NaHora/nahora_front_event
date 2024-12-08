import axios, { AxiosError } from 'axios';
import { useAuth } from '../hooks/auth';

let isRefreshing = false;
let failedRequestQueue: any[] = [];

export function setupAPIClient() {
  const token = localStorage.getItem('@NaHora:token');
  const { signOut } = useAuth();

  const api = axios.create({
    baseURL: import.meta.env.VITE_API,
    headers: {
      Authorization: token ? `Bearer ${token}` : '',
    },
  });

  api.interceptors.response.use(
    (response) => {
      return response;
    },
    (error: AxiosError) => {
      if (error.response?.status === 401) {
        if (
          error.response?.data?.message === 'Token expirou, refaça o login.'
        ) {
          const refreshToken = localStorage.getItem('@NaHora:refreshToken');
          const originalConfig = error.config;

          if (!isRefreshing) {
            isRefreshing = true;

            api
              .post('/sessions/refresh-token', {
                current_refresh_token: refreshToken,
              })
              .then((response) => {
                const { token: newToken, refresh_token: newRefreshToken } =
                  response.data;

                localStorage.setItem('@NaHora:token', newToken);
                localStorage.setItem('@NaHora:refreshToken', newRefreshToken);

                api.defaults.headers['Authorization'] = `Bearer ${newToken}`;

                failedRequestQueue.forEach((request) =>
                  request.onSuccess(newToken)
                );
                failedRequestQueue = [];
              })
              .catch((err) => {
                failedRequestQueue.forEach((request) => request.onFailure(err));
                failedRequestQueue = [];

                signOut();
              })
              .finally(() => {
                isRefreshing = false;
              });
          }

          return new Promise((resolve, reject) => {
            failedRequestQueue.push({
              onSuccess: (newToken: string) => {
                if (originalConfig?.headers) {
                  originalConfig.headers[
                    'Authorization'
                  ] = `Bearer ${newToken}`;
                }
                resolve(api(originalConfig));
              },
              onFailure: (err: AxiosError) => {
                reject(err);
              },
            });
          });
        } else {
          signOut();
        }
      }

      return Promise.reject(error);
    }
  );

  return api;
}
