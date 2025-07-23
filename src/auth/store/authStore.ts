import { create } from 'zustand';
import AuthServices, { User, Account, AuthResponse } from '../services/AuthServices';

export interface UserSession {
  user: User | null;
  accounts: Account[];
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  errorMessage: string | null;
}

interface AuthState extends UserSession {
  // Actions
  login: (username: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  clearError: () => void;
  validateSession: () => Promise<boolean>;
}

const initialState: UserSession = {
  user: null,
  accounts: [],
  token: null,
  isAuthenticated: false,
  isLoading: false,
  errorMessage: null,
};

export const useAuthStore = create<AuthState>((set, get) => ({
  ...initialState,

  /**
   * Realiza login do usuário
   */
  login: async (username: string, password: string) => {
    set({ isLoading: true, errorMessage: null });

    try {
      const authResponse: AuthResponse = await AuthServices.authenticate(username, password);
      
      set({
        user: authResponse.user,
        accounts: authResponse.accounts,
        token: authResponse.token,
        isAuthenticated: true,
        isLoading: false,
        errorMessage: null,
      });

      console.log('Login realizado com sucesso:', authResponse.user.name);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erro desconhecido durante o login';
      
      set({
        user: null,
        accounts: [],
        token: null,
        isAuthenticated: false,
        isLoading: false,
        errorMessage,
      });

      console.error('Erro no login:', errorMessage);
    }
  },

  /**
   * Realiza logout do usuário
   */
  logout: async () => {
    const { token } = get();
    set({ isLoading: true });

    try {
      if (token) {
        await AuthServices.logout(token);
      }

      set({
        ...initialState,
        isLoading: false,
      });

      console.log('Logout realizado com sucesso');
    } catch (error) {
      console.error('Erro durante logout:', error);
      
      // Mesmo com erro, limpa a sessão local
      set({
        ...initialState,
        isLoading: false,
        errorMessage: 'Erro durante logout, mas sessão foi limpa localmente',
      });
    }
  },

  /**
   * Limpa mensagem de erro
   */
  clearError: () => {
    set({ errorMessage: null });
  },

  /**
   * Valida se a sessão atual ainda é válida
   */
  validateSession: async (): Promise<boolean> => {
    const { token, isAuthenticated } = get();
    
    if (!token || !isAuthenticated) {
      return false;
    }

    try {
      const isValid = await AuthServices.validateToken(token);
      
      if (!isValid) {
        // Token inválido, limpa a sessão
        set({
          ...initialState,
          errorMessage: 'Sessão expirada. Faça login novamente.',
        });
        return false;
      }

      return true;
    } catch (error) {
      console.error('Erro na validação da sessão:', error);
      set({
        ...initialState,
        errorMessage: 'Erro na validação da sessão. Faça login novamente.',
      });
      return false;
    }
  },
}));

// Selectors para facilitar o uso
export const useUser = () => useAuthStore(state => state.user);
export const useAccounts = () => useAuthStore(state => state.accounts);
export const useIsAuthenticated = () => useAuthStore(state => state.isAuthenticated);
export const useIsLoading = () => useAuthStore(state => state.isLoading);
export const useErrorMessage = () => useAuthStore(state => state.errorMessage);

export default useAuthStore;
