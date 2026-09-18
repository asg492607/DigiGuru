export type UserRole = 'student' | 'teacher' | 'parent';

export interface UserAccount {
  id: string;
  name: string;
  username: string;
  email: string;
  passwordHash: string; // Stored securely in client storage
  role: UserRole;
  standard: string; // e.g. "Nursery A", "Grade 5-B", "Grade 10-A", "Faculty"
  avatar: string; // Emoji avatar e.g. "👦", "👧", "🤖", "👩‍🏫"
  digiStars: number;
  badges: {
    id: string;
    name: string;
    icon: string;
    description: string;
    unlockedAt: string;
  }[];
  createdAt: string;
  lastLoginAt: string;
}

export interface AuthSession {
  token: string;
  userId: string;
  user: UserAccount;
  expiresAt: string;
}

export interface LoginCredentials {
  usernameOrEmail: string;
  password: string;
  rememberMe?: boolean;
}

export interface RegisterData {
  name: string;
  username: string;
  email: string;
  password: string;
  confirmPassword?: string;
  role: UserRole;
  standard: string;
  avatar: string;
}
