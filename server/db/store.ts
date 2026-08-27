import { 
  ServerUser, 
  ServerWalletTransaction, 
  ServerInventoryItem, 
  ServerEscrowContract, 
  ServerOrder, 
  ServerAuditLog, 
  ServerReview 
} from '../types';
import { INITIAL_PRODUCTS } from '../../src/data/mockProducts';
import { INITIAL_GAMES, INITIAL_SUPPLIERS } from '../../src/data/mockTopupGames';
import { INITIAL_VOUCHERS } from '../../src/data/shopclone7AdminData';

class DatabaseStore {
  public users: Map<string, ServerUser> = new Map();
  public transactions: ServerWalletTransaction[] = [];
  public inventory: Map<string, ServerInventoryItem> = new Map();
  public escrowContracts: Map<string, ServerEscrowContract> = new Map();
  public orders: Map<string, ServerOrder> = new Map();
  public reviews: ServerReview[] = [];
  public auditLogs: ServerAuditLog[] = [];
  public products: any[] = [];
  public games: any[] = [];
  public suppliers: any[] = [];
  public vouchers: any[] = [];
  public categories: any[] = [];
  public tickets: any[] = [];
  public systemConfig: any = {};

  // Mutex lock trackers
  private inventoryLocks: Set<string> = new Set();
  private userLocks: Set<string> = new Set();

  constructor() {
    this.seedDatabase();
  }

  private seedDatabase() {
    // 1. Users
    const defaultUsers: ServerUser[] = [
      {
        id: 'usr-admin-01',
        email: 'admin@cyberpool.vn',
        name: 'CyberPool SuperAdmin',
        role: 'SUPER_ADMIN',
        walletBalance: 50000000,
        escrowLocked: 0,
        affiliateEarnings: 2450000,
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80',
        isVerified: true,
        status: 'active',
        createdAt: '2026-01-01T00:00:00Z',
        lastLoginAt: new Date().toISOString(),
        ipAddress: '127.0.0.1'
      },
      {
        id: 'usr-buyer-01',
        email: 'lombard2508@gmail.com',
        name: 'CyberTrader_Vip',
        role: 'USER',
        walletBalance: 2450000,
        escrowLocked: 150000,
        affiliateEarnings: 320000,
        avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80',
        isVerified: true,
        status: 'active',
        createdAt: '2026-02-15T10:30:00Z',
        lastLoginAt: new Date().toISOString(),
        ipAddress: '113.190.234.12'
      }
    ];

    defaultUsers.forEach(u => this.users.set(u.id, u));

    // 2. Products
    this.products = JSON.parse(JSON.stringify(INITIAL_PRODUCTS));
    this.games = JSON.parse(JSON.stringify(INITIAL_GAMES));
    this.suppliers = JSON.parse(JSON.stringify(INITIAL_SUPPLIERS));
    this.vouchers = JSON.parse(JSON.stringify(INITIAL_VOUCHERS));

    // 3. Seed Inventory with digital keys
    this.products.forEach(p => {
      for (let i = 1; i <= 20; i++) {
        const itemId = `inv-${p.id}-${i}`;
        const keyItem: ServerInventoryItem = {
          id: itemId,
          productId: p.id,
          keyCode: `CYBER-${p.platform.toUpperCase()}-${Math.floor(1000 + Math.random() * 9000)}-${Math.floor(1000 + Math.random() * 9000)}-${Math.floor(1000 + Math.random() * 9000)}`,
          pinCode: Math.floor(1000 + Math.random() * 9000).toString(),
          state: i <= 5 ? 'SOLD' : 'AVAILABLE',
          costPrice: Math.round(p.retailPrice * 0.4),
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        };
        this.inventory.set(itemId, keyItem);
      }

      // Seed active escrow contracts for pools
      if (p.activePools && p.activePools.length > 0) {
        p.activePools.forEach((pool: any) => {
          this.escrowContracts.set(pool.id, {
            id: `escrow-${pool.id}`,
            productId: p.id,
            poolId: pool.id,
            targetSlots: pool.targetSlots,
            filledSlots: pool.filledSlots,
            pricePerSlot: pool.pricePerSlot,
            totalLockedAmount: pool.filledSlots * pool.pricePerSlot,
            status: pool.status === 'completed' ? 'COMPLETED' : 'FILLING',
            expiresAt: new Date(Date.now() + 86400000 * 2).toISOString(),
            participants: pool.participants.map((pt: any) => ({
              userId: pt.id || 'usr-mock',
              userName: pt.name,
              avatar: pt.avatar,
              joinedAt: pt.joinedAt,
              slotNumber: pt.slotNumber,
              deliveredKey: pool.status === 'completed' ? `KEY-DELIVERED-${pt.slotNumber}` : undefined
            })),
            createdAt: new Date().toISOString()
          });
        });
      }
    });

    // 4. Initial Audit Log
    this.auditLogs.push({
      id: 'audit-001',
      actorId: 'usr-admin-01',
      actorName: 'CyberPool SuperAdmin',
      actorRole: 'SUPER_ADMIN',
      action: 'SYSTEM_BOOTSTRAP',
      resource: 'SERVER_ENGINE',
      resourceId: 'NODE_FAST_API_GATEWAY',
      newValue: { status: 'ONLINE', modules: ['AUTH', 'LEDGER', 'ORDER_ENGINE', 'ESCROW', 'INVENTORY'] },
      ipAddress: '127.0.0.1',
      timestamp: new Date().toISOString()
    });

    // 5. Initial Categories
    this.categories = [
      { id: 'all', name: 'Tất Cả Sản Phẩm', slug: 'all', count: 50 },
      { id: 'ai_tools', name: 'AI & Machine Learning', slug: 'ai-tools', count: 12 },
      { id: 'entertainment', name: 'Giải Trí & Phim Ảnh', slug: 'entertainment', count: 10 },
      { id: 'software', name: 'Bản Quyền Phần Mềm', slug: 'software', count: 8 },
      { id: 'gaming', name: 'Gaming & Steam Vault', slug: 'gaming', count: 15 },
      { id: 'vpn_security', name: 'VPN & An Ninh Mạng', slug: 'vpn-security', count: 5 }
    ];

    // 6. System Config
    this.systemConfig = {
      siteTitle: 'CYBERPOOL // Production Marketplace',
      siteName: 'CyberPool Engine v8.0',
      platformFeePercent: 2,
      minDepositAmount: 10000,
      minWithdrawalAmount: 100000,
      escrowTimeoutHours: 48,
      antiDDoSMode: 'advanced_waf',
      maintenanceMode: false
    };
  }

  // Mutex helpers for Atomic Operations
  public async acquireInventoryLock(productId: string): Promise<boolean> {
    if (this.inventoryLocks.has(productId)) {
      for (let i = 0; i < 5; i++) {
        await new Promise(r => setTimeout(r, 20));
        if (!this.inventoryLocks.has(productId)) break;
      }
    }
    this.inventoryLocks.add(productId);
    return true;
  }

  public releaseInventoryLock(productId: string) {
    this.inventoryLocks.delete(productId);
  }

  public async acquireUserLock(userId: string): Promise<boolean> {
    this.userLocks.add(userId);
    return true;
  }

  public releaseUserLock(userId: string) {
    this.userLocks.delete(userId);
  }
}

export const db = new DatabaseStore();
