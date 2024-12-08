import React, {
  createContext,
  useCallback,
  useState,
  useContext,
  ReactNode,
} from 'react';
import { useNavigate } from 'react-router-dom';
import { User } from '../dtos';
import { api } from '../services/apiClient';

interface AuthState {
  token: string;
  refresh_token: string;
  user: User;
}

interface SignInCredentials {
  email: string;
  password: string;
}

interface SignInCredentialsSocial {
  email: string;
  password: string;
  name: string;
  celphone?: string;
  photoUrl?: string;
  gender?: string;
}

interface AuthContextData {
  user: User;
  signIn(credentials: SignInCredentials): Promise<void>;
  signOut(): void;
}

const AuthContext = createContext<AuthContextData>({} as AuthContextData);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const navigate = useNavigate();
  const [data, setData] = useState<AuthState>(() => {
    const refresh_token = localStorage.getItem('@NaHora:refresh_token');
    const token = localStorage.getItem('@NaHora:token');
    const user = localStorage.getItem('@NaHora:user');

    if (token && user && refresh_token) {
      api.defaults.headers.authorization = `Bearer ${token}`;

      return { token, user: JSON.parse(user), refresh_token };
    }

    return {} as AuthState;
  });

  const signIn = useCallback(async ({ email, password }: SignInCredentials) => {
    const response = await api.post('sessions', {
      email,
      password,
    });

    const { token, user, refresh_token } = response.data;

    localStorage.setItem('@NaHora:refresh_token', refresh_token);
    localStorage.setItem('@NaHora:token', token);
    localStorage.setItem('@NaHora:user', JSON.stringify(user));

    api.defaults.headers.authorization = `Bearer ${token}`;

    setData({ token, user, refresh_token });
    navigate('panel');
  }, []);

  const signOut = useCallback(() => {
    localStorage.removeItem('@NaHora:refresh_token');
    localStorage.removeItem('@NaHora:token');
    localStorage.removeItem('@NaHora:user');
    localStorage.removeItem('@NaHora:myEnterprise');

    setData({} as AuthState);
  }, []);

  return (
    <AuthContext.Provider value={{ user: data.user, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};
export function useAuth(): AuthContextData {
  const context = useContext(AuthContext);

  return context;
}
