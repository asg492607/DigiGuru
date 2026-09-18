import { createContext } from 'react';
import type { LoginCredentials, RegisterData, UserAccount } from '../types/auth';

export interface AuthContextType {
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

export const AuthContext = createContext<AuthContextType | undefined>(undefined);
