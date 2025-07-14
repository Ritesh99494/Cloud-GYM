import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { apiService } from '../services/api';

interface User {
  id: string;
  username: string;
  email: string;
  role: 'USER' | 'ADMIN';
  contactNumber?: string;
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

interface RegisterData {
  username: string;
  email: string;
  password: string;
  contactNumber: string;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(localStorage.getItem('authToken'));
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initAuth = async () => {
      const storedToken = localStorage.getItem('authToken');
      if (storedToken) {
        try {
          const userData = await apiService.validateToken(storedToken);
          setUser(userData);
          setToken(storedToken);
        } catch (error) {
          localStorage.removeItem('authToken');
          setToken(null);
        }
      }
      setLoading(false);
    };

    initAuth();
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const response = await apiService.login(email, password);
      const { user: userData, token: authToken } = response;
      
      setUser(userData);
      setToken(authToken);
      localStorage.setItem('authToken', authToken);
    } catch (error) {
      throw new Error('Invalid credentials');
    }
  };

  const register = async (userData: RegisterData) => {
    try {
      const response = await apiService.register(userData);
      const { user: newUser, token: authToken } = response;
      
      setUser(newUser);
      setToken(authToken);
      localStorage.setItem('authToken', authToken);
    } catch (error) {
      throw new Error('Registration failed');
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('authToken');
  };

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

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};