import type { AuthSession, LoginCredentials, RegisterData, UserAccount } from '../types/auth';

const USERS_STORAGE_KEY = 'digiguru_accounts_v1';
const SESSION_STORAGE_KEY = 'digiguru_active_session_v1';

// Simple deterministic hash for client-side storage
function hashPassword(password: string): string {
  let hash = 0;
  for (let i = 0; i < password.length; i++) {
    const char = password.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash |= 0;
  }
  return 'dg_' + Math.abs(hash).toString(16) + '_' + password.length;
}

// Initial seed users so new users immediately have working demo accounts to test
const SEED_USERS: UserAccount[] = [
  {
    id: 'user_aryan_01',
    name: 'Aryan Sharma',
    username: 'aryan',
    email: 'aryan@digiguru.edu',
    passwordHash: hashPassword('password123'),
    role: 'student',
    standard: 'Nursery A',
    avatar: '👦',
    digiStars: 60,
    badges: [
      {
        id: 'b1',
        name: 'First Day at School',
        icon: '🎒',
        description: 'Stepped onto the DigiGuru Campus',
        unlockedAt: '2026-09-01',
      },
      {
        id: 'b2',
        name: 'Counting Star',
        icon: '⭐',
        description: 'Learned numbers 1 to 5 with Guru-Bot',
        unlockedAt: '2026-09-05',
      },
      {
        id: 'b3',
        name: 'Junior Safari Ranger',
        icon: '🐘',
        description: 'Summoned the 3D Elephant AR Hologram',
        unlockedAt: '2026-09-10',
      },
    ],
    createdAt: '2026-09-01T08:00:00.000Z',
    lastLoginAt: new Date().toISOString(),
  },
  {
    id: 'user_ananya_02',
    name: 'Ananya Deshmukh',
    username: 'ananya',
    email: 'ananya@digiguru.edu',
    passwordHash: hashPassword('password123'),
    role: 'student',
    standard: 'Grade 10-A',
    avatar: '👧',
    digiStars: 145,
    badges: [
      {
        id: 'b1',
        name: 'First Day at School',
        icon: '🎒',
        description: 'Stepped onto the DigiGuru Campus',
        unlockedAt: '2026-08-15',
      },
      {
        id: 'b4',
        name: 'Shivaji Memorial Scholar',
        icon: '🚩',
        description: 'Completed the Maratha History Quad Quest',
        unlockedAt: '2026-08-20',
      },
      {
        id: 'b5',
        name: 'Robotics Innovator',
        icon: '🤖',
        description: 'Programmed the AI Companion in Tech Hub',
        unlockedAt: '2026-09-02',
      },
    ],
    createdAt: '2026-08-15T08:00:00.000Z',
    lastLoginAt: new Date().toISOString(),
  },
  {
    id: 'user_maya_03',
    name: 'Miss Maya',
    username: 'missmaya',
    email: 'maya@digiguru.edu',
    passwordHash: hashPassword('teacher123'),
    role: 'teacher',
    standard: 'Faculty (Early Years & STEM)',
    avatar: '👩‍🏫',
    digiStars: 500,
    badges: [
      {
        id: 'bt1',
        name: 'Master Educator',
        icon: '🎓',
        description: 'Conducting immersive lessons in DigiGuru Metaverse',
        unlockedAt: '2026-07-01',
      },
      {
        id: 'bt2',
        name: 'AR Hologram Creator',
        icon: '✨',
        description: 'Published 25+ interactive 3D spatial lessons',
        unlockedAt: '2026-08-01',
      },
    ],
    createdAt: '2026-07-01T08:00:00.000Z',
    lastLoginAt: new Date().toISOString(),
  },
];

