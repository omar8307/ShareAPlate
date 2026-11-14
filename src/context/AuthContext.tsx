import React, { createContext, useContext, useState, useEffect } from 'react';
import type { User } from '../types';
import { api } from '../services/api';

interface AuthContextType {
  currentUser: User | null;
  demoUsers: User[];
  isLoading: boolean;
  isAuthModalOpen: boolean;
  authModalMode: 'login' | 'register';
  openAuthModal: (mode?: 'login' | 'register') => void;
  closeAuthModal: () => void;
  switchPersona: (user: User) => void;
  login: (email: string) => Promise<void>;
  register: (data: Partial<User>) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [demoUsers, setDemoUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authModalMode, setAuthModalMode] = useState<'login' | 'register'>('login');

  useEffect(() => {
    async function initAuth() {
      try {
        const users = await api.getDemoUsers();
        setDemoUsers(users);

        const savedUserJson = localStorage.getItem('shareaplate_user');
        if (savedUserJson) {
          try {
            setCurrentUser(JSON.parse(savedUserJson));
          } catch {
            setCurrentUser(users[0]);
          }
        } else {
          // Default to first demo donor for smooth out-of-the-box exploration
          setCurrentUser(users[0]);
          localStorage.setItem('shareaplate_user', JSON.stringify(users[0]));
          localStorage.setItem('shareaplate_token', `jwt_token_${users[0].id}_init`);
        }
      } catch (err) {
        console.error('Failed to init demo users:', err);
      } finally {
        setIsLoading(false);
      }
    }
    initAuth();
  }, []);

  const switchPersona = (user: User) => {
    setCurrentUser(user);
    localStorage.setItem('shareaplate_user', JSON.stringify(user));
    localStorage.setItem('shareaplate_token', `jwt_token_${user.id}_switched`);
  };

  const login = async (email: string) => {
    const res = await api.login(email);
    setCurrentUser(res.user);
    localStorage.setItem('shareaplate_user', JSON.stringify(res.user));
    localStorage.setItem('shareaplate_token', res.token);
    setIsAuthModalOpen(false);
  };

  const register = async (data: Partial<User>) => {
    const res = await api.register(data);
    setCurrentUser(res.user);
    localStorage.setItem('shareaplate_user', JSON.stringify(res.user));
    localStorage.setItem('shareaplate_token', res.token);
    setIsAuthModalOpen(false);
  };

  const logout = () => {
    setCurrentUser(null);
    localStorage.removeItem('shareaplate_user');
    localStorage.removeItem('shareaplate_token');
  };

  const openAuthModal = (mode: 'login' | 'register' = 'login') => {
    setAuthModalMode(mode);
    setIsAuthModalOpen(true);
  };

  const closeAuthModal = () => {
    setIsAuthModalOpen(false);
  };

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        demoUsers,
        isLoading,
        isAuthModalOpen,
        authModalMode,
        openAuthModal,
        closeAuthModal,
        switchPersona,
        login,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
