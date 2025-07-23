import React, { useEffect, ReactNode } from 'react';
import { useAuthStore } from '../store/authStore';
import type { UserSession } from '../store/authStore';

export interface AuthProviderProps {
  children: (authState: AuthState) => ReactNode;
  validateSessionOnMount?: boolean;
}

export interface AuthState extends UserSession {
  login: (username: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  clearError: () => void;
}

/**
 * AuthProvider component using function as children pattern
 * Provides authentication state and methods to child components
 * 
 * @example
 * <AuthProvider>
 *   {(authState) => (
 *     authState.isAuthenticated ? (
 *       <AuthenticatedApp />
 *     ) : (
 *       <LoginScreen />
 *     )
 *   )}
 * </AuthProvider>
 */
const AuthProvider: React.FC<AuthProviderProps> = ({ 
  children, 
  validateSessionOnMount = true 
}) => {
  const authStore = useAuthStore();

  useEffect(() => {
    // Validar sessão ao montar o componente se solicitado
    if (validateSessionOnMount && authStore.isAuthenticated) {
      authStore.validateSession();
    }
  }, [validateSessionOnMount, authStore]);

  const authState: AuthState = {
    // Session data
    user: authStore.user,
    accounts: authStore.accounts,
    token: authStore.token,
    isAuthenticated: authStore.isAuthenticated,
    isLoading: authStore.isLoading,
    errorMessage: authStore.errorMessage,
    
    // Actions
    login: authStore.login,
    logout: authStore.logout,
    clearError: authStore.clearError,
  };

  return <>{children(authState)}</>;
};

export default AuthProvider;