class AuthService {
  private getStoredUsers(): UserAccount[] {
    try {
      const data = localStorage.getItem(USERS_STORAGE_KEY);
      if (!data) {
        // Initialize with default seed accounts
        localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(SEED_USERS));
        return SEED_USERS;
      }
      const parsed = JSON.parse(data);
      if (!Array.isArray(parsed) || parsed.length === 0) {
        localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(SEED_USERS));
        return SEED_USERS;
      }
      return parsed;
    } catch {
      return SEED_USERS;
    }
  }

  private saveStoredUsers(users: UserAccount[]): void {
    try {
      localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users));
    } catch (e) {
      console.error('Failed to save users to localStorage', e);
    }
  }

  public getSession(): AuthSession | null {
    try {
      const data = localStorage.getItem(SESSION_STORAGE_KEY);
      if (!data) return null;
      const session = JSON.parse(data) as AuthSession;
      // Check if session is expired
      if (new Date(session.expiresAt) <= new Date()) {
        this.logout();
        return null;
      }
      // Re-hydrate latest user data from storage
      const users = this.getStoredUsers();
      const latestUser = users.find((u) => u.id === session.userId);
      if (latestUser) {
        session.user = latestUser;
      }
      return session;
    } catch {
      return null;
    }
  }

  public register(data: RegisterData): { success: boolean; user?: UserAccount; message?: string } {
    // 1. Validation
    const name = data.name.trim();
    const username = data.username.trim().toLowerCase();
    const email = data.email.trim().toLowerCase();
    const password = data.password;

    if (!name || name.length < 2) {
      return { success: false, message: 'Please enter your full name (minimum 2 characters).' };
    }

    if (!username || username.length < 3) {
      return { success: false, message: 'Username must be at least 3 characters long.' };
    }

    if (!/^[a-zA-Z0-9_-]+$/.test(username)) {
      return { success: false, message: 'Username can only contain letters, numbers, hyphens and underscores.' };
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return { success: false, message: 'Please provide a valid email address.' };
    }

    if (!password || password.length < 6) {
      return { success: false, message: 'Password must be at least 6 characters long.' };
    }

    if (data.confirmPassword !== undefined && data.confirmPassword !== password) {
      return { success: false, message: 'Passwords do not match.' };
    }

    const users = this.getStoredUsers();

    // Check unique username
    if (users.some((u) => u.username.toLowerCase() === username)) {
      return { success: false, message: `Username "${username}" is already taken. Please choose another.` };
    }

    // Check unique email
    if (users.some((u) => u.email.toLowerCase() === email)) {
      return { success: false, message: `An account with email "${email}" already exists. Please log in.` };
    }

    // 2. Create new user account
    const newUser: UserAccount = {
      id: 'user_' + Date.now() + '_' + Math.random().toString(36).substring(2, 7),
      name,
      username,
      email,
      passwordHash: hashPassword(password),
      role: data.role || 'student',
      standard: data.standard || 'Nursery A',
      avatar: data.avatar || '👦',
      digiStars: 50, // Welcome bonus stars!
      badges: [
        {
          id: 'b_welcome',
          name: 'Campus Citizen',
          icon: '🎒',
          description: 'Officially enrolled in DigiGuru Digital Campus',
          unlockedAt: new Date().toLocaleDateString(),
        },
      ],
      createdAt: new Date().toISOString(),
      lastLoginAt: new Date().toISOString(),
    };

    users.push(newUser);
    this.saveStoredUsers(users);

    // Auto-login new user
    this.createSession(newUser, true);

    return { success: true, user: newUser };
  }

  public login(credentials: LoginCredentials): { success: boolean; user?: UserAccount; message?: string } {
    const query = credentials.usernameOrEmail.trim().toLowerCase();
    const password = credentials.password;

    if (!query) {
      return { success: false, message: 'Please enter your username or email address.' };
    }
    if (!password) {
      return { success: false, message: 'Please enter your password.' };
    }

    const users = this.getStoredUsers();
    const user = users.find(
      (u) => u.username.toLowerCase() === query || u.email.toLowerCase() === query
    );

    if (!user) {
      return { success: false, message: 'No DigiGuru account found with that username or email.' };
    }

    const inputHash = hashPassword(password);
    if (user.passwordHash !== inputHash) {
      return { success: false, message: 'Incorrect password. Please try again.' };
    }

    // Update lastLoginAt
    user.lastLoginAt = new Date().toISOString();
    this.saveStoredUsers(users);

    // Create session
    this.createSession(user, credentials.rememberMe ?? true);

    return { success: true, user };
  }

  public createSession(user: UserAccount, remember: boolean): AuthSession {
    const daysValid = remember ? 30 : 1;
    const expiresAt = new Date(Date.now() + daysValid * 24 * 60 * 60 * 1000).toISOString();
    const token = 'jwt_' + Math.random().toString(36).substring(2) + Date.now().toString(36);

    const session: AuthSession = {
      token,
      userId: user.id,
      user,
      expiresAt,
    };

    try {
      localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(session));
    } catch (e) {
      console.error('Failed to save session', e);
    }

    return session;
  }

  public logout(): void {
    try {
      localStorage.removeItem(SESSION_STORAGE_KEY);
    } catch (e) {
      console.error('Failed to clear session', e);
    }
  }

  public updateUserProfile(
    userId: string,
    updates: Partial<Pick<UserAccount, 'name' | 'standard' | 'avatar' | 'digiStars' | 'badges'>>
  ): UserAccount | null {
    const users = this.getStoredUsers();
    const index = users.findIndex((u) => u.id === userId);
    if (index === -1) return null;

    users[index] = {
      ...users[index],
      ...updates,
    };

    this.saveStoredUsers(users);

    // Update session user cache if current
    const session = this.getSession();
    if (session && session.userId === userId) {
      session.user = users[index];
      try {
        localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(session));
      } catch (err) {
        console.error(err);
      }
    }

    return users[index];
  }

  public getSeedAccounts(): { name: string; username: string; role: string; standard: string; avatar: string }[] {
    return SEED_USERS.map((u) => ({
      name: u.name,
      username: u.username,
      role: u.role,
      standard: u.standard,
      avatar: u.avatar,
    }));
  }
}

export const authService = new AuthService();
