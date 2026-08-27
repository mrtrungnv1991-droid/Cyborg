import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { 
  TransactionRecord, 
  TelcoCardSubmission, 
  TopupInvoice, 
  CTVWithdrawal 
} from '../types';
import { INITIAL_CTV_WITHDRAWALS } from '../data/shopclone7ExtendedData';
import { generateTxHash } from '../utils/formatters';
import { useAuth } from './AuthContext';

interface WalletContextType {
  transactions: TransactionRecord[];
  telcoCards: TelcoCardSubmission[];
  topupInvoices: TopupInvoice[];
  withdrawals: CTVWithdrawal[];
  addTransaction: (tx: Omit<TransactionRecord, 'id' | 'createdAt'>) => TransactionRecord;
  depositMoney: (amount: number, methodTitle: string) => void;
  submitTelcoCard: (submission: { telco: TelcoCardSubmission['telco']; declaredAmount: number; pin: string; serial: string }) => void;
  createTopupInvoice: (invoice: Omit<TopupInvoice, 'id' | 'createdAt' | 'txCode' | 'status'>) => TopupInvoice;
  approveInvoice: (invoiceId: string) => void;
  rejectInvoice: (invoiceId: string, reason?: string) => void;
  requestWithdrawal: (amount: number, bankName: string, accountNo: string, accountName: string) => void;
}

const INITIAL_TRANSACTIONS: TransactionRecord[] = [
  {
    id: 'tx-001',
    type: 'deposit_qr',
    description: 'Nạp tiền tự động qua VietQR (MB Bank)',
    amount: 1000000,
    balanceAfter: 2450000,
    status: 'completed',
    createdAt: 'Hôm nay 15:20',
    txCode: 'VQR882190'
  },
  {
    id: 'tx-002',
    type: 'buy_pool',
    description: 'Gom đơn ChatGPT Plus 1 Tháng (#PL-01)',
    amount: -65000,
    balanceAfter: 1450000,
    status: 'completed',
    createdAt: 'Hôm nay 14:10',
    txCode: 'POOL-9921'
  },
  {
    id: 'tx-003',
    type: 'topup_game',
    description: 'Nạp 6,480 Đá Sáng Thế Genshin Impact',
    amount: -1850000,
    balanceAfter: 1515000,
    status: 'completed',
    createdAt: 'Hôm qua 21:05',
    txCode: 'TOPUP-3382'
  }
];

const INITIAL_INVOICES: TopupInvoice[] = [
  {
    id: 'INV-1001',
    txCode: 'VQR-MB-99210',
    userId: 'MB-001',
    userName: 'CyberBuyer_Vn',
    method: 'bank_vietqr',
    amount: 500000,
    receivedAmount: 500000,
    fee: 0,
    status: 'completed',
    createdAt: '2026-08-27 15:10',
    bankInfo: {
      bankName: 'MBBank (Quân Đội)',
      accountNo: '0388999999',
      content: 'NAP CYBER MB001'
    }
  },
  {
    id: 'INV-1002',
    txCode: 'CARD-VTT-4821',
    userId: 'MB-002',
    userName: 'GamerPro99',
    method: 'telco_card',
    amount: 200000,
    receivedAmount: 160000,
    fee: 40000,
    status: 'pending',
    createdAt: '2026-08-27 15:35',
    cardInfo: {
      telco: 'VIETTEL',
      serial: '100058291039',
      pin: '98210491823901'
    }
  },
  {
    id: 'INV-1003',
    txCode: 'USDT-TRC20-091',
    userId: 'MB-003',
    userName: 'HoangLongMMO',
    method: 'crypto_usdt',
    amount: 2540000,
    receivedAmount: 2540000,
    fee: 0,
    status: 'pending',
    createdAt: '2026-08-27 15:42',
    cryptoInfo: {
      coin: 'USDT',
      address: 'TXu9...cyber88',
      txHash: '0x99281a8e9...',
      rate: 25400
    }
  }
];

const WalletContext = createContext<WalletContextType | undefined>(undefined);

