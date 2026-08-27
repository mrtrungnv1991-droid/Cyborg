import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { 
  UserOrder, 
  ManualOrder, 
  SupportTicket, 
  ChatSession, 
  ChatMessage, 
  WheelPrize, 
  WheelSpinRecord, 
  Product, 
  GameItem, 
  TopupTier, 
  GroupPool 
} from '../types';
import { INITIAL_ORDERS } from '../data/mockProducts';
import { INITIAL_TICKETS } from '../data/mockTopupGames';
import { INITIAL_MANUAL_ORDERS } from '../data/shopclone7ExtendedData';
import { generateTxHash, generateRandomKey } from '../utils/formatters';
import { useAuth } from './AuthContext';
import { useWallet } from './WalletContext';
import { useCatalog } from './CatalogContext';

interface OrdersContextType {
  orders: UserOrder[];
  manualOrders: ManualOrder[];
  tickets: SupportTicket[];
  chatSessions: ChatSession[];
  chatMessages: ChatMessage[];
  luckyWheelPrizes: WheelPrize[];
  spinRecords: WheelSpinRecord[];
  
  // Actions
  joinPool: (poolId: string, product: Product) => { success: boolean; message: string };
  buyInstantSingle: (product: Product, quantity?: number) => { success: boolean; message: string };
  createTopupOrder: (game: GameItem, tier: TopupTier, uid: string, zoneId?: string, characterName?: string, isGroup?: boolean) => { success: boolean; message: string };
  forceEscrowAction: (orderId: string, action: 'release_to_seller' | 'refund_to_buyer') => void;
  createSupportTicket: (ticket: Omit<SupportTicket, 'id' | 'createdAt' | 'status' | 'messages'>, initialMessage: string) => void;
  adminReplyTicket: (ticketId: string, replyText: string, newStatus?: SupportTicket['status']) => void;
  adminSendChatMessage: (sessionId: string, text: string) => void;
  sendUserChatMessage: (text: string, orderRef?: string) => void;
  processManualOrder: (orderId: string, action: 'start_processing' | 'fulfill' | 'reject' | 'refund', data?: { deliveredContent?: string; note?: string; secretKey?: string; barcode?: string }) => void;
  spinLuckyWheel: () => { success: boolean; prize?: WheelPrize; message: string };
}

const DEFAULT_PRIZES: WheelPrize[] = [
  { id: 'p1', name: 'Key ChatGPT Plus 1 Tháng', label: 'GPT Plus 1M', type: 'key', value: 65000, deliveredCode: 'OPENAI-PLUS-9921-XKQW-8821', color: '#06b6d4', probability: 5 },
  { id: 'p2', name: '+50,000đ Tiền Vào Ví', label: '+50K Ví', type: 'wallet_cash', value: 50000, color: '#10b981', probability: 20 },
  { id: 'p3', name: 'Voucher Giảm 30% Mua Chung', label: 'Voucher 30%', type: 'voucher', value: 30, deliveredCode: 'VOUCHER-LUCKY-30', color: '#8b5cf6', probability: 25 },
  { id: 'p4', name: '100 Kim Cương Free Fire', label: '100 KC FF', type: 'game_diamonds', value: 20000, deliveredCode: 'GARENA-FF-100-DIAMONDS', color: '#f59e0b', probability: 15 },
  { id: 'p5', name: 'Thẻ Quà GiftUp 100K', label: 'GiftUp 100K', type: 'giftup_card', value: 100000, deliveredCode: 'GIFTUP-100K-PREMIUM-CARD', color: '#ec4899', probability: 5 },
  { id: 'p6', name: 'Chúc Bạn May Mắn Lần Sau', label: 'May Mắn Lần Sau', type: 'bad_luck', value: 0, color: '#64748b', probability: 30 }
];

const OrdersContext = createContext<OrdersContextType | undefined>(undefined);

