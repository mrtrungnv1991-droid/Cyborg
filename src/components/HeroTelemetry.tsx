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
  Compass
} from 'lucide-react';
import { ProductCategory } from '../types';

interface HeroTelemetryProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  selectedCategory: ProductCategory;
  onSelectCategory: (category: ProductCategory) => void;
  sortBy: 'savings' | 'ending_soon' | 'price_asc' | 'popular';
  onSortChange: (sort: 'savings' | 'ending_soon' | 'price_asc' | 'popular') => void;
  totalProductsCount: number;
  onOpenFanMenu?: () => void;
}

export const HeroTelemetry: React.FC<HeroTelemetryProps> = ({
  searchTerm,
  onSearchChange,
  selectedCategory,
  onSelectCategory,
  sortBy,
  onSortChange,
  totalProductsCount,
  onOpenFanMenu
}) => {
  const categories: { id: ProductCategory; label: string; icon: React.ReactNode; count: number }[] = [
    { id: 'all', label: 'Tất Cả Sản Phẩm', icon: <Sparkles className="w-3.5 h-3.5" />, count: totalProductsCount },
    { id: 'topup_games', label: '⚡ Nạp 121 Game Trực Tiếp', icon: <Gamepad2 className="w-3.5 h-3.5" />, count: 121 },
    { id: 'ai_tools', label: 'AI & ChatGPT Plus', icon: <Bot className="w-3.5 h-3.5" />, count: 2 },
    { id: 'gaming', label: 'Key Game Steam / Epic', icon: <Gamepad2 className="w-3.5 h-3.5" />, count: 1 },
    { id: 'giftup_cards', label: 'GiftUp E-Vouchers', icon: <Gift className="w-3.5 h-3.5" />, count: 1 },
    { id: 'streaming', label: 'Netflix 4K & Phim', icon: <Tv className="w-3.5 h-3.5" />, count: 2 },
    { id: 'software', label: 'Adobe & Công Cụ Bản Quyền', icon: <Layers className="w-3.5 h-3.5" />, count: 1 },
    { id: 'vpn', label: 'VPN & An Toàn Số', icon: <Shield className="w-3.5 h-3.5" />, count: 1 },
  ];

  return (
    <div className="relative border-b border-slate-800 bg-[#07090e] cyber-grid overflow-hidden">
      {/* Ambient background glow */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-0 left-1/4 w-80 h-80 bg-blue-600/10 rounded-full blur-3xl pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-5 sm:py-8">
        {/* Main Title & Value Proposition Grid */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4 sm:gap-6 mb-5 sm:mb-7">
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

        {/* Search & Filter Command Bar */}
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
            <div className="flex items-center gap-2">
              <div className="w-full md:w-auto flex items-center gap-1.5 px-3 py-2.5 rounded-lg bg-slate-900/90 border border-slate-700 text-xs font-mono text-slate-300">
                <Filter className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                <span className="hidden sm:inline text-slate-400">Sắp xếp:</span>
                <select
                  value={sortBy}
                  onChange={(e) => onSortChange(e.target.value as any)}
                  className="bg-transparent text-cyan-400 font-bold focus:outline-none cursor-pointer w-full md:w-auto text-xs"
                >
                  <option value="savings" className="bg-slate-900 text-white">Giảm giá nhiều nhất (% cao)</option>
                  <option value="ending_soon" className="bg-slate-900 text-white">Sắp đủ slot (Chốt nhanh)</option>
                  <option value="price_asc" className="bg-slate-900 text-white">Giá gom rẻ nhất</option>
                  <option value="popular" className="bg-slate-900 text-white">Được mua nhiều nhất</option>
                </select>
              </div>
            </div>
          </div>

          {/* Category Pills */}
          <div className="flex items-center gap-1.5 sm:gap-2 overflow-x-auto pb-1.5 scrollbar-none">
            {onOpenFanMenu && (
              <button
                onClick={onOpenFanMenu}
                className="flex items-center gap-1.5 px-3 sm:px-3.5 py-1.5 sm:py-2 rounded-lg text-xs font-mono font-bold whitespace-nowrap transition-all border border-cyan-400/60 bg-gradient-to-r from-cyan-950 via-slate-900 to-blue-950 text-cyan-300 hover:from-cyan-900 hover:to-blue-900 shadow-[0_0_15px_rgba(6,182,212,0.25)] active:scale-95 cursor-pointer shrink-0"
                title="Mở Thư Mục tất cả 18 tiện ích"
              >
                <Compass className="w-3.5 h-3.5 text-cyan-400 animate-spin" style={{ animationDuration: '10s' }} />
                <span>📂 Thư Mục (18 Tiện Ích)</span>
              </button>
            )}

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
      </div>
    </div>
  );
};
