import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from 'react';
import { apiService } from '../services/api';

// -------------------- Interfaces --------------------

export interface User {
  id: string;
  username: string;
  email: string;
  role: 'USER' | 'ADMIN';
  contactNumber?: string;
}

interface RegisterData {
  username: string;
  email: string;
  password: string;
  contactNumber: string;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (email: string, password: string) => Promise<void>;
  register: (userData: RegisterData) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
  isAdmin: boolean;
  loading: boolean;
}

// -------------------- Context Setup --------------------

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// -------------------- Auth Provider --------------------

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(() => localStorage.getItem('authToken'));
  const [loading, setLoading] = useState(true);

  // ✅ Load user on page refresh if token exists
  useEffect(() => {
    const initAuth = async () => {
      const storedToken = localStorage.getItem('authToken');
      if (storedToken) {
        try {
          const userData = await apiService.validateToken(storedToken); // Already typed as User
          setUser(userData);
          setToken(storedToken);
        } catch (error) {
          console.error('❌ Token validation failed:', error);
          localStorage.removeItem('authToken');
          setToken(null);
          setUser(null);
        }
      }
      setLoading(false);
    };

    initAuth();
  }, []);

  // ✅ Login
  const login = async (email: string, password: string) => {
    try {
      const response = await apiService.login(email, password); // { user, token }
      const { user: userData, token: authToken } = response;

      setUser(userData);
      setToken(authToken);
      localStorage.setItem('authToken', authToken);
    } catch (error) {
      console.error('❌ Login error:', error);
      throw new Error('Invalid credentials');
    }
  };

  // ✅ Register
  const register = async (userData: RegisterData) => {
    try {
      const response = await apiService.register(userData); // { user, token }
      const { user: newUser, token: authToken } = response;

      setUser(newUser);
      setToken(authToken);
      localStorage.setItem('authToken', authToken);
    } catch (error) {
      console.error('❌ Registration error:', error);
      throw new Error('Registration failed');
    }
  };

  // ✅ Logout
  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('authToken');
  };

  // ✅ Context value
  const value: AuthContextType = {
    user,
    token,
    login,
    register,
    logout,
    isAuthenticated: !!user,
    isAdmin: user?.role === 'ADMIN',
    loading,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
