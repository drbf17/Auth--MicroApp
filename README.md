# Auth - Módulo de Autenticação do SuperApp

O **Auth** é o módulo de autenticação do SuperApp bancário, responsável por gerenciar login, logout, sessão de usuário e controle de acesso através do Module Federation.

## 📋 Visão Geral

Este módulo fornece:
- **Sistema de Autenticação**: Login/logout com validação de credenciais
- **Gerenciamento de Sessão**: Estado persistente da autenticação
- **Controle de Acesso**: AuthProvider com pattern function-as-children
- **Module Federation**: Componentes exportados para integração no SuperApp

## 🏗️ Arquitetura

```
Auth/
├── src/
│   ├── App.tsx                         # App principal do módulo
│   └── auth/
│       ├── components/
│       │   ├── AuthProvider.tsx        # Provider com function-as-children
│       │   └── LoginComponent.tsx      # Interface de login
│       ├── services/
│       │   └── AuthServices.ts         # Serviços de autenticação
│       └── store/
│           ├── authStore.ts            # Zustand store principal
│           └── index.ts                # Barrel exports
├── rspack.config.mjs                   # Configuração Module Federation
└── package.json
```

## 🚀 Funcionalidades

### 1. Autenticação
- **Login**: Validação de credenciais com dados mock
- **Logout**: Limpeza de sessão e invalidação de token
- **Validação de Sessão**: Verificação automática de token válido
- **Tratamento de Erros**: Mensagens amigáveis para credenciais inválidas

### 2. Gerenciamento de Estado (Zustand)
- **UserSession**: Estado da sessão do usuário
- **Dados do Usuário**: Nome, email, contas bancárias
- **Estados de UI**: Loading, autenticado, mensagens de erro
- **Actions**: login(), logout(), clearError(), validateSession()

### 3. Componentes Exportados
- **AuthProvider**: Wrapper com function-as-children pattern
- **LoginComponent**: Interface completa de login
- **App**: Aplicação principal do módulo

## 🔧 Configuração e Instalação

### Pré-requisitos
- Node.js >= 18
- React Native CLI
- CocoaPods (para iOS)

### Instalação
```bash
# Instalar dependências
npm install

# iOS - Instalar pods
cd ios && pod install && cd ..

# Iniciar Metro bundler na porta 8084
npm start

# Executar no iOS
npm run ios

# Executar no Android  
npm run android
```

## 📦 Dependências Principais

```json
{
  "react": "19.0.0",
  "react-native": "0.79.5",
  "@react-navigation/native": "^7.1.14",
  "@react-navigation/native-stack": "^7.3.21",
  "zustand": "^5.0.6",
  "axios": "^1.10.0",
  "@callstack/repack": "^5.1.3",
  "@module-federation/enhanced": "^0.17.0"
}
```

## 🌐 Module Federation

### Configuração
O módulo expõe componentes para integração com outros módulos:

```javascript
// rspack.config.mjs
new ModuleFederationPlugin({
  name: 'Auth',
  exposes: {
    './App': './src/App.tsx',
    './AuthProvider': './src/auth/components/AuthProvider.tsx',
    './LoginComponent': './src/auth/components/LoginComponent.tsx',
  },
  shared: {
    react: { singleton: true, eager: false },
    'react-native': { singleton: true, eager: false },
    // ... outras dependências compartilhadas
  }
})
```

### Uso em Outros Módulos
```tsx
// Host App - Importação de componentes remotos
const AuthProvider = React.lazy(() => import('Auth/AuthProvider'));
const LoginComponent = React.lazy(() => import('Auth/LoginComponent'));

// Uso com function-as-children pattern
<AuthProvider>
  {(authState) => (
    authState.isAuthenticated ? (
      <MainApp />
    ) : (
      <LoginComponent />
    )
  )}
</AuthProvider>
```

## 🔐 Sistema de Autenticação

### Usuários de Teste
```javascript
// Credenciais válidas para desenvolvimento
user1 / senha1  // João Silva - 2 contas
user2 / senha2  // Maria Santos - 3 contas

// Qualquer outra combinação retorna erro
```

### Dados Mock dos Usuários
```javascript
{
  user1: {
    user: { id: '1', name: 'João Silva', email: 'joao.silva@email.com' },
    accounts: [
      { accountNumber: '12345-6', balance: 15420.50, type: 'checking' },
      { accountNumber: '12345-7', balance: 8750.25, type: 'savings' }
    ]
  },
  user2: {
    user: { id: '2', name: 'Maria Santos', email: 'maria.santos@email.com' },
    accounts: [
      { accountNumber: '98765-4', balance: 23150.75, type: 'checking' },
      { accountNumber: '98765-5', balance: 12000.00, type: 'savings' },
      { accountNumber: '98765-6', balance: 5500.30, type: 'checking' }
    ]
  }
}
```

