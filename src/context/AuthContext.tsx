import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import type { LoginCredentials, RegisterData, UserAccount } from '../types/auth';
import { authService } from '../services/authService';

interface AuthContextType {
  user: UserAccount | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (credentials: LoginCredentials) => { success: boolean; message?: string; user?: UserAccount };
  register: (data: RegisterData) => { success: boolean; message?: string; user?: UserAccount };
  logout: () => void;
  updateUserStarsAndBadges: (stars: number, newBadge?: { id: string; name: string; icon: string; description: string; unlockedAt: string }) => void;
  isAuthModalOpen: boolean;
  authModalMode: 'login' | 'register';
  openAuthModal: (mode?: 'login' | 'register') => void;
  closeAuthModal: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserAccount | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState<boolean>(false);
  const [authModalMode, setAuthModalMode] = useState<'login' | 'register'>('login');

  // Re-hydrate session on initial mount
  useEffect(() => {
    try {
      const session = authService.getSession();
      if (session) {
        setUser(session.user);
      }
    } catch (e) {
      console.error('Error hydrating session', e);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const login = useCallback((credentials: LoginCredentials) => {
    const res = authService.login(credentials);
    if (res.success && res.user) {
      setUser(res.user);
      setIsAuthModalOpen(false);
    }
    return res;
  }, []);

  const register = useCallback((data: RegisterData) => {
    const res = authService.register(data);
    if (res.success && res.user) {
      setUser(res.user);
      setIsAuthModalOpen(false);
    }
    return res;
  }, []);

  const logout = useCallback(() => {
    authService.logout();
    setUser(null);
  }, []);

  const updateUserStarsAndBadges = useCallback((
    stars: number,
    newBadge?: { id: string; name: string; icon: string; description: string; unlockedAt: string }
  ) => {
    if (!user) return;
    const updatedBadges = newBadge
      ? [...user.badges.filter((b) => b.id !== newBadge.id), newBadge]
      : user.badges;

    const updated = authService.updateUserProfile(user.id, {
      digiStars: stars,
      badges: updatedBadges,
    });

    if (updated) {
      setUser(updated);
    }
  }, [user]);

  const openAuthModal = useCallback((mode: 'login' | 'register' = 'login') => {
    setAuthModalMode(mode);
    setIsAuthModalOpen(true);
  }, []);

  const closeAuthModal = useCallback(() => {
    setIsAuthModalOpen(false);
  }, []);

  const value: AuthContextType = {
    user,
    isAuthenticated: !!user,
    isLoading,
    login,
    register,
    logout,
    updateUserStarsAndBadges,
    isAuthModalOpen,
    authModalMode,
    openAuthModal,
    closeAuthModal,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
