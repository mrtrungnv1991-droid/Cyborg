import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { 
  MemberUser, 
  SupplierApiConfig, 
  SystemConfiguration, 
  VoucherCoupon 
} from '../types';
import { INITIAL_SUPPLIERS } from '../data/mockTopupGames';
import { INITIAL_VOUCHERS } from '../data/shopclone7ExtendedData';

interface AdminContextType {
  members: MemberUser[];
  suppliers: SupplierApiConfig[];
  systemConfig: SystemConfiguration;
  vouchers: VoucherCoupon[];
  updateMemberRole: (memberId: string, newRole: MemberUser['role']) => void;
  toggleMemberStatus: (memberId: string) => void;
  adjustMemberBalance: (memberId: string, amount: number, reason: string) => void;
  updateSupplierBalance: (supplierId: string, deltaBalance: number) => void;
  updateSystemConfig: (newConfig: Partial<SystemConfiguration>) => void;
  addVoucher: (voucher: Partial<VoucherCoupon>) => void;
  toggleVoucherStatus: (voucherId: string) => void;
  deleteVoucher: (voucherId: string) => void;
}

const INITIAL_MEMBERS: MemberUser[] = [
  {
    id: 'MB-001',
    username: 'CyberBuyer_Vn',
    email: 'lombard2508@gmail.com',
    role: 'admin',
    walletBalance: 2450000,
    totalDeposited: 12500000,
    totalOrders: 28,
    status: 'active',
    createdAt: '2026-01-15',
    lastLogin: 'Hôm nay 15:40'
  },
  {
    id: 'MB-002',
    username: 'GamerPro99',
    email: 'gamerpro99@gmail.com',
    role: 'ctv_gold',
    walletBalance: 850000,
    totalDeposited: 5200000,
    totalOrders: 14,
    status: 'active',
    createdAt: '2026-02-01',
    lastLogin: 'Hôm nay 14:15'
  },
  {
    id: 'MB-003',
    username: 'HoangLongMMO',
    email: 'hoanglong.mmo@gmail.com',
    role: 'ctv_diamond',
    walletBalance: 3120000,
    totalDeposited: 38000000,
    totalOrders: 92,
    status: 'active',
    createdAt: '2026-01-10',
    lastLogin: 'Hôm nay 16:02'
  },
  {
    id: 'MB-004',
    username: 'NguyenVip88',
    email: 'nguyenvip88@yahoo.com',
    role: 'member',
    walletBalance: 120000,
    totalDeposited: 800000,
    totalOrders: 3,
    status: 'active',
    createdAt: '2026-02-18',
    lastLogin: 'Hôm qua'
  },
  {
    id: 'MB-005',
    username: 'SpamAbuser',
    email: 'spambot99@tempmail.com',
    role: 'member',
    walletBalance: 0,
    totalDeposited: 0,
    totalOrders: 0,
    status: 'banned',
    createdAt: '2026-02-10',
    lastLogin: '2 ngày trước'
  }
];

const DEFAULT_SYSTEM_CONFIG: SystemConfiguration = {
  siteName: 'CYBERPOOL // Sàn Gom Đơn Mua Chung & Nạp Game Số 1 VN',
  siteTitle: 'CYBERPOOL - Marketplace & Digital Assets Escrow',
  slogan: 'Sàn Gom Đơn Mua Chung Bản Quyền & Nạp Game Trực Tuyến Hàng Đầu VN',
  logoUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=200&auto=format&fit=crop&q=80',
  hotline: '1900.888.999',
  telegramSupport: 'https://t.me/cyberpool_cskh',
  zaloSupport: 'https://zalo.me/cyberpool_support',
  facebookFanpage: 'https://facebook.com/cyberpool.official',
  homeAnnouncement: '🔥 KHUYẾN MÃI NẠP TIỀN: Tặng ngay +10% giá trị nạp VietQR tự động nhân dịp ra mắt bản nâng cấp v7.4.2!',
  showAnnouncementPopup: true,
  usdToVndRate: 25450,
  platformFeePercent: 2,
  maintenanceMode: false,
  autoEscrowRelease: true,
  cronCheckLiveActive: true,
  bankName: 'MBBANK',
  bankAccountNo: '0388999999',
  bankAccountName: 'CYBERPOOL TECH JSC',
  vietQrApiToken: 'vqr_live_cyberpool_99482',
  telcoPartnerId: 'TSR_CYBER_882',
  telcoPartnerKey: 'key_sec_tsr_99182a88e0',
  cryptoUsdtAddress: 'TXu9cyber8821pool9948210398402',
  momoPhone: '0988889999',
  momoName: 'NGUYEN VAN CYBER'
};