## 🏪 Zustand Store

### Estado da Sessão
```typescript
interface UserSession {
  user: User | null;
  accounts: Account[];
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  errorMessage: string | null;
}
```

### Actions Disponíveis
```typescript
// Login do usuário
await login(username: string, password: string);

// Logout e limpeza da sessão
await logout();

// Limpar mensagens de erro
clearError();

// Validar sessão atual
await validateSession(): Promise<boolean>;
```

### Selectors Otimizados
```typescript
// Hooks especializados para facilitar o uso
const user = useUser();
const accounts = useAccounts();
const isAuthenticated = useIsAuthenticated();
const isLoading = useIsLoading();
const errorMessage = useErrorMessage();
```

## 🎨 Interface do Usuário

### LoginComponent
- **Campos de Input**: Usuário e senha com validação
- **Tratamento de Estados**: Loading, erro, sucesso
- **Instruções**: Dicas sobre usuários de teste
- **Design Responsivo**: Interface adaptável e acessível

### Tela Autenticada
- **Dados do Usuário**: Nome e email
- **Lista de Contas**: Número, tipo e saldo formatado
- **Ação de Logout**: Botão para sair da sessão

## 🔄 Fluxo de Autenticação

1. **Usuário insere credenciais** → LoginComponent
2. **Validação via AuthServices** → Dados mock ou erro
3. **Atualização da Store** → Estado de autenticação
4. **AuthProvider reativa** → Renderiza conteúdo baseado no estado
5. **App principal exibido** → Usuário autenticado

## 🚨 Tratamento de Erros

### Validação de Credenciais
- **Credenciais inválidas**: Mensagem específica de erro
- **Campos vazios**: Validação local antes do envio
- **Sessão expirada**: Logout automático e redirecionamento

### Estados de Loading
- **Login em progresso**: Indicador visual durante autenticação
- **Validação de sessão**: Placeholder durante verificação
- **Logout**: Feedback visual durante processo

## 🧪 Desenvolvimento e Testes

### Scripts Disponíveis
```bash
# Desenvolvimento
npm start                    # Metro na porta 8084
npm run dev:android         # Android com port forwarding
npm run adb:reverse         # Configurar port forwarding

# Qualidade de código
npm run lint                # ESLint
npm test                    # Jest tests
```

### Port Forwarding Android
```bash
# Configurar acesso ao módulo Auth
adb reverse tcp:8084 tcp:8084
```

## 🌍 Integração com SuperApp

### Arquitetura do Host
```typescript
// Host App integra Auth como primeiro layer
<NavigationContainer>
  <AuthProvider>
    {(authState) => 
      authState.isAuthenticated ? <MainApp /> : <LoginScreen />
    }
  </AuthProvider>
</NavigationContainer>
```

### Variáveis de Ambiente (Host)
```bash
# env/.env.development
AUTH_MINI_APP_URL=http://localhost:8084
```

### Dependências Compartilhadas
- React 19.0.0 (singleton)
- React Native 0.79.5 (singleton)
- React Navigation 7.x (singleton)
- Zustand 5.0.6 (compartilhado)

## 🛠️ Troubleshooting

### Problemas Comuns

1. **Module Federation não carrega**
   - **Causa**: Módulo Auth não está rodando na porta 8084
   - **Solução**: `curl http://localhost:8084` para verificar
   - **Android**: Verificar `adb reverse tcp:8084 tcp:8084`

2. **Erro de autenticação**
   - **Causa**: Credenciais incorretas
   - **Solução**: Usar `user1/senha1` ou `user2/senha2`

3. **Estado não persiste**
   - **Causa**: Store não está sendo compartilhada corretamente
   - **Solução**: Verificar configuração Module Federation

4. **Erro de carregamento de componentes**
   - **Causa**: Tipos TypeScript ou imports incorretos
   - **Solução**: Verificar `module-federation.d.ts` no Host

## 📚 Recursos Adicionais

- [Re.Pack Documentation](https://re-pack.dev/)
- [Zustand State Management](https://zustand-demo.pmnd.rs/)
- [Module Federation](https://module-federation.io/)
- [React Navigation](https://reactnavigation.org/)

## 🤝 Contribuição

1. Clone o repositório
2. Instale dependências: `npm install`
3. Inicie o servidor: `npm start`
4. Faça suas mudanças
5. Execute testes: `npm test`
6. Abra um Pull Request

## 📞 Suporte

Para dúvidas sobre autenticação:
- Documentação: Este README
- Issues: GitHub Issues
- Team: Equipe de segurança e autenticação

---

**Auth Module** - Sistema de Autenticação do SuperApp Banking Architecture 🔐
