import React, { useState, useCallback } from 'react';
import type { LoginCredentials, RegisterData, UserAccount } from '../types/auth';
import { authService } from '../services/authService';
import { AuthContext, type AuthContextType } from './authContextDef';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserAccount | null>(() => {
    try {
      return authService.getSession()?.user || null;
    } catch {
      return null;
    }
  });
  const [isLoading] = useState<boolean>(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState<boolean>(false);
  const [authModalMode, setAuthModalMode] = useState<'login' | 'register'>('login');

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

export default AuthProvider;
