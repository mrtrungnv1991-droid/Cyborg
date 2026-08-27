import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { UserProfile, CurrencyCode, LanguageCode } from '../types';
import { authApi, AuthUser } from '../api/auth';
import { api } from '../api/client';

interface AuthContextType {
  currentUser: UserProfile;
  setCurrentUser: React.Dispatch<React.SetStateAction<UserProfile>>;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password?: string) => Promise<{ success: boolean; error?: string }>;
  register: (data: { email: string; name: string; phone?: string; password?: string }) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
  refreshUserProfile: () => Promise<void>;
  updateUserRole: (role: UserProfile['role']) => Promise<void>;
  updateUserBalance: (delta: number) => void;
  updateEscrowLocked: (delta: number) => void;
  updateLanguage: (lang: LanguageCode) => void;
  updateCurrency: (curr: CurrencyCode) => void;
}

// Initial placeholder until API boots
const INITIAL_BOOT_USER: UserProfile = {
  id: 'usr-admin-01',
  name: 'CyberPool SuperAdmin',
  email: 'admin@cyberpool.vn',
  avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80',
  walletBalance: 50000000,
  escrowLocked: 0,
  currency: 'VND',
  language: 'vi',
  reputationScore: 99.9,
  role: 'admin',
  affiliateCode: 'CYBER777',
  affiliateEarnings: 2450000,
  totalSpun: 15
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<UserProfile>(INITIAL_BOOT_USER);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(true);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // Sync server profile to client state
  const mapServerUserToProfile = (serverUser: AuthUser): UserProfile => {
    let clientRole: UserProfile['role'] = 'buyer';
    if (serverUser.role === 'SUPER_ADMIN' || serverUser.role === 'ADMIN') {
      clientRole = 'admin';
    } else if (serverUser.role === 'SELLER') {
      clientRole = 'seller_ctv';
    }

    return {
      id: serverUser.id,
      name: serverUser.name,
      email: serverUser.email,
      avatar: serverUser.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&auto=format&fit=crop&q=80',
      walletBalance: serverUser.walletBalance ?? 0,
      escrowLocked: serverUser.escrowLocked ?? 0,
      currency: 'VND',
      language: 'vi',
      reputationScore: 99.8,
      role: clientRole,
      affiliateCode: `AFF-${serverUser.id.slice(-6).toUpperCase()}`,
      affiliateEarnings: serverUser.affiliateEarnings ?? 0,
      totalSpun: 10
    };
  };

  const refreshUserProfile = useCallback(async () => {
    try {
      const res = await authApi.getMe();
      if (res.success && res.data?.user) {
        setCurrentUser(mapServerUserToProfile(res.data.user));
        setIsAuthenticated(true);
      }
    } catch {
      // server sync fallback
    }
  }, []);

  useEffect(() => {
    refreshUserProfile();
  }, [refreshUserProfile]);

  const login = async (email: string, password?: string) => {
    setIsLoading(true);
    try {
      const res = await authApi.login(email, password);
      if (res.success && res.data) {
        api.setToken(res.data.token);
        setCurrentUser(mapServerUserToProfile(res.data.user));
        setIsAuthenticated(true);
        setIsLoading(false);
        return { success: true };
      }
      setIsLoading(false);
      return { success: false, error: res.error || 'Đăng nhập thất bại' };
    } catch (err: any) {
      setIsLoading(false);
      return { success: false, error: err?.message || 'Lỗi mạng' };
    }
  };

  const register = async (data: { email: string; name: string; phone?: string; password?: string }) => {
    setIsLoading(true);
    try {
      const res = await authApi.register(data);
      if (res.success && res.data) {
        api.setToken(res.data.token);
        setCurrentUser(mapServerUserToProfile(res.data.user));
        setIsAuthenticated(true);
        setIsLoading(false);
        return { success: true };
      }
      setIsLoading(false);
      return { success: false, error: res.error || 'Đăng ký thất bại' };
    } catch (err: any) {
      setIsLoading(false);
      return { success: false, error: err?.message || 'Lỗi mạng' };
    }
  };

  const logout = async () => {
    await authApi.logout();
    api.setToken(null);
    setIsAuthenticated(false);
  };

  const updateUserRole = async (role: UserProfile['role']) => {
    setCurrentUser(prev => ({ ...prev, role }));
  };

  const updateUserBalance = (delta: number) => {
    setCurrentUser(prev => ({
      ...prev,
      walletBalance: Math.max(0, prev.walletBalance + delta)
    }));
    // Also trigger server sync in background
    refreshUserProfile();
  };

  const updateEscrowLocked = (delta: number) => {
    setCurrentUser(prev => ({
      ...prev,
      escrowLocked: Math.max(0, prev.escrowLocked + delta)
    }));
    refreshUserProfile();
  };

  const updateLanguage = (language: LanguageCode) => {
    setCurrentUser(prev => ({ ...prev, language }));
  };

  const updateCurrency = (currency: CurrencyCode) => {
    setCurrentUser(prev => ({ ...prev, currency }));
  };

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        setCurrentUser,
        isAuthenticated,
        isLoading,
        login,
        register,
        logout,
        refreshUserProfile,
        updateUserRole,
        updateUserBalance,
        updateEscrowLocked,
        updateLanguage,
        updateCurrency
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