export const WalletProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { currentUser, updateUserBalance } = useAuth();

  const [transactions, setTransactions] = useState<TransactionRecord[]>(() => {
    try {
      const saved = localStorage.getItem('cyberpool_transactions');
      if (saved) return JSON.parse(saved);
    } catch {
      // ignore
    }
    return INITIAL_TRANSACTIONS;
  });

  const [telcoCards, setTelcoCards] = useState<TelcoCardSubmission[]>(() => {
    try {
      const saved = localStorage.getItem('cyberpool_telco_cards');
      if (saved) return JSON.parse(saved);
    } catch {
      // ignore
    }
    return [];
  });

  const [topupInvoices, setTopupInvoices] = useState<TopupInvoice[]>(() => {
    try {
      const saved = localStorage.getItem('cyberpool_topup_invoices');
      if (saved) return JSON.parse(saved);
    } catch {
      // ignore
    }
    return INITIAL_INVOICES;
  });

  const [withdrawals, setWithdrawals] = useState<CTVWithdrawal[]>(() => {
    try {
      const saved = localStorage.getItem('cyberpool_withdrawals');
      if (saved) return JSON.parse(saved);
    } catch {
      // ignore
    }
    return INITIAL_CTV_WITHDRAWALS;
  });

  useEffect(() => {
    try {
      localStorage.setItem('cyberpool_transactions', JSON.stringify(transactions));
    } catch {}
  }, [transactions]);

  useEffect(() => {
    try {
      localStorage.setItem('cyberpool_telco_cards', JSON.stringify(telcoCards));
    } catch {}
  }, [telcoCards]);

  useEffect(() => {
    try {
      localStorage.setItem('cyberpool_topup_invoices', JSON.stringify(topupInvoices));
    } catch {}
  }, [topupInvoices]);

  useEffect(() => {
    try {
      localStorage.setItem('cyberpool_withdrawals', JSON.stringify(withdrawals));
    } catch {}
  }, [withdrawals]);

  const addTransaction = (txData: Omit<TransactionRecord, 'id' | 'createdAt'>): TransactionRecord => {
    const newTx: TransactionRecord = {
      ...txData,
      id: `tx-${Date.now()}`,
      createdAt: 'Vừa xong'
    };
    setTransactions(prev => [newTx, ...prev]);
    return newTx;
  };

  const depositMoney = (amount: number, methodTitle: string) => {
    const newBalance = currentUser.walletBalance + amount;
    updateUserBalance(amount);
    addTransaction({
      type: 'deposit_qr',
      description: `Nạp tiền qua ${methodTitle}`,
      amount,
      balanceAfter: newBalance,
      status: 'completed',
      txCode: generateTxHash().substring(0, 10).toUpperCase()
    });
  };

  const submitTelcoCard = (submission: { telco: TelcoCardSubmission['telco']; declaredAmount: number; pin: string; serial: string }) => {
    const feeRate = 0.20; // 20%
    const receivedAmount = Math.round(submission.declaredAmount * (1 - feeRate));
    const txId = `TELCO-${Date.now()}`;

    const newSubmission: TelcoCardSubmission = {
      id: txId,
      telco: submission.telco,
      declaredAmount: submission.declaredAmount,
      receivedAmount,
      feePercent: 20,
      pin: submission.pin,
      serial: submission.serial,
      status: 'success',
      createdAt: 'Vừa xong',
      txId
    };

    setTelcoCards(prev => [newSubmission, ...prev]);
    
    // Auto credit funds
    depositMoney(receivedAmount, `Thẻ cào ${submission.telco} ${submission.declaredAmount.toLocaleString()}đ`);
  };

  const createTopupInvoice = (invoiceData: Omit<TopupInvoice, 'id' | 'createdAt' | 'txCode' | 'status'>): TopupInvoice => {
    const newInvoice: TopupInvoice = {
      ...invoiceData,
      id: `INV-${Date.now()}`,
      txCode: `TX-${generateTxHash().substring(0, 8).toUpperCase()}`,
      status: 'pending',
      createdAt: new Date().toISOString().replace('T', ' ').substring(0, 16)
    };
    setTopupInvoices(prev => [newInvoice, ...prev]);
    return newInvoice;
  };

  const approveInvoice = (invoiceId: string) => {
    setTopupInvoices(prev => prev.map(inv => {
      if (inv.id === invoiceId) {
        if (inv.userId === currentUser.id || inv.userName === currentUser.name) {
          updateUserBalance(inv.receivedAmount);
          addTransaction({
            type: 'deposit_qr',
            description: `Duyệt nạp tiền hóa đơn #${inv.id}`,
            amount: inv.receivedAmount,
            balanceAfter: currentUser.walletBalance + inv.receivedAmount,
            status: 'completed',
            txCode: inv.txCode
          });
        }
        return { ...inv, status: 'completed' };
      }
      return inv;
    }));
  };

  const rejectInvoice = (invoiceId: string, reason?: string) => {
    setTopupInvoices(prev => prev.map(inv => {
      if (inv.id === invoiceId) {
        return { ...inv, status: 'cancelled', note: reason };
      }
      return inv;
    }));
  };

  const requestWithdrawal = (amount: number, bankName: string, accountNo: string, accountName: string) => {
    if (currentUser.walletBalance < amount) return;
    updateUserBalance(-amount);

    const newWithdrawal: CTVWithdrawal = {
      id: `WD-${Date.now()}`,
      ctvId: currentUser.id,
      ctvName: currentUser.name,
      amount,
      bankName,
      accountNumber: accountNo,
      accountNo,
      accountName,
      status: 'pending',
      createdAt: 'Vừa xong'
    };

    setWithdrawals(prev => [newWithdrawal, ...prev]);
    addTransaction({
      type: 'buy_instant',
      description: `Rút tiền về tài khoản ngân hàng (${bankName})`,
      amount: -amount,
      balanceAfter: currentUser.walletBalance - amount,
      status: 'processing',
      txCode: newWithdrawal.id
    });
  };

  return (
    <WalletContext.Provider
      value={{
        transactions,
        telcoCards,
        topupInvoices,
        withdrawals,
        addTransaction,
        depositMoney,
        submitTelcoCard,
        createTopupInvoice,
        approveInvoice,
        rejectInvoice,
        requestWithdrawal
      }}
    >
      {children}
    </WalletContext.Provider>
  );
};

export const useWallet = (): WalletContextType => {
  const context = useContext(WalletContext);
  if (!context) {
    throw new Error('useWallet must be used within a WalletProvider');
  }
  return context;
};