const AdminContext = createContext<AdminContextType | undefined>(undefined);

export const AdminProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [members, setMembers] = useState<MemberUser[]>(() => {
    try {
      const saved = localStorage.getItem('cyberpool_members');
      if (saved) return JSON.parse(saved);
    } catch {}
    return INITIAL_MEMBERS;
  });

  const [suppliers, setSuppliers] = useState<SupplierApiConfig[]>(() => {
    try {
      const saved = localStorage.getItem('cyberpool_suppliers');
      if (saved) return JSON.parse(saved);
    } catch {}
    return INITIAL_SUPPLIERS;
  });

  const [systemConfig, setSystemConfig] = useState<SystemConfiguration>(() => {
    try {
      const saved = localStorage.getItem('cyberpool_system_config');
      if (saved) return JSON.parse(saved);
    } catch {}
    return DEFAULT_SYSTEM_CONFIG;
  });

  const [vouchers, setVouchers] = useState<VoucherCoupon[]>(() => {
    try {
      const saved = localStorage.getItem('cyberpool_vouchers');
      if (saved) return JSON.parse(saved);
    } catch {}
    return INITIAL_VOUCHERS;
  });

  useEffect(() => {
    try {
      localStorage.setItem('cyberpool_members', JSON.stringify(members));
    } catch {}
  }, [members]);

  useEffect(() => {
    try {
      localStorage.setItem('cyberpool_suppliers', JSON.stringify(suppliers));
    } catch {}
  }, [suppliers]);

  useEffect(() => {
    try {
      localStorage.setItem('cyberpool_system_config', JSON.stringify(systemConfig));
    } catch {}
  }, [systemConfig]);

  useEffect(() => {
    try {
      localStorage.setItem('cyberpool_vouchers', JSON.stringify(vouchers));
    } catch {}
  }, [vouchers]);

  const updateMemberRole = (memberId: string, newRole: MemberUser['role']) => {
    setMembers(prev => prev.map(m => m.id === memberId ? { ...m, role: newRole } : m));
  };

  const toggleMemberStatus = (memberId: string) => {
    setMembers(prev => prev.map(m => {
      if (m.id === memberId) {
        return {
          ...m,
          status: m.status === 'active' ? 'banned' : 'active'
        };
      }
      return m;
    }));
  };

  const adjustMemberBalance = (memberId: string, amount: number, _reason: string) => {
    setMembers(prev => prev.map(m => {
      if (m.id === memberId) {
        return {
          ...m,
          walletBalance: Math.max(0, m.walletBalance + amount)
        };
      }
      return m;
    }));
  };

  const updateSupplierBalance = (supplierId: string, deltaBalance: number) => {
    setSuppliers(prev => prev.map(s => {
      if (s.id === supplierId) {
        return {
          ...s,
          balance: s.balance + deltaBalance
        };
      }
      return s;
    }));
  };

  const updateSystemConfig = (newConfig: Partial<SystemConfiguration>) => {
    setSystemConfig(prev => ({ ...prev, ...newConfig }));
  };

  const addVoucher = (voucher: Partial<VoucherCoupon>) => {
    const newVoucher: VoucherCoupon = {
      id: `vouch_${Date.now()}`,
      code: voucher.code || `PROMO${Date.now().toString().slice(-4)}`,
      discountType: voucher.discountType || 'percent',
      discountValue: voucher.discountValue || 10,
      minOrderValue: voucher.minOrderValue || 50000,
      usageLimit: voucher.usageLimit || 100,
      usedCount: 0,
      expiresAt: voucher.expiresAt || '2026-12-31',
      status: 'active',
      ...voucher
    };
    setVouchers(prev => [newVoucher, ...prev]);
  };

  const toggleVoucherStatus = (voucherId: string) => {
    setVouchers(prev => prev.map(v => {
      if (v.id === voucherId) {
        return {
          ...v,
          status: v.status === 'active' ? 'disabled' : 'active'
        };
      }
      return v;
    }));
  };

  const deleteVoucher = (voucherId: string) => {
    setVouchers(prev => prev.filter(v => v.id !== voucherId));
  };

  return (
    <AdminContext.Provider
      value={{
        members,
        suppliers,
        systemConfig,
        vouchers,
        updateMemberRole,
        toggleMemberStatus,
        adjustMemberBalance,
        updateSupplierBalance,
        updateSystemConfig,
        addVoucher,
        toggleVoucherStatus,
        deleteVoucher
      }}
    >
      {children}
    </AdminContext.Provider>
  );
};

export const useAdmin = (): AdminContextType => {
  const context = useContext(AdminContext);
  if (!context) {
    throw new Error('useAdmin must be used within an AdminProvider');
  }
  return context;
};
