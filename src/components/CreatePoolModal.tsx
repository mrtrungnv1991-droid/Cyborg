import React, { useState, useMemo, useEffect } from 'react';
import { 
  X, 
  PlusCircle, 
  Layers, 
  Sparkles, 
  ShieldCheck, 
  CheckCircle2, 
  AlertCircle, 
  ArrowRight,
  Info,
  Search,
  Check,
  Zap,
  Flame,
  Tag,
  Clock,
  Users,
  RefreshCw,
  SlidersHorizontal
} from 'lucide-react';
import { Product, ProductCategory, GroupPool, CurrencyCode } from '../types';
import { formatCurrency } from '../utils/formatters';

interface CreatePoolModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccessCreate: (product: Product, newPool: GroupPool) => void;
  currency: CurrencyCode;
  products?: Product[];
  initialProduct?: Product | null;
}

export const CreatePoolModal: React.FC<CreatePoolModalProps> = ({
  isOpen,
  onClose,
  onSuccessCreate,
  currency,
  products = [],
  initialProduct = null
}) => {
  // State for Product Selection & Search
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState<string>('all');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(initialProduct || products[0] || null);
  const [isCustomMode, setIsCustomMode] = useState(false);

  // Custom Product state (if user specifically wants to create a new product not in catalog)
  const [customTitle, setCustomTitle] = useState('');
  const [customCategory, setCustomCategory] = useState<ProductCategory>('gaming');
  const [customPlatform, setCustomPlatform] = useState<string>('Steam');
  const [customRetailPrice, setCustomRetailPrice] = useState<number>(800000);
  const [customGroupPrice, setCustomGroupPrice] = useState<number>(400000);

  // Pool Configuration state
  const [targetSlots, setTargetSlots] = useState<number>(4);
  const [durationHours, setDurationHours] = useState<number>(24);
  const [customPoolTitle, setCustomPoolTitle] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  // Update selected product if initialProduct changes
  useEffect(() => {
    if (initialProduct) {
      setSelectedProduct(initialProduct);
      setTargetSlots(initialProduct.minSlots || 4);
      setIsCustomMode(false);
    } else if (!selectedProduct && products.length > 0) {
      setSelectedProduct(products[0]);
      setTargetSlots(products[0].minSlots || 4);
    }
  }, [initialProduct, products]);

  // When selectedProduct changes, update default targetSlots
  useEffect(() => {
    if (selectedProduct) {
      setTargetSlots(Math.max(2, selectedProduct.minSlots || 4));
      setCustomPoolTitle(`Gom Đơn Sỉ: ${selectedProduct.title}`);
    }
  }, [selectedProduct]);

  if (!isOpen) return null;

  // Filter available products for search
  const filteredProducts = products.filter(p => {
    const matchCat = selectedCategoryFilter === 'all' || p.category === selectedCategoryFilter;
    const matchSearch = searchTerm.trim() === '' || 
      p.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.subtitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.platform.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (p.tags && p.tags.some(t => t.toLowerCase().includes(searchTerm.toLowerCase())));
    return matchCat && matchSearch;
  });

  // Effective Pricing calculations
  const effectiveRetailPrice = isCustomMode 
    ? customRetailPrice 
    : (selectedProduct?.retailPrice || 0);

  // Wholesale price is STRICTLY determined by the product catalog / supplier policy
  const effectiveGroupPrice = isCustomMode
    ? customGroupPrice
    : (selectedProduct?.groupPrice || Math.round(effectiveRetailPrice * 0.5));

  const savingsPercent = effectiveRetailPrice > 0 
    ? Math.max(1, Math.round(((effectiveRetailPrice - effectiveGroupPrice) / effectiveRetailPrice) * 100))
    : 0;

  const totalPoolValue = effectiveGroupPrice * targetSlots;
  const totalSavings = Math.max(0, (effectiveRetailPrice - effectiveGroupPrice) * targetSlots);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!isCustomMode && !selectedProduct) {
      setErrorMsg('Vui lòng tìm và chọn một sản phẩm từ hệ thống để mở nhóm gom đơn');
      return;
    }

    if (isCustomMode && !customTitle.trim()) {
      setErrorMsg('Vui lòng nhập tên sản phẩm muốn gom mua chung');
      return;
    }

    if (targetSlots < 2 || targetSlots > 20) {
      setErrorMsg('Số lượng slot gom phải từ 2 đến 20 thành viên');
      return;
    }

    const currentProduct: Product = isCustomMode ? {
      id: `prod-custom-${Date.now()}`,
      title: customTitle.trim(),
      subtitle: `Gói gom đơn mua chung ${customTitle.trim()} bản quyền chiết khấu sỉ -${savingsPercent}%`,
      category: customCategory,
      platform: customPlatform as any,
      bannerImg: customCategory === 'gaming'
        ? 'https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=800&q=80'
        : customCategory === 'ai_tools'
        ? 'https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&w=800&q=80'
        : 'https://images.unsplash.com/photo-1559526324-4b87b5e36e44?auto=format&fit=crop&w=800&q=80',
      retailPrice: customRetailPrice,
      groupPrice: customGroupPrice,
      minSlots: targetSlots,
      deliveryType: 'instant_key',
      deliveryEstimate: 'Bung mã tức thì khi đủ slot',
      description: `Nhóm gom đơn mua chung ${customTitle.trim()}. Giá sỉ niêm yết cố định từ Nhà cung cấp.`,
      features: [
        'Mã key được kiểm tra trước khi đưa vào kho Escrow',
        'Tự động gửi mã khi gom đủ slot người mua',
        'Bảo hành đổi trả 100% trong 24 giờ'
      ],
      instructions: [
        '1. Tham gia đặt cọc slot trong nhóm gom đơn',
        '2. Chờ đủ thành viên để bung key',
        '3. Nhận key tại Kho Key Cá Nhân'
      ],
      seller: {
        id: 'seller-official',
        name: 'Official CyberPool Partner',
        avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80',
        badge: 'Tesla Verified',
        rating: 5.0,
        totalDeals: 120,
        completedPools: 98,
        responseTime: '< 1 phút'
      },
      activePools: [],
      rating: 5.0,
      reviewCount: 12,
      stockAvailable: targetSlots * 5,
      tags: ['ESCROW 100%', `GIẢM ${savingsPercent}%`, 'OFFICIAL']
    } : selectedProduct!;

    // Auto-generate keysVault items for the pool based on targetSlots so auto-fulfillment works
    const autoVaultKeys = Array.from({ length: targetSlots }).map((_, idx) => {
      const codePrefix = currentProduct.platform.toUpperCase();
      const randomCode = `${codePrefix}-VAULT-${Math.random().toString(36).substring(2, 6).toUpperCase()}-${Math.random().toString(36).substring(2, 6).toUpperCase()}-${Math.random().toString(36).substring(2, 6).toUpperCase()}`;
      return {
        id: `k-vault-${Date.now()}-${idx + 1}`,
        code: randomCode,
        status: (idx === 0 ? 'reserved' : 'available') as 'reserved' | 'available'
      };
    });

    const poolId = `pool-${Date.now()}`;
    const newPool: GroupPool = {
      id: poolId,
      productId: currentProduct.id,
      title: customPoolTitle.trim() || `Nhóm Gom: ${currentProduct.title}`,
      targetSlots: targetSlots,
      filledSlots: 1, // Host takes slot #1
      pricePerSlot: effectiveGroupPrice,
      retailPrice: effectiveRetailPrice,
      savingsPercent: savingsPercent,
      expiresAt: `${durationHours}h 00m`,
      status: 'filling',
      hostName: 'CyberBuyer_Vn (Bạn)',
      isHot: true,
      participants: [
        {
          id: 'p-host-creator',
          name: 'CyberBuyer_Vn (Host)',
          avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=100&q=80',
          joinedAt: 'Vừa xong',
          txHash: '0x' + Math.random().toString(16).substring(2, 10),
          slotNumber: 1
        }
      ],
      keysVault: autoVaultKeys
    };

    onSuccessCreate(currentProduct, newPool);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-3xl rounded-2xl bg-[#0b0e17] border border-cyan-500/40 shadow-[0_0_50px_rgba(6,182,212,0.15)] overflow-hidden my-6">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-slate-800 flex items-center justify-between bg-gradient-to-r from-slate-900 via-[#0d1424] to-slate-900">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-cyan-950 border border-cyan-500/40 text-cyan-400 shadow-md">
              <PlusCircle className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold text-white uppercase tracking-wide flex items-center gap-2">
                <span>MỞ NHÓM GOM ĐƠN / NIÊM YẾT SỈ SẢN PHẨM SỐ</span>
              </h2>
              <p className="text-xs text-slate-400 mt-0.5 font-sans">
                Chọn sản phẩm trong danh mục hệ thống & mở nhóm gom với giá sỉ cố định do Nhà cung cấp niêm yết
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-4 sm:p-6 space-y-5 max-h-[78vh] overflow-y-auto">
          {errorMsg && (
            <div className="p-3 rounded-xl bg-rose-950/80 border border-rose-500/50 text-rose-300 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Workflow Transparent Banner */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 p-3 rounded-xl bg-slate-950/90 border border-cyan-500/30 text-xs">
            <div className="p-2 rounded-lg bg-black/40 border border-slate-800/80 space-y-1">
              <div className="text-cyan-400 font-bold text-[11px] flex items-center gap-1.5">
                <span className="w-4 h-4 rounded-full bg-cyan-500 text-black text-[10px] flex items-center justify-center font-black">1</span>
                <span>CHỌN SẢN PHẨM</span>
              </div>
              <p className="text-[10px] text-slate-400 leading-tight">
                Tìm sản phẩm chuẩn trong catalog hệ thống để xác định rõ nguồn hàng.
              </p>
            </div>

            <div className="p-2 rounded-lg bg-black/40 border border-slate-800/80 space-y-1">
              <div className="text-amber-400 font-bold text-[11px] flex items-center gap-1.5">
                <span className="w-4 h-4 rounded-full bg-amber-500 text-black text-[10px] flex items-center justify-center font-black">2</span>
                <span>GIÁ SỈ CỐ ĐỊNH</span>
              </div>
              <p className="text-[10px] text-slate-400 leading-tight">
                Giá gom / slot do Nhà cung cấp niêm yết chuẩn, không bị ép giá sai lệch.
              </p>
            </div>

            <div className="p-2 rounded-lg bg-black/40 border border-slate-800/80 space-y-1">
              <div className="text-emerald-400 font-bold text-[11px] flex items-center gap-1.5">
                <span className="w-4 h-4 rounded-full bg-emerald-500 text-black text-[10px] flex items-center justify-center font-black">3</span>
                <span>BUNG KEY TỰ ĐỘNG</span>
              </div>
              <p className="text-[10px] text-slate-400 leading-tight">
                Đủ slot tự động giao key vào ví cá nhân của từng người, 100% Escrow bảo lãnh.
              </p>
            </div>
          </div>

          {/* ========================================================================= */}
          {/* SECTION 1: TÌM KIẾM & CHỌN SẢN PHẨM TỪ HỆ THỐNG */}
          {/* ========================================================================= */}
          <div className="space-y-3 p-4 rounded-2xl bg-slate-900/50 border border-slate-800">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div className="text-xs font-bold text-cyan-400 uppercase tracking-wider flex items-center gap-2">
                <Layers className="w-4 h-4 text-cyan-400" />
                <span>1. Thông Tin Sản Phẩm & Nền Tảng (Tìm Trong Catalog)</span>
              </div>

              {/* Toggle Custom Product if needed */}
              <button
                type="button"
                onClick={() => {
                  setIsCustomMode(!isCustomMode);
                  setErrorMsg('');
                }}
                className="text-[11px] text-slate-400 hover:text-cyan-300 underline decoration-cyan-500/30 cursor-pointer self-start sm:self-auto"
              >
                {isCustomMode ? '← Quay lại chọn sản phẩm hệ thống' : '+ Không tìm thấy? Tự tạo sản phẩm mới'}
              </button>
            </div>

            {!isCustomMode ? (
              <div className="space-y-3">
                {/* Search & Category Filter */}
                <div className="space-y-2">
                  <div className="relative">
                    <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      placeholder="Tìm theo tên sản phẩm, game, AI, Netflix, Steam, Adobe..."
                      className="w-full pl-9 pr-4 py-2.5 bg-slate-950 border border-slate-800 focus:border-cyan-500 rounded-xl text-xs text-white placeholder:text-slate-600 focus:outline-none transition-colors"
                    />
                  </div>

                  {/* Category Pills */}
                  <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none text-xs">
                    {[
                      { id: 'all', label: 'Tất cả' },
                      { id: 'gaming', label: 'Game Keys' },
                      { id: 'ai_tools', label: 'AI Tools' },
                      { id: 'giftup_cards', label: 'Gift Cards' },
                      { id: 'streaming', label: 'Streaming' },
                      { id: 'software', label: 'Phần Mềm' },
                      { id: 'vpn', label: 'VPN / Server' }
                    ].map(cat => (
                      <button
                        key={cat.id}
                        type="button"
                        onClick={() => setSelectedCategoryFilter(cat.id)}
                        className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold whitespace-nowrap transition-colors cursor-pointer ${
                          selectedCategoryFilter === cat.id
                            ? 'bg-cyan-500 text-black font-bold'
                            : 'bg-slate-950 text-slate-400 hover:text-white border border-slate-800'
                        }`}
                      >
                        {cat.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Available Products Selector List */}
                <div className="max-h-48 overflow-y-auto space-y-2 pr-1">
                  {filteredProducts.map(p => {
                    const isSelected = selectedProduct?.id === p.id;
                    const discount = Math.round(((p.retailPrice - p.groupPrice) / p.retailPrice) * 100);

                    return (
                      <div
                        key={p.id}
                        onClick={() => {
                          setSelectedProduct(p);
                          setErrorMsg('');
                        }}
                        className={`p-2.5 rounded-xl border transition-all cursor-pointer flex items-center justify-between gap-3 ${
                          isSelected
                            ? 'bg-cyan-950/60 border-cyan-500 shadow-[0_0_15px_rgba(6,182,212,0.2)] ring-1 ring-cyan-500'
                            : 'bg-slate-950/70 border-slate-800/90 hover:border-slate-700 hover:bg-slate-900/60'
                        }`}
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          <img
                            src={p.bannerImg}
                            alt={p.title}
                            className="w-11 h-11 rounded-lg object-cover border border-slate-800 shrink-0"
                          />
                          <div className="min-w-0">
                            <div className="flex items-center gap-2 flex-wrap">
                              <span className="text-xs font-bold text-white truncate">{p.title}</span>
                              <span className="px-1.5 py-0.2 rounded text-[10px] bg-slate-800 text-slate-300 font-mono">
                                {p.platform}
                              </span>
                              <span className="px-1.5 py-0.2 rounded text-[10px] font-bold bg-red-950 text-red-300 border border-red-500/30">
                                -{discount}%
                              </span>
                            </div>
                            <p className="text-[11px] text-slate-400 truncate mt-0.5 font-sans">
                              {p.subtitle || p.description}
                            </p>
                          </div>
                        </div>

                        <div className="text-right shrink-0 flex items-center gap-3">
                          <div>
                            <div className="text-[10px] text-slate-400 line-through font-mono">
                              {formatCurrency(p.retailPrice, currency)}
                            </div>
                            <div className="text-xs font-bold text-cyan-400 font-mono">
                              {formatCurrency(p.groupPrice, currency)}
                            </div>
                          </div>

                          <div className={`w-5 h-5 rounded-full flex items-center justify-center border ${
                            isSelected
                              ? 'bg-cyan-500 border-cyan-400 text-black'
                              : 'border-slate-700 bg-slate-900 text-transparent'
                          }`}>
                            <Check className="w-3.5 h-3.5" />
                          </div>
                        </div>
                      </div>
                    );
                  })}

                  {filteredProducts.length === 0 && (
                    <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 text-center text-xs text-slate-400">
                      Không tìm thấy sản phẩm phù hợp với từ khóa "{searchTerm}". Bạn có thể bấm nút "Tự tạo sản phẩm mới" ở góc trên.
                    </div>
                  )}
                </div>

                {/* Selected Product Highlight Card */}
                {selectedProduct && (
                  <div className="p-3 rounded-xl bg-cyan-950/30 border border-cyan-500/40 flex items-center justify-between gap-3">
                    <div className="flex items-center gap-2.5 min-w-0">
                      <img
                        src={selectedProduct.bannerImg}
                        alt={selectedProduct.title}
                        className="w-10 h-10 rounded-lg object-cover border border-cyan-500/30 shrink-0"
                      />
                      <div className="min-w-0">
                        <div className="text-xs font-bold text-white flex items-center gap-1.5">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                          <span className="truncate">Đã chọn: {selectedProduct.title}</span>
                        </div>
                        <div className="text-[11px] text-slate-300 mt-0.5">
                          Nền tảng: <span className="text-cyan-300 font-bold">{selectedProduct.platform}</span> • Nhà cung cấp: <span className="text-slate-200">{selectedProduct.seller?.name || 'Chính Hãng'}</span>
                        </div>
                      </div>
                    </div>

                    <div className="text-right shrink-0">
                      <span className="text-[10px] text-slate-400 block">Giá sỉ niêm yết:</span>
                      <span className="text-xs font-bold text-cyan-400 font-mono">
                        {formatCurrency(selectedProduct.groupPrice, currency)} / slot
                      </span>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              /* Custom Product Creation Form (if user wants to list a custom item) */
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                <div className="sm:col-span-2">
                  <label className="block text-[11px] font-bold text-slate-300 mb-1">
                    Tên Sản Phẩm / Game / Gói License *
                  </label>
                  <input
                    type="text"
                    required
                    value={customTitle}
                    onChange={(e) => setCustomTitle(e.target.value)}
                    placeholder="VD: ChatGPT Plus 30 Ngày, Adobe All Apps 1 Năm..."
                    className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder:text-slate-600 focus:outline-none focus:border-cyan-500 font-mono"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-300 mb-1">
                    Chuyên Mục Sản Phẩm
                  </label>
                  <select
                    value={customCategory}
                    onChange={(e) => setCustomCategory(e.target.value as ProductCategory)}
                    className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-cyan-500"
                  >
                    <option value="gaming">Game Steam / AAA Keys</option>
                    <option value="ai_tools">Trí Tuệ Nhân Tạo (AI Tools)</option>
                    <option value="giftup_cards">Thẻ Quà Tặng / GiftUp Card</option>
                    <option value="streaming">Giải Trí (Netflix / Spotify)</option>
                    <option value="software">Phần Mềm Bản Quyền</option>
                    <option value="vpn">VPN / Server Proxy</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-300 mb-1">
                    Nền Tảng Phân Phối
                  </label>
                  <select
                    value={customPlatform}
                    onChange={(e) => setCustomPlatform(e.target.value)}
                    className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-cyan-500"
                  >
                    <option value="Steam">Steam</option>
                    <option value="OpenAI">OpenAI</option>
                    <option value="GiftUp">GiftUp</option>
                    <option value="Netflix">Netflix</option>
                    <option value="Adobe">Adobe</option>
                    <option value="NordVPN">NordVPN</option>
                    <option value="Spotify">Spotify</option>
                    <option value="Xbox">Xbox</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-300 mb-1">
                    Giá Bán Lẻ Niêm Yết Gốc (VND)
                  </label>
                  <input
                    type="number"
                    step="10000"
                    value={customRetailPrice}
                    onChange={(e) => setCustomRetailPrice(Math.max(10000, Number(e.target.value)))}
                    className="w-full p-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white font-mono focus:outline-none focus:border-cyan-500"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-300 mb-1">
                    Giá Sỉ Gom Cho Mỗi Slot (VND)
                  </label>
                  <input
                    type="number"
                    step="10000"
                    value={customGroupPrice}
                    onChange={(e) => setCustomGroupPrice(Math.max(5000, Number(e.target.value)))}
                    className="w-full p-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-cyan-400 font-bold font-mono focus:outline-none focus:border-cyan-500"
                  />
                </div>
              </div>
            )}
          </div>

          {/* ========================================================================= */}
          {/* SECTION 2: CƠ CHẾ GOM ĐƠN & ĐỊNH GIÁ SỈ THỰC TẾ (CỐ ĐỊNH THEO PRODUCT) */}
          {/* ========================================================================= */}
          <div className="space-y-4 p-4 rounded-2xl bg-slate-900/50 border border-slate-800">
            <div className="flex items-center justify-between">
              <div className="text-xs font-bold text-cyan-400 uppercase tracking-wider flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-cyan-400" />
                <span>2. Cơ Chế Gom Đơn & Định Giá Sỉ (Theo Chính Sách Nhà Cung Cấp)</span>
              </div>
              <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-500/30 font-bold">
                CHIẾT KHẤU CHUẨN -{savingsPercent}%
              </span>
            </div>

            {/* Explanatory Note regarding Fixed Wholesale Math */}
            <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800 text-[11px] text-slate-300 flex items-start gap-2.5">
              <Info className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
              <div className="space-y-1 font-sans">
                <p>
                  <strong>Chính sách giá sỉ minh bạch:</strong> Mức giá gom <strong>{formatCurrency(effectiveGroupPrice, currency)} / slot</strong> (tiết kiệm {savingsPercent}% so với giá lẻ {formatCurrency(effectiveRetailPrice, currency)}) được áp dụng cố định theo cấu hình của sản phẩm trong hệ thống để bảo đảm quyền lợi tài khoản chính hãng và cam kết bảo hành.
                </p>
              </div>
            </div>

            {/* Target Slots Selector */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                  <Users className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Số Lượng Slot Thành Viên Cần Gom:</span>
                </label>
                <span className="text-xs font-bold text-cyan-400 font-mono">
                  {targetSlots} Thành Viên (Host + {targetSlots - 1} Người)
                </span>
              </div>

              {/* Quick slot selection pills */}
              <div className="grid grid-cols-5 sm:grid-cols-6 gap-2">
                {[2, 3, 4, 5, 6, 10].map(slots => (
                  <button
                    key={slots}
                    type="button"
                    onClick={() => setTargetSlots(slots)}
                    className={`py-2 rounded-xl text-xs font-bold font-mono transition-all cursor-pointer ${
                      targetSlots === slots
                        ? 'bg-cyan-500 text-black shadow-md shadow-cyan-950/50 scale-102 ring-1 ring-cyan-400'
                        : 'bg-slate-950 text-slate-400 hover:text-white border border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    {slots} Slots
                  </button>
                ))}
              </div>
            </div>

            {/* Title for the Group Pool */}
            <div>
              <label className="block text-[11px] font-bold text-slate-300 mb-1">
                Tiêu Đề Nhóm Gom Đơn:
              </label>
              <input
                type="text"
                value={customPoolTitle}
                onChange={(e) => setCustomPoolTitle(e.target.value)}
                placeholder="VD: Gom chung ChatGPT Plus slot chính hãng giá sỉ..."
                className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-cyan-500 font-mono"
              />
            </div>

            {/* Duration Selector */}
            <div className="flex items-center justify-between text-xs bg-slate-950/60 p-3 rounded-xl border border-slate-800">
              <span className="text-slate-300 flex items-center gap-1.5">
                <Clock className="w-4 h-4 text-amber-400" />
                <span>Thời Hạn Gom Đơn:</span>
              </span>
              <div className="flex items-center gap-2">
                {[24, 48, 72].map(hrs => (
                  <button
                    key={hrs}
                    type="button"
                    onClick={() => setDurationHours(hrs)}
                    className={`px-2.5 py-1 rounded-lg text-xs font-mono font-bold cursor-pointer transition-colors ${
                      durationHours === hrs
                        ? 'bg-amber-500 text-black'
                        : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
                    }`}
                  >
                    {hrs} Giờ
                  </button>
                ))}
              </div>
            </div>

            {/* Financial Summary Box */}
            <div className="p-4 rounded-xl bg-gradient-to-r from-slate-950 via-[#0c1322] to-slate-950 border border-cyan-500/30 space-y-2 text-xs">
              <div className="text-slate-400 font-bold uppercase text-[11px] flex items-center justify-between border-b border-slate-800 pb-2">
                <span>BẢNG TÍNH KINH TẾ NHÓM GOM ({targetSlots} SLOTS)</span>
                <span className="text-emerald-400 font-mono">Tiết kiệm {formatCurrency(totalSavings, currency)}</span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-1">
                <div>
                  <span className="text-[11px] text-slate-400 block">Tiền cọc slot của bạn (Host):</span>
                  <span className="text-sm font-black text-cyan-400 font-mono">
                    {formatCurrency(effectiveGroupPrice, currency)}
                  </span>
                </div>

                <div>
                  <span className="text-[11px] text-slate-400 block">Tổng tiền gom cả nhóm:</span>
                  <span className="text-sm font-black text-white font-mono">
                    {formatCurrency(totalPoolValue, currency)}
                  </span>
                </div>

                <div className="col-span-2 sm:col-span-1">
                  <span className="text-[11px] text-slate-400 block">Cam kết bảo lãnh:</span>
                  <span className="text-xs font-bold text-emerald-400 flex items-center gap-1 mt-0.5">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    <span>100% Escrow Vault</span>
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* ========================================================================= */}
          {/* SECTION 3: CƠ CHẾ PHÁT HÀNH KEY TỰ ĐỘNG & BẢO LÃNH ESCROW (KHÔNG CẦN NẠP KEY THỦ CÔNG) */}
          {/* ========================================================================= */}
          <div className="p-4 rounded-2xl bg-gradient-to-r from-emerald-950/20 via-slate-950 to-cyan-950/20 border border-emerald-500/30 space-y-2.5">
            <div className="flex items-center gap-2 text-xs font-bold text-emerald-400 uppercase tracking-wide">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>3. Cơ Chế Bung Mã Bản Quyền Tự Động & Bảo Lãnh Escrow</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-slate-300 font-sans">
              <div className="p-2.5 rounded-xl bg-black/40 border border-slate-800 space-y-1">
                <div className="text-cyan-300 font-bold flex items-center gap-1.5 text-[11px]">
                  <Zap className="w-3.5 h-3.5 text-cyan-400" />
                  <span>⚡ Tự Động Giao Key Vào Ví</span>
                </div>
                <p className="text-[11px] text-slate-400">
                  Khi nhóm gom đủ <strong>{targetSlots} slot</strong>, hệ thống và đối tác sẽ tự động phát mã key / tài khoản trực tiếp vào <strong>Kho Key Cá Nhân</strong> của từng người mua ngay lập tức.
                </p>
              </div>

              <div className="p-2.5 rounded-xl bg-black/40 border border-slate-800 space-y-1">
                <div className="text-emerald-300 font-bold flex items-center gap-1.5 text-[11px]">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  <span>🛡️ 100% Hoàn Tiền Nếu Không Đủ Người</span>
                </div>
                <p className="text-[11px] text-slate-400">
                  Tiền cọc của bạn và thành viên được giữ an toàn tuyệt đối trong két Escrow. Nếu hết {durationHours}h mà chưa đủ slot, tiền sẽ tự động hoàn 100% về ví ngay.
                </p>
              </div>
            </div>
          </div>
        </form>

        {/* Modal Footer */}
        <div className="p-4 sm:p-5 border-t border-slate-800 bg-[#0a0d14] flex items-center justify-between">
          <button
            type="button"
            onClick={onClose}
            className="py-2.5 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white font-semibold text-xs border border-slate-800 cursor-pointer transition-colors"
          >
            Hủy Bỏ
          </button>

          <button
            type="button"
            onClick={handleSubmit}
            disabled={!isCustomMode && !selectedProduct}
            className="flex items-center gap-2 py-3 px-6 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-black font-bold text-xs uppercase tracking-wider transition-all shadow-[0_0_20px_rgba(6,182,212,0.4)] active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
          >
            <span>Xuất Bản Nhóm Gom Đơn Ngay</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
