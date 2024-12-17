import React, {
  createContext,
  useCallback,
  useState,
  useContext,
  ReactNode,
  useEffect,
} from 'react';
import { useNavigate } from 'react-router-dom';
import { key } from '../config/key';
import { EnterpriseDTO, User } from '../dtos';
import api from '../services/api';

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
  userEnterprise: EnterpriseDTO;
}

const AuthContext = createContext<AuthContextData>({} as AuthContextData);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const navigate = useNavigate();
  const [userEnterprise, setUserEnterprise] = useState<EnterpriseDTO>(
    {} as EnterpriseDTO
  );

  const [data, setData] = useState<AuthState>(() => {
    const refresh_token = localStorage.getItem(key.refreshToken);
    const token = localStorage.getItem(key.token);
    const user = localStorage.getItem(key.user);

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

    localStorage.setItem(key.refreshToken, refresh_token);
    localStorage.setItem(key.token, token);
    localStorage.setItem(key.user, JSON.stringify(user));

    api.defaults.headers.authorization = `Bearer ${token}`;

    setData({ token, user, refresh_token });
    navigate('events');
  }, []);

  const signOut = useCallback(() => {
    localStorage.removeItem(key.refreshToken);
    localStorage.removeItem(key.token);
    localStorage.removeItem(key.user);

    setData({} as AuthState);
  }, []);

  useEffect(() => {
    if (data.user) {
      const getEnterprise = async () => {
        try {
          const response = await api.get('/enterprises/mine');
          const enterpriseData = response.data;

          setUserEnterprise(enterpriseData);
          localStorage.setItem(key.enterprise, JSON.stringify(enterpriseData));
        } catch (err) {
          console.error('Erro ao buscar dados da empresa:', err);
        }
      };

      getEnterprise();
    }
  }, [data.user]);

  useEffect(() => {
    api.registerInterceptTokenManager(signOut);
  }, [signOut]);

  return (
    <AuthContext.Provider
      value={{ user: data.user, signIn, signOut, userEnterprise }}
    >
      {children}
    </AuthContext.Provider>
  );
};
export function useAuth(): AuthContextData {
  const context = useContext(AuthContext);

  return context;
}