export const OrdersProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { currentUser, updateUserBalance, updateEscrowLocked, setCurrentUser } = useAuth();
  const { addTransaction } = useWallet();
  const { products, updateProduct } = useCatalog();

  const [orders, setOrders] = useState<UserOrder[]>(() => {
    try {
      const saved = localStorage.getItem('cyberpool_orders');
      if (saved) return JSON.parse(saved);
    } catch {}
    return INITIAL_ORDERS;
  });

  const [manualOrders, setManualOrders] = useState<ManualOrder[]>(() => {
    try {
      const saved = localStorage.getItem('cyberpool_manual_orders');
      if (saved) return JSON.parse(saved);
    } catch {}
    return INITIAL_MANUAL_ORDERS;
  });

  const [tickets, setTickets] = useState<SupportTicket[]>(() => {
    try {
      const saved = localStorage.getItem('cyberpool_tickets');
      if (saved) return JSON.parse(saved);
    } catch {}
    return INITIAL_TICKETS;
  });

  const [chatSessions, setChatSessions] = useState<ChatSession[]>([
    {
      id: 'sess-1',
      userId: 'user-0x889',
      userName: 'CyberBuyer_Vn (Bạn)',
      userAvatar: '',
      lastMessage: 'Đơn nạp VietQR đã được cộng tiền vào ví chưa admin?',
      unreadCount: 0,
      updatedAt: '15:35',
      status: 'active',
      messages: [
        {
          id: 'msg-1',
          sender: 'agent',
          senderName: 'CSKH CyberPool',
          text: 'Chào bạn! Hệ thống VietQR tự động khớp lệnh trong 3-10 giây.',
          timestamp: '15:30'
        },
        {
          id: 'msg-2',
          sender: 'user',
          senderName: 'CyberBuyer_Vn',
          text: 'Vâng mình vừa nhận được thông báo cộng tiền vào ví rồi nhé!',
          timestamp: '15:35'
        }
      ]
    }
  ]);

  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    {
      id: 'msg-init',
      sender: 'agent',
      senderName: 'Admin Hỗ Trợ 24/7',
      text: 'Chào mừng bạn đến với sàn CyberPool. Bạn cần tra soát đơn hàng, nạp tiền tự động hay bảo hành key?',
      timestamp: '15:30'
    }
  ]);

  const [luckyWheelPrizes] = useState<WheelPrize[]>(DEFAULT_PRIZES);
  const [spinRecords, setSpinRecords] = useState<WheelSpinRecord[]>([]);

  useEffect(() => {
    try {
      localStorage.setItem('cyberpool_orders', JSON.stringify(orders));
    } catch {}
  }, [orders]);

  useEffect(() => {
    try {
      localStorage.setItem('cyberpool_manual_orders', JSON.stringify(manualOrders));
    } catch {}
  }, [manualOrders]);

  useEffect(() => {
    try {
      localStorage.setItem('cyberpool_tickets', JSON.stringify(tickets));
    } catch {}
  }, [tickets]);

  // Join Group Buy Pool
  const joinPool = (poolId: string, product: Product) => {
    const price = product.groupPrice;
    if (currentUser.walletBalance < price) {
      return { success: false, message: 'Số dư ví không đủ để tham gia nhóm mua chung. Vui lòng nạp thêm tiền!' };
    }

    updateUserBalance(-price);
    updateEscrowLocked(price);

    const txId = generateTxHash();
    const newOrder: UserOrder = {
      id: `ord_${Date.now()}`,
      poolId,
      productId: product.id,
      productTitle: product.title,
      platform: product.platform,
      type: 'group_buy',
      pricePaid: price,
      status: 'escrow_locked',
      createdAt: 'Vừa xong',
      slotNumber: 2,
      txId
    };

    setOrders(prev => [newOrder, ...prev]);
    addTransaction({
      type: 'buy_pool',
      description: `Gom đơn mua chung: ${product.title}`,
      amount: -price,
      balanceAfter: currentUser.walletBalance - price,
      status: 'completed',
      txCode: txId.substring(0, 10).toUpperCase()
    });

    return { success: true, message: 'Tham gia gom đơn thành công! Tiền được khóa ký quỹ an toàn 100%.' };
  };

  // Buy Instant Single
  const buyInstantSingle = (product: Product, quantity = 1) => {
    const price = (product.retailPrice || product.groupPrice) * quantity;
    if (currentUser.walletBalance < price) {
      return { success: false, message: 'Số dư ví không đủ để mua ngay sản phẩm này. Vui lòng nạp thêm!' };
    }

    if (product.stockAvailable < quantity) {
      return { success: false, message: 'Sản phẩm tạm thời hết hàng trong kho.' };
    }

    updateUserBalance(-price);
    const key = generateRandomKey(product.platform);
    const txId = generateTxHash();

    const newOrder: UserOrder = {
      id: `ord_${Date.now()}`,
      productId: product.id,
      productTitle: product.title,
      platform: product.platform,
      type: 'instant_single',
      pricePaid: price,
      status: 'fulfilled',
      createdAt: 'Vừa xong',
      deliveredKey: key,
      pinCode: '882199',
      txId
    };

    setOrders(prev => [newOrder, ...prev]);
    updateProduct(product.id, { stockAvailable: Math.max(0, product.stockAvailable - quantity) });

    addTransaction({
      type: 'buy_instant',
      description: `Mua ngay: ${product.title} (x${quantity})`,
      amount: -price,
      balanceAfter: currentUser.walletBalance - price,
      status: 'completed',
      txCode: txId.substring(0, 10).toUpperCase()
    });

    return { success: true, message: `Mua thành công! Mã key đã được cấp tự động trong Kho Key Vault: ${key}` };
  };

  // Topup Order
  const createTopupOrder = (
    game: GameItem, 
    tier: TopupTier, 
    uid: string, 
    zoneId?: string, 
    characterName?: string, 
    isGroup = false
  ) => {
    const price = isGroup ? tier.groupPrice : tier.retailPrice;
    if (currentUser.walletBalance < price) {
      return { success: false, message: 'Số dư ví không đủ để thanh toán gói nạp này. Vui lòng nạp ví!' };
    }

    updateUserBalance(-price);
    const txId = generateTxHash();

    const newOrder: UserOrder = {
      id: `ord_${Date.now()}`,
      productId: game.id,
      productTitle: `${game.name} - ${tier.name}`,
      platform: 'Garena',
      type: isGroup ? 'topup_group' : 'topup_direct',
      pricePaid: price,
      status: 'fulfilled',
      createdAt: 'Vừa xong',
      topupDetails: {
        gameName: game.name,
        uid,
        zoneId,
        characterName: characterName || 'Player',
        tierName: tier.name
      },
      txId
    };

    setOrders(prev => [newOrder, ...prev]);
    addTransaction({
      type: 'topup_game',
      description: `Nạp game ${game.name} (${tier.name}) - UID: ${uid}`,
      amount: -price,
      balanceAfter: currentUser.walletBalance - price,
      status: 'completed',
      txCode: txId.substring(0, 10).toUpperCase()
    });

    return { success: true, message: `Nạp thành công gói ${tier.name} cho UID ${uid}! Giao dịch hoàn tất qua API Midasbuy.` };
  };

  // Escrow force action
  const forceEscrowAction = (orderId: string, action: 'release_to_seller' | 'refund_to_buyer') => {
    setOrders(prev => prev.map(o => {
      if (o.id === orderId) {
        if (action === 'refund_to_buyer') {
          updateUserBalance(o.pricePaid);
          updateEscrowLocked(-o.pricePaid);
          addTransaction({
            type: 'escrow_refund',
            description: `Hoàn tiền Escrow đơn #${o.id}`,
            amount: o.pricePaid,
            balanceAfter: currentUser.walletBalance + o.pricePaid,
            status: 'completed',
            txCode: generateTxHash().substring(0, 10).toUpperCase()
          });
          return { ...o, status: 'refunded' };
        } else {
          updateEscrowLocked(-o.pricePaid);
          return { ...o, status: 'fulfilled' };
        }
      }
      return o;
    }));
  };

  // Support Tickets
  const createSupportTicket = (ticketData: Omit<SupportTicket, 'id' | 'createdAt' | 'status' | 'messages'>, initialMessage: string) => {
    const newTicket: SupportTicket = {
      ...ticketData,
      id: `TCK-${Date.now()}`,
      status: 'open',
      createdAt: 'Vừa xong',
      messages: [
        {
          id: `msg-${Date.now()}`,
          sender: 'user',
          text: initialMessage,
          timestamp: 'Vừa xong'
        }
      ]
    };
    setTickets(prev => [newTicket, ...prev]);
  };

  const adminReplyTicket = (ticketId: string, replyText: string, newStatus?: SupportTicket['status']) => {
    setTickets(prev => prev.map(t => {
      if (t.id === ticketId) {
        return {
          ...t,
          status: newStatus || t.status,
          messages: [
            ...t.messages,
            {
              id: `msg-${Date.now()}`,
              sender: 'agent',
              text: replyText,
              timestamp: 'Vừa xong'
            }
          ]
        };
      }
      return t;
    }));
  };

  // Live Chat
  const adminSendChatMessage = (sessionId: string, text: string) => {
    setChatSessions(prev => prev.map(s => {
      if (s.id === sessionId) {
        return {
          ...s,
          lastMessage: text,
          updatedAt: 'Vừa xong',
          messages: [
            ...s.messages,
            {
              id: `msg-${Date.now()}`,
              sender: 'agent',
              senderName: 'Admin CSKH',
              text,
              timestamp: 'Vừa xong'
            }
          ]
        };
      }
      return s;
    }));
  };

  const sendUserChatMessage = (text: string, orderRef?: string) => {
    const newMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
      sender: 'user',
      senderName: currentUser.name,
      text,
      timestamp: 'Vừa xong',
      orderRef
    };
    setChatMessages(prev => [...prev, newMsg]);

    // Update primary session
    setChatSessions(prev => prev.map(s => {
      if (s.id === 'sess-1') {
        return {
          ...s,
          lastMessage: text,
          updatedAt: 'Vừa xong',
          messages: [...s.messages, newMsg]
        };
      }
      return s;
    }));

    // Auto bot responder
    setTimeout(() => {
      const botReply: ChatMessage = {
        id: `msg-bot-${Date.now()}`,
        sender: 'agent',
        senderName: 'Bot Hỗ Trợ Cyber',
        text: 'Hệ thống đã tiếp nhận tin nhắn của bạn. Kỹ thuật viên hỗ trợ sẽ phản hồi trong giây lát!',
        timestamp: 'Vừa xong',
        orderRef
      };
      setChatMessages(p => [...p, botReply]);
      setChatSessions(prev => prev.map(s => s.id === 'sess-1' ? { ...s, lastMessage: botReply.text, messages: [...s.messages, botReply] } : s));
    }, 1500);
  };

  // Process Manual Order
  const processManualOrder = (
    orderId: string, 
    action: 'start_processing' | 'fulfill' | 'reject' | 'refund', 
    data?: { deliveredContent?: string; note?: string; secretKey?: string; barcode?: string }
  ) => {
    setManualOrders(prev => prev.map(mo => {
      if (mo.id === orderId) {
        if (action === 'start_processing') {
          return { ...mo, status: 'processing', assignedAdmin: currentUser.name };
        }
        if (action === 'fulfill') {
          return {
            ...mo,
            status: 'completed',
            fulfillmentData: {
              deliveredSecret: data?.deliveredContent || data?.secretKey || 'DELIVERED-OK-882190',
              processedAt: 'Vừa xong',
              processedBy: currentUser.name,
              note: data?.note
            }
          };
        }
        if (action === 'refund' || action === 'reject') {
          return {
            ...mo,
            status: action === 'refund' ? 'refunded' : 'rejected',
            fulfillmentData: {
              processedAt: 'Vừa xong',
              processedBy: currentUser.name,
              note: data?.note || 'Đã hủy đơn theo yêu cầu'
            }
          };
        }
      }
      return mo;
    }));
  };

  // Lucky Wheel Spin
  const spinLuckyWheel = () => {
    const spinCost = 10000;
    if (currentUser.walletBalance < spinCost) {
      return { success: false, message: 'Số dư không đủ 10.000đ để quay Vòng Quay May Mắn!' };
    }

    updateUserBalance(-spinCost);
    setCurrentUser(prev => ({ ...prev, totalSpun: (prev.totalSpun || 0) + 1 }));

    // Pick prize based on probability
    const rand = Math.random() * 100;
    let cumulative = 0;
    let selectedPrize = luckyWheelPrizes[luckyWheelPrizes.length - 1];

    for (const p of luckyWheelPrizes) {
      cumulative += p.probability;
      if (rand <= cumulative) {
        selectedPrize = p;
        break;
      }
    }

    if (selectedPrize.type === 'wallet_cash' && selectedPrize.value > 0) {
      updateUserBalance(selectedPrize.value);
    }

    const newRecord: WheelSpinRecord = {
      id: `spin-${Date.now()}`,
      user: currentUser.name,
      prizeName: selectedPrize.name,
      prizeType: selectedPrize.type,
      value: selectedPrize.value,
      timestamp: 'Vừa xong',
      txId: generateTxHash().substring(0, 8).toUpperCase()
    };
    setSpinRecords(prev => [newRecord, ...prev]);

    return {
      success: true,
      prize: selectedPrize,
      message: `Chúc mừng bạn đã quay trúng: ${selectedPrize.name}!`
    };
  };

  return (
    <OrdersContext.Provider
      value={{
        orders,
        manualOrders,
        tickets,
        chatSessions,
        chatMessages,
        luckyWheelPrizes,
        spinRecords,
        joinPool,
        buyInstantSingle,
        createTopupOrder,
        forceEscrowAction,
        createSupportTicket,
        adminReplyTicket,
        adminSendChatMessage,
        sendUserChatMessage,
        processManualOrder,
        spinLuckyWheel
      }}
    >
      {children}
    </OrdersContext.Provider>
  );
};

export const useOrders = (): OrdersContextType => {
  const context = useContext(OrdersContext);
  if (!context) {
    throw new Error('useOrders must be used within an OrdersProvider');
  }
  return context;
};
