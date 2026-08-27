import React from 'react';
import { 
  Search, 
  Sparkles, 
  Gamepad2, 
  Tv, 
  Layers, 
  Gift, 
  Shield, 
  Bot, 
  Filter, 
  Zap,
  ShieldCheck,
  Compass,
  PlusCircle,
  CreditCard,
  CircleDollarSign,
  TrendingUp,
  History
} from 'lucide-react';
import { ProductCategory, UserProfile, CurrencyCode } from '../types';

interface HeroTelemetryProps {
  user?: UserProfile;
  currency?: CurrencyCode;
  searchTerm?: string;
  onSearchChange?: (value: string) => void;
  selectedCategory?: ProductCategory;
  onSelectCategory?: (category: ProductCategory) => void;
  sortBy?: 'savings' | 'ending_soon' | 'price_asc' | 'popular' | 'price_low' | 'price_high' | 'rating' | 'discount';
  onSortChange?: (sort: any) => void;
  totalProductsCount?: number;
  onOpenCreatePool?: () => void;
  onOpenEscrowGuide?: () => void;
  onOpenTopup?: () => void;
  onOpenTelcoCard?: () => void;
  onOpenLuckyWheel?: () => void;
  onOpenDepositHub?: () => void;
  onOpenAffiliate?: () => void;
  onOpenLedger?: () => void;
  onOpenFanMenu?: () => void;
}

