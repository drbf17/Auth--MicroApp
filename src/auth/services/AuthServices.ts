export interface User {
  id: string;
  name: string;
  email: string;
}

export interface Account {
  id: string;
  accountNumber: string;
  balance: number;
  type: 'checking' | 'savings';
}

export interface AuthResponse {
  user: User;
  accounts: Account[];
  token: string;
}

// Mock data
const mockUsers = {
  'user1': {
    password: 'senha1',
    data: {
      user: {
        id: '1',
        name: 'João Silva',
        email: 'joao.silva@email.com',
      },
      accounts: [
        {
          id: 'acc1',
          accountNumber: '12345-6',
          balance: 15420.50,
          type: 'checking' as const,
        },
        {
          id: 'acc2',
          accountNumber: '12345-7',
          balance: 8750.25,
          type: 'savings' as const,
        },
      ],
      token: 'mock-jwt-token-user1',
    },
  },
  'user2': {
    password: 'senha2',
    data: {
      user: {
        id: '2',
        name: 'Maria Santos',
        email: 'maria.santos@email.com',
      },
      accounts: [
        {
          id: 'acc3',
          accountNumber: '98765-4',
          balance: 23150.75,
          type: 'checking' as const,
        },
        {
          id: 'acc4',
          accountNumber: '98765-5',
          balance: 12000.00,
          type: 'savings' as const,
        },
        {
          id: 'acc5',
          accountNumber: '98765-6',
          balance: 5500.30,
          type: 'checking' as const,
        },
      ],
      token: 'mock-jwt-token-user2',
    },
  },
};

export class AuthServices {
  /**
   * Simula autenticação do usuário
   * @param username - Nome de usuário
   * @param password - Senha
   * @returns Promise com dados do usuário autenticado
   */
  static async authenticate(username: string, password: string): Promise<AuthResponse> {
    // Simular delay de rede
    await new Promise(resolve => setTimeout(resolve, 1000));

    const mockUser = mockUsers[username as keyof typeof mockUsers];
    
    if (!mockUser || mockUser.password !== password) {
      throw new Error('Credenciais inválidas. Verifique seu usuário e senha.');
    }

    return mockUser.data;
  }

  /**
   * Simula logout (invalidação do token)
   * @param token - Token a ser invalidado
   */
  static async logout(token: string): Promise<void> {
    // Simular delay de rede
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Em um cenário real, aqui faria a invalidação do token no servidor
    console.log('Token invalidado:', token);
  }

  /**
   * Valida se o token ainda é válido
   * @param token - Token a ser validado
   */
  static async validateToken(token: string): Promise<boolean> {
    // Simular delay de rede
    await new Promise(resolve => setTimeout(resolve, 300));
    
    // Mock validation - em produção faria chamada para o backend
    return token.startsWith('mock-jwt-token');
  }
}

export default AuthServices;
