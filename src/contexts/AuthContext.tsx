import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { UserProfile, CurrencyCode, LanguageCode } from '../types';

interface AuthContextType {
  currentUser: UserProfile;
  setCurrentUser: React.Dispatch<React.SetStateAction<UserProfile>>;
  updateUserRole: (role: UserProfile['role']) => void;
  updateUserBalance: (delta: number) => void;
  updateEscrowLocked: (delta: number) => void;
  updateLanguage: (lang: LanguageCode) => void;
  updateCurrency: (curr: CurrencyCode) => void;
}

const DEFAULT_USER: UserProfile = {
  id: 'user_cyber_vn_01',
  name: 'CyberBuyer_Vn',
  email: 'lombard2508@gmail.com',
  avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80',
  walletBalance: 2450000,
  escrowLocked: 185000,
  currency: 'VND',
  language: 'vi',
  reputationScore: 99.8,
  role: 'admin',
  affiliateCode: 'CYBER777',
  affiliateEarnings: 450000,
  totalSpun: 12
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<UserProfile>(() => {
    try {
      const saved = localStorage.getItem('cyberpool_current_user');
      if (saved) {
        return JSON.parse(saved);
      }
    } catch {
      // ignore
    }
    return DEFAULT_USER;
  });

  useEffect(() => {
    try {
      localStorage.setItem('cyberpool_current_user', JSON.stringify(currentUser));
    } catch {
      // ignore
    }
  }, [currentUser]);

  const updateUserRole = (role: UserProfile['role']) => {
    setCurrentUser(prev => ({ ...prev, role }));
  };

  const updateUserBalance = (delta: number) => {
    setCurrentUser(prev => ({
      ...prev,
      walletBalance: Math.max(0, prev.walletBalance + delta)
    }));
  };

  const updateEscrowLocked = (delta: number) => {
    setCurrentUser(prev => ({
      ...prev,
      escrowLocked: Math.max(0, prev.escrowLocked + delta)
    }));
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