export const HeroTelemetry: React.FC<HeroTelemetryProps> = ({
  user,
  currency = 'VND',
  searchTerm = '',
  onSearchChange,
  selectedCategory = 'all',
  onSelectCategory,
  sortBy = 'popular',
  onSortChange,
  totalProductsCount = 12,
  onOpenCreatePool,
  onOpenEscrowGuide,
  onOpenTopup,
  onOpenTelcoCard,
  onOpenLuckyWheel,
  onOpenDepositHub,
  onOpenAffiliate,
  onOpenLedger,
  onOpenFanMenu
}) => {
  const categories: { id: ProductCategory; label: string; icon: React.ReactNode; count?: number }[] = [
    { id: 'all', label: 'Tất Cả Sản Phẩm', icon: <Sparkles className="w-3.5 h-3.5" />, count: totalProductsCount },
    { id: 'ai_tools', label: 'AI & ChatGPT Plus', icon: <Bot className="w-3.5 h-3.5" /> },
    { id: 'gaming', label: 'Key Game Steam / Epic', icon: <Gamepad2 className="w-3.5 h-3.5" /> },
    { id: 'giftup_cards', label: 'GiftUp E-Vouchers', icon: <Gift className="w-3.5 h-3.5" /> },
    { id: 'streaming', label: 'Netflix 4K & Phim', icon: <Tv className="w-3.5 h-3.5" /> },
    { id: 'software', label: 'Adobe & Phần Mềm', icon: <Layers className="w-3.5 h-3.5" /> },
    { id: 'vpn', label: 'VPN & Bảo Mật', icon: <Shield className="w-3.5 h-3.5" /> },
  ];

  return (
    <div className="relative border-b border-slate-800 bg-[#07090e] cyber-grid overflow-hidden">
      {/* Ambient background glow */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-0 left-1/4 w-80 h-80 bg-blue-600/10 rounded-full blur-3xl pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-5 sm:py-8">
        {/* Main Title & Value Proposition Grid */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4 sm:gap-6 mb-5 sm:mb-6">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-cyan-950/80 border border-cyan-500/30 text-cyan-400 text-[10px] sm:text-xs font-mono mb-2.5 shadow-sm">
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse"></span>
              SÀN GOM ĐƠN MUA CHUNG SẢN PHẨM SỐ & KEY BẢN QUYỀN
            </div>
            <h1 className="text-2xl sm:text-4xl lg:text-5xl font-black tracking-tight text-white uppercase font-mono leading-tight">
              MUA CHUNG KEY BẢN QUYỀN <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-teal-300 to-blue-500">
                TIẾT KIỆM ĐẾN 80%
              </span>
            </h1>
            <p className="text-slate-400 text-xs sm:text-sm mt-1.5 sm:mt-2 font-normal leading-relaxed">
              Giải pháp gom đơn thông minh: Nhận giá sỉ gốc cho ChatGPT Plus, Netflix 4K, Game Steam và 121 tựa game hot. Thanh toán tự động, nhận mã tức thì qua hợp đồng bảo lãnh Escrow 100%.
            </p>
          </div>

          {/* Telemetry Metrics Pod - Clean Customer Values */}
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-2 gap-2 font-mono text-xs shrink-0">
            <div className="p-2.5 sm:p-3 rounded-lg bg-slate-900/90 border border-slate-800 hover:border-cyan-500/40 transition-colors">
              <div className="text-slate-400 text-[9px] sm:text-[10px] uppercase flex items-center gap-1">
                <Zap className="w-3 h-3 text-cyan-400" /> Tốc Độ Nhận Key
              </div>
              <div className="text-sm sm:text-base font-black text-cyan-400 mt-0.5">3 - 30 Giây</div>
              <div className="text-[9px] sm:text-[10px] text-emerald-400 mt-0.5">Tự động trả mã 24/7</div>
            </div>

            <div className="p-2.5 sm:p-3 rounded-lg bg-slate-900/90 border border-slate-800 hover:border-emerald-500/40 transition-colors">
              <div className="text-slate-400 text-[9px] sm:text-[10px] uppercase flex items-center gap-1">
                <ShieldCheck className="w-3 h-3 text-emerald-400" /> Bảo Lãnh Escrow
              </div>
              <div className="text-sm sm:text-base font-black text-emerald-400 mt-0.5">100% Hoàn Tiền</div>
              <div className="text-[9px] sm:text-[10px] text-slate-400 mt-0.5">Bảo hành 1:1 mọi lỗi</div>
            </div>
          </div>
        </div>

        {/* Quick Launchpad Shortcuts Bar */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 mb-4 scrollbar-none">
          {onOpenTopup && (
            <button
              onClick={onOpenTopup}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 text-xs font-mono font-bold whitespace-nowrap transition-all cursor-pointer shadow-sm shrink-0"
            >
              <Zap className="w-3.5 h-3.5 text-cyan-400" />
              <span>⚡ Nạp 121 Game (3s)</span>
            </button>
          )}

          {onOpenCreatePool && (
            <button
              onClick={onOpenCreatePool}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-500/10 hover:bg-blue-500/20 text-blue-400 border border-blue-500/30 text-xs font-mono font-bold whitespace-nowrap transition-all cursor-pointer shadow-sm shrink-0"
            >
              <PlusCircle className="w-3.5 h-3.5 text-blue-400" />
              <span>🚀 Mở Gom Đơn Mới</span>
            </button>
          )}

          {onOpenDepositHub && (
            <button
              onClick={onOpenDepositHub}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-xs font-mono font-bold whitespace-nowrap transition-all cursor-pointer shadow-sm shrink-0"
            >
              <CircleDollarSign className="w-3.5 h-3.5 text-emerald-400" />
              <span>🏦 Nạp Tiền VietQR</span>
            </button>
          )}

          {onOpenTelcoCard && (
            <button
              onClick={onOpenTelcoCard}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-purple-500/10 hover:bg-purple-500/20 text-purple-400 border border-purple-500/30 text-xs font-mono font-bold whitespace-nowrap transition-all cursor-pointer shadow-sm shrink-0"
            >
              <CreditCard className="w-3.5 h-3.5 text-purple-400" />
              <span>💳 Đổi Thẻ Cào Tự Động</span>
            </button>
          )}

          {onOpenLuckyWheel && (
            <button
              onClick={onOpenLuckyWheel}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 border border-amber-500/30 text-xs font-mono font-bold whitespace-nowrap transition-all cursor-pointer shadow-sm shrink-0"
            >
              <Gift className="w-3.5 h-3.5 text-amber-400" />
              <span>🎡 Vòng Quay May Mắn</span>
            </button>
          )}

          {onOpenAffiliate && (
            <button
              onClick={onOpenAffiliate}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-400 border border-indigo-500/30 text-xs font-mono font-bold whitespace-nowrap transition-all cursor-pointer shadow-sm shrink-0"
            >
              <TrendingUp className="w-3.5 h-3.5 text-indigo-400" />
              <span>🤝 Đại Lý CTV (-10%)</span>
            </button>
          )}

          {onOpenEscrowGuide && (
            <button
              onClick={onOpenEscrowGuide}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 text-xs font-mono font-bold whitespace-nowrap transition-all cursor-pointer shadow-sm shrink-0"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>🛡️ Quy Trình Escrow</span>
            </button>
          )}

          {onOpenLedger && (
            <button
              onClick={onOpenLedger}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 text-xs font-mono font-bold whitespace-nowrap transition-all cursor-pointer shadow-sm shrink-0"
            >
              <History className="w-3.5 h-3.5 text-cyan-400" />
              <span>📑 Sao Kê Ví</span>
            </button>
          )}

          {onOpenFanMenu && (
            <button
              onClick={onOpenFanMenu}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gradient-to-r from-cyan-950 via-slate-900 to-blue-950 text-cyan-300 border border-cyan-500/40 text-xs font-mono font-bold whitespace-nowrap transition-all cursor-pointer shadow-sm shrink-0"
            >
              <Compass className="w-3.5 h-3.5 text-cyan-400 animate-spin" style={{ animationDuration: '10s' }} />
              <span>📂 18 Tiện Ích</span>
            </button>
          )}
        </div>

        {/* Search & Filter Command Bar */}
        {onSearchChange && onSelectCategory && (
          <div className="space-y-3 sm:space-y-4">
            <div className="flex flex-col md:flex-row gap-2.5 sm:gap-3">
              {/* Search Input */}
              <div className="relative flex-1">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-cyan-400" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => onSearchChange(e.target.value)}
                  placeholder="Tìm kiếm theo tên game, ChatGPT, Netflix, Adobe, Spotify, Steam Key..."
                  className="w-full pl-10 pr-12 py-2.5 sm:py-3 bg-slate-900/90 border border-slate-700 hover:border-slate-600 focus:border-cyan-500 focus:outline-none rounded-lg text-xs sm:text-sm text-white placeholder:text-slate-500 font-mono transition-all shadow-inner"
                />
                {searchTerm && (
                  <button
                    onClick={() => onSearchChange('')}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] font-mono text-slate-400 hover:text-white px-2 py-0.5 rounded bg-slate-800 cursor-pointer"
                  >
                    XÓA
                  </button>
                )}
              </div>

              {/* Sort Selector */}
              {onSortChange && (
                <div className="flex items-center gap-2">
                  <div className="w-full md:w-auto flex items-center gap-1.5 px-3 py-2.5 rounded-lg bg-slate-900/90 border border-slate-700 text-xs font-mono text-slate-300">
                    <Filter className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                    <span className="hidden sm:inline text-slate-400">Sắp xếp:</span>
                    <select
                      value={sortBy}
                      onChange={(e) => onSortChange(e.target.value as any)}
                      className="bg-transparent text-cyan-400 font-bold focus:outline-none cursor-pointer w-full md:w-auto text-xs"
                    >
                      <option value="popular" className="bg-slate-900 text-white">Phổ biến nhất</option>
                      <option value="savings" className="bg-slate-900 text-white">Giảm giá nhiều nhất (% cao)</option>
                      <option value="price_low" className="bg-slate-900 text-white">Giá thấp đến cao</option>
                      <option value="price_high" className="bg-slate-900 text-white">Giá cao đến thấp</option>
                      <option value="rating" className="bg-slate-900 text-white">Đánh giá cao nhất</option>
                    </select>
                  </div>
                </div>
              )}
            </div>

            {/* Category Pills */}
            <div className="flex items-center gap-1.5 sm:gap-2 overflow-x-auto pb-1.5 scrollbar-none">
              {categories.map((cat) => {
                const active = selectedCategory === cat.id;
                return (
                  <button
                    key={cat.id}
                    onClick={() => onSelectCategory(cat.id)}
                    className={`flex items-center gap-1.5 px-3 sm:px-3.5 py-1.5 sm:py-2 rounded-lg text-xs font-mono whitespace-nowrap transition-all border shrink-0 cursor-pointer ${
                      active
                        ? 'bg-cyan-500 text-black border-cyan-400 font-bold shadow-[0_0_15px_rgba(6,182,212,0.3)]'
                        : 'bg-slate-900/70 text-slate-300 border-slate-800 hover:border-slate-700 hover:bg-slate-800'
                    }`}
                  >
                    {cat.icon}
                    <span>{cat.label}</span>
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
